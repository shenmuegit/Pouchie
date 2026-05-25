import type {
  AnalyticsCategoryPoint,
  AnalyticsQuery,
  AuthResponse,
  CategoryBudget,
  DashboardSummary,
  GroupedTransactions,
  MonthlyBudget,
  Transaction,
  User
} from "@xiaohebao/contracts";
import type { AppEntries } from "./ports/entries";
import type { CategoryRecord, TransactionRecord } from "./ports/repositories";
import type { DomainContext } from "./context";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from "./errors";
import { clampPercentage, getDateKeyInShanghai, resolveAnalyticsDateRange } from "./utils/time";

function nowIso(ctx: DomainContext): string {
  return ctx.services.clock.now().toISOString();
}

function plusHours(input: Date, hours: number): Date {
  return new Date(input.getTime() + hours * 60 * 60 * 1000);
}

function toPublicUser(record: {
  id: string;
  appleSub: string;
  email: string | null;
  displayName: string | null;
}): User {
  return {
    id: record.id,
    appleSub: record.appleSub,
    email: record.email,
    displayName: record.displayName
  };
}

async function buildAuthResponse(
  ctx: DomainContext,
  user: User,
  now: Date
): Promise<AuthResponse> {
  const tokenPair = await ctx.services.authProvider.issueOpaqueToken();
  const expiresAt = plusHours(now, ctx.config.sessionTtlHours).toISOString();
  await ctx.repos.sessions.create({
    userId: user.id,
    tokenHash: tokenPair.tokenHash,
    expiresAt
  });
  return {
    token: tokenPair.rawToken,
    expiresAt,
    user
  };
}

function groupTransactionsByDate(items: TransactionRecord[]): GroupedTransactions[] {
  const map = new Map<string, Transaction[]>();
  for (const item of items) {
    const key = getDateKeyInShanghai(new Date(item.occurredAt));
    const entry = map.get(key);
    if (!entry) {
      map.set(key, [item]);
      continue;
    }
    entry.push(item);
  }

  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, txs]) => ({
      date,
      items: txs.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
    }));
}

async function getMonthlyBudgetSnapshot(
  ctx: DomainContext,
  userId: string,
  month: string
): Promise<MonthlyBudget> {
  const budget = await ctx.repos.budgets.getMonthlyBudget(userId, month);
  const today = getDateKeyInShanghai(ctx.services.clock.now());
  const summary = await ctx.repos.transactions.summarizeMonth(userId, month, today);
  const total = budget?.totalCents ?? 0;
  const used = summary.expenseCents;
  const remaining = total - used;
  const progress = total <= 0 ? 0 : clampPercentage((used / total) * 100);

  return {
    month,
    totalCents: total,
    usedCents: used,
    remainingCents: remaining,
    progress
  };
}

async function listCategoryBudgetItems(
  ctx: DomainContext,
  userId: string,
  month: string
): Promise<CategoryBudget[]> {
  const categories = await ctx.repos.categories.listByUser(userId, {
    type: "expense",
    includeHidden: true
  });
  const budgets = await ctx.repos.budgets.listCategoryBudgets(userId, month);
  const spent = await ctx.repos.transactions.sumByCategoryForMonth(
    userId,
    month,
    "expense"
  );

  const budgetMap = new Map(budgets.map((b) => [b.categoryId, b]));
  const spentMap = new Map(spent.map((s) => [s.categoryId, s.amountCents]));

  return categories
    .filter((category) => !category.deletedAt && !category.isHidden)
    .map((category) => {
      const budget = budgetMap.get(category.id)?.budgetCents ?? 0;
      const used = spentMap.get(category.id) ?? 0;
      const remaining = budget - used;
      const progress = budget <= 0 ? 0 : clampPercentage((used / budget) * 100);
      return {
        categoryId: category.id,
        categoryName: category.name,
        budgetCents: budget,
        usedCents: used,
        remainingCents: remaining,
        progress,
        isOverBudget: remaining < 0
      };
    });
}

function normalizeAnalyticsQuery(ctx: DomainContext, query: AnalyticsQuery): AnalyticsQuery {
  const range = resolveAnalyticsDateRange(
    ctx.services.clock.now(),
    query.period,
    query.dateFrom,
    query.dateTo
  );

  return {
    period: query.period,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo
  };
}

async function ensureUser(ctx: DomainContext, userId: string): Promise<User> {
  const user = await ctx.repos.users.findById(userId);
  if (!user) {
    throw new UnauthorizedError("用户会话无效");
  }
  return toPublicUser(user);
}

async function getCategoryOrThrow(
  ctx: DomainContext,
  userId: string,
  categoryId: string
): Promise<CategoryRecord> {
  const category = await ctx.repos.categories.findById(userId, categoryId);
  if (!category || category.deletedAt) {
    throw new NotFoundError("分类不存在");
  }
  return category;
}

