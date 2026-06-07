# Pouchie Child Plan 4 CloudBase Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the independent CloudBase backend used only by the WeChat Mini Program.

**Architecture:** CloudBase functions expose CloudBase-available entries from `PRODUCT_ENDPOINTS`, call `@pouchie/server-core`, store all China data in CloudBase database/storage, and implement only WeChat auth.

**Tech Stack:** Tencent CloudBase functions, CloudBase database, CloudBase storage, TypeScript, Vitest, `@pouchie/contracts`, `@pouchie/server-core`.

---

## Preconditions

- Child Plan 1 and Child Plan 2 have passed.
- Cloudflare data is independent and not accessed by this plan.

## Files

- Create: `backends/cloudbase/functions/api/package.json`
- Create: `backends/cloudbase/functions/api/tsconfig.json`
- Create: `backends/cloudbase/functions/api/src/index.ts`
- Create: `backends/cloudbase/functions/api/src/create-app.ts`
- Create: `backends/cloudbase/functions/api/src/auth/wechat.ts`
- Create: `backends/cloudbase/functions/api/src/auth/session.ts`
- Create: `backends/cloudbase/functions/api/src/repositories/cloudbase.ts`
- Create: `backends/cloudbase/functions/api/src/storage/cloudbase-storage.ts`
- Create: `backends/cloudbase/functions/api/src/routes/health.ts`
- Create: `backends/cloudbase/functions/api/src/routes/auth.ts`
- Create: `backends/cloudbase/functions/api/src/routes/dashboard.ts`
- Create: `backends/cloudbase/functions/api/src/routes/transactions.ts`
- Create: `backends/cloudbase/functions/api/src/routes/reports.ts`
- Create: `backends/cloudbase/functions/api/src/routes/categories.ts`
- Create: `backends/cloudbase/functions/api/src/routes/accounts.ts`
- Create: `backends/cloudbase/functions/api/src/routes/payment-methods.ts`
- Create: `backends/cloudbase/functions/api/src/routes/tags.ts`
- Create: `backends/cloudbase/functions/api/src/routes/budgets.ts`
- Create: `backends/cloudbase/functions/api/src/routes/goals.ts`
- Create: `backends/cloudbase/functions/api/src/routes/shared-ledgers.ts`
- Create: `backends/cloudbase/functions/api/src/routes/receipts.ts`
- Create: `backends/cloudbase/functions/api/src/routes/profile.ts`
- Create: `backends/cloudbase/database/collections.json`
- Create: `backends/cloudbase/database/indexes.json`
- Create: `backends/cloudbase/database/rules.json`
- Create: `backends/cloudbase/storage/rules.json`
- Create: `backends/cloudbase/functions/api/tests/routes.test.ts`
- Create: `backends/cloudbase/functions/api/tests/repositories.test.ts`

## Task 1: CloudBase Route Contract

- [ ] **Step 1: Write CloudBase route contract tests**

Create `backends/cloudbase/functions/api/tests/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "@pouchie/contracts";
import { createApp } from "../src/create-app";

describe("CloudBase route contract", () => {
  it("registers all and only CloudBase product routes", () => {
    const app = createApp({ mode: "test" });
    const registered = app.listRoutes().filter((route) => route.path.startsWith("/v1/"));
    const expected = PRODUCT_ENDPOINTS
      .filter((endpoint) => endpoint.regions.includes("cloudbase"))
      .map((endpoint) => `${endpoint.method} ${endpoint.path}`)
      .sort();

    expect(registered.map((route) => `${route.method} ${route.path}`).sort()).toEqual(expected);
  });

  it("has only WeChat auth provider routes", () => {
    const paths = createApp({ mode: "test" }).listRoutes().map((route) => route.path);
    expect(paths).toContain("/v1/auth/wechat/login");
    expect(paths).not.toContain("/v1/auth/apple/login");
    expect(paths).not.toContain("/v1/auth/google/login");
    expect(paths).not.toContain("/v1/auth/email/register");
    expect(paths).not.toContain("/v1/auth/email/login");
    expect(paths).not.toContain("/v1/auth/email/verification-code");
    expect(paths).not.toContain("/v1/auth/email/verify");
  });

  it("keeps health operational and public", () => {
    const health = OPERATIONAL_ENDPOINTS.find((endpoint) => endpoint.path === "/health");
    expect(health).toMatchObject({ method: "GET", authRequirement: "public" });
    expect(createApp({ mode: "test" }).listRoutes()).toContainEqual(expect.objectContaining({ method: "GET", path: "/health", authRequirement: "public" }));
  });
});
```

