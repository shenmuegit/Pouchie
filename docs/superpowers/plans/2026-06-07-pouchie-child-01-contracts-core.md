# Pouchie Child Plan 1 Contracts And Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the shared product language for Pouchie: package names, workspace paths, endpoint registry, request/response schemas, category catalog, money rules, report math, split math, goal math, and i18n labels.

**Architecture:** This plan creates the contract and pure-domain layer that every downstream backend and client imports. It does not create Cloudflare, CloudBase, Expo, or WeChat runtime behavior.

**Tech Stack:** pnpm monorepo, TypeScript, Zod, Vitest, `@pouchie/contracts`, `@pouchie/core`, `@pouchie/i18n`.

---

## Preconditions

- `docs/superpowers/plans/2026-06-07-pouchie-full-rewrite-master.md` exists.
- `原型/手账本.html`, `原型/app/nb1.jsx`, `原型/app/nb2.jsx`, `原型/app/tokens.jsx`, and `原型/app/data.jsx` exist for visual and data semantics reference only.
- No runtime code may import prototype JSX or prototype fixture data.

## Files

- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.base.json`
- Modify: `apps/mobile/package.json`
- Modify: `apps/api-worker/package.json`
- Modify: `packages/contracts/package.json`
- Modify: `packages/domain/package.json`
- Modify: `packages/ui-tokens/package.json`
- Replace: `packages/contracts/src/index.ts`
- Create: `packages/contracts/src/category-catalog.ts`
- Create: `packages/contracts/src/api/endpoints.ts`
- Create: `packages/contracts/src/api/operational-endpoints.ts`
- Create: `packages/contracts/src/api/schemas/auth.ts`
- Create: `packages/contracts/src/api/schemas/dashboard.ts`
- Create: `packages/contracts/src/api/schemas/transactions.ts`
- Create: `packages/contracts/src/api/schemas/reports.ts`
- Create: `packages/contracts/src/api/schemas/categories.ts`
- Create: `packages/contracts/src/api/schemas/accounts.ts`
- Create: `packages/contracts/src/api/schemas/payment-methods.ts`
- Create: `packages/contracts/src/api/schemas/tags.ts`
- Create: `packages/contracts/src/api/schemas/budgets.ts`
- Create: `packages/contracts/src/api/schemas/goals.ts`
- Create: `packages/contracts/src/api/schemas/shared-ledgers.ts`
- Create: `packages/contracts/src/api/schemas/receipts.ts`
- Create: `packages/contracts/src/api/schemas/profile.ts`
- Create: `packages/contracts/tests/endpoint-registry.test.ts`
- Create: `packages/contracts/tests/schema-coverage.test.ts`
- Create: `packages/contracts/tests/category-catalog.test.ts`
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/money.ts`
- Create: `packages/core/src/time.ts`
- Create: `packages/core/src/budget.ts`
- Create: `packages/core/src/reports.ts`
- Create: `packages/core/src/splits.ts`
- Create: `packages/core/src/goals.ts`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/tests/money.test.ts`
- Create: `packages/core/tests/reports.test.ts`
- Create: `packages/core/tests/splits.test.ts`
- Create: `packages/core/tests/goals.test.ts`
- Create: `packages/i18n/package.json`
- Create: `packages/i18n/tsconfig.json`
- Create: `packages/i18n/src/locales/zh-CN.ts`
- Create: `packages/i18n/src/locales/en.ts`
- Create: `packages/i18n/src/index.ts`

## Task 1: Workspace Package Identity

- [ ] **Step 1: Write the workspace identity test**

Create `packages/contracts/tests/workspace-identity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "../../..");

function readJson(path: string) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

