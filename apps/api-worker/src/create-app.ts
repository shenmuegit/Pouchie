import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  analyticsQuerySchema,
  appleLoginRequestSchema,
  createCategoryRequestSchema,
  createTransactionRequestSchema,
  devLoginRequestSchema,
  listTransactionsQuerySchema,
  patchProfilePreferencesRequestSchema,
  updateCategoryBudgetsRequestSchema,
  updateCategoryRequestSchema,
  updateMonthlyBudgetRequestSchema,
  updateTransactionRequestSchema
} from "@xiaohebao/contracts";
import { createAppEntries, systemClock, ValidationError } from "@xiaohebao/domain";
import {
  D1AnalyticsRepository,
  D1BudgetRepository,
  D1CategoryRepository,
  D1PreferenceRepository,
  D1SessionRepository,
  D1TransactionRepository,
  D1UserRepository
} from "./repositories/d1-repositories";
import { WorkerAuthProvider } from "./auth-provider";
import type { AuthContext, Env } from "./types";
import {
  monthKeyFromDate,
  normalizeBooleanString,
  readBearerToken,
  sha256Hex,
  toErrorResponse
} from "./utils";

type Variables = {
  auth: AuthContext;
};

type BuildEntriesResult = ReturnType<typeof buildDefaultEntries>;
type BuildEntriesFn = (env: Env) => BuildEntriesResult;

function buildDefaultEntries(env: Env) {
  const repos = {
    users: new D1UserRepository(env.DB),
    sessions: new D1SessionRepository(env.DB),
    categories: new D1CategoryRepository(env.DB),
    transactions: new D1TransactionRepository(env.DB),
    budgets: new D1BudgetRepository(env.DB),
    analytics: new D1AnalyticsRepository(env.DB),
    preferences: new D1PreferenceRepository(env.DB)
  };

  return {
    repos,
    entries: createAppEntries({
      repos,
      services: {
        authProvider: new WorkerAuthProvider({
          audience: env.APPLE_AUDIENCE,
          issuer: env.APPLE_ISSUER
        }),
        clock: systemClock
      },
      config: {
        enableDevBypass: normalizeBooleanString(env.ENABLE_DEV_BYPASS, false),
        sessionTtlHours: Number(env.SESSION_TTL_HOURS || 720)
      }
    })
  };
}

function parseMonth(value: string | null | undefined): string {
  if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return value;
  }
  return monthKeyFromDate(new Date());
}

