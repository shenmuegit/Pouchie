# Pouchie Child Plan 2 Server Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement backend business behavior once behind repository, auth, email, and storage ports.

**Architecture:** `@pouchie/server-core` owns business entries and calls ports for persistence and providers. Cloudflare and CloudBase adapters created in their backend child plans must not duplicate business rules.

**Tech Stack:** TypeScript, Vitest, `@pouchie/contracts`, `@pouchie/core`, `@pouchie/server-core`.

---

## Preconditions

- Child Plan 1 has passed all verification commands.
- `PRODUCT_ENDPOINTS`, schemas, category catalog, and core money/report helpers exist.

## Files

- Create: `packages/server-core/package.json`
- Create: `packages/server-core/tsconfig.json`
- Create: `packages/server-core/src/context.ts`
- Create: `packages/server-core/src/errors.ts`
- Create: `packages/server-core/src/ports/repositories.ts`
- Create: `packages/server-core/src/ports/storage.ts`
- Create: `packages/server-core/src/ports/auth.ts`
- Create: `packages/server-core/src/ports/email.ts`
- Create: `packages/server-core/src/entries/create-entries.ts`
- Create: `packages/server-core/src/entries/auth.ts`
- Create: `packages/server-core/src/entries/dashboard.ts`
- Create: `packages/server-core/src/entries/transactions.ts`
- Create: `packages/server-core/src/entries/reports.ts`
- Create: `packages/server-core/src/entries/categories.ts`
- Create: `packages/server-core/src/entries/accounts.ts`
- Create: `packages/server-core/src/entries/payment-methods.ts`
- Create: `packages/server-core/src/entries/tags.ts`
- Create: `packages/server-core/src/entries/budgets.ts`
- Create: `packages/server-core/src/entries/goals.ts`
- Create: `packages/server-core/src/entries/shared-ledgers.ts`
- Create: `packages/server-core/src/entries/receipts.ts`
- Create: `packages/server-core/src/entries/profile.ts`
- Create: `packages/server-core/src/index.ts`
- Create: `packages/server-core/tests/in-memory-repositories.ts`
- Create: `packages/server-core/tests/transactions.test.ts`
- Create: `packages/server-core/tests/reports.test.ts`
- Create: `packages/server-core/tests/settings.test.ts`
- Create: `packages/server-core/tests/goals.test.ts`
- Create: `packages/server-core/tests/shared-ledgers.test.ts`
- Create: `packages/server-core/tests/receipts.test.ts`
- Create: `packages/server-core/tests/profile-auth.test.ts`

## Task 1: Ports And Context

- [ ] **Step 1: Write the ports and context compile test**

Create `packages/server-core/tests/ports-context.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { AuthProviderPort, EmailDeliveryPort, RepositoryPorts, ServerContext, StoragePort } from "../src";
import { DomainError } from "../src";

describe("server-core ports and context", () => {
  it("defines region-aware server context", () => {
    const context: ServerContext = {
      region: "cloudflare",
      userId: "user_1",
      sessionId: "session_1",
      locale: "en",
      timezone: "America/Los_Angeles",
      currencyPolicy: { kind: "international" },
    };

    expect(context.region).toBe("cloudflare");
  });

  it("defines all provider ports used by backends", () => {
    const repositories = {} as RepositoryPorts;
    const storage = {} as StoragePort;
    const auth = {} as AuthProviderPort;
    const email = {} as EmailDeliveryPort;

    expect(repositories).toBeDefined();
    expect(storage).toBeDefined();
    expect(auth).toBeDefined();
    expect(email).toBeDefined();
  });

  it("uses stable domain error codes", () => {
    const error = new DomainError("UNAUTHORIZED", "Sign in required");
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Sign in required");
  });
});
```

- [ ] **Step 2: Run the failing ports test**

Run:

```bash
pnpm --filter @pouchie/server-core test -- ports-context
```

Expected: FAIL because `@pouchie/server-core` does not export the context, ports, or `DomainError`.

- [ ] **Step 3: Implement context, errors, and ports**

Create `packages/server-core/src/context.ts`:

