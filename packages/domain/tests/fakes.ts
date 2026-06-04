import type {
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  CreateCategoryRequest,
  CreateTransactionRequest,
  ListTransactionsQuery,
  PatchProfilePreferencesRequest,
  ProfilePreferences,
  TransactionType,
  UpdateCategoryRequest,
  UpdateTransactionRequest
} from "@xiaohebao/contracts";
import { DEFAULT_CATEGORIES, DEFAULT_PREFERENCES } from "../src/defaults";
import type {
  AnalyticsRepository,
  BudgetRepository,
  CategoryBudgetRecord,
  CategoryRecord,
  CategoryRepository,
  MonthlyBudgetRecord,
  PreferenceRecord,
  PreferenceRepository,
  SessionRecord,
  SessionRepository,
  TransactionRecord,
  TransactionRepository,
  UserRecord,
  UserRepository
} from "../src/ports/repositories";
import type {
  AppleIdentity,
  AuthProvider,
  Clock,
  GoogleIdentity,
  TokenPair
} from "../src/services";
import { getDateKeyInShanghai } from "../src/utils/time";

let globalCounter = 1;
function nextId(prefix: string): string {
  globalCounter += 1;
  return `${prefix}_${globalCounter}`;
}

function inRange(dateKey: string, from?: string, to?: string): boolean {
  if (from && dateKey < from) return false;
  if (to && dateKey > to) return false;
  return true;
}

function dateFromIso(iso: string): string {
  return getDateKeyInShanghai(new Date(iso));
}

export class FixedClock implements Clock {
  constructor(private readonly value: Date) {}

  now(): Date {
    return new Date(this.value.getTime());
  }
}

export class FakeAuthProvider implements AuthProvider {
  appleIdentity: AppleIdentity = {
    appleSub: "apple-sub-1",
    email: "test@example.com",
    displayName: "测试用户"
  };
  googleIdentity: GoogleIdentity = {
    googleSub: "google-sub-1",
    email: "google@example.com",
    displayName: "Google 用户"
  };
  tokenCounter = 0;

  async verifyAppleIdToken(): Promise<AppleIdentity> {
    return this.appleIdentity;
  }

  async verifyGoogleIdToken(): Promise<GoogleIdentity> {
    return this.googleIdentity;
  }

  async issueOpaqueToken(): Promise<TokenPair> {
    this.tokenCounter += 1;
    return {
      rawToken: `raw-token-${this.tokenCounter}`,
      tokenHash: `hash-token-${this.tokenCounter}`
    };
  }
}

export class InMemoryUserRepo implements UserRepository {
  readonly items: Array<UserRecord & { googleSub?: string | null }> = [];

  async findById(userId: string): Promise<UserRecord | null> {
    return this.items.find((x) => x.id === userId) ?? null;
  }

  async findByAppleSub(appleSub: string): Promise<UserRecord | null> {
    return this.items.find((x) => x.appleSub === appleSub) ?? null;
  }

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    return this.items.find((x) => x.googleSub === googleSub) ?? null;
  }

  async create(input: {
    appleSub: string;
    googleSub?: string;
    email: string | null;
    displayName: string | null;
  }): Promise<UserRecord> {
    const now = new Date().toISOString();
    const row: UserRecord & { googleSub?: string | null } = {
      id: nextId("user"),
      appleSub: input.appleSub,
      googleSub: input.googleSub ?? null,
      email: input.email,
      displayName: input.displayName,
      createdAt: now,
      updatedAt: now
    };
    this.items.push(row);
    return row;
  }

  async updateProfile(
    userId: string,
    patch: {
      email?: string | null;
      displayName?: string | null;
    }
  ): Promise<UserRecord> {
    const row = this.items.find((x) => x.id === userId);
    if (!row) {
      throw new Error("user not found");
    }
    if (patch.email !== undefined) row.email = patch.email;
    if (patch.displayName !== undefined) row.displayName = patch.displayName;
    row.updatedAt = new Date().toISOString();
    return row;
  }
}

export class InMemorySessionRepo implements SessionRepository {
  readonly items: SessionRecord[] = [];

  async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: string;
  }): Promise<SessionRecord> {
    const row: SessionRecord = {
      id: nextId("session"),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      createdAt: new Date().toISOString()
    };
    this.items.push(row);
    return row;
  }

  async findValidByTokenHash(
    tokenHash: string,
    nowIso: string
  ): Promise<SessionRecord | null> {
    return (
      this.items.find((x) => x.tokenHash === tokenHash && x.expiresAt > nowIso) ?? null
    );
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    const idx = this.items.findIndex((x) => x.tokenHash === tokenHash);
    if (idx >= 0) {
      this.items.splice(idx, 1);
    }
  }
}

