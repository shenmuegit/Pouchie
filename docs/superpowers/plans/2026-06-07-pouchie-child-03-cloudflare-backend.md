# Pouchie Child Plan 3 Cloudflare Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old API worker with a Cloudflare Workers backend for Android/iOS international data.

**Architecture:** Cloudflare routes import endpoint definitions from `@pouchie/contracts`, call `@pouchie/server-core`, persist structured data in D1, store files in R2, and implement only Cloudflare adapters.

**Tech Stack:** Cloudflare Workers, D1, R2, TypeScript, Vitest, Wrangler, `@pouchie/contracts`, `@pouchie/server-core`.

---

## Preconditions

- Child Plan 1 and Child Plan 2 have passed.
- Design tokens are not required for this backend plan.

## Files

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.base.json`
- Delete in this child plan after new Cloudflare route tests pass: `apps/api-worker/`
- Delete in this child plan after `@pouchie/server-core` imports replace every old domain import: `packages/domain/`
- Create: `backends/cloudflare/worker-api/package.json`
- Create: `backends/cloudflare/worker-api/tsconfig.json`
- Create: `backends/cloudflare/worker-api/wrangler.toml`
- Create: `backends/cloudflare/worker-api/src/index.ts`
- Create: `backends/cloudflare/worker-api/src/create-app.ts`
- Create: `backends/cloudflare/worker-api/src/env.ts`
- Create: `backends/cloudflare/worker-api/src/auth/apple.ts`
- Create: `backends/cloudflare/worker-api/src/auth/email.ts`
- Create: `backends/cloudflare/worker-api/src/auth/google.ts`
- Create: `backends/cloudflare/worker-api/src/auth/password.ts`
- Create: `backends/cloudflare/worker-api/src/auth/session.ts`
- Create: `backends/cloudflare/worker-api/src/email/http-email.ts`
- Create: `backends/cloudflare/worker-api/src/repositories/d1.ts`
- Create: `backends/cloudflare/worker-api/src/storage/r2.ts`
- Create: `backends/cloudflare/worker-api/src/routes/health.ts`
- Create: `backends/cloudflare/worker-api/src/routes/auth.ts`
- Create: `backends/cloudflare/worker-api/src/routes/dashboard.ts`
- Create: `backends/cloudflare/worker-api/src/routes/transactions.ts`
- Create: `backends/cloudflare/worker-api/src/routes/reports.ts`
- Create: `backends/cloudflare/worker-api/src/routes/categories.ts`
- Create: `backends/cloudflare/worker-api/src/routes/accounts.ts`
- Create: `backends/cloudflare/worker-api/src/routes/payment-methods.ts`
- Create: `backends/cloudflare/worker-api/src/routes/tags.ts`
- Create: `backends/cloudflare/worker-api/src/routes/budgets.ts`
- Create: `backends/cloudflare/worker-api/src/routes/goals.ts`
- Create: `backends/cloudflare/worker-api/src/routes/shared-ledgers.ts`
- Create: `backends/cloudflare/worker-api/src/routes/receipts.ts`
- Create: `backends/cloudflare/worker-api/src/routes/profile.ts`
- Create: `backends/cloudflare/worker-api/migrations/0001_init.sql`
- Create: `backends/cloudflare/worker-api/migrations/0002_indexes.sql`
- Create: `backends/cloudflare/worker-api/tests/routes.test.ts`
- Create: `backends/cloudflare/worker-api/tests/repositories.test.ts`

## Task 1: Worker Package And Route Registry

- [ ] **Step 1: Write route registry tests**

Create `backends/cloudflare/worker-api/tests/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "@pouchie/contracts";
import { createApp } from "../src/create-app";

describe("Cloudflare route registry", () => {
  it("registers all and only Cloudflare product routes", () => {
    const app = createApp({ mode: "test" });
    const registered = app.listRoutes().filter((route) => route.path.startsWith("/v1/"));
    const expected = PRODUCT_ENDPOINTS
      .filter((endpoint) => endpoint.regions.includes("cloudflare"))
      .map((endpoint) => `${endpoint.method} ${endpoint.path}`)
      .sort();

    expect(registered.map((route) => `${route.method} ${route.path}`).sort()).toEqual(expected);
  });

  it("keeps health operational and public", () => {
    const app = createApp({ mode: "test" });
    const health = OPERATIONAL_ENDPOINTS.find((endpoint) => endpoint.path === "/health");
    expect(health).toMatchObject({ method: "GET", authRequirement: "public" });
    expect(app.listRoutes()).toContainEqual(expect.objectContaining({ method: "GET", path: "/health", authRequirement: "public" }));
  });

  it("does not register WeChat login", () => {
    const app = createApp({ mode: "test" });
    expect(app.listRoutes().map((route) => route.path)).not.toContain("/v1/auth/wechat/login");
  });
});
```

- [ ] **Step 2: Run the failing route tests**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- routes
```