describe("workspace identity", () => {
  it("uses the pouchie root package name", () => {
    expect(readJson("package.json").name).toBe("pouchie-monorepo");
  });

  it("keeps only named transitional packages", () => {
    const packages = [
      "apps/mobile/package.json",
      "apps/api-worker/package.json",
      "packages/contracts/package.json",
      "packages/domain/package.json",
      "packages/ui-tokens/package.json",
    ].map(readJson);

    expect(packages.map((pkg) => pkg.name).sort()).toEqual([
      "@pouchie/api-worker",
      "@pouchie/contracts",
      "@pouchie/domain",
      "@pouchie/mobile",
      "@pouchie/ui-tokens",
    ]);
  });

  it("contains no active xiaohebao package names", () => {
    const files = [
      "package.json",
      "apps/mobile/package.json",
      "apps/api-worker/package.json",
      "packages/contracts/package.json",
      "packages/domain/package.json",
      "packages/ui-tokens/package.json",
    ];

    for (const file of files) {
      expect(readFileSync(join(root, file), "utf8")).not.toContain("@xiaohebao/");
      expect(readFileSync(join(root, file), "utf8")).not.toContain("xiaohebao-monorepo");
    }
  });
});
```

- [ ] **Step 2: Run the failing workspace identity test**

Run:

```bash
pnpm --filter @pouchie/contracts test -- workspace-identity
```

Expected: FAIL because the package names and path aliases still use the current workspace names.

- [ ] **Step 3: Rename workspace manifests and paths**

Set root `package.json` name to `pouchie-monorepo`. Rename active package scopes to `@pouchie/*`; keep transitional names only for `@pouchie/api-worker`, `@pouchie/domain`, and `@pouchie/ui-tokens`. Update `pnpm-workspace.yaml` to:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "backends/cloudflare/*"
  - "backends/cloudbase/functions/*"
```

Update `tsconfig.base.json` paths for:

```json
{
  "@pouchie/contracts": ["packages/contracts/src/index.ts"],
  "@pouchie/core": ["packages/core/src/index.ts"],
  "@pouchie/server-core": ["packages/server-core/src/index.ts"],
  "@pouchie/api-client": ["packages/api-client/src/index.ts"],
  "@pouchie/api-client/native": ["packages/api-client/src/native.ts"],
  "@pouchie/api-client/wechat": ["packages/api-client/src/wechat.ts"],
  "@pouchie/design-tokens": ["packages/design-tokens/src/index.ts"],
  "@pouchie/i18n": ["packages/i18n/src/index.ts"],
  "@pouchie/domain": ["packages/domain/src/index.ts"],
  "@pouchie/ui-tokens": ["packages/ui-tokens/src/index.ts"]
}
```

- [ ] **Step 4: Run workspace verification**

Run:

```bash
pnpm install
pnpm --filter @pouchie/contracts test -- workspace-identity
pnpm -r --if-present run typecheck
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit workspace identity**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json apps/mobile/package.json apps/api-worker/package.json packages/contracts/package.json packages/domain/package.json packages/ui-tokens/package.json packages/contracts/tests/workspace-identity.test.ts
git commit -m "chore: rename workspace to pouchie packages"
```

## Task 2: Endpoint Registry And Schema Keys

- [ ] **Step 1: Write endpoint registry tests**

Create `packages/contracts/tests/endpoint-registry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "../src";

describe("endpoint registry", () => {
  it("has unique product method/path pairs", () => {
    const pairs = PRODUCT_ENDPOINTS.map((endpoint) => `${endpoint.method} ${endpoint.path}`);
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("separates product and operational endpoints", () => {
    const productPairs = new Set(PRODUCT_ENDPOINTS.map((endpoint) => `${endpoint.method} ${endpoint.path}`));
    for (const endpoint of OPERATIONAL_ENDPOINTS) {
      expect(productPairs.has(`${endpoint.method} ${endpoint.path}`)).toBe(false);
    }
  });

  it("declares Cloudflare auth without WeChat login", () => {
    const cloudflarePaths = PRODUCT_ENDPOINTS.filter((endpoint) => endpoint.regions.includes("cloudflare")).map((endpoint) => endpoint.path);
    expect(cloudflarePaths).toContain("/v1/auth/apple/login");
    expect(cloudflarePaths).toContain("/v1/auth/google/login");
    expect(cloudflarePaths).toContain("/v1/auth/email/register");
    expect(cloudflarePaths).toContain("/v1/auth/email/login");
    expect(cloudflarePaths).toContain("/v1/auth/email/verification-code");
    expect(cloudflarePaths).toContain("/v1/auth/email/verify");
    expect(cloudflarePaths).not.toContain("/v1/auth/wechat/login");
  });

  it("declares CloudBase WeChat auth without App auth providers", () => {
    const cloudbasePaths = PRODUCT_ENDPOINTS.filter((endpoint) => endpoint.regions.includes("cloudbase")).map((endpoint) => endpoint.path);
    expect(cloudbasePaths).toContain("/v1/auth/wechat/login");
    expect(cloudbasePaths).not.toContain("/v1/auth/apple/login");
    expect(cloudbasePaths).not.toContain("/v1/auth/google/login");
    expect(cloudbasePaths).not.toContain("/v1/auth/email/register");
  });

  it("declares schema keys and auth requirement for every product endpoint", () => {
    for (const endpoint of PRODUCT_ENDPOINTS) {
      expect(endpoint.key).toMatch(/^[a-z][a-zA-Z0-9.]+$/);
      expect(["GET", "POST", "PATCH", "PUT", "DELETE"]).toContain(endpoint.method);
      expect(endpoint.path).toMatch(/^\/v1\//);
      expect(endpoint.requestSchema).toMatch(/^[A-Z][A-Za-z0-9]+$/);
      expect(endpoint.responseSchema).toMatch(/^[A-Z][A-Za-z0-9]+$/);
      expect(["public", "session"]).toContain(endpoint.authRequirement);
    }
  });

  it("covers every required product capability area", () => {
    const keyPrefixes = new Set(PRODUCT_ENDPOINTS.map((endpoint) => endpoint.key.split(".")[0]));
    expect([...keyPrefixes].sort()).toEqual([
      "accounts",
      "auth",
      "budgets",
      "categories",
      "dashboard",
      "goals",
      "paymentMethods",
      "profile",
      "receipts",
      "reports",
      "sharedLedgers",
      "tags",
      "transactions",
    ]);
  });
});
```

- [ ] **Step 2: Run the failing endpoint registry test**

Run:

```bash
pnpm --filter @pouchie/contracts test -- endpoint-registry
```

Expected: FAIL because `PRODUCT_ENDPOINTS` and `OPERATIONAL_ENDPOINTS` are not implemented.

- [ ] **Step 3: Implement endpoint registry**

Create `packages/contracts/src/api/endpoints.ts` with these exported types:

```ts
export type Region = "cloudflare" | "cloudbase";
export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type AuthRequirement = "public" | "session";

export type ProductEndpoint = {
  key: string;
  method: HttpMethod;
  path: `/v1/${string}`;
  regions: readonly Region[];
  authRequirement: AuthRequirement;
  requestSchema: string;
  responseSchema: string;
};

export const PRODUCT_ENDPOINTS = [
  { key: "auth.loginWithApple", method: "POST", path: "/v1/auth/apple/login", regions: ["cloudflare"], authRequirement: "public", requestSchema: "AppleLoginRequestSchema", responseSchema: "SessionResponseSchema" },
  { key: "auth.loginWithGoogle", method: "POST", path: "/v1/auth/google/login", regions: ["cloudflare"], authRequirement: "public", requestSchema: "GoogleLoginRequestSchema", responseSchema: "SessionResponseSchema" },
  { key: "auth.registerWithEmail", method: "POST", path: "/v1/auth/email/register", regions: ["cloudflare"], authRequirement: "public", requestSchema: "EmailRegisterRequestSchema", responseSchema: "EmailAuthResponseSchema" },
  { key: "auth.loginWithEmail", method: "POST", path: "/v1/auth/email/login", regions: ["cloudflare"], authRequirement: "public", requestSchema: "EmailLoginRequestSchema", responseSchema: "SessionResponseSchema" },
  { key: "auth.requestEmailVerificationCode", method: "POST", path: "/v1/auth/email/verification-code", regions: ["cloudflare"], authRequirement: "public", requestSchema: "EmailVerificationCodeRequestSchema", responseSchema: "EmailVerificationCodeResponseSchema" },
  { key: "auth.verifyEmailCode", method: "POST", path: "/v1/auth/email/verify", regions: ["cloudflare"], authRequirement: "public", requestSchema: "EmailVerifyRequestSchema", responseSchema: "SessionResponseSchema" },
  { key: "auth.loginWithWechatMiniProgram", method: "POST", path: "/v1/auth/wechat/login", regions: ["cloudbase"], authRequirement: "public", requestSchema: "WechatLoginRequestSchema", responseSchema: "SessionResponseSchema" },
  { key: "auth.logout", method: "POST", path: "/v1/auth/logout", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "auth.me", method: "GET", path: "/v1/auth/me", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "ProfileResponseSchema" },
  { key: "dashboard.getHome", method: "GET", path: "/v1/dashboard", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "DashboardResponseSchema" },
  { key: "transactions.list", method: "GET", path: "/v1/transactions", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "TransactionListRequestSchema", responseSchema: "TransactionListResponseSchema" },
  { key: "transactions.create", method: "POST", path: "/v1/transactions", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "TransactionCreateRequestSchema", responseSchema: "TransactionDetailResponseSchema" },
  { key: "transactions.getDetail", method: "GET", path: "/v1/transactions/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "TransactionDetailResponseSchema" },
  { key: "transactions.update", method: "PATCH", path: "/v1/transactions/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "TransactionUpdateRequestSchema", responseSchema: "TransactionDetailResponseSchema" },
  { key: "transactions.remove", method: "DELETE", path: "/v1/transactions/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "categories.list", method: "GET", path: "/v1/categories", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "CategoryListResponseSchema" },
  { key: "categories.create", method: "POST", path: "/v1/categories", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "CategoryCreateRequestSchema", responseSchema: "CategoryResponseSchema" },
  { key: "categories.update", method: "PATCH", path: "/v1/categories/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "CategoryUpdateRequestSchema", responseSchema: "CategoryResponseSchema" },
  { key: "categories.remove", method: "DELETE", path: "/v1/categories/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "accounts.list", method: "GET", path: "/v1/accounts", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "AccountListResponseSchema" },
  { key: "accounts.create", method: "POST", path: "/v1/accounts", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "AccountCreateRequestSchema", responseSchema: "AccountResponseSchema" },
  { key: "accounts.update", method: "PATCH", path: "/v1/accounts/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "AccountUpdateRequestSchema", responseSchema: "AccountResponseSchema" },
  { key: "accounts.remove", method: "DELETE", path: "/v1/accounts/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "paymentMethods.list", method: "GET", path: "/v1/payment-methods", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "PaymentMethodListResponseSchema" },
  { key: "paymentMethods.create", method: "POST", path: "/v1/payment-methods", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "PaymentMethodCreateRequestSchema", responseSchema: "PaymentMethodResponseSchema" },
  { key: "paymentMethods.update", method: "PATCH", path: "/v1/payment-methods/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "PaymentMethodUpdateRequestSchema", responseSchema: "PaymentMethodResponseSchema" },
  { key: "paymentMethods.remove", method: "DELETE", path: "/v1/payment-methods/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "tags.list", method: "GET", path: "/v1/tags", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "TagListResponseSchema" },
  { key: "tags.create", method: "POST", path: "/v1/tags", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "TagCreateRequestSchema", responseSchema: "TagResponseSchema" },
  { key: "tags.update", method: "PATCH", path: "/v1/tags/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "TagUpdateRequestSchema", responseSchema: "TagResponseSchema" },
  { key: "tags.remove", method: "DELETE", path: "/v1/tags/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "budgets.get", method: "GET", path: "/v1/budget", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "BudgetResponseSchema" },
  { key: "budgets.update", method: "PUT", path: "/v1/budget", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "BudgetUpdateRequestSchema", responseSchema: "BudgetResponseSchema" },
  { key: "goals.list", method: "GET", path: "/v1/goals", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "GoalListResponseSchema" },
  { key: "goals.create", method: "POST", path: "/v1/goals", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "GoalCreateRequestSchema", responseSchema: "GoalResponseSchema" },
  { key: "goals.getDetail", method: "GET", path: "/v1/goals/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "GoalDetailResponseSchema" },
  { key: "goals.update", method: "PATCH", path: "/v1/goals/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "GoalUpdateRequestSchema", responseSchema: "GoalResponseSchema" },
  { key: "goals.remove", method: "DELETE", path: "/v1/goals/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "EmptyResponseSchema" },
  { key: "goals.createDeposit", method: "POST", path: "/v1/goals/:id/deposits", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "GoalDepositCreateRequestSchema", responseSchema: "GoalDetailResponseSchema" },
  { key: "sharedLedgers.list", method: "GET", path: "/v1/shared-ledgers", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "SharedLedgerListResponseSchema" },
  { key: "sharedLedgers.create", method: "POST", path: "/v1/shared-ledgers", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "SharedLedgerCreateRequestSchema", responseSchema: "SharedLedgerResponseSchema" },
  { key: "sharedLedgers.getDetail", method: "GET", path: "/v1/shared-ledgers/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "IdRequestSchema", responseSchema: "SharedLedgerDetailResponseSchema" },
  { key: "sharedLedgers.update", method: "PATCH", path: "/v1/shared-ledgers/:id", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "SharedLedgerUpdateRequestSchema", responseSchema: "SharedLedgerResponseSchema" },
  { key: "sharedLedgers.addMember", method: "POST", path: "/v1/shared-ledgers/:id/members", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "SharedLedgerMemberCreateRequestSchema", responseSchema: "SharedLedgerDetailResponseSchema" },
  { key: "sharedLedgers.removeMember", method: "DELETE", path: "/v1/shared-ledgers/:id/members/:memberId", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "SharedLedgerMemberRemoveRequestSchema", responseSchema: "SharedLedgerDetailResponseSchema" },
  { key: "sharedLedgers.createSettlement", method: "POST", path: "/v1/shared-ledgers/:id/settlements", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "SharedLedgerSettlementCreateRequestSchema", responseSchema: "SharedLedgerDetailResponseSchema" },
  { key: "receipts.createUploadTarget", method: "POST", path: "/v1/receipts/upload-target", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReceiptUploadTargetRequestSchema", responseSchema: "ReceiptUploadTargetResponseSchema" },
  { key: "receipts.attachToTransaction", method: "POST", path: "/v1/transactions/:id/receipts", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReceiptAttachRequestSchema", responseSchema: "TransactionDetailResponseSchema" },
  { key: "receipts.removeFromTransaction", method: "DELETE", path: "/v1/transactions/:id/receipts/:receiptId", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReceiptRemoveRequestSchema", responseSchema: "TransactionDetailResponseSchema" },
  { key: "reports.getSummary", method: "GET", path: "/v1/reports/summary", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReportRequestSchema", responseSchema: "ReportSummaryResponseSchema" },
  { key: "reports.getTrend", method: "GET", path: "/v1/reports/trend", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReportRequestSchema", responseSchema: "ReportTrendResponseSchema" },
  { key: "reports.getCategories", method: "GET", path: "/v1/reports/categories", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ReportRequestSchema", responseSchema: "ReportCategoriesResponseSchema" },
  { key: "profile.get", method: "GET", path: "/v1/profile", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "ProfileResponseSchema" },
  { key: "profile.update", method: "PATCH", path: "/v1/profile", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "ProfileUpdateRequestSchema", responseSchema: "ProfileResponseSchema" },
  { key: "profile.export", method: "POST", path: "/v1/profile/export", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "ProfileExportResponseSchema" },
  { key: "profile.deleteAccount", method: "DELETE", path: "/v1/profile", regions: ["cloudflare", "cloudbase"], authRequirement: "session", requestSchema: "EmptyRequestSchema", responseSchema: "EmptyResponseSchema" }
] as const satisfies readonly ProductEndpoint[];
```

Create `packages/contracts/src/api/operational-endpoints.ts`:

```ts
export const OPERATIONAL_ENDPOINTS = [
  { key: "health.get", method: "GET", path: "/health", authRequirement: "public", responseSchema: "HealthResponseSchema" }
] as const;
```

- [ ] **Step 4: Run endpoint registry verification**

Run:

```bash
pnpm --filter @pouchie/contracts test -- endpoint-registry
```

Expected: PASS.

- [ ] **Step 5: Commit endpoint registry**

```bash
git add packages/contracts/src/api/endpoints.ts packages/contracts/src/api/operational-endpoints.ts packages/contracts/tests/endpoint-registry.test.ts packages/contracts/src/index.ts
git commit -m "feat: define pouchie endpoint registry"
```

## Task 3: Request And Response Schemas

- [ ] **Step 1: Write schema coverage tests**

Create `packages/contracts/tests/schema-coverage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import * as exports from "../src";
import { PRODUCT_ENDPOINTS } from "../src";

describe("schema coverage", () => {
  it("exports every request and response schema referenced by endpoints", () => {
    for (const endpoint of PRODUCT_ENDPOINTS) {
      expect(exports).toHaveProperty(endpoint.requestSchema);
      expect(exports).toHaveProperty(endpoint.responseSchema);
    }
  });

  it("requires currencyCode on money-bearing transaction payloads", () => {
    const result = exports.TransactionCreateRequestSchema.safeParse({
      type: "expense",
      amountCents: 1200,
      categoryId: "food",
      accountId: "acc_1",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: "Bakery",
    });

    expect(result.success).toBe(false);
  });

  it("preserves merchantName as nullable transaction data", () => {
    const result = exports.TransactionCreateRequestSchema.safeParse({
      type: "expense",
      amountCents: 1200,
      currencyCode: "USD",
      categoryId: "food",
      accountId: "acc_1",
      occurredAt: "2026-06-07T10:00:00.000Z",
      localDateKey: "2026-06-07",
      merchantName: null,
    });

    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run the failing schema coverage test**

Run:

```bash
pnpm --filter @pouchie/contracts test -- schema-coverage
```

Expected: FAIL because schema exports do not exist yet.

- [ ] **Step 3: Implement shared schema modules**

Create schema modules under `packages/contracts/src/api/schemas/`. At minimum, each module exports Zod schemas referenced by `PRODUCT_ENDPOINTS`. Use this shape for shared primitives in `transactions.ts` and reuse it across schema files:

```ts
import { z } from "zod";

export const CurrencyCodeSchema = z.string().regex(/^[A-Z]{3}$/);
export const EmptyRequestSchema = z.object({}).strict();
export const EmptyResponseSchema = z.object({ ok: z.literal(true) }).strict();
export const IdRequestSchema = z.object({ id: z.string().min(1) }).strict();

export const TransactionTypeSchema = z.enum(["expense", "income", "transfer"]);

export const TransactionCreateRequestSchema = z.object({
  type: TransactionTypeSchema,
  amountCents: z.number().int(),
  currencyCode: CurrencyCodeSchema,
  categoryId: z.string().min(1).or(z.undefined()),
  accountId: z.string().min(1),
  paymentMethodId: z.string().min(1).or(z.undefined()),
  occurredAt: z.string().datetime(),
  localDateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  merchantName: z.string().min(1).nullable(),
  note: z.string().nullable().or(z.undefined()),
  tagIds: z.array(z.string().min(1)).default([]),
}).strict();
```

Export every schema from `packages/contracts/src/index.ts`.

- [ ] **Step 4: Run schema verification**

Run:

```bash
pnpm --filter @pouchie/contracts test -- schema-coverage
pnpm --filter @pouchie/contracts typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit schemas**

```bash
git add packages/contracts/src/api/schemas packages/contracts/src/index.ts packages/contracts/tests/schema-coverage.test.ts
git commit -m "feat: add pouchie contract schemas"
```

## Task 4: Category Catalog And I18n Labels

- [ ] **Step 1: Write category catalog tests**

Create `packages/contracts/tests/category-catalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PREDEFINED_CATEGORIES } from "../src";
import { en, zhCN } from "@pouchie/i18n";

describe("category catalog", () => {
  it("contains the required stable category keys", () => {
    expect(PREDEFINED_CATEGORIES.map((category) => category.key).sort()).toEqual([
      "bonus",
      "entertainment",
      "food",
      "home",
      "reimbursement",
      "salary",
      "shopping",
      "transit",
    ]);
  });

  it("has no catch-all sentinel key", () => {
    expect(PREDEFINED_CATEGORIES.map((category) => category.key)).not.toContain("other");
    expect(PREDEFINED_CATEGORIES.map((category) => category.key)).not.toContain("uncategorized");
  });

  it("has i18n labels and visual tokens", () => {
    for (const category of PREDEFINED_CATEGORIES) {
      expect(["expense", "income"]).toContain(category.type);
      expect(category.iconToken).toMatch(/^category\./);
      expect(category.colorToken).toMatch(/^category\./);
      expect(en[category.labelKey]).toBeTruthy();
      expect(zhCN[category.labelKey]).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run the failing category test**

Run:

```bash
pnpm --filter @pouchie/contracts test -- category-catalog
```

Expected: FAIL because the catalog and i18n exports do not exist.

- [ ] **Step 3: Implement catalog and labels**

Create `packages/contracts/src/category-catalog.ts`:

```ts
export const PREDEFINED_CATEGORIES = [
  { key: "food", type: "expense", sortOrder: 10, iconToken: "category.food.icon", colorToken: "category.food.color", labelKey: "category.food" },
  { key: "transit", type: "expense", sortOrder: 20, iconToken: "category.transit.icon", colorToken: "category.transit.color", labelKey: "category.transit" },
  { key: "shopping", type: "expense", sortOrder: 30, iconToken: "category.shopping.icon", colorToken: "category.shopping.color", labelKey: "category.shopping" },
  { key: "home", type: "expense", sortOrder: 40, iconToken: "category.home.icon", colorToken: "category.home.color", labelKey: "category.home" },
  { key: "entertainment", type: "expense", sortOrder: 50, iconToken: "category.entertainment.icon", colorToken: "category.entertainment.color", labelKey: "category.entertainment" },
  { key: "salary", type: "income", sortOrder: 60, iconToken: "category.salary.icon", colorToken: "category.salary.color", labelKey: "category.salary" },
  { key: "bonus", type: "income", sortOrder: 70, iconToken: "category.bonus.icon", colorToken: "category.bonus.color", labelKey: "category.bonus" },
  { key: "reimbursement", type: "income", sortOrder: 80, iconToken: "category.reimbursement.icon", colorToken: "category.reimbursement.color", labelKey: "category.reimbursement" },
] as const;
```

Create matching `en` and `zhCN` locale objects in `packages/i18n/src/locales/en.ts` and `packages/i18n/src/locales/zh-CN.ts`.

- [ ] **Step 4: Run category verification**

Run:

```bash
pnpm --filter @pouchie/contracts test -- category-catalog
pnpm --filter @pouchie/i18n typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit category catalog**

```bash
git add packages/contracts/src/category-catalog.ts packages/contracts/src/index.ts packages/contracts/tests/category-catalog.test.ts packages/i18n
git commit -m "feat: define category catalog and labels"
```

## Task 5: Core Money, Time, Reports, Splits, And Goals

- [ ] **Step 1: Write core tests**

Create `packages/core/tests/money.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assertCurrencyCode, groupMoneyByCurrency } from "../src";

describe("money", () => {
  it("rejects missing or invalid currency codes", () => {
    expect(() => assertCurrencyCode("")).toThrow("currencyCode");
    expect(() => assertCurrencyCode("usd")).toThrow("currencyCode");
  });

  it("groups money by currency without conversion", () => {
    expect(groupMoneyByCurrency([
      { amountCents: 100, currencyCode: "USD" },
      { amountCents: 200, currencyCode: "CNY" },
      { amountCents: 50, currencyCode: "USD" },
    ])).toEqual([
      { currencyCode: "USD", amountCents: 150 },
      { currencyCode: "CNY", amountCents: 200 },
    ]);
  });
});
```

Create `packages/core/tests/splits.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assertSplitTotal } from "../src";

describe("splits", () => {
  it("requires split cents to equal transaction cents", () => {
    expect(() => assertSplitTotal(1000, [{ memberId: "a", shareCents: 600 }, { memberId: "b", shareCents: 300 }])).toThrow("split");
    expect(() => assertSplitTotal(1000, [{ memberId: "a", shareCents: 600 }, { memberId: "b", shareCents: 400 }])).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the failing core tests**

Run:

```bash
pnpm --filter @pouchie/core test
```

Expected: FAIL because `@pouchie/core` helpers do not exist.

- [ ] **Step 3: Implement core helpers**

Create `packages/core/src/money.ts`:

```ts
export type MoneyInput = { amountCents: number; currencyCode: string };

export function assertCurrencyCode(currencyCode: string): asserts currencyCode is string {
  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    throw new Error("currencyCode must be an ISO 4217 uppercase code");
  }
}

export function groupMoneyByCurrency(values: readonly MoneyInput[]) {
  const totals = new Map<string, number>();
  for (const value of values) {
    assertCurrencyCode(value.currencyCode);
    if (!Number.isInteger(value.amountCents)) {
      throw new Error("amountCents must be an integer");
    }
    totals.set(value.currencyCode, (totals.get(value.currencyCode) ?? 0) + value.amountCents);
  }
  return [...totals.entries()].map(([currencyCode, amountCents]) => ({ currencyCode, amountCents }));
}
```

Create `packages/core/src/splits.ts`:

```ts
export type SplitInput = { memberId: string; shareCents: number };

export function assertSplitTotal(amountCents: number, splits: readonly SplitInput[]) {
  const total = splits.reduce((sum, split) => sum + split.shareCents, 0);
  if (total !== amountCents) {
    throw new Error("split shares must equal transaction amountCents");
  }
}
```

Create report, budget, goal, and time helpers with the same integer-cent and explicit-currency rules, then export all helpers from `packages/core/src/index.ts`.

- [ ] **Step 4: Run core verification**

Run:

```bash
pnpm --filter @pouchie/core test
pnpm --filter @pouchie/core typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit core helpers**

```bash
git add packages/core
git commit -m "feat: add pouchie core money and report helpers"
```

## Verification Commands

```bash
pnpm install
pnpm --filter @pouchie/core test
pnpm --filter @pouchie/core typecheck
pnpm --filter @pouchie/contracts test
pnpm --filter @pouchie/contracts typecheck
pnpm --filter @pouchie/i18n typecheck
pnpm --filter @pouchie/mobile typecheck
pnpm --filter @pouchie/api-worker typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- No active workspace manifest contains `@xiaohebao/*`.
- Endpoint registry is the only product route source of truth.
- Operational endpoints are separate from product endpoints.
- Schema coverage tests prove every endpoint schema key resolves.
- Category catalog has no catch-all key.
- Money, reports, splits, and goals use integer cents and explicit currency codes.
- No production path imports prototype JSX or prototype fixture data.