export class InMemoryCategoryRepo implements CategoryRepository {
  readonly items: CategoryRecord[] = [];

  async ensureDefaultCategories(userId: string): Promise<void> {
    const now = new Date().toISOString();
    for (const preset of DEFAULT_CATEGORIES) {
      const exists = this.items.some(
        (x) =>
          x.userId === userId &&
          x.type === preset.type &&
          x.name === preset.name &&
          !x.deletedAt
      );
      if (exists) continue;
      this.items.push({
        id: nextId("category"),
        userId,
        name: preset.name,
        type: preset.type,
        icon: preset.icon,
        color: preset.color,
        isDefault: true,
        isHidden: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      });
    }
  }

  async listByUser(
    userId: string,
    options?: {
      type?: TransactionType;
      includeHidden?: boolean;
    }
  ): Promise<CategoryRecord[]> {
    return this.items.filter((x) => {
      if (x.userId !== userId) return false;
      if (x.deletedAt) return false;
      if (options?.type && x.type !== options.type) return false;
      if (!options?.includeHidden && x.isHidden) return false;
      return true;
    });
  }

  async findById(userId: string, categoryId: string): Promise<CategoryRecord | null> {
    return this.items.find((x) => x.userId === userId && x.id === categoryId) ?? null;
  }

  async create(userId: string, payload: CreateCategoryRequest): Promise<CategoryRecord> {
    const now = new Date().toISOString();
    const row: CategoryRecord = {
      id: nextId("category"),
      userId,
      name: payload.name,
      type: payload.type,
      icon: payload.icon,
      color: payload.color,
      isDefault: false,
      isHidden: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    this.items.push(row);
    return row;
  }

  async update(
    userId: string,
    categoryId: string,
    patch: UpdateCategoryRequest
  ): Promise<CategoryRecord | null> {
    const row = await this.findById(userId, categoryId);
    if (!row || row.deletedAt) return null;
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.icon !== undefined) row.icon = patch.icon;
    if (patch.color !== undefined) row.color = patch.color;
    if (patch.isHidden !== undefined) row.isHidden = patch.isHidden;
    row.updatedAt = new Date().toISOString();
    return row;
  }

  async softDelete(userId: string, categoryId: string, deletedAt: string): Promise<void> {
    const row = await this.findById(userId, categoryId);
    if (row) {
      row.deletedAt = deletedAt;
      row.updatedAt = deletedAt;
    }
  }

  async countByUser(userId: string): Promise<number> {
    return this.items.filter((x) => x.userId === userId && !x.deletedAt).length;
  }
}

export class InMemoryTransactionRepo implements TransactionRepository {
  readonly items: TransactionRecord[] = [];
  constructor(private readonly categories: InMemoryCategoryRepo) {}

  private fillCategory(userId: string, categoryId: string): { categoryName: string } {
    const category = this.categories.items.find(
      (x) => x.userId === userId && x.id === categoryId && !x.deletedAt
    );
    if (!category) throw new Error("category not found");
    return { categoryName: category.name };
  }