Expected: FAIL because the Cloudflare worker package and `createApp` do not exist.

- [ ] **Step 3: Implement worker package and route registration**

Create `backends/cloudflare/worker-api/src/create-app.ts` with a test-visible route registry:

```ts
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "@pouchie/contracts";

export type RegisteredRoute = { method: string; path: string; authRequirement: "public" | "session" };

export function createApp() {
  const routes: RegisteredRoute[] = [
    ...OPERATIONAL_ENDPOINTS.map((endpoint) => ({ method: endpoint.method, path: endpoint.path, authRequirement: endpoint.authRequirement })),
    ...PRODUCT_ENDPOINTS
      .filter((endpoint) => endpoint.regions.includes("cloudflare"))
      .map((endpoint) => ({ method: endpoint.method, path: endpoint.path, authRequirement: endpoint.authRequirement })),
  ];

  return {
    listRoutes: () => routes,
    fetch: async () => new Response("not implemented", { status: 501 }),
  };
}
```

Create `index.ts`, route modules, `wrangler.toml`, and package scripts so the Worker can typecheck. Route handlers must dispatch through `@pouchie/server-core` entries and schema validation from `@pouchie/contracts`.

- [ ] **Step 4: Run route verification**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- routes
pnpm --filter @pouchie/cloudflare-worker typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit route registry**

```bash
git add backends/cloudflare/worker-api/package.json backends/cloudflare/worker-api/tsconfig.json backends/cloudflare/worker-api/wrangler.toml backends/cloudflare/worker-api/src/index.ts backends/cloudflare/worker-api/src/create-app.ts backends/cloudflare/worker-api/src/routes backends/cloudflare/worker-api/tests/routes.test.ts package.json pnpm-lock.yaml tsconfig.base.json
git commit -m "feat: add cloudflare worker route registry"
```

## Task 2: D1 And R2 Adapters

- [ ] **Step 1: Write repository and migration tests**

Create `backends/cloudflare/worker-api/tests/repositories.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createD1Repositories } from "../src/repositories/d1";

const migrationsDir = join(__dirname, "../migrations");

describe("Cloudflare D1 repositories", () => {
  it("defines auth and accounting tables", () => {
    const sql = `${readFileSync(join(migrationsDir, "0001_init.sql"), "utf8")}\n${readFileSync(join(migrationsDir, "0002_indexes.sql"), "utf8")}`;
    for (const table of ["users", "user_identities", "sessions", "password_credentials", "email_verification_challenges", "transactions", "transaction_tags", "transaction_receipts", "saving_goals", "shared_ledgers", "export_jobs"]) {
      expect(sql).toContain(`CREATE TABLE ${table}`);
    }
  });

  it("stores password and email verification code hashes, not raw secrets", async () => {
    const repositories = createD1Repositories({ db: "test" as never });
    await repositories.authCredentials.createPasswordCredential({ userId: "u1", passwordHash: "hash_pw" });
    await repositories.emailChallenges.create({ email: "ada@example.com", codeHash: "hash_code", expiresAt: "2026-06-07T10:05:00.000Z" });

    expect(await repositories.authCredentials.findPasswordCredential("u1")).toMatchObject({ passwordHash: "hash_pw" });
    expect(await repositories.emailChallenges.findLatest("ada@example.com")).not.toHaveProperty("code");
  });
});
```

- [ ] **Step 2: Run the failing repository tests**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- repositories
```

Expected: FAIL because migrations and D1 repositories are not implemented.

- [ ] **Step 3: Implement migrations and adapters**

Create `0001_init.sql` with tables for users, identities, sessions, password credentials, email verification challenges, categories, accounts, payment methods, tags, transactions, transaction tag joins, transaction receipt joins, budgets, saving goals, deposits, shared ledgers, members, splits, settlements, report aggregates, export jobs, and deletion records. Create `0002_indexes.sql` with indexes for user id, session token hash, local date key, transaction type, category id, goal id, shared ledger id, and expiration cleanup.

Create `src/repositories/d1.ts` implementing `RepositoryPorts`. Create `src/storage/r2.ts` implementing `StoragePort` for receipt upload targets, receipt deletion, export artifact writing, and cleanup scheduling.

- [ ] **Step 4: Run repository verification**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- repositories
pnpm --filter @pouchie/cloudflare-worker typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit persistence adapters**

```bash
git add backends/cloudflare/worker-api/migrations backends/cloudflare/worker-api/src/repositories/d1.ts backends/cloudflare/worker-api/src/storage/r2.ts backends/cloudflare/worker-api/tests/repositories.test.ts
git commit -m "feat: add cloudflare d1 and r2 adapters"
```

## Task 3: Cloudflare Auth And Email

- [ ] **Step 1: Write Cloudflare auth and email tests**

Create `backends/cloudflare/worker-api/tests/auth-email.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createHttpEmailDelivery } from "../src/email/http-email";