export function createAppEntries(ctx: DomainContext): AppEntries {
  return {
    auth: {
      appleLogin: {
        execute: async (input) => {
          const identity = await ctx.services.authProvider.verifyAppleIdToken(input.idToken);
          const now = ctx.services.clock.now();

          let user = await ctx.repos.users.findByAppleSub(identity.appleSub);
          if (!user) {
            user = await ctx.repos.users.create({
              appleSub: identity.appleSub,
              email: identity.email ?? input.email ?? null,
              displayName: identity.displayName ?? input.displayName ?? null
            });
            await ctx.repos.categories.ensureDefaultCategories(user.id);
          } else {
            user = await ctx.repos.users.updateProfile(user.id, {
              email: identity.email ?? user.email,
              displayName: identity.displayName ?? user.displayName
            });
          }

          await ctx.repos.preferences.getOrCreate(user.id);
          return buildAuthResponse(ctx, toPublicUser(user), now);
        }
      },
      googleLogin: {
        execute: async (input) => {
          const identity = await ctx.services.authProvider.verifyGoogleIdToken(input.idToken);
          const now = ctx.services.clock.now();

          let user = await ctx.repos.users.findByGoogleSub(identity.googleSub);
          if (!user) {
            user = await ctx.repos.users.create({
              appleSub: `google-${identity.googleSub}`,
              googleSub: identity.googleSub,
              email: identity.email,
              displayName: identity.displayName
            });
            await ctx.repos.categories.ensureDefaultCategories(user.id);
          } else {
            user = await ctx.repos.users.updateProfile(user.id, {
              email: identity.email ?? user.email,
              displayName: identity.displayName ?? user.displayName
            });
          }

          await ctx.repos.preferences.getOrCreate(user.id);
          return buildAuthResponse(ctx, toPublicUser(user), now);
        }
      },
      devLogin: {
        execute: async (input) => {
          if (!ctx.config.enableDevBypass) {
            throw new UnauthorizedError("开发旁路登录已关闭");
          }

          const now = ctx.services.clock.now();
          const appleSub = `dev:${input.email.toLowerCase()}`;

          let user = await ctx.repos.users.findByAppleSub(appleSub);
          if (!user) {
            user = await ctx.repos.users.create({
              appleSub,
              email: input.email,
              displayName: input.displayName
            });
            await ctx.repos.categories.ensureDefaultCategories(user.id);
          } else {
            user = await ctx.repos.users.updateProfile(user.id, {
              email: input.email,
              displayName: input.displayName
            });
          }

          await ctx.repos.preferences.getOrCreate(user.id);
          return buildAuthResponse(ctx, toPublicUser(user), now);
        }
      },
      logout: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          await ctx.repos.sessions.deleteByTokenHash(input.tokenHash);
          return { success: true as const };
        }
      },
      me: {
        execute: async (input) => ensureUser(ctx, input.userId)
      }
    },
    dashboard: {
      summary: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const today = getDateKeyInShanghai(ctx.services.clock.now());
          const txSummary = await ctx.repos.transactions.summarizeMonth(
            input.userId,
            input.month,
            today
          );
          const budget = await ctx.repos.budgets.getMonthlyBudget(input.userId, input.month);
          const budgetTotalCents = budget?.totalCents ?? 0;
          const budgetUsedCents = txSummary.expenseCents;
          const budgetProgress =
            budgetTotalCents <= 0
              ? 0
              : clampPercentage((budgetUsedCents / budgetTotalCents) * 100);

          const payload: DashboardSummary = {
            month: input.month,
            expenseCents: txSummary.expenseCents,
            incomeCents: txSummary.incomeCents,
            balanceCents: txSummary.incomeCents - txSummary.expenseCents,
            todayExpenseCents: txSummary.todayExpenseCents,
            budgetTotalCents,
            budgetUsedCents,
            budgetProgress
          };
          return payload;
        }
      },
      recentTransactions: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const items = await ctx.repos.transactions.listRecent(input.userId, 8);
          return { items };
        }
      }
    },
    transaction: {
      list: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const items = await ctx.repos.transactions.listByUser(input.userId, input.query);
          return {
            total: items.length,
            groups: groupTransactionsByDate(items)
          };
        }
      },
      create: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const category = await getCategoryOrThrow(
            ctx,
            input.userId,
            input.payload.categoryId
          );
          if (category.type !== input.payload.type) {
            throw new ValidationError("分类类型与收支类型不一致");
          }
          return ctx.repos.transactions.create(input.userId, input.payload);
        }
      },
      update: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const original = await ctx.repos.transactions.findById(
            input.userId,
            input.transactionId
          );
          if (!original || original.deletedAt) {
            throw new NotFoundError("账单不存在");
          }

          const nextType = input.payload.type ?? original.type;
          const nextCategoryId = input.payload.categoryId ?? original.categoryId;
          const category = await getCategoryOrThrow(ctx, input.userId, nextCategoryId);
          if (category.type !== nextType) {
            throw new ValidationError("分类类型与收支类型不一致");
          }

          const updated = await ctx.repos.transactions.update(
            input.userId,
            input.transactionId,
            input.payload
          );
          if (!updated) {
            throw new NotFoundError("账单不存在");
          }
          return updated;
        }
      },
      remove: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const original = await ctx.repos.transactions.findById(
            input.userId,
            input.transactionId
          );
          if (!original || original.deletedAt) {
            throw new NotFoundError("账单不存在");
          }
          await ctx.repos.transactions.softDelete(
            input.userId,
            input.transactionId,
            nowIso(ctx)
          );
          return { success: true as const };
        }
      }
    },
    category: {
      list: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const items = await ctx.repos.categories.listByUser(input.userId, {
            type: input.type,
            includeHidden: input.includeHidden
          });
          return { items: items.filter((x) => !x.deletedAt) };
        }
      },
      create: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const existing = await ctx.repos.categories.listByUser(input.userId, {
            type: input.payload.type,
            includeHidden: true
          });
          const duplicate = existing.find(
            (item) =>
              !item.deletedAt &&
              item.name.trim().toLowerCase() === input.payload.name.trim().toLowerCase()
          );
          if (duplicate) {
            throw new ConflictError("分类名称已存在");
          }
          return ctx.repos.categories.create(input.userId, input.payload);
        }
      },
      update: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const existing = await getCategoryOrThrow(ctx, input.userId, input.categoryId);
          if (existing.isDefault && input.payload.name && input.payload.name !== existing.name) {
            throw new ValidationError("默认分类不允许修改名称");
          }
          const updated = await ctx.repos.categories.update(
            input.userId,
            input.categoryId,
            input.payload
          );
          if (!updated) {
            throw new NotFoundError("分类不存在");
          }
          return updated;
        }
      },
      remove: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const existing = await getCategoryOrThrow(ctx, input.userId, input.categoryId);
          if (existing.isDefault) {
            await ctx.repos.categories.update(input.userId, input.categoryId, {
              isHidden: true
            });
            return { success: true as const };
          }
          await ctx.repos.categories.softDelete(
            input.userId,
            input.categoryId,
            nowIso(ctx)
          );
          return { success: true as const };
        }
      }
    },
    budget: {
      getMonthly: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          return getMonthlyBudgetSnapshot(ctx, input.userId, input.month);
        }
      },
      updateMonthly: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          await ctx.repos.budgets.upsertMonthlyBudget(
            input.userId,
            input.payload.month,
            input.payload.totalCents
          );
          return getMonthlyBudgetSnapshot(ctx, input.userId, input.payload.month);
        }
      },
      listCategoryBudgets: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const items = await listCategoryBudgetItems(ctx, input.userId, input.month);
          return { items };
        }
      },
      updateCategoryBudgets: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          for (const item of input.payload.items) {
            const category = await getCategoryOrThrow(ctx, input.userId, item.categoryId);
            if (category.type !== "expense") {
              throw new ValidationError("仅支出分类支持预算");
            }
            await ctx.repos.budgets.upsertCategoryBudget(
              input.userId,
              input.payload.month,
              item.categoryId,
              item.budgetCents
            );
          }
          const items = await listCategoryBudgetItems(
            ctx,
            input.userId,
            input.payload.month
          );
          return { items };
        }
      }
    },
    analytics: {
      summary: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const query = normalizeAnalyticsQuery(ctx, input.query);
          return ctx.repos.analytics.getSummary(input.userId, query);
        }
      },
      trend: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const query = normalizeAnalyticsQuery(ctx, input.query);
          const items = await ctx.repos.analytics.getTrend(input.userId, query);
          return { items };
        }
      },
      categories: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          const query = normalizeAnalyticsQuery(ctx, input.query);
          const rows = await ctx.repos.analytics.getCategoryDistribution(input.userId, query);
          const total = rows.reduce((sum, row) => sum + row.amountCents, 0);
          const items: AnalyticsCategoryPoint[] = rows.map((row) => ({
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            amountCents: row.amountCents,
            percentage: total <= 0 ? 0 : clampPercentage((row.amountCents / total) * 100)
          }));
          return { items };
        }
      }
    },
    profile: {
      overview: {
        execute: async (input) => {
          const user = await ensureUser(ctx, input.userId);
          const preferences = await ctx.repos.preferences.getOrCreate(input.userId);
          const [totalTransactions, activeDays, categoryCount] = await Promise.all([
            ctx.repos.transactions.countByUser(input.userId),
            ctx.repos.transactions.countActiveDaysByUser(input.userId),
            ctx.repos.categories.countByUser(input.userId)
          ]);
          return {
            user,
            totalTransactions,
            activeDays,
            categoryCount,
            preferences
          };
        }
      },
      patchPreferences: {
        execute: async (input) => {
          await ensureUser(ctx, input.userId);
          return ctx.repos.preferences.patch(input.userId, input.payload);
        }
      }
    }
  };
}