  async listByUser(userId: string, query: ListTransactionsQuery): Promise<TransactionRecord[]> {
    return this.items
      .filter((x) => {
        if (x.userId !== userId) return false;
        if (x.deletedAt) return false;
        if (query.type && x.type !== query.type) return false;
        if (query.search && !x.name.toLowerCase().includes(query.search.toLowerCase())) {
          return false;
        }
        const key = dateFromIso(x.occurredAt);
        if (!inRange(key, query.dateFrom, query.dateTo)) return false;
        return true;
      })
      .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));
  }

  async listRecent(userId: string, limit: number): Promise<TransactionRecord[]> {
    return this.items
      .filter((x) => x.userId === userId && !x.deletedAt)
      .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
      .slice(0, limit);
  }

  async findById(userId: string, transactionId: string): Promise<TransactionRecord | null> {
    return this.items.find((x) => x.userId === userId && x.id === transactionId) ?? null;
  }

  async create(userId: string, payload: CreateTransactionRequest): Promise<TransactionRecord> {
    const category = this.fillCategory(userId, payload.categoryId);
    const now = new Date().toISOString();
    const row: TransactionRecord = {
      id: nextId("tx"),
      userId,
      name: payload.name,
      type: payload.type,
      amountCents: payload.amountCents,
      categoryId: payload.categoryId,
      categoryName: category.categoryName,
      note: payload.note ?? null,
      occurredAt: payload.occurredAt,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    this.items.push(row);
    return row;
  }

  async update(
    userId: string,
    transactionId: string,
    patch: UpdateTransactionRequest
  ): Promise<TransactionRecord | null> {
    const row = await this.findById(userId, transactionId);
    if (!row || row.deletedAt) return null;
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.type !== undefined) row.type = patch.type;
    if (patch.amountCents !== undefined) row.amountCents = patch.amountCents;
    if (patch.categoryId !== undefined) {
      row.categoryId = patch.categoryId;
      row.categoryName = this.fillCategory(userId, patch.categoryId).categoryName;
    }
    if (patch.note !== undefined) row.note = patch.note ?? null;
    if (patch.occurredAt !== undefined) row.occurredAt = patch.occurredAt;
    row.updatedAt = new Date().toISOString();
    return row;
  }

  async softDelete(userId: string, transactionId: string, deletedAt: string): Promise<void> {
    const row = await this.findById(userId, transactionId);
    if (row) {
      row.deletedAt = deletedAt;
      row.updatedAt = deletedAt;
    }
  }

  async summarizeMonth(
    userId: string,
    month: string,
    todayDate: string
  ): Promise<{
    expenseCents: number;
    incomeCents: number;
    todayExpenseCents: number;
  }> {
    const rows = this.items.filter((x) => {
      if (x.userId !== userId || x.deletedAt) return false;
      return dateFromIso(x.occurredAt).startsWith(month);
    });
    const expenseCents = rows
      .filter((x) => x.type === "expense")
      .reduce((sum, row) => sum + row.amountCents, 0);
    const incomeCents = rows
      .filter((x) => x.type === "income")
      .reduce((sum, row) => sum + row.amountCents, 0);
    const todayExpenseCents = rows
      .filter((x) => x.type === "expense" && dateFromIso(x.occurredAt) === todayDate)
      .reduce((sum, row) => sum + row.amountCents, 0);
    return { expenseCents, incomeCents, todayExpenseCents };
  }

  async sumByCategoryForMonth(
    userId: string,
    month: string,
    type: TransactionType
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  > {
    const rows = this.items.filter((x) => {
      if (x.userId !== userId || x.deletedAt) return false;
      if (x.type !== type) return false;
      return dateFromIso(x.occurredAt).startsWith(month);
    });
    const map = new Map<string, { categoryName: string; amountCents: number }>();
    for (const row of rows) {
      const old = map.get(row.categoryId);
      if (!old) {
        map.set(row.categoryId, {
          categoryName: row.categoryName,
          amountCents: row.amountCents
        });
      } else {
        old.amountCents += row.amountCents;
      }
    }
    return [...map.entries()].map(([categoryId, info]) => ({
      categoryId,
      categoryName: info.categoryName,
      amountCents: info.amountCents
    }));
  }

  async countByUser(userId: string): Promise<number> {
    return this.items.filter((x) => x.userId === userId && !x.deletedAt).length;
  }

  async countActiveDaysByUser(userId: string): Promise<number> {
    const set = new Set<string>();
    for (const row of this.items) {
      if (row.userId !== userId || row.deletedAt) continue;
      set.add(dateFromIso(row.occurredAt));
    }
    return set.size;
  }
}

export class InMemoryBudgetRepo implements BudgetRepository {
  readonly monthly = new Map<string, MonthlyBudgetRecord>();
  readonly category = new Map<string, CategoryBudgetRecord>();

  private monthlyKey(userId: string, month: string): string {
    return `${userId}:${month}`;
  }

  private categoryKey(userId: string, month: string, categoryId: string): string {
    return `${userId}:${month}:${categoryId}`;
  }

  async getMonthlyBudget(
    userId: string,
    month: string
  ): Promise<MonthlyBudgetRecord | null> {
    return this.monthly.get(this.monthlyKey(userId, month)) ?? null;
  }

  async upsertMonthlyBudget(
    userId: string,
    month: string,
    totalCents: number
  ): Promise<MonthlyBudgetRecord> {
    const key = this.monthlyKey(userId, month);
    const current = this.monthly.get(key);
    const now = new Date().toISOString();
    if (current) {
      current.totalCents = totalCents;
      current.updatedAt = now;
      return current;
    }
    const row: MonthlyBudgetRecord = {
      userId,
      month,
      totalCents,
      createdAt: now,
      updatedAt: now
    };
    this.monthly.set(key, row);
    return row;
  }

  async listCategoryBudgets(userId: string, month: string): Promise<CategoryBudgetRecord[]> {
    return [...this.category.values()].filter(
      (x) => x.userId === userId && x.month === month
    );
  }