describe("Cloudflare auth email delivery", () => {
  it("posts exact email payload with bearer token and ignores provider body", async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ providerId: "secret-provider-id" }), { status: 200 }));
    const delivery = createHttpEmailDelivery({
      endpoint: "https://email.example/send",
      token: "email-token",
      fetch,
    });

    const result = await delivery.sendEmailVerificationCode({
      to: "ada@example.com",
      subject: "Verify Pouchie",
      text: "123456",
      html: "<p>123456</p>",
    });

    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith("https://email.example/send", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer email-token" },
      body: JSON.stringify({ to: "ada@example.com", subject: "Verify Pouchie", text: "123456", html: "<p>123456</p>" }),
    });
  });
});
```

- [ ] **Step 2: Run the failing auth email tests**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- auth-email
```

Expected: FAIL because Cloudflare auth/email adapters do not exist.

- [ ] **Step 3: Implement auth and email adapters**

Create Apple, Google, email, password, session, and HTTP email adapters. `http-email.ts` must export:

```ts
export function createHttpEmailDelivery(config: { endpoint: string; token: string; fetch: typeof fetch }) {
  return {
    async sendEmailVerificationCode(input: { to: string; subject: string; text: string; html: string }) {
      const response = await config.fetch(config.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${config.token}` },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Email delivery failed");
      return { ok: true as const };
    },
  };
}
```

Session adapters must hash session tokens before storage. Password and email verification adapters must store only hashes and explicit expiration/attempt/consumed fields.

- [ ] **Step 4: Run auth email verification**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- auth-email
pnpm --filter @pouchie/cloudflare-worker typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit auth adapters**

```bash
git add backends/cloudflare/worker-api/src/auth backends/cloudflare/worker-api/src/email/http-email.ts backends/cloudflare/worker-api/tests/auth-email.test.ts
git commit -m "feat: add cloudflare auth and email adapters"
```

## Task 4: Cleanup Old Runtime

- [ ] **Step 1: Write cleanup boundary test**

Create `backends/cloudflare/worker-api/tests/cleanup-boundary.test.ts`:

```ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../..");

describe("old runtime cleanup", () => {
  it("removes old api worker and domain package", () => {
    expect(existsSync(join(root, "apps/api-worker"))).toBe(false);
    expect(existsSync(join(root, "packages/domain"))).toBe(false);
  });

  it("removes old runtime references from root config", () => {
    const files = ["package.json", "pnpm-workspace.yaml", "tsconfig.base.json"];
    for (const file of files) {
      const text = readFileSync(join(root, file), "utf8");
      expect(text).not.toMatch(/@pouchie\/domain|@xiaohebao\/domain|apps\/api-worker|@pouchie\/api-worker/);
    }
  });
});
```

- [ ] **Step 2: Run the failing cleanup test**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- cleanup-boundary
```

Expected: FAIL while the old API worker or domain package still exists.

- [ ] **Step 3: Remove old runtime**

Update root `dev:api` to filter `@pouchie/cloudflare-worker`. Remove `apps/api-worker/`, remove `packages/domain/`, and remove `@pouchie/domain` path aliases. Run:

```bash
rg -n '@pouchie/domain|@xiaohebao/domain|apps/api-worker|@pouchie/api-worker' package.json pnpm-workspace.yaml tsconfig.base.json apps packages backends
```

Expected: no output.

- [ ] **Step 4: Run cleanup verification**

Run:

```bash
pnpm --filter @pouchie/cloudflare-worker test -- cleanup-boundary
pnpm -r --if-present run typecheck
test ! -e apps/api-worker
test ! -e packages/domain
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit old runtime removal**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json backends/cloudflare/worker-api/tests/cleanup-boundary.test.ts
git add -A apps/api-worker packages/domain
git commit -m "chore: remove old api worker runtime"
```

## Verification Commands

```bash
pnpm --filter @pouchie/cloudflare-worker test
pnpm --filter @pouchie/cloudflare-worker typecheck
pnpm -r --if-present run typecheck
test ! -e apps/api-worker
test ! -e packages/domain
```

## Completion Criteria

- Cloudflare implements all and only Cloudflare-available product endpoints.
- Shared routes use `PRODUCT_ENDPOINTS`; deploy-only routes use `OPERATIONAL_ENDPOINTS`.
- Cloudflare stores Android/iOS data only in D1/R2.
- WeChat auth and CloudBase data are absent from the Cloudflare runtime.