- [ ] **Step 2: Run the failing route tests**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- routes
```

Expected: FAIL because the CloudBase API package and route registry do not exist.

- [ ] **Step 3: Implement CloudBase app and routes**

Create `backends/cloudbase/functions/api/src/create-app.ts` with a test-visible route registry filtered to `cloudbase` endpoints:

```ts
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "@pouchie/contracts";

export function createApp() {
  const routes = [
    ...OPERATIONAL_ENDPOINTS.map((endpoint) => ({ method: endpoint.method, path: endpoint.path, authRequirement: endpoint.authRequirement })),
    ...PRODUCT_ENDPOINTS
      .filter((endpoint) => endpoint.regions.includes("cloudbase"))
      .map((endpoint) => ({ method: endpoint.method, path: endpoint.path, authRequirement: endpoint.authRequirement })),
  ];

  return {
    listRoutes: () => routes,
    main: async () => ({ statusCode: 501, body: "not implemented" }),
  };
}
```

Create route modules for health, auth, dashboard, transactions, reports, categories, accounts, payment methods, tags, budgets, goals, shared ledgers, receipts, and profile. Route handlers must validate schemas from `@pouchie/contracts` and call `@pouchie/server-core`.

- [ ] **Step 4: Run route verification**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- routes
pnpm --filter @pouchie/cloudbase-api typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit route contract**

```bash
git add backends/cloudbase/functions/api/package.json backends/cloudbase/functions/api/tsconfig.json backends/cloudbase/functions/api/src/index.ts backends/cloudbase/functions/api/src/create-app.ts backends/cloudbase/functions/api/src/routes backends/cloudbase/functions/api/tests/routes.test.ts package.json pnpm-lock.yaml tsconfig.base.json
git commit -m "feat: add cloudbase route contract"
```

## Task 2: WeChat Auth Adapter

- [ ] **Step 1: Write WeChat auth adapter tests**

Create `backends/cloudbase/functions/api/tests/wechat-auth.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createWechatAuthAdapter } from "../src/auth/wechat";

describe("CloudBase WeChat auth adapter", () => {
  it("exchanges wx login and phone codes into a CloudBase identity", async () => {
    const adapter = createWechatAuthAdapter({
      exchangeLoginCode: async () => ({ openid: "openid_1", unionid: "unionid_1" }),
      exchangePhoneCode: async () => ({ phoneNumber: "+8613800138000" }),
    });

    await expect(adapter.exchangeWechatLogin({ loginCode: "login-code", phoneCode: "phone-code" })).resolves.toEqual({
      openid: "openid_1",
      unionid: "unionid_1",
      phoneNumber: "+8613800138000",
    });
  });
});
```

- [ ] **Step 2: Run the failing auth adapter test**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- wechat-auth
```

Expected: FAIL because WeChat auth adapter does not exist.

- [ ] **Step 3: Implement WeChat auth and sessions**

Create `src/auth/wechat.ts`:

```ts
export function createWechatAuthAdapter(deps: {
  exchangeLoginCode(input: { loginCode: string }): Promise<{ openid: string; unionid?: string }>;
  exchangePhoneCode(input: { phoneCode: string }): Promise<{ phoneNumber: string }>;
}) {
  return {
    async exchangeWechatLogin(input: { loginCode: string; phoneCode: string }) {
      const identity = await deps.exchangeLoginCode({ loginCode: input.loginCode });
      const phone = await deps.exchangePhoneCode({ phoneCode: input.phoneCode });
      return { ...identity, ...phone };
    },
  };
}
```

Create `src/auth/session.ts` to hash session tokens before storing them in CloudBase. The server-core `auth.loginWithWechatMiniProgram` entry must use these adapters through ports.

- [ ] **Step 4: Run WeChat auth verification**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- wechat-auth
pnpm --filter @pouchie/cloudbase-api typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit WeChat auth**

```bash
git add backends/cloudbase/functions/api/src/auth backends/cloudbase/functions/api/tests/wechat-auth.test.ts
git commit -m "feat: add cloudbase wechat auth adapter"
```

## Task 3: CloudBase Persistence And Storage