  async upsertCategoryBudget(
    userId: string,
    month: string,
    categoryId: string,
    budgetCents: number
  ): Promise<CategoryBudgetRecord> {
    const key = this.categoryKey(userId, month, categoryId);
    const current = this.category.get(key);
    const now = new Date().toISOString();
    if (current) {
      current.budgetCents = budgetCents;
      current.updatedAt = now;
      return current;
    }
    const row: CategoryBudgetRecord = {
      userId,
      month,
      categoryId,
      budgetCents,
      createdAt: now,
      updatedAt: now
    };
    this.category.set(key, row);
    return row;
  }
}

export class InMemoryAnalyticsRepo implements AnalyticsRepository {
  constructor(private readonly txRepo: InMemoryTransactionRepo) {}

  private collect(userId: string, query: AnalyticsQuery): TransactionRecord[] {
    return this.txRepo.items.filter((x) => {
      if (x.userId !== userId || x.deletedAt) return false;
      const day = dateFromIso(x.occurredAt);
      return inRange(day, query.dateFrom, query.dateTo);
    });
  }

  async getSummary(userId: string, query: AnalyticsQuery): Promise<AnalyticsSummary> {
    const rows = this.collect(userId, query);
    const totalExpenseCents = rows
      .filter((x) => x.type === "expense")
      .reduce((sum, row) => sum + row.amountCents, 0);
    const totalIncomeCents = rows
      .filter((x) => x.type === "income")
      .reduce((sum, row) => sum + row.amountCents, 0);
    return {
      totalExpenseCents,
      totalIncomeCents,
      netCents: totalIncomeCents - totalExpenseCents
    };
  }

  async getTrend(userId: string, query: AnalyticsQuery): Promise<AnalyticsTrendPoint[]> {
    const rows = this.collect(userId, query);
    const map = new Map<string, { expense: number; income: number }>();
    for (const row of rows) {
      const day = dateFromIso(row.occurredAt);
      const old = map.get(day) ?? { expense: 0, income: 0 };
      if (row.type === "expense") old.expense += row.amountCents;
      else old.income += row.amountCents;
      map.set(day, old);
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([bucket, value]) => ({
        bucket,
        expenseCents: value.expense,
        incomeCents: value.income
      }));
  }

  async getCategoryDistribution(
    userId: string,
    query: AnalyticsQuery
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  > {
    const rows = this.collect(userId, query).filter((x) => x.type === "expense");
    const map = new Map<string, { categoryName: string; amount: number }>();
    for (const row of rows) {
      const old = map.get(row.categoryId) ?? { categoryName: row.categoryName, amount: 0 };
      old.amount += row.amountCents;
      map.set(row.categoryId, old);
    }
    return [...map.entries()].map(([categoryId, payload]) => ({
      categoryId,
      categoryName: payload.categoryName,
      amountCents: payload.amount
    }));
  }
}

export class InMemoryPreferenceRepo implements PreferenceRepository {
  readonly items = new Map<string, PreferenceRecord>();

  async getOrCreate(userId: string): Promise<PreferenceRecord> {
    const existing = this.items.get(userId);
    if (existing) return existing;
    const now = new Date().toISOString();
    const row: PreferenceRecord = {
      userId,
      ...DEFAULT_PREFERENCES,
      createdAt: now,
      updatedAt: now
    };
    this.items.set(userId, row);
    return row;
  }

  async patch(
    userId: string,
    patch: PatchProfilePreferencesRequest
  ): Promise<PreferenceRecord> {
    const row = await this.getOrCreate(userId);
    if (patch.faceIdEnabled !== undefined) row.faceIdEnabled = patch.faceIdEnabled;
    if (patch.defaultCurrency !== undefined) row.defaultCurrency = patch.defaultCurrency;
    if (patch.notificationsEnabled !== undefined) {
      row.notificationsEnabled = patch.notificationsEnabled;
    }
    row.updatedAt = new Date().toISOString();
    return row;
  }
}

export function createInMemoryRepos() {
  const users = new InMemoryUserRepo();
  const categories = new InMemoryCategoryRepo();
  const transactions = new InMemoryTransactionRepo(categories);
  const sessions = new InMemorySessionRepo();
  const budgets = new InMemoryBudgetRepo();
  const analytics = new InMemoryAnalyticsRepo(transactions);
  const preferences = new InMemoryPreferenceRepo();

  return {
    users,
    categories,
    transactions,
    sessions,
    budgets,
    analytics,
    preferences
  };
}
