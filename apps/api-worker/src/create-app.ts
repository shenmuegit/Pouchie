import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  analyticsQuerySchema,
  appleLoginRequestSchema,
  createCategoryRequestSchema,
  createTransactionRequestSchema,
  devLoginRequestSchema,
  googleLoginRequestSchema,
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
          issuer: env.APPLE_ISSUER,
          googleClientId: env.GOOGLE_CLIENT_ID ?? ""
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

  app.get("/privacy", (c) =>
    c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>小荷包 · 隐私政策</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,sans-serif;
         max-width:720px;margin:0 auto;padding:28px 20px;color:#1e293b;line-height:1.75}
    h1{font-size:24px;color:#1d4ed8;margin-bottom:4px}
    .date{color:#64748b;font-size:14px;margin-bottom:32px}
    h2{font-size:17px;margin-top:36px;color:#1e293b}
    p,li{margin:10px 0;font-size:15px}
    a{color:#2563eb}
    footer{margin-top:56px;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
  </style>
</head>
<body>
<h1>小荷包 · 隐私政策</h1>
<p class="date">最后更新：2026 年 5 月 25 日</p>

<p>小荷包（以下简称"本应用"）由 meolord 开发并运营。本政策说明本应用收集、使用及保护您个人信息的方式。</p>

<h2>一、收集的信息</h2>
<ul>
  <li><strong>Apple 账号信息</strong>：通过 Sign in with Apple 登录时，您可选择是否共享姓名和邮箱地址，仅用于显示账户资料。</li>
  <li><strong>财务记录</strong>：您手动录入的收支账单、分类与预算数据，存储于您的账户中，仅用于提供记账功能。</li>
</ul>

<h2>二、信息使用</h2>
<p>我们收集的信息仅用于提供本应用的核心功能（记账、统计、预算管理）。我们不会将您的数据用于广告投放，也不会出售给任何第三方。</p>

<h2>三、数据存储与安全</h2>
<p>所有数据存储于 Cloudflare 提供的安全基础设施中，所有网络通信均通过 HTTPS 加密传输。本应用支持 Face ID 保护，防止他人未经授权访问您的账户。</p>

<h2>四、第三方共享</h2>
<p>我们不会主动向任何第三方共享您的个人信息，法律法规要求的情况除外。</p>

<h2>五、数据删除</h2>
<p>您可随时在应用内点击"退出登录"停止使用服务。如需永久删除账户及所有数据，请发送邮件至 <a href="mailto:shenmuemeolord@gmail.com">shenmuemeolord@gmail.com</a>，我们将在 7 个工作日内处理。</p>

<h2>六、未成年人</h2>
<p>本应用不面向 13 岁以下未成年人，我们不会有意收集其个人信息。</p>

<h2>七、政策更新</h2>
<p>本政策如有重大变更，我们将在应用内通知您，并更新本页面顶部的"最后更新"日期。</p>

<h2>八、联系我们</h2>
<p>如对本隐私政策有任何疑问或请求，请联系：<a href="mailto:shenmuemeolord@gmail.com">shenmuemeolord@gmail.com</a></p>

<footer>© 2026 meolord · 小荷包</footer>
</body>
</html>`)
  );

  app.get("/support", (c) =>
    c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>小荷包 · 支持</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,sans-serif;
         max-width:720px;margin:0 auto;padding:28px 20px;color:#1e293b;line-height:1.75}
    h1{font-size:24px;color:#1d4ed8}
    h2{font-size:17px;margin-top:32px}
    p,li{font-size:15px;margin:10px 0}
    a{color:#2563eb}
    footer{margin-top:56px;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
  </style>
</head>
<body>
<h1>小荷包 · 技术支持</h1>

<h2>联系方式</h2>
<p>如遇到问题或有功能建议，请发送邮件至：<a href="mailto:shenmuemeolord@gmail.com">shenmuemeolord@gmail.com</a></p>
<p>我们通常在 1–3 个工作日内回复。</p>

<h2>常见问题</h2>
<ul>
  <li><strong>如何添加账单？</strong>点击底部导航栏中央的"＋"按钮即可快速记账。</li>
  <li><strong>如何设置预算？</strong>在首页点击"预算管理"，可设置月总预算及每个分类的预算上限。</li>
  <li><strong>如何删除账单？</strong>在"账单"页面左滑条目，选择删除。</li>
  <li><strong>如何退出登录？</strong>进入"我的"页面，点击底部"退出登录"。</li>
  <li><strong>如何删除账户？</strong>请发送邮件至上方地址，注明"删除账户"，我们将在 7 个工作日内处理。</li>
</ul>

<footer>© 2026 meolord · 小荷包</footer>
</body>
</html>`)
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

  app.post("/v1/auth/google/login", async (c) => {
    try {
      const input = await c.req.json();
      const parsed = googleLoginRequestSchema.parse(input);
      const { entries } = buildEntries(c.env);
      const payload = await entries.auth.googleLogin.execute(parsed);
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