export function createApiApp(options?: { buildEntries?: BuildEntriesFn }) {
  const buildEntries = options?.buildEntries ?? buildDefaultEntries;
  const app = new Hono<{ Bindings: Env; Variables: Variables }>();

  app.use("*", cors());

  app.get("/health", (c) =>
    c.json({
      ok: true,
      service: "xiaohebao-api",
      now: new Date().toISOString()
    })
  );

  app.post("/v1/auth/apple/login", async (c) => {
    try {
      const input = await c.req.json();
      const parsed = appleLoginRequestSchema.parse(input);
      const { entries } = buildEntries(c.env);
      const payload = await entries.auth.appleLogin.execute(parsed);
      return c.json(payload);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.post("/v1/auth/dev/login", async (c) => {
    try {
      const input = await c.req.json();
      const parsed = devLoginRequestSchema.parse(input);
      const { entries } = buildEntries(c.env);
      const payload = await entries.auth.devLogin.execute(parsed);
      return c.json(payload);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.use("/v1/*", async (c, next) => {
    if (c.req.path === "/v1/auth/apple/login" || c.req.path === "/v1/auth/dev/login") {
      return next();
    }

    try {
      const rawToken = readBearerToken(c.req.header("authorization"));
      if (!rawToken) {
        throw new ValidationError("缺少 Bearer Token");
      }
      const tokenHash = await sha256Hex(rawToken);
      const { repos } = buildEntries(c.env);
      const session = await repos.sessions.findValidByTokenHash(
        tokenHash,
        new Date().toISOString()
      );
      if (!session) {
        throw new ValidationError("登录态已失效");
      }
      c.set("auth", { userId: session.userId, tokenHash });
      await next();
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.post("/v1/auth/logout", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = await entries.auth.logout.execute({
        userId: auth.userId,
        tokenHash: auth.tokenHash
      });
      return c.json(payload);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/auth/me", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(await entries.auth.me.execute({ userId: auth.userId }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/dashboard/summary", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const month = parseMonth(c.req.query("month"));
      const payload = await entries.dashboard.summary.execute({
        userId: auth.userId,
        month
      });
      return c.json(payload);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/dashboard/recent-transactions", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(await entries.dashboard.recentTransactions.execute({ userId: auth.userId }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/transactions", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const query = listTransactionsQuerySchema.parse({
        type: c.req.query("type"),
        search: c.req.query("search"),
        dateFrom: c.req.query("dateFrom"),
        dateTo: c.req.query("dateTo"),
        groupBy: c.req.query("groupBy")
      });
      const payload = await entries.transaction.list.execute({
        userId: auth.userId,
        query
      });
      return c.json(payload);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.post("/v1/transactions", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = createTransactionRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.transaction.create.execute({
          userId: auth.userId,
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.patch("/v1/transactions/:id", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = updateTransactionRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.transaction.update.execute({
          userId: auth.userId,
          transactionId: c.req.param("id"),
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.delete("/v1/transactions/:id", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(
        await entries.transaction.remove.execute({
          userId: auth.userId,
          transactionId: c.req.param("id")
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/categories", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(
        await entries.category.list.execute({
          userId: auth.userId,
          type: c.req.query("type") as "expense" | "income" | undefined,
          includeHidden: c.req.query("includeHidden") === "true"
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.post("/v1/categories", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = createCategoryRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.category.create.execute({
          userId: auth.userId,
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.patch("/v1/categories/:id", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = updateCategoryRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.category.update.execute({
          userId: auth.userId,
          categoryId: c.req.param("id"),
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.delete("/v1/categories/:id", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(
        await entries.category.remove.execute({
          userId: auth.userId,
          categoryId: c.req.param("id")
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/budgets/monthly", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const month = parseMonth(c.req.query("month"));
      return c.json(await entries.budget.getMonthly.execute({ userId: auth.userId, month }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.put("/v1/budgets/monthly", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = updateMonthlyBudgetRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.budget.updateMonthly.execute({
          userId: auth.userId,
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/budgets/categories", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const month = parseMonth(c.req.query("month"));
      return c.json(
        await entries.budget.listCategoryBudgets.execute({ userId: auth.userId, month })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.put("/v1/budgets/categories", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = updateCategoryBudgetsRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.budget.updateCategoryBudgets.execute({
          userId: auth.userId,
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/analytics/summary", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const query = analyticsQuerySchema.parse({
        period: c.req.query("period") ?? "month",
        dateFrom: c.req.query("dateFrom"),
        dateTo: c.req.query("dateTo")
      });
      return c.json(await entries.analytics.summary.execute({ userId: auth.userId, query }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/analytics/trend", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const query = analyticsQuerySchema.parse({
        period: c.req.query("period") ?? "month",
        dateFrom: c.req.query("dateFrom"),
        dateTo: c.req.query("dateTo")
      });
      return c.json(await entries.analytics.trend.execute({ userId: auth.userId, query }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/analytics/categories", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const query = analyticsQuerySchema.parse({
        period: c.req.query("period") ?? "month",
        dateFrom: c.req.query("dateFrom"),
        dateTo: c.req.query("dateTo")
      });
      return c.json(await entries.analytics.categories.execute({ userId: auth.userId, query }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/profile/preferences", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const data = await entries.profile.overview.execute({ userId: auth.userId });
      return c.json(data.preferences);
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.patch("/v1/profile/preferences", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      const payload = patchProfilePreferencesRequestSchema.parse(await c.req.json());
      return c.json(
        await entries.profile.patchPreferences.execute({
          userId: auth.userId,
          payload
        })
      );
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  app.get("/v1/profile/overview", async (c) => {
    try {
      const { entries } = buildEntries(c.env);
      const auth = c.get("auth");
      return c.json(await entries.profile.overview.execute({ userId: auth.userId }));
    } catch (error) {
      return toErrorResponse(c, error);
    }
  });

  return app;
}