- [ ] **Step 1: Write CloudBase persistence tests**

Create `backends/cloudbase/functions/api/tests/repositories.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const databaseDir = join(__dirname, "../../../database");

describe("CloudBase database metadata", () => {
  it("declares every required collection", () => {
    const collections = JSON.parse(readFileSync(join(databaseDir, "collections.json"), "utf8"));
    expect(collections.map((collection: { name: string }) => collection.name).sort()).toEqual([
      "accounts",
      "budgets",
      "categories",
      "export_jobs",
      "payment_methods",
      "report_category_aggregates",
      "report_daily_aggregates",
      "saving_goal_deposits",
      "saving_goals",
      "sessions",
      "settlements",
      "shared_ledgers",
      "shared_members",
      "tags",
      "transaction_receipts",
      "transaction_splits",
      "transaction_tags",
      "transactions",
      "user_identities",
      "users",
    ]);
  });

  it("scopes database and storage rules to user identity", () => {
    expect(readFileSync(join(databaseDir, "rules.json"), "utf8")).toContain("auth.uid");
    expect(readFileSync(join(__dirname, "../../../storage/rules.json"), "utf8")).toContain("auth.uid");
  });
});
```

- [ ] **Step 2: Run the failing persistence tests**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- repositories
```

Expected: FAIL because CloudBase collection metadata and repository adapters do not exist.

- [ ] **Step 3: Implement CloudBase metadata and adapters**

Create `collections.json`, `indexes.json`, `rules.json`, and storage `rules.json`. Create `src/repositories/cloudbase.ts` implementing `RepositoryPorts`, and create `src/storage/cloudbase-storage.ts` implementing `StoragePort`. Transaction documents must denormalize category, account, payment method, and tag display snapshots.

- [ ] **Step 4: Run persistence verification**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- repositories
pnpm --filter @pouchie/cloudbase-api typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit CloudBase persistence**

```bash
git add backends/cloudbase/database backends/cloudbase/storage backends/cloudbase/functions/api/src/repositories/cloudbase.ts backends/cloudbase/functions/api/src/storage/cloudbase-storage.ts backends/cloudbase/functions/api/tests/repositories.test.ts
git commit -m "feat: add cloudbase persistence adapters"
```

## Task 4: China Currency Enforcement

- [ ] **Step 1: Write China currency enforcement tests**

Create `backends/cloudbase/functions/api/tests/currency.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createApp } from "../src/create-app";

describe("CloudBase CNY enforcement", () => {
  it("rejects missing currencyCode on transaction writes", async () => {
    const app = createApp({ mode: "test" });
    const response = await app.inject({ method: "POST", path: "/v1/transactions", body: { amountCents: 100, categoryId: "food" } });
    expect(response.status).toBe(400);
  });

  it("rejects non-CNY currencyCode", async () => {
    const app = createApp({ mode: "test" });
    const response = await app.inject({ method: "POST", path: "/v1/transactions", body: { amountCents: 100, currencyCode: "USD", categoryId: "food" } });
    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run the failing currency tests**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test -- currency
```

Expected: FAIL until CloudBase routes pass China context into `@pouchie/server-core` for every money-bearing write.

- [ ] **Step 3: Implement China context enforcement**

Every CloudBase route calling server-core must pass:

```ts
const context = {
  region: "cloudbase",
  userId,
  sessionId,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  currencyPolicy: { kind: "china", currencyCode: "CNY" },
} as const;
```

Routes must reject missing and non-CNY `currencyCode` through schema/server-core validation for transactions, budgets, goals, deposits, shared settlements, and report-affecting writes.

- [ ] **Step 4: Run full CloudBase verification**

Run:

```bash
pnpm --filter @pouchie/cloudbase-api test
pnpm --filter @pouchie/cloudbase-api typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit CNY enforcement**

```bash
git add backends/cloudbase/functions/api/src backends/cloudbase/functions/api/tests/currency.test.ts
git commit -m "feat: enforce cny in cloudbase api"
```

## Verification Commands

```bash
pnpm --filter @pouchie/cloudbase-api test
pnpm --filter @pouchie/cloudbase-api typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- CloudBase implements all and only CloudBase-available product endpoints.
- CloudBase auth is WeChat-only.
- CloudBase data never joins or reads Cloudflare data.
- Receipt and export storage are user-scoped.