```ts
export type RuntimeRegion = "cloudflare" | "cloudbase";
export type CurrencyPolicy = { kind: "international" } | { kind: "china"; currencyCode: "CNY" };

export type ServerContext = {
  region: RuntimeRegion;
  userId: string;
  sessionId: string;
  locale: "en" | "zh-CN";
  timezone: string;
  currencyPolicy: CurrencyPolicy;
};
```

Create `packages/server-core/src/errors.ts`:

```ts
export type DomainErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PROVIDER_ERROR";

export class DomainError extends Error {
  constructor(readonly code: DomainErrorCode, message: string) {
    super(message);
    this.name = "DomainError";
  }
}
```

Create port files with explicit interfaces for repositories, storage, auth providers, and email delivery. `RepositoryPorts` must include user, session, category, account, payment method, tag, transaction, budget, goal, shared ledger, receipt, report, export, and deletion-job repositories.

- [ ] **Step 4: Run ports verification**

Run:

```bash
pnpm --filter @pouchie/server-core test -- ports-context
pnpm --filter @pouchie/server-core typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit ports and context**

```bash
git add packages/server-core/package.json packages/server-core/tsconfig.json packages/server-core/src/context.ts packages/server-core/src/errors.ts packages/server-core/src/ports packages/server-core/src/index.ts packages/server-core/tests/ports-context.test.ts
git commit -m "feat: define server core ports and context"
```

## Task 2: Auth Entries

- [ ] **Step 1: Write auth entry tests**

Create `packages/server-core/tests/profile-auth.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createEntries } from "../src";
import { createInMemoryPorts } from "./in-memory-repositories";

describe("auth entries", () => {
  it("creates Cloudflare sessions for Apple login only in Cloudflare context", async () => {
    const ports = createInMemoryPorts();
    const entries = createEntries(ports);
    const session = await entries.auth.loginWithApple({
      identityToken: "apple-token",
      fullName: "Ada",
    });

    expect(session.region).toBe("cloudflare");
    expect(ports.cloudbaseUsers.count()).toBe(0);
  });

  it("sends exactly one email verification code and stores only challenge hash", async () => {
    const ports = createInMemoryPorts();
    const entries = createEntries(ports);
    await entries.auth.requestEmailVerificationCode({ email: "ada@example.com" });

    expect(ports.emailDeliveries).toHaveLength(1);
    expect(ports.emailChallenges.all()[0].codeHash).toMatch(/^[a-f0-9]{64}$/);
    expect(ports.emailChallenges.all()[0]).not.toHaveProperty("code");
  });

  it("creates CloudBase sessions for WeChat login only in CloudBase context", async () => {
    const ports = createInMemoryPorts();
    const entries = createEntries(ports);
    const session = await entries.auth.loginWithWechatMiniProgram({
      loginCode: "wx-login-code",
      phoneCode: "wx-phone-code",
    });

    expect(session.region).toBe("cloudbase");
    expect(ports.cloudflareUsers.count()).toBe(0);
  });

  it("logout invalidates the current session", async () => {
    const ports = createInMemoryPorts();
    const entries = createEntries(ports);
    const session = await entries.auth.loginWithEmail({ email: "ada@example.com", password: "passw0rd!" });
    await entries.auth.logout({ sessionToken: session.accessToken });
    await expect(entries.auth.me({ sessionToken: session.accessToken })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
```

- [ ] **Step 2: Run the failing auth tests**

Run:

```bash
pnpm --filter @pouchie/server-core test -- profile-auth
```

Expected: FAIL because `createEntries`, auth entries, and in-memory ports do not exist.

- [ ] **Step 3: Implement auth entries and in-memory ports**

Create `packages/server-core/src/entries/auth.ts` exporting:

```ts
export type AuthEntries = {
  loginWithApple(input: { identityToken: string; fullName?: string }): Promise<SessionResult>;
  loginWithGoogle(input: { idToken: string }): Promise<SessionResult>;
  registerWithEmail(input: { email: string; password: string }): Promise<EmailAuthResult>;
  loginWithEmail(input: { email: string; password: string }): Promise<SessionResult>;
  requestEmailVerificationCode(input: { email: string }): Promise<{ ok: true }>;
  verifyEmailCode(input: { email: string; code: string }): Promise<SessionResult>;
  loginWithWechatMiniProgram(input: { loginCode: string; phoneCode: string }): Promise<SessionResult>;
  logout(input: { sessionToken: string }): Promise<{ ok: true }>;
  me(input: { sessionToken: string }): Promise<{ userId: string; region: "cloudflare" | "cloudbase" }>;
};
```

Create `packages/server-core/tests/in-memory-repositories.ts` with deterministic in-memory users, sessions, email challenges, email deliveries, and region-specific stores. Email verification codes must be hashed before storage and challenges must include expiration, attempt count, and consumed timestamp.

- [ ] **Step 4: Run auth verification**

Run:

```bash
pnpm --filter @pouchie/server-core test -- profile-auth
pnpm --filter @pouchie/server-core typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit auth entries**

```bash
git add packages/server-core/src/entries/auth.ts packages/server-core/src/entries/create-entries.ts packages/server-core/tests/in-memory-repositories.ts packages/server-core/tests/profile-auth.test.ts packages/server-core/src/index.ts
git commit -m "feat: add server core auth entries"
```

## Task 3: Accounting Entries

- [ ] **Step 1: Write accounting behavior tests**

Create `packages/server-core/tests/transactions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createEntries } from "../src";
import { createInMemoryPorts, cloudflareContext } from "./in-memory-repositories";

describe("transaction entries", () => {
  it("creates expenses and updates budget usage and category reports", async () => {
    const entries = createEntries(createInMemoryPorts());
    await entries.budgets.update(cloudflareContext, { month: "2026-06", currencyCode: "USD", budgetCents: 10000 });
    await entries.transactions.create(cloudflareContext, {
      type: "expense",
      amountCents: 1250,
      currencyCode: "USD",
      categoryId: "food",
      accountId: "cash",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: "Bakery",
    });

    const summary = await entries.reports.getSummary(cloudflareContext, { month: "2026-06" });
    expect(summary.expenseGroups).toContainEqual({ currencyCode: "USD", amountCents: 1250 });
  });

  it("preserves merchantName in list and detail", async () => {
    const entries = createEntries(createInMemoryPorts());
    const created = await entries.transactions.create(cloudflareContext, {
      type: "expense",
      amountCents: 900,
      currencyCode: "USD",
      categoryId: "food",
      accountId: "cash",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: "Coffee Shop",
    });

    expect((await entries.transactions.getDetail(cloudflareContext, { id: created.id })).merchantName).toBe("Coffee Shop");
    expect((await entries.transactions.list(cloudflareContext, {})).items[0].merchantName).toBe("Coffee Shop");
  });
});
```

Create `packages/server-core/tests/goals.test.ts`, `shared-ledgers.test.ts`, `receipts.test.ts`, and `settings.test.ts` with one red test per required behavior listed in this task.

- [ ] **Step 2: Run the failing accounting tests**

Run:

```bash
pnpm --filter @pouchie/server-core test -- transactions goals shared-ledgers receipts settings
```

Expected: FAIL because accounting entries do not exist.

- [ ] **Step 3: Implement accounting entries**

Create entry modules for dashboard, transactions, reports, categories, accounts, payment methods, tags, budgets, goals, shared ledgers, receipts, and profile. `createEntries` must export:

```ts
export type ServerEntries = {
  auth: AuthEntries;
  dashboard: DashboardEntries;
  transactions: TransactionEntries;
  reports: ReportEntries;
  categories: SettingsEntries;
  accounts: SettingsEntries;
  paymentMethods: SettingsEntries;
  tags: SettingsEntries;
  budgets: BudgetEntries;
  goals: GoalEntries;
  sharedLedgers: SharedLedgerEntries;
  receipts: ReceiptEntries;
  profile: ProfileEntries;
};
```

Use `@pouchie/core` for money grouping, split totals, budget math, reports, and goal progress. Do not duplicate those calculations inside entry modules.

- [ ] **Step 4: Run accounting verification**

Run:

```bash
pnpm --filter @pouchie/server-core test -- transactions goals shared-ledgers receipts settings
pnpm --filter @pouchie/server-core typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit accounting entries**

```bash
git add packages/server-core/src/entries packages/server-core/tests/transactions.test.ts packages/server-core/tests/reports.test.ts packages/server-core/tests/settings.test.ts packages/server-core/tests/goals.test.ts packages/server-core/tests/shared-ledgers.test.ts packages/server-core/tests/receipts.test.ts
git commit -m "feat: add server core accounting entries"
```

## Task 4: Currency And Category Enforcement

- [ ] **Step 1: Write enforcement tests**

Create `packages/server-core/tests/reports.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createEntries } from "../src";
import { chinaContext, cloudflareContext, createInMemoryPorts } from "./in-memory-repositories";

describe("currency and category enforcement", () => {
  it("rejects missing currencyCode on money-bearing writes", async () => {
    const entries = createEntries(createInMemoryPorts());
    await expect(entries.transactions.create(cloudflareContext, {
      type: "expense",
      amountCents: 100,
      categoryId: "food",
      accountId: "cash",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: null,
    } as never)).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("rejects non-CNY writes in China context", async () => {
    const entries = createEntries(createInMemoryPorts());
    await expect(entries.transactions.create(chinaContext, {
      type: "expense",
      amountCents: 100,
      currencyCode: "USD",
      categoryId: "food",
      accountId: "cash",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: null,
    })).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("rejects categories that are neither catalog nor user-owned", async () => {
    const entries = createEntries(createInMemoryPorts());
    await expect(entries.transactions.create(cloudflareContext, {
      type: "expense",
      amountCents: 100,
      currencyCode: "USD",
      categoryId: "unknown-category",
      accountId: "cash",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: null,
    })).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });
});
```

- [ ] **Step 2: Run the failing enforcement tests**

Run:

```bash
pnpm --filter @pouchie/server-core test -- reports
```

Expected: FAIL until entry modules enforce region currency and category membership.

- [ ] **Step 3: Implement enforcement helpers**

Create shared internal helpers used by every money-bearing entry:

```ts
import { PREDEFINED_CATEGORIES } from "@pouchie/contracts";
import { assertCurrencyCode } from "@pouchie/core";
import { DomainError } from "../errors";
import type { ServerContext } from "../context";

export function assertWritableCurrency(context: ServerContext, currencyCode: string | undefined) {
  if (!currencyCode) throw new DomainError("VALIDATION_ERROR", "currencyCode is required");
  assertCurrencyCode(currencyCode);
  if (context.currencyPolicy.kind === "china" && currencyCode !== "CNY") {
    throw new DomainError("VALIDATION_ERROR", "China region writes require CNY");
  }
}

export async function assertCategoryAllowed(context: ServerContext, categoryId: string, repositories: RepositoryPorts) {
  if (PREDEFINED_CATEGORIES.some((category) => category.key === categoryId)) return;
  if (await repositories.categories.isOwnedByUser(context.userId, categoryId)) return;
  throw new DomainError("VALIDATION_ERROR", "Category is not available to this user");
}
```

Call these helpers from transactions, budgets, goals, shared settlements, and report-affecting writes.

- [ ] **Step 4: Run full server-core verification**

Run:

```bash
pnpm --filter @pouchie/server-core test
pnpm --filter @pouchie/server-core typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit enforcement**

```bash
git add packages/server-core/src packages/server-core/tests/reports.test.ts
git commit -m "feat: enforce server core currency and categories"
```

## Verification Commands

```bash
pnpm --filter @pouchie/server-core test
pnpm --filter @pouchie/server-core typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- Every required entry listed in this plan is exported by `createEntries`.
- Tests cover Cloudflare auth, CloudBase auth, transactions, reports, settings, goals, shared ledgers, receipts, profile export, and account deletion.
- No backend-specific SDK is imported by `@pouchie/server-core`.
- No server-core test uses prototype fixture data as runtime data.
