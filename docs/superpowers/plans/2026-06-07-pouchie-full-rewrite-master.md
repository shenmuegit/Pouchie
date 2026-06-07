# Pouchie Full Rewrite Master Implementation Plan

> **For agentic workers:** This is a master roadmap, not a directly executable task plan. REQUIRED NEXT STEP: execute the nine child plans in the Execution Order section; each child plan is the executable Superpowers implementation plan with checkbox (`- [ ]`) steps, concrete code snippets, exact commands, expected outputs, and per-task commits.

**Goal:** Rebuild Pouchie as a full notebook-style accounting product across Expo Android/iOS international apps and an independent WeChat Mini Program, with shared contracts and server business logic across Cloudflare and CloudBase backends.

**Architecture:** The product uses two independent runtime/data regions: Expo mobile apps call Cloudflare Workers/D1/R2 for the international multilingual product, and the WeChat Mini Program calls Tencent CloudBase functions/database/storage for the China product. Business rules live in shared TypeScript packages, while each backend implements only routing, auth adapters, repositories, and storage adapters.

**Tech Stack:** pnpm monorepo, TypeScript, Expo SDK, React Native, Expo Router, TanStack Query, Zustand, React Hook Form, Zod, react-native-svg, Cloudflare Workers/D1/R2, Tencent CloudBase cloud functions/database/storage, native WeChat Mini Program TypeScript, Vitest, Playwright, pixelmatch, pngjs, tsx, and @babel/standalone for offline prototype fidelity tooling.

---

## Master Plan Usage

Do not run `superpowers:executing-plans` or `superpowers:subagent-driven-development` against this file directly. Run those skills against exactly one child plan at a time, in the Execution Order section, and request review after each child-plan task before proceeding.

Child Plan 1 must execute first because it fixes workspace discovery, package naming, shared schemas, and shared model primitives that all downstream child plans depend on.

## Scope Boundary

This is a full rewrite plan, not an extension of the current implementation. Existing runtime implementations are replaced by the child-plan targets in this file; old runtime paths are not retained as alternate implementations, compatibility layers, or secondary entry points. The new prototype is the visual source of truth, not a mood board. The complete 1:1 product-screen source is `原型/手账本.html`, with the current target screens defined by `原型/app/nb1.jsx`, `原型/app/nb2.jsx`, visual constants in `原型/app/tokens.jsx`, and data semantics in `原型/app/data.jsx`. The complete 1:1 auth/onboarding source is `原型/手账本-登录注册.html`, with App auth screens defined by `原型/app/nb_auth_app.jsx` and Mini Program auth screens defined by `原型/app/nb_auth_mini.jsx`.

Prototype 1:1 fidelity rule:

- Every child plan that touches user interface must preserve the current prototype's screen structure, hierarchy, artboard geometry, spacing rhythm, colors, typography, paper texture, red margin line, horizontal rule spacing, tape, sticky notes, doodle borders, tab bar, keypad, chart, jar, receipt, and tag compositions.
- The reference prototype artboard is 446 x 918, containing a 402 x 874 phone viewport. Expo and WeChat implementations must first match the 402 x 874 viewport, then add responsive behavior without changing the relative composition.
- Screens with explicit product prototype artboards must map 1:1: `NbHome`, `NbAdd`, `NbLedger`, `NbReports`, `NbShared`, `NbDetail`, and `NbGoal`.
- Screens with explicit App auth prototype artboards must map 1:1: `AuAppWelcome`, `AuAppRegister`, `AuAppLogin`, and `AuAppVerify`.
- Screens with explicit Mini Program auth prototype artboards must map 1:1: `AuMiniIntro`, `AuMiniPhone`, and `AuMiniLoading`.
- Product data becomes live API data. Values from `原型/app/data.jsx` are permitted only in screenshot fidelity test fixtures and captured baseline metadata; production clients, shared packages, backends, migrations, seed scripts, empty states, and product docs must not import, copy, or derive default records from them.
- Prototype fidelity fixtures are test-only data: they exist only to render the fourteen explicit artboards under test, must be byte-for-byte traceable to `原型/app/data.jsx` before cleanup, and must never be used when API data is missing.
- Loading, empty, and error states must keep the same frame sizes, paper geometry, and visual rhythm as the filled prototype; they must not replace notebook layouts with generic mobile cards.
- Screens without explicit prototype artboards, such as deeper settings pages, must be built only from the same notebook primitives and tokens derived from the prototype; they cannot introduce a separate visual style.
- Platform chrome differences are limited to OS safe areas and WeChat capsule/status bar offsets. Any offset must be documented in the child plan and cannot alter the notebook content composition.
- Do not substitute native default controls, glassmorphism, generic SaaS cards, stock illustrations, alternate palettes, alternate tab bars, or alternate typography for prototyped surfaces.
- Do not import prototype JSX into production. Recreate it in Expo React Native and native WeChat Mini Program code while matching the visual output.
- A child plan is not accepted unless it includes a prototype-to-route/component mapping table and screenshot fidelity checks for every explicit prototype artboard it implements.

The following product capabilities are in scope:

- Auth/onboarding: App welcome, Apple sign-in, Google sign-in, email registration, email login, email verification code, Mini Program brand intro, WeChat phone authorization, and Mini Program loading state.
- Home dashboard: remaining budget, month spending, budget progress, recent transactions, saving goal summary, shared ledger settlement summary.
- Add transaction: expense, income, transfer, amount keypad, category, account, payment method, note, tags, receipt, split, saving-goal deposit linkage.
- Ledger: grouped transaction list, monthly summary, search, filters, split marks, edit, delete, detail navigation.
- Reports: monthly summary, trend, category distribution, category count, previous-period comparison, budget usage.
- Shared ledgers: members, payer, split shares, owed/receivable amount, settlements, shared transaction list.
- Transaction detail: category, amount, merchant, note, date/time, account, payment method, split detail, receipt, tags, edit, delete.
- Saving goals: target, saved amount, monthly plan, estimated completion, deposit history, deposit creation.
- Settings/profile: user profile, categories, accounts, payment methods, tags, budgets, international currency preferences, language, data export, account deletion, logout.

Data interoperability rule:

- WeChat Mini Program data is stored only in CloudBase and is independent.
- Android and iOS data is stored in Cloudflare and is shared between those two apps.
- There is no cross-region sync, linking, import, or migration flow between Mini Program and App data.

## Planned Repository Shape

Create this target structure:

```text
apps/
  mobile/
    app/
    src/
      api/
      features/
      notebook/
      i18n/
      state/
      testing/
  wechat-miniprogram/
    miniprogram/
    project.config.json
    tsconfig.json

backends/
  cloudflare/
    worker-api/
      src/
        adapters/
        repositories/
        routes/
        storage/
        auth/
      migrations/
      tests/
      wrangler.toml
  cloudbase/
    functions/
      api/
        src/
          adapters/
          repositories/
          routes/
          storage/
          auth/
        tests/
    database/
    storage/

packages/
  contracts/
  core/
  server-core/
  api-client/
  design-tokens/
  i18n/
```

Remove or replace these current paths during the relevant child plan:

```text
apps/api-worker/
packages/domain/
packages/ui-tokens/
```

Keep `原型/` as the visual source of truth during implementation, remove it in Child Plan 9 only after product documentation and screenshot fidelity baselines capture its decisions, and do not import prototype JSX directly into production apps.

## Child Plan Decomposition

This master plan intentionally decomposes implementation into child plans. Each child plan must be saved under `docs/superpowers/plans/YYYY-MM-DD-pouchie-<area>.md` before code for that area begins.

### Child Plan 1: Shared Contracts And Core Model

**Purpose:** Define the product language once: schemas, entities, money/date rules, split math, budget math, goal progress, and report calculations.

**Files:**
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

**Required model decisions:**
- Rename the root package from `xiaohebao-monorepo` to `pouchie-monorepo`.
- Rename all active package scopes from `@xiaohebao/*` to `@pouchie/*`.
- Update every current workspace manifest in the same child plan so no package still depends on `@xiaohebao/*` after `packages/contracts/package.json` is renamed.
- Rename existing transitional packages before downstream deletion: `@xiaohebao/mobile` to `@pouchie/mobile`, `@xiaohebao/api-worker` to `@pouchie/api-worker`, `@xiaohebao/contracts` to `@pouchie/contracts`, `@xiaohebao/domain` to `@pouchie/domain`, and `@xiaohebao/ui-tokens` to `@pouchie/ui-tokens`.
- Keep the transitional alias for `@pouchie/domain` until Child Plan 3 removes `packages/domain/` with the old API worker.
- Keep the transitional alias for `@pouchie/ui-tokens` until Child Plan 6 migrates the Expo app to `@pouchie/design-tokens`; delete `packages/ui-tokens/` only in Child Plan 9 cleanup.
- Update root scripts so Child Plan 1 keeps existing dev commands working with transitional packages and downstream child plans replace them: `dev:mobile` filters `@pouchie/mobile`, `dev:api` filters `@pouchie/api-worker`, and Child Plan 3 changes `dev:api` to `@pouchie/cloudflare-worker`.
- Update `pnpm-workspace.yaml` to include every runtime package:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "backends/cloudflare/*"
  - "backends/cloudbase/functions/*"
```

- Update `tsconfig.base.json` paths to expose `@pouchie/contracts`, `@pouchie/core`, `@pouchie/server-core`, `@pouchie/api-client`, `@pouchie/api-client/native`, `@pouchie/api-client/wechat`, `@pouchie/design-tokens`, and `@pouchie/i18n`.
- Keep transitional `tsconfig.base.json` paths for `@pouchie/domain` and `@pouchie/ui-tokens` until the child plans that remove those packages also remove their aliases.
- Money is always stored as integer cents.
- Every money-bearing entity stores `currencyCode` as an ISO 4217 code.
- International Android/iOS accounts, transactions, budgets, goals, and reports support multiple currencies from day one.
- International reports are grouped by `currencyCode` when the user has data in more than one currency.
- No automatic foreign-exchange conversion is included in this rewrite; cross-currency totals are not collapsed into a single converted number.
- WeChat Mini Program money-bearing entities must explicitly store `currencyCode: "CNY"`; missing or non-CNY values fail validation.
- Amount fields use explicit cent suffixes: `amountCents`, `budgetCents`, `targetCents`, `savedCents`, and `shareCents`.
- Dates are stored as ISO timestamps plus derived `localDateKey` in the user's selected region.
- Transaction type is `expense | income | transfer`.
- Transaction merchant is persisted as nullable `merchantName`; create/update payloads accept it, and list/detail responses return it without dropping edits.
- `packages/contracts/src/api/endpoints.ts` freezes every product `/v1/*` endpoint path, HTTP method, region availability, auth requirement, request schema key, and response schema key before either backend starts.
- `packages/contracts/src/api/operational-endpoints.ts` freezes deploy-only operational endpoints such as `GET /health`; these endpoints are used by backend route tests and healthcheck scripts, but they are not exposed by the shared app API client.
- Cloudflare and CloudBase route files must import endpoint definitions from `@pouchie/contracts` instead of spelling product paths or DTO names by hand.
- Product request/response schemas live only in `packages/contracts/src/api/schemas/*`; backend adapters, `server-core`, Expo, and WeChat may import those schemas but must not define duplicate DTOs.
- Cloudflare auth endpoints include Apple login, Google login, email registration, email login, email verification-code request, and email verification-code confirmation.
- CloudBase auth endpoints include WeChat Mini Program login with `wx.login` code plus phone authorization code from the Mini Program auth prototype.
- Shared product endpoints use the same request/response schema keys in both regions when the endpoint is available in both regions; region-specific auth endpoints are explicitly region-scoped in `PRODUCT_ENDPOINTS`.
- Category identity uses explicit stable keys such as `food`, `transit`, `shopping`, `home`, `entertainment`, `salary`, `bonus`, and `reimbursement`.
- Transactions cannot be saved without a selected predefined category or a user-created custom category.
- `packages/contracts/src/category-catalog.ts` exports the complete predefined category catalog, with stable keys, transaction type, sort order, icon token, color token, and i18n label keys.
- New-user category availability comes from the predefined category catalog plus user-created records returned by the category repository; no generated category records are inserted into user storage.
- Static schema validation accepts category references by id shape only; runtime category ownership and catalog membership validation belongs to `server-core`.
- User-facing category labels come from i18n unless the user created a custom category name.
- Payment methods are user-owned records with stable ids, display names, provider keys when applicable, and masked account hints when supplied by the user or provider.
- Tags are user-owned records with stable ids and display names; transaction payloads store tag ids and detail responses include tag display snapshots.
- Receipt upload uses a two-step flow: create a pending receipt upload target, then attach the uploaded receipt id to a transaction.
- Split amounts are persisted as cents and must sum exactly to the transaction amount.
- Report category percentages are basis-point integers, not floats.

**Acceptance tests:**
- `pnpm --filter @pouchie/core test`
- `pnpm --filter @pouchie/contracts test`
- `pnpm --filter @pouchie/contracts typecheck`
- Money and report tests verify missing or invalid `currencyCode` is rejected, international report totals are grouped by `currencyCode`, and cross-currency values are never collapsed into a converted total.
- Endpoint registry tests verify every product endpoint has a unique method/path pair, region availability, auth requirement, request schema key, response schema key, and matching exported schema.
- Endpoint registry tests verify Cloudflare-only auth endpoints include Apple, Google, email registration, email login, email verification-code request, and email verification-code confirmation.
- Endpoint registry tests verify CloudBase-only auth endpoints include WeChat Mini Program login with phone authorization input and exclude Apple, Google, and email auth endpoints.
- Endpoint registry tests verify `GET /health` is present only in the operational endpoint registry and never appears in the product endpoint registry used by `@pouchie/api-client`.
- Schema coverage tests verify all contract request/response schemas are exported from `packages/contracts/src/index.ts`.
- Category catalog tests verify every predefined category key has i18n labels, color/icon token ids, a transaction type, and no catch-all sentinel key.
- Transaction schema tests reject missing category ids and accept category id strings without reaching into user storage.
- `pnpm --filter @pouchie/i18n typecheck`
- `pnpm --filter @pouchie/mobile typecheck`
- `pnpm --filter @pouchie/api-worker typecheck`
- `pnpm -r --if-present run typecheck`

### Child Plan 2: Shared Server Core

**Purpose:** Put all backend business logic behind ports so Cloudflare and CloudBase share behavior.

**Files:**
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

**Required entries:**
- `auth.loginWithApple`
- `auth.loginWithGoogle`
- `auth.registerWithEmail`
- `auth.loginWithEmail`
- `auth.requestEmailVerificationCode`
- `auth.verifyEmailCode`
- `auth.loginWithWechatMiniProgram`
- `auth.logout`
- `auth.me`
- `dashboard.getHome`
- `transactions.list`
- `transactions.getDetail`
- `transactions.create`
- `transactions.update`
- `transactions.remove`
- `reports.getSummary`
- `reports.getTrend`
- `reports.getCategories`
- `categories.list/create/update/remove`
- `accounts.list/create/update/remove`
- `paymentMethods.list/create/update/remove`
- `tags.list/create/update/remove`
- `budgets.get/update`
- `goals.list/get/create/update/remove/addDeposit/removeDeposit`
- `sharedLedgers.list/get/create/update/remove/addMember/removeMember/createSettlement`
- `receipts.createUploadTarget/attachToTransaction/removeFromTransaction`
- `profile.get/update/export/deleteAccount`

**Acceptance tests:**
- `pnpm --filter @pouchie/server-core test`
- `pnpm --filter @pouchie/server-core typecheck`
- Creating an expense updates monthly budget usage and report aggregates.
- Creating transactions, budgets, goals, and account balances rejects missing or invalid `currencyCode`.
- International report summaries group totals by `currencyCode` and never merge different currencies into one converted total.
- China-region contexts reject money-bearing writes unless `currencyCode` is explicitly `CNY`.
- Creating a transaction accepts a predefined catalog category id.
- Creating a transaction accepts a category id owned by the current user.
- Creating a transaction rejects a category id that is neither in the predefined catalog nor owned by the current user.
- Creating and updating a transaction preserves `merchantName` in transaction list, detail, search, and edit payloads.
- Creating an income affects income/net reports and does not affect expense category distribution.
- Creating a transfer creates account movement and is excluded from expense/income reports.
- Creating a split transaction calculates receivable/payable balances.
- Creating a saving goal deposit updates goal progress and dashboard summary.
- Creating, renaming, and deleting payment methods and tags updates settings lists and preserves transaction display snapshots.
- Attaching a pending uploaded receipt to a transaction makes it appear in transaction detail.
- Removing a receipt from a transaction detaches it and schedules storage cleanup through the storage port.
- Deleting a transaction reverses affected aggregates.
- Logging out invalidates the session and prevents subsequent authenticated entry calls with that session.
- Email registration creates a pending or active Cloudflare identity according to verification state, email login creates a Cloudflare session after credential validation, email verification-code request creates a bounded verification challenge and sends the code through `EmailDeliveryPort`, and email verification-code confirmation marks the email identity verified before app entry.
- WeChat Mini Program login accepts both the `wx.login` code and phone authorization code, creates or finds the CloudBase user, stores the phone binding only in CloudBase, and returns a CloudBase session token.
- Profile export creates an export job, writes an export artifact through the storage port, and returns a downloadable file reference.
- Account deletion deletes or anonymizes user-owned data, invalidates active sessions, and schedules receipt/export storage cleanup.

### Child Plan 3: Cloudflare International Backend

**Purpose:** Serve Android/iOS users through Cloudflare while implementing shared `server-core` ports.

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.base.json`
- Delete in this child plan after the new Cloudflare Worker route tests pass: `apps/api-worker/`
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

**API surface:**

```text
GET    /health
POST   /v1/auth/apple/login
POST   /v1/auth/google/login
POST   /v1/auth/email/register
POST   /v1/auth/email/login
POST   /v1/auth/email/verification-code
POST   /v1/auth/email/verify
POST   /v1/auth/logout
GET    /v1/auth/me
GET    /v1/dashboard
GET    /v1/transactions
POST   /v1/transactions
GET    /v1/transactions/:id
PATCH  /v1/transactions/:id
DELETE /v1/transactions/:id
GET    /v1/reports/summary
GET    /v1/reports/trend
GET    /v1/reports/categories
GET    /v1/categories
POST   /v1/categories
PATCH  /v1/categories/:id
DELETE /v1/categories/:id
GET    /v1/accounts
POST   /v1/accounts
PATCH  /v1/accounts/:id
DELETE /v1/accounts/:id
GET    /v1/payment-methods
POST   /v1/payment-methods
PATCH  /v1/payment-methods/:id
DELETE /v1/payment-methods/:id
GET    /v1/tags
POST   /v1/tags
PATCH  /v1/tags/:id
DELETE /v1/tags/:id
GET    /v1/budgets/current
PUT    /v1/budgets/current
GET    /v1/goals
POST   /v1/goals
GET    /v1/goals/:id
PATCH  /v1/goals/:id
DELETE /v1/goals/:id
POST   /v1/goals/:id/deposits
DELETE /v1/goals/:id/deposits/:depositId
GET    /v1/shared-ledgers
POST   /v1/shared-ledgers
GET    /v1/shared-ledgers/:id
PATCH  /v1/shared-ledgers/:id
DELETE /v1/shared-ledgers/:id
POST   /v1/shared-ledgers/:id/members
DELETE /v1/shared-ledgers/:id/members/:memberId
POST   /v1/shared-ledgers/:id/settlements
POST   /v1/receipts/upload-url
POST   /v1/transactions/:id/receipts
DELETE /v1/transactions/:id/receipts/:receiptId
GET    /v1/profile
PATCH  /v1/profile
POST   /v1/profile/export
DELETE /v1/profile
```

**Cloudflare persistence:**
- D1 stores structured user/accounting data.
- D1 migrations create users, user identities, sessions, password credentials, and email verification challenges for Cloudflare auth.
- D1 migrations create payment method, tag, transaction tag join, and transaction receipt join tables.
- R2 stores receipt images and export files.
- `backends/cloudflare/worker-api/src/email/http-email.ts` implements `EmailDeliveryPort` by POSTing the exact payload `{ to, subject, text, html }` to `AUTH_EMAIL_HTTP_ENDPOINT` with `Authorization: Bearer ${AUTH_EMAIL_HTTP_TOKEN}`; the provider response body is not stored in D1.
- Cron triggers recompute report aggregates, clean expired sessions, and clean expired email verification challenges.

**Acceptance tests:**
- `pnpm --filter @pouchie/cloudflare-worker test`
- `pnpm --filter @pouchie/cloudflare-worker typecheck`
- Root `dev:api` script filters `@pouchie/cloudflare-worker` after `apps/api-worker/` is removed.
- `tsconfig.base.json` no longer exposes `@pouchie/domain` after `packages/domain/` is removed.
- Route tests compare every registered Cloudflare product route against `PRODUCT_ENDPOINTS` from `@pouchie/contracts`, including method, path, auth requirement, and request/response schema key.
- Route tests verify Cloudflare registers all and only Cloudflare-available product endpoints from `PRODUCT_ENDPOINTS`; tests fail when a Cloudflare-available endpoint is missing or when an extra `/v1/*` route is registered outside `PRODUCT_ENDPOINTS`.
- Route tests compare deploy-only Cloudflare routes against `OPERATIONAL_ENDPOINTS` from `@pouchie/contracts`; operational routes do not appear in `PRODUCT_ENDPOINTS`.
- Route tests verify `GET /health` is public and returns service, version, environment, and dependency readiness.
- Route tests verify auth is required or public exactly according to each endpoint's `authRequirement` in `PRODUCT_ENDPOINTS`; only Apple login, Google login, email registration, email login, email verification-code request, and email verification-code confirmation are public in Cloudflare.
- Route tests verify Cloudflare registers Apple login, Google login, email registration, email login, email verification-code request, and email verification-code confirmation from `PRODUCT_ENDPOINTS`.
- Route tests verify Cloudflare does not register the WeChat Mini Program login endpoint.
- Route and repository tests verify Cloudflare accepts supported ISO 4217 `currencyCode` values on money-bearing product writes and returns multi-currency report groups without conversion.
- Route and repository tests verify transaction creation rejects category ids that are neither in the predefined catalog nor owned by the current Cloudflare user.
- Repository tests verify D1 split, goal, transaction, payment method, tag, receipt, and aggregate persistence.
- Route and repository tests verify logout invalidates sessions, profile export creates an export job and R2 artifact, and account deletion cleans D1 user data plus R2 receipt/export objects.
- Route and repository tests verify email registration/login/verification flows create only Cloudflare identities and sessions and do not touch CloudBase data.
- Route and repository tests verify passwords and email verification codes are stored only as hashes, email verification challenges have explicit expiration and attempt limits, expired or over-attempted challenges cannot verify an email, and successful verification consumes the challenge.
- Email delivery tests verify requesting an email verification code calls `EmailDeliveryPort` exactly once with the recipient email, subject, text body, and HTML body, while D1 stores only the challenge hash, expiration, attempt counter, and consumed timestamp.

### Child Plan 4: CloudBase China Backend

**Purpose:** Serve the independent WeChat Mini Program through CloudBase while implementing the same `server-core` ports.

**Files:**
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

**CloudBase API surface:**

CloudBase uses the same request/response schemas as Cloudflare for shared product endpoints, but its auth surface is WeChat-only. It must not implement Apple, Google, or email auth endpoints. The WeChat login request includes the `wx.login` code and the phone authorization code captured by the Mini Program auth prototype.

```text
GET    /health
POST   /v1/auth/wechat/login
POST   /v1/auth/logout
GET    /v1/auth/me
GET    /v1/dashboard
GET    /v1/transactions
POST   /v1/transactions
GET    /v1/transactions/:id
PATCH  /v1/transactions/:id
DELETE /v1/transactions/:id
GET    /v1/reports/summary
GET    /v1/reports/trend
GET    /v1/reports/categories
GET    /v1/categories
POST   /v1/categories
PATCH  /v1/categories/:id
DELETE /v1/categories/:id
GET    /v1/accounts
POST   /v1/accounts
PATCH  /v1/accounts/:id
DELETE /v1/accounts/:id
GET    /v1/payment-methods
POST   /v1/payment-methods
PATCH  /v1/payment-methods/:id
DELETE /v1/payment-methods/:id
GET    /v1/tags
POST   /v1/tags
PATCH  /v1/tags/:id
DELETE /v1/tags/:id
GET    /v1/budgets/current
PUT    /v1/budgets/current
GET    /v1/goals
POST   /v1/goals
GET    /v1/goals/:id
PATCH  /v1/goals/:id
DELETE /v1/goals/:id
POST   /v1/goals/:id/deposits
DELETE /v1/goals/:id/deposits/:depositId
GET    /v1/shared-ledgers
POST   /v1/shared-ledgers
GET    /v1/shared-ledgers/:id
PATCH  /v1/shared-ledgers/:id
DELETE /v1/shared-ledgers/:id
POST   /v1/shared-ledgers/:id/members
DELETE /v1/shared-ledgers/:id/members/:memberId
POST   /v1/shared-ledgers/:id/settlements
POST   /v1/receipts/upload-url
POST   /v1/transactions/:id/receipts
DELETE /v1/transactions/:id/receipts/:receiptId
GET    /v1/profile
PATCH  /v1/profile
POST   /v1/profile/export
DELETE /v1/profile
```

**CloudBase collections:**

```text
users
user_identities
sessions
categories
accounts
payment_methods
tags
transactions
transaction_tags
transaction_receipts
budgets
saving_goals
saving_goal_deposits
shared_ledgers
shared_members
transaction_splits
settlements
report_daily_aggregates
report_category_aggregates
export_jobs
```

**CloudBase-specific rules:**
- Mini Program login uses `wx.login`, `wx.getPhoneNumber`, and a CloudBase function exchange.
- Data is scoped to CloudBase user id/openid and never joins Cloudflare data.
- Cloud database documents denormalize display snapshots such as category name, account name, payment method name, and tag names.
- Cloud storage keeps receipt images and export files in user-scoped directories.

**Acceptance tests:**
- `pnpm --filter @pouchie/cloudbase-api test`
- `pnpm --filter @pouchie/cloudbase-api typecheck`
- CloudBase `GET /health` is public and returns service, version, environment, and dependency readiness.
- Route tests compare every registered CloudBase product route against `PRODUCT_ENDPOINTS` from `@pouchie/contracts`, including method, path, auth requirement, region availability, and request/response schema key.
- Route tests verify CloudBase registers all and only CloudBase-available product endpoints from `PRODUCT_ENDPOINTS`; tests fail when a CloudBase-available endpoint is missing or when an extra `/v1/*` route is registered outside `PRODUCT_ENDPOINTS`.
- Route tests compare deploy-only CloudBase routes against `OPERATIONAL_ENDPOINTS` from `@pouchie/contracts`; operational routes do not appear in `PRODUCT_ENDPOINTS`.
- CloudBase route contract matches Cloudflare route contract for shared endpoints.
- CloudBase route tests verify Apple, Google, and email auth endpoints are not registered.
- CloudBase route and repository tests verify every money-bearing write must include `currencyCode: "CNY"` and rejects missing or non-CNY currency codes.
- CloudBase route and repository tests verify transaction creation rejects category ids that are neither in the predefined catalog nor owned by the current CloudBase user.
- Creating and deleting transactions updates aggregates exactly like `server-core` in-memory repository tests.
- Creating, updating, and deleting payment methods and tags works through CloudBase repositories.
- Receipt upload target creation, transaction attachment, and transaction receipt removal work through CloudBase storage and repository ports.
- WeChat login accepts the `wx.login` code plus phone authorization code, creates or finds a CloudBase user, stores the phone binding in CloudBase only, and returns a session token.
- Logout invalidates CloudBase sessions, profile export creates an `export_jobs` document plus storage artifact, and account deletion cleans CloudBase user documents plus receipt/export storage objects.

### Child Plan 5: Shared API Client

**Purpose:** Give Expo and Mini Program the same typed API calls with platform-specific transport adapters.

**Files:**
- Create: `packages/api-client/package.json`
- Create: `packages/api-client/tsconfig.json`
- Create: `packages/api-client/src/transport.ts`
- Create: `packages/api-client/src/token-provider.ts`
- Create: `packages/api-client/src/create-client.ts`
- Create: `packages/api-client/src/errors.ts`
- Create: `packages/api-client/src/native.ts`
- Create: `packages/api-client/src/native-transport.ts`
- Create: `packages/api-client/src/wechat.ts`
- Create: `packages/api-client/src/wechat-runtime.ts`
- Create: `packages/api-client/src/wechat-transport.ts`
- Create: `packages/api-client/src/index.ts`
- Create: `packages/api-client/tests/create-client.test.ts`
- Create: `packages/api-client/tests/exports.test.ts`

This child plan must not create or modify app-specific API wiring files. Expo wiring belongs in Child Plan 6, and WeChat Mini Program wiring belongs in Child Plan 7, after each app structure exists.

**Transport responsibilities:**
- Native transport uses `fetch`.
- WeChat transport accepts an injected `WechatRuntime` interface with `request` and `uploadFile` methods; the Mini Program wiring passes the global `wx` object, while `@pouchie/api-client` itself does not reference a global `wx`.
- Both transports return the same normalized `ApiError` shape.
- `createClient` accepts a `TokenProvider` with `getAccessToken`, `setAccessToken`, and `clearAccessToken` methods; transports attach bearer session tokens through that injected provider.
- The shared `@pouchie/api-client` package does not directly import Expo storage, React Native storage, WeChat storage, or app state modules. Expo token storage wiring belongs in `apps/mobile/src/api/client.ts`; WeChat token storage wiring belongs in `apps/wechat-miniprogram/miniprogram/api/client.ts`.
- `packages/api-client/package.json` exports three entry points: `@pouchie/api-client` for platform-neutral types, errors, endpoint-backed client factory, and transport interfaces; `@pouchie/api-client/native` for the native `fetch` transport; and `@pouchie/api-client/wechat` for `createWechatTransport` plus the `WechatRuntime` interface.
- The package root must not import `native-transport.ts` or `wechat-transport.ts`; platform transports are imported only through their subpath entry points.
- `tsconfig.base.json` path mappings for `@pouchie/api-client/native` and `@pouchie/api-client/wechat` point to `packages/api-client/src/native.ts` and `packages/api-client/src/wechat.ts` so workspace typechecks resolve the same entry points used by package exports.

**Acceptance tests:**
- `pnpm --filter @pouchie/api-client test`
- `pnpm --filter @pouchie/api-client typecheck`
- Network failure includes method and URL.
- HTTP failure includes method, URL, status, and server message.
- Token tests verify the injected `TokenProvider` is used for authenticated requests and cleared on logout.
- Import-boundary tests verify `@pouchie/api-client` has no direct imports from Expo, React Native storage, WeChat storage, or app-specific state packages.
- Typecheck and import-boundary tests verify `@pouchie/api-client` does not require a global `wx` declaration; WeChat transport tests inject a fake `WechatRuntime` with `request` and `uploadFile`.
- Export-boundary tests verify the package root does not import `native-transport.ts` or `wechat-transport.ts`, `@pouchie/api-client/native` exports only the native transport, and `@pouchie/api-client/wechat` exports only the WeChat-specific transport factory and runtime types.
- Type resolution tests verify `@pouchie/api-client`, `@pouchie/api-client/native`, and `@pouchie/api-client/wechat` resolve through both package exports and workspace `tsconfig.base.json` paths.
- Client methods use only product endpoint paths defined in `PRODUCT_ENDPOINTS` from `packages/contracts`.
- Client methods cover every app-facing product endpoint defined in `PRODUCT_ENDPOINTS`, including Apple login, Google login, email registration/login/verification, WeChat Mini Program login, logout, me, dashboard, transactions, reports, categories, accounts, payment methods, tags, budgets, goals/deposits, shared ledgers/members/settlements, receipts, profile update, profile export, and account deletion.
- Tests fail if an app-facing product endpoint exists in `PRODUCT_ENDPOINTS` without a corresponding typed client method.
- Tests verify `OPERATIONAL_ENDPOINTS` such as `GET /health` are not exposed through the app API client.

### Child Plan 6: Expo International App

**Purpose:** Rebuild Android/iOS as the multilingual notebook-style product using Expo.

**Files:**
- Modify: `apps/mobile/package.json`
- Modify: `pnpm-lock.yaml`
- Replace: `apps/mobile/app/_layout.tsx`
- Replace: `apps/mobile/app/index.tsx`
- Replace: `apps/mobile/app/welcome.tsx`
- Replace: `apps/mobile/app/signin.tsx`
- Create: `apps/mobile/app/register.tsx`
- Create: `apps/mobile/app/verify.tsx`
- Create: `apps/mobile/app/(app)/_layout.tsx`
- Create: `apps/mobile/app/(app)/index.tsx`
- Create: `apps/mobile/app/(app)/add.tsx`
- Create: `apps/mobile/app/(app)/ledger.tsx`
- Create: `apps/mobile/app/(app)/reports.tsx`
- Create: `apps/mobile/app/(app)/profile.tsx`
- Create: `apps/mobile/app/(app)/transactions/[id].tsx`
- Create: `apps/mobile/app/(app)/shared/[id].tsx`
- Create: `apps/mobile/app/(app)/goals/[id].tsx`
- Create: `apps/mobile/app/(app)/settings/categories.tsx`
- Create: `apps/mobile/app/(app)/settings/accounts.tsx`
- Create: `apps/mobile/app/(app)/settings/payment-methods.tsx`
- Create: `apps/mobile/app/(app)/settings/budget.tsx`
- Create: `apps/mobile/app/(app)/settings/tags.tsx`
- Create: `apps/mobile/app/(app)/settings/currency.tsx`
- Create: `apps/mobile/app/(app)/settings/language.tsx`
- Delete in this child plan after the new Expo route tests pass: `apps/mobile/app/(tabs)/_layout.tsx`
- Delete in this child plan after the new Expo route tests pass: `apps/mobile/app/(tabs)/index.tsx`
- Delete in this child plan after the new Expo route tests pass: `apps/mobile/app/(tabs)/add.tsx`
- Delete in this child plan after the new Expo route tests pass: `apps/mobile/app/(tabs)/transactions.tsx`
- Delete in this child plan after the new Expo route tests pass: `apps/mobile/app/(tabs)/profile.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassBackground.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassButton.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassCard.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassChip.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassInput.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/GlassModal.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/Page.tsx`
- Delete in this child plan after notebook primitives replace all imports: `apps/mobile/src/components/SwipeActionsRow.tsx`
- Replace: `apps/mobile/src/lib/http.ts`
- Create: `apps/mobile/src/api/config.ts`
- Create: `apps/mobile/src/api/client.ts`
- Replace: `apps/mobile/src/theme.ts`
- Replace: `apps/mobile/src/store/auth-store.ts`
- Create: `apps/mobile/src/notebook/tokens.ts`
- Create: `apps/mobile/src/notebook/fonts.ts`
- Create: `apps/mobile/src/notebook/NotebookPage.tsx`
- Create: `apps/mobile/src/notebook/NotebookPaper.tsx`
- Create: `apps/mobile/src/notebook/NotebookTabBar.tsx`
- Create: `apps/mobile/src/notebook/NotebookHeader.tsx`
- Create: `apps/mobile/src/notebook/DoodleBox.tsx`
- Create: `apps/mobile/src/notebook/Tape.tsx`
- Create: `apps/mobile/src/notebook/MoneyText.tsx`
- Create: `apps/mobile/src/notebook/NotebookButton.tsx`
- Create: `apps/mobile/src/notebook/NotebookInput.tsx`
- Create: `apps/mobile/src/notebook/NotebookKeypad.tsx`
- Create: `apps/mobile/src/notebook/NotebookChart.tsx`
- Create: `apps/mobile/src/features/auth/WelcomeScreen.tsx`
- Create: `apps/mobile/src/features/auth/RegisterScreen.tsx`
- Create: `apps/mobile/src/features/auth/LoginScreen.tsx`
- Create: `apps/mobile/src/features/auth/VerifyScreen.tsx`
- Create: `apps/mobile/src/features/dashboard/HomeScreen.tsx`
- Create: `apps/mobile/src/features/transactions/AddTransactionScreen.tsx`
- Create: `apps/mobile/src/features/transactions/LedgerScreen.tsx`
- Create: `apps/mobile/src/features/transactions/TransactionDetailScreen.tsx`
- Create: `apps/mobile/src/features/reports/ReportsScreen.tsx`
- Create: `apps/mobile/src/features/shared/SharedLedgerScreen.tsx`
- Create: `apps/mobile/src/features/goals/GoalScreen.tsx`
- Create: `apps/mobile/src/features/profile/ProfileScreen.tsx`
- Create: `apps/mobile/src/features/settings/CategoriesSettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/AccountsSettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/PaymentMethodsSettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/BudgetSettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/TagsSettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/CurrencySettingsScreen.tsx`
- Create: `apps/mobile/src/features/settings/LanguageSettingsScreen.tsx`
- Create: `apps/mobile/src/i18n/index.ts`
- Create: `apps/mobile/src/state/session.ts`
- Create: `apps/mobile/src/state/preferences.ts`
- Create: `apps/mobile/src/testing/render.tsx`
- Create: `apps/mobile/src/testing/prototype-fixtures.ts`
- Create: `apps/mobile/src/testing/prototype-screen-map.ts`
- Create: `apps/mobile/tests/prototype-fidelity.test.ts`
- Create: `apps/mobile/tests/prototype-fixtures-boundary.test.ts`

**Routes:**

```text
app/welcome.tsx
app/signin.tsx
app/register.tsx
app/verify.tsx
app/(app)/_layout.tsx
app/(app)/index.tsx
app/(app)/add.tsx
app/(app)/ledger.tsx
app/(app)/reports.tsx
app/(app)/profile.tsx
app/(app)/transactions/[id].tsx
app/(app)/shared/[id].tsx
app/(app)/goals/[id].tsx
app/(app)/settings/categories.tsx
app/(app)/settings/accounts.tsx
app/(app)/settings/payment-methods.tsx
app/(app)/settings/budget.tsx
app/(app)/settings/tags.tsx
app/(app)/settings/currency.tsx
app/(app)/settings/language.tsx
```

**Visual requirements from prototype:**
- `apps/mobile/src/testing/prototype-screen-map.ts` maps `NbHome` to `app/(app)/index.tsx`, `NbAdd` to `app/(app)/add.tsx`, `NbLedger` to `app/(app)/ledger.tsx`, `NbReports` to `app/(app)/reports.tsx`, `NbShared` to `app/(app)/shared/[id].tsx`, `NbDetail` to `app/(app)/transactions/[id].tsx`, and `NbGoal` to `app/(app)/goals/[id].tsx`.
- `apps/mobile/src/testing/prototype-screen-map.ts` maps `AuAppWelcome` to `app/welcome.tsx`, `AuAppRegister` to `app/register.tsx`, `AuAppLogin` to `app/signin.tsx`, and `AuAppVerify` to `app/verify.tsx`.
- App auth screens match `原型/手账本-登录注册.html` at the 402 x 874 reference viewport, including the auth paper wrapper, brand coin, welcome sticky notes, Apple/Google auth buttons, dashed separators, hand-drawn fields, checkbox, verification-code boxes, bottom confirm button, and all exact text hierarchy.
- Paper background, artboard background, sheet margin, sheet radius, shadow, left red margin line position, and horizontal rule texture match the prototype at the 402 x 874 reference viewport.
- The exact prototype visual constants are preserved through `@pouchie/design-tokens`: artboard background `#e3dccb`, app background `#efe3cc`, paper `#fcf8ef`, ink `#43403a`, red `oklch(0.58 0.19 25)`, blue `oklch(0.52 0.14 245)`, green `oklch(0.5 0.13 150)`, and line texture `repeating-linear-gradient(transparent 0 31px, rgba(90,130,165,0.14) 31px 32px)`.
- Tape and doodle shapes use the same dimensions, rotations, border widths, irregular border radii, shadows, fills, and stable layout boxes as the prototype and do not shift on loading.
- Bottom navigation matches the prototype geometry and labels `首页 / 明细 / + / 报表 / 我的`, including the raised red add button, hand-drawn active underline, border, shadow, and bottom offset.
- The amount keypad matches the prototype key grid, torn-paper strip placement, key dimensions, border, radius, shadow, and primary submit button.
- Reports, shared ledger, detail, and goal screens preserve the prototype's bar chart, category progress rows, owed callout, payer chips, split doodle boxes, receipt/tape block, tag chips, jar shape, and deposit rows.
- Money uses a bundled handwriting-style display font that visually matches the prototype's Caveat numerals, and app verification fails if the font asset is missing or not loaded.
- Chinese handwriting headings/body copy use bundled fonts that visually match the prototype's Ma Shan Zheng and Zhi Mang Xing usage; English and Simplified Chinese translations must fit without clipping while preserving the same component geometry.
- Content supports English and Simplified Chinese without clipped labels.

**Acceptance tests:**
- `pnpm --filter @pouchie/mobile test`
- `pnpm --filter @pouchie/mobile typecheck`
- `apps/mobile/package.json` depends on `@pouchie/design-tokens` and no longer depends on `@pouchie/ui-tokens`.
- `apps/mobile/src/api/client.ts` imports the native transport from `@pouchie/api-client/native` and does not import `@pouchie/api-client/wechat` or reference `wx`.
- International currency preferences are stored in the Cloudflare-backed profile through `PATCH /v1/profile`, cached in local preferences for offline display, restored after app restart, and shared between Android and iOS when the same user signs in.
- Unit tests cover amount keypad, transaction form payload including `merchantName`, split allocation, goal deposit payload, and language switching.
- Auth tests cover Apple login, Google login, email registration payload, email login payload, email verification-code request/confirmation, and post-auth session persistence.
- Unit tests cover account, transaction, budget, and goal payloads with selected `currencyCode`, plus report rendering when multiple currency groups are returned.
- Profile/settings tests cover saving the preferred currency through `PATCH /v1/profile`, app restart restoration, and cross-device profile refresh after signing in on iOS or Android.
- Profile tests cover data export, account deletion, logout, and session cleanup.
- Settings tests cover category, account, payment method, tag, budget, currency, and language screen payloads.
- App smoke test opens all routes without a blank screen.
- `apps/mobile/tests/prototype-fixtures-boundary.test.ts` verifies `apps/mobile/src/testing/prototype-fixtures.ts` is imported only by `apps/mobile/tests/prototype-fidelity.test.ts` and other files under `apps/mobile/src/testing/`; no file under `apps/mobile/app/`, `apps/mobile/src/api/`, `apps/mobile/src/features/`, `apps/mobile/src/state/`, or `apps/mobile/src/i18n/` may import it.
- `apps/mobile/tests/prototype-fixtures-boundary.test.ts` verifies runtime screens render empty/loading/error states from explicit state objects rather than reading prototype transaction, category, account, tag, shared-ledger, or goal values.
- Prototype fidelity tests render welcome, register, signin, verify, home, add, ledger, reports, shared, detail, and goal screens with `apps/mobile/src/testing/prototype-fixtures.ts` at 402 x 874 and compare them against screenshots captured from `原型/手账本-登录注册.html` and `原型/手账本.html`; any unmasked notebook-content pixel diff above 1.0% fails. Allowed comparison masks are fixed in `scripts/prototype/artboards.ts`, limited to OS safe-area or status-bar pixels outside the 402 x 874 notebook content viewport, and cannot be changed by a child plan review.
- Playwright or Expo screenshot checks also verify home, add, ledger, reports, shared, detail, and goal screens render nonblank at representative phone sizes after the 402 x 874 fidelity baseline passes.

### Child Plan 7: WeChat Mini Program China App

**Purpose:** Build the independent China Mini Program with the same product capabilities and notebook direction, using CloudBase data.

**Files:**
- Create: `apps/wechat-miniprogram/package.json`
- Create: `apps/wechat-miniprogram/tsconfig.json`
- Create: `apps/wechat-miniprogram/project.config.json`
- Create: `apps/wechat-miniprogram/miniprogram/app.json`
- Create: `apps/wechat-miniprogram/miniprogram/app.ts`
- Create: `apps/wechat-miniprogram/miniprogram/app.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/api/config.ts`
- Create: `apps/wechat-miniprogram/miniprogram/api/client.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/intro/intro.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/intro/intro.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/intro/intro.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/intro/intro.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/phone/phone.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/phone/phone.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/phone/phone.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/phone/phone.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/loading/loading.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/loading/loading.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/loading/loading.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/auth/loading/loading.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/home/home.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/home/home.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/home/home.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/home/home.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/add/add.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/add/add.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/add/add.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/add/add.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/ledger/ledger.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/ledger/ledger.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/ledger/ledger.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/ledger/ledger.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/reports/reports.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/reports/reports.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/reports/reports.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/reports/reports.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/pages/profile/profile.json`
- Create: `apps/wechat-miniprogram/miniprogram/pages/profile/profile.ts`
- Create: `apps/wechat-miniprogram/miniprogram/pages/profile/profile.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/pages/profile/profile.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/transactions/detail/detail.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/transactions/detail/detail.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/transactions/detail/detail.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/transactions/detail/detail.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/shared/detail/detail.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/shared/detail/detail.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/shared/detail/detail.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/shared/detail/detail.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/goals/detail/detail.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/goals/detail/detail.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/goals/detail/detail.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/detail/pages/goals/detail/detail.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/categories/categories.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/categories/categories.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/categories/categories.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/categories/categories.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/accounts/accounts.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/accounts/accounts.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/accounts/accounts.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/accounts/accounts.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/payment-methods/payment-methods.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/payment-methods/payment-methods.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/payment-methods/payment-methods.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/payment-methods/payment-methods.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/budget/budget.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/budget/budget.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/budget/budget.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/budget/budget.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/tags/tags.json`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/tags/tags.ts`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/tags/tags.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/subpackages/settings/pages/tags/tags.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/notebook-paper/notebook-paper.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/notebook-paper/notebook-paper.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/notebook-paper/notebook-paper.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/notebook-paper/notebook-paper.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/doodle-box/doodle-box.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/doodle-box/doodle-box.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/doodle-box/doodle-box.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/doodle-box/doodle-box.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/tape/tape.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/tape/tape.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/tape/tape.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/tape/tape.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/money-text/money-text.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/money-text/money-text.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/money-text/money-text.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/money-text/money-text.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/keypad/keypad.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/keypad/keypad.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/keypad/keypad.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/keypad/keypad.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/components/chart/chart.json`
- Create: `apps/wechat-miniprogram/miniprogram/components/chart/chart.ts`
- Create: `apps/wechat-miniprogram/miniprogram/components/chart/chart.wxml`
- Create: `apps/wechat-miniprogram/miniprogram/components/chart/chart.wxss`
- Create: `apps/wechat-miniprogram/tests/api-client.test.ts`
- Create: `apps/wechat-miniprogram/tests/page-payloads.test.ts`
- Create: `apps/wechat-miniprogram/tests/receipt-upload.test.ts`
- Create: `apps/wechat-miniprogram/tests/settings.test.ts`
- Create: `apps/wechat-miniprogram/tests/prototype-fidelity.test.ts`
- Create: `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts`

**Prototype fidelity requirements:**
- `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts` verifies the page map preserves the same explicit prototype screen set: `NbHome`, `NbAdd`, `NbLedger`, `NbReports`, `NbShared`, `NbDetail`, and `NbGoal`.
- `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts` also verifies `AuMiniIntro` maps to `pages/auth/intro/intro`, `AuMiniPhone` maps to `pages/auth/phone/phone`, and `AuMiniLoading` maps to `pages/auth/loading/loading`.
- `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts` verifies `NbHome` maps to `pages/home/home`, `NbAdd` maps to `pages/add/add`, `NbLedger` maps to `pages/ledger/ledger`, `NbReports` maps to `pages/reports/reports`, `NbShared` maps to `subpackages/detail/pages/shared/detail/detail`, `NbDetail` maps to `subpackages/detail/pages/transactions/detail/detail`, and `NbGoal` maps to `subpackages/detail/pages/goals/detail/detail`.
- Home, add, ledger, reports, shared detail, transaction detail, and goal detail pages match the same 402 x 874 prototype content composition used by the Expo app.
- Mini Program auth pages match `原型/手账本-登录注册.html` at the 402 x 874 reference viewport, including the top capsule, brand coin, feature sticky notes, WeChat green `#07c160` button, agreement copy, dimmed background, WeChat phone authorization sheet, selected phone row, allow/refuse buttons, spinner ring, coin, and bouncing dots.
- The WeChat page content area uses the same paper background, red margin line, horizontal rule texture, tape, doodle boxes, sticky-note rotations, tab geometry, keypad, chart, receipt block, and jar composition as `原型/手账本.html`.
- WeChat status bar, capsule, and safe-area offsets may shift the outer page chrome only; the notebook sheet and inner content must preserve the prototype's relative geometry after the documented top offset.
- Native WeChat controls are wrapped or restyled to match the prototype notebook primitives; do not expose default WeChat button, input, picker, or tab styles on prototyped surfaces.

**Mini Program constraints:**
- Use Chinese copy only.
- Use CloudBase endpoint only.
- Do not show a currency picker; every money-bearing payload explicitly sends `currencyCode: "CNY"`.
- Use Mini Program native storage for session token and preferences.
- Use `wx.chooseMedia` and `wx.uploadFile` for receipts.
- Use Mini Program subpackages from the start: `app.json.pages` contains `pages/auth/intro/intro`, `pages/auth/phone/phone`, `pages/auth/loading/loading`, `pages/home/home`, `pages/add/add`, `pages/ledger/ledger`, `pages/reports/reports`, and `pages/profile/profile`; `app.json.subPackages[0]` has root `subpackages/detail` and pages `pages/transactions/detail/detail`, `pages/shared/detail/detail`, and `pages/goals/detail/detail`; `app.json.subPackages[1]` has root `subpackages/settings` and pages `pages/categories/categories`, `pages/accounts/accounts`, `pages/payment-methods/payment-methods`, `pages/budget/budget`, and `pages/tags/tags`.

**Acceptance tests:**
- `pnpm --filter @pouchie/wechat-miniprogram test`
- `pnpm --filter @pouchie/wechat-miniprogram typecheck`
- WeChat Developer Tools opens every page.
- App configuration tests verify `apps/wechat-miniprogram/miniprogram/app.json` contains exactly the main package pages and two subpackages listed above, with no detail or settings page declared in `app.json.pages`.
- CloudBase login returns a session token and user profile.
- Mini Program auth tests cover intro-to-phone authorization navigation, `wx.login`, phone authorization code collection, login loading state, and CloudBase session persistence.
- `apps/wechat-miniprogram/miniprogram/api/client.ts` imports `createWechatTransport` from `@pouchie/api-client/wechat`, passes the Mini Program global `wx` object as the `WechatRuntime`, and does not import `@pouchie/api-client/native` or any native fetch transport.
- Add transaction, detail, goal deposit, shared settlement, report, payment method settings, and tag settings pages work against the CloudBase API.
- Automated tests cover transaction payload creation including `merchantName` and explicit `currencyCode: "CNY"`, CloudBase API calls, receipt `wx.chooseMedia` and `wx.uploadFile` flow, goal deposit payloads, shared ledger settlement payloads, and category/account/payment method/tag/budget settings payloads.
- Profile tests cover data export, account deletion, logout, native session storage cleanup, and return to login state.
- Prototype fidelity tests compare WeChat Developer Tools screenshots for auth intro, phone authorization, auth loading, home, add, ledger, reports, shared detail, transaction detail, and goal detail against screenshots captured from `原型/手账本-登录注册.html` and `原型/手账本.html`; any unmasked notebook-content pixel diff above 1.0% fails. Allowed comparison masks are fixed in `scripts/prototype/artboards.ts`, limited to WeChat capsule/status-bar pixels outside the 402 x 874 notebook content viewport, and cannot be changed by a child plan review.

### Child Plan 8: Design Tokens

**Purpose:** Make the visual contract explicit so Expo and Mini Program stay aligned without sharing UI code.

**Files:**
- Keep unchanged: `packages/ui-tokens/`
- Create: `packages/design-tokens/package.json`
- Create: `packages/design-tokens/tsconfig.json`
- Create: `packages/design-tokens/assets/fonts/MaShanZheng-Regular.ttf`
- Create: `packages/design-tokens/assets/fonts/ZhiMangXing-Regular.ttf`
- Create: `packages/design-tokens/assets/fonts/Caveat-VariableFont_wght.ttf`
- Create: `packages/design-tokens/assets/fonts/OFL.txt`
- Create: `packages/design-tokens/src/notebook.ts`
- Create: `packages/design-tokens/src/categories.ts`
- Create: `packages/design-tokens/src/fonts.ts`
- Create: `packages/design-tokens/src/index.ts`
- Create: `packages/design-tokens/tests/categories.test.ts`
- Create: `packages/design-tokens/tests/fonts.test.ts`
- Create: `packages/design-tokens/tests/prototype-tokens.test.ts`

**Design-token requirements:**
- Create `packages/design-tokens/` alongside the transitional `packages/ui-tokens/`; do not delete `packages/ui-tokens/` in this child plan because the current Expo app still depends on it until Child Plan 6.
- Capture visual tokens from the prototype exactly: artboard background `#e3dccb`, app background `#efe3cc`, paper `#fcf8ef`, ink `#43403a`, muted ink `#a89e88`, red `oklch(0.58 0.19 25)`, blue `oklch(0.52 0.14 245)`, green `oklch(0.5 0.13 150)`, tape `oklch(0.86 0.09 75 / 0.5)`, red margin line `oklch(0.7 0.16 25 / 0.35)`, and line texture `repeating-linear-gradient(transparent 0 31px, rgba(90,130,165,0.14) 31px 32px)`.
- Capture prototype geometry tokens for sheet margin, sheet radius, red margin x-position, bottom tab height, bottom tab offset, raised add button size/offset, keypad key height, doodle border width, doodle irregular radius string, tape height, and sticky-note rotations.
- Capture auth prototype tokens from `原型/app/nb_auth_app.jsx` and `原型/app/nb_auth_mini.jsx`: brand coin fill `oklch(0.88 0.16 92)`, auth field background `#fffdf7`, field focus border/red cursor geometry, auth button height `52`, auth button irregular radius `14px 12px 15px 12px`, verification-code box radius `12px 10px 13px 11px`, WeChat green `#07c160`, Mini Program capsule size `78 x 30`, and Mini Program auth sheet top radius `18`.
- Capture prototype font roles: Chinese heading handwriting, Chinese body handwriting, handwritten numerals, and compact system captions. Expo and WeChat use the packaged local font files in `packages/design-tokens/assets/fonts/`, and each role's font file mapping must stay explicit.
- The packaged font files map the prototype font-family names exactly: `Ma Shan Zheng` to `MaShanZheng-Regular.ttf`, `Zhi Mang Xing` to `ZhiMangXing-Regular.ttf`, and `Caveat` to `Caveat-VariableFont_wght.ttf`.
- Category token ids in `packages/design-tokens/src/categories.ts` must match the category catalog token ids exported by `@pouchie/contracts`.

**Acceptance tests:**
- `pnpm --filter @pouchie/design-tokens test`
- `pnpm --filter @pouchie/design-tokens typecheck`
- `pnpm --filter @pouchie/ui-tokens typecheck`
- Design-token tests verify every category catalog color token and icon token resolves to a concrete token in `@pouchie/design-tokens`.
- Font tests verify every exported font role resolves to an existing packaged font file and that no Expo or WeChat visual surface references remote font URLs.
- Prototype-token tests verify every exact product and auth color, line-texture, font-role, and geometry token listed above is exported from `@pouchie/design-tokens` without renamed, rounded, or substituted values.

### Child Plan 9: Final Documentation, Verification, Release, And Cleanup

**Purpose:** Capture the finished product contract from implemented code, close the rewrite with complete verification, and remove drift from the old implementation.

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.base.json`
- Modify: `readme.md`
- Replace: `PROJECT_GUIDE.md`
- Replace: `TESTING.md`
- Replace: `DEPLOY.md`
- Create: `docs/product/pouchie-screen-map.md`
- Create: `docs/product/pouchie-data-model.md`
- Create: `docs/product/pouchie-api-contract.md`
- Create: `docs/product/pouchie-visual-language.md`
- Create: `docs/product/pouchie-prototype-fidelity.md`
- Create: `docs/product/prototype-baselines/manifest.json`
- Create: `docs/product/prototype-baselines/nb-home.png`
- Create: `docs/product/prototype-baselines/nb-add.png`
- Create: `docs/product/prototype-baselines/nb-ledger.png`
- Create: `docs/product/prototype-baselines/nb-reports.png`
- Create: `docs/product/prototype-baselines/nb-shared.png`
- Create: `docs/product/prototype-baselines/nb-detail.png`
- Create: `docs/product/prototype-baselines/nb-goal.png`
- Create: `docs/product/prototype-baselines/au-app-welcome.png`
- Create: `docs/product/prototype-baselines/au-app-register.png`
- Create: `docs/product/prototype-baselines/au-app-login.png`
- Create: `docs/product/prototype-baselines/au-app-verify.png`
- Create: `docs/product/prototype-baselines/au-mini-intro.png`
- Create: `docs/product/prototype-baselines/au-mini-phone.png`
- Create: `docs/product/prototype-baselines/au-mini-loading.png`
- Create: `docs/product/pouchie-release-checklist.md`
- Create: `.github/workflows/typecheck-test.yml`
- Create: `.github/workflows/cloudflare-deploy.yml`
- Create: `.github/workflows/cloudbase-deploy.yml`
- Create: `scripts/verify-all.sh`
- Create: `scripts/deliverable-paths.txt`
- Create: `scripts/capture-prototype-baselines.sh`
- Create: `scripts/compare-prototype-fidelity.sh`
- Create: `scripts/prototype/artboards.ts`
- Create: `scripts/prototype/prototype-server.ts`
- Create: `scripts/prototype/capture-baselines.ts`
- Create: `scripts/prototype/compare-fidelity.ts`
- Create: `scripts/prototype/tests/artboards.test.ts`
- Create: `scripts/prototype/tests/prototype-fidelity-scripts.test.ts`
- Create: `scripts/scan-explicit-data.sh`
- Create: `scripts/deploy-cloudflare-staging.sh`
- Create: `scripts/healthcheck-cloudflare-staging.sh`
- Create: `scripts/deploy-cloudbase-staging.sh`
- Create: `scripts/healthcheck-cloudbase-staging.sh`
- Create: `scripts/clean-old-architecture.sh`
- Delete after Expo migration passes: `packages/ui-tokens/`
- Delete from the repository after product documentation capture: `docs/superpowers/specs/`
- Delete from the repository after product documentation capture: `docs/superpowers/plans/`, including this master roadmap and any generated child implementation plans.
- Delete from the repository after product documentation and screenshot fidelity baseline capture: `原型/`
- Delete from the repository after product documentation capture: `archive/non-deliverable/`; `scripts/clean-old-architecture.sh` treats an already-absent path as a completed deletion and still verifies it is absent on disk.

**Final documentation requirements:**
- `docs/product/pouchie-screen-map.md` is generated from the implemented Expo Router files and WeChat Mini Program `app.json`, then lists all screens and route names for both clients.
- `docs/product/pouchie-data-model.md` is generated from `@pouchie/contracts` exports and backend migration/collection files, then lists every entity and field with region ownership.
- `docs/product/pouchie-data-model.md` lists every money-bearing field with `currencyCode` behavior, including international multi-currency grouping and the Mini Program requirement to write explicit `currencyCode: "CNY"`.
- `docs/product/pouchie-api-contract.md` is generated from `PRODUCT_ENDPOINTS`, `OPERATIONAL_ENDPOINTS`, and exported request/response schemas in `@pouchie/contracts`, then lists every endpoint and its request/response schema reference.
- `docs/product/pouchie-api-contract.md` explicitly separates product endpoints used by `@pouchie/api-client` from deploy-only operational endpoints used by healthcheck scripts.
- `docs/product/pouchie-visual-language.md` records the concrete `@pouchie/design-tokens` values used by Expo and WeChat for paper, ink, red, blue, green, tape, line texture, doodle border, tab shape, and category tokens.
- `docs/product/pouchie-prototype-fidelity.md` records the source prototype files `原型/手账本.html` and `原型/手账本-登录注册.html`, the 446 x 918 artboard, the 402 x 874 reference viewport, the fourteen explicit prototype artboards, the platform-specific Expo and WeChat route mappings, the accepted platform chrome offsets, and the final screenshot comparison result for Expo and WeChat.
- `docs/product/prototype-baselines/manifest.json` records the captured baseline image names, source HTML file, prototype component name, SHA-256 hash, viewport, capture tool version, `prototypeDataSha256` for `原型/app/data.jsx`, and platform subset membership for each explicit artboard. It must contain exactly these fourteen baseline files: `nb-home.png`, `nb-add.png`, `nb-ledger.png`, `nb-reports.png`, `nb-shared.png`, `nb-detail.png`, `nb-goal.png`, `au-app-welcome.png`, `au-app-register.png`, `au-app-login.png`, `au-app-verify.png`, `au-mini-intro.png`, `au-mini-phone.png`, and `au-mini-loading.png`.
- `docs/product/prototype-baselines/manifest.json` must mark exactly eleven Expo entries and ten WeChat entries because the seven product artboards belong to both platforms, the four `AuApp*` auth artboards belong only to Expo, and the three `AuMini*` auth artboards belong only to WeChat.
- `docs/product/pouchie-release-checklist.md` records the final verification commands, release gates, deployment scripts, and manual preview checks.
- Final product docs contain no prototype imports, old early-stage architecture claims, generated records, or scanner policy text as product content.

- Root `package.json` must include explicit dev dependencies for prototype fidelity tooling: `@babel/standalone`, `@playwright/test`, `pixelmatch`, `pngjs`, `tsx`, `vitest`, `react`, and `react-dom`; the `react` and `react-dom` versions must match `apps/mobile/package.json`, and `scripts/prototype/tests/artboards.test.ts` must fail if those versions diverge. Child Plan 9 must run `pnpm install` so `pnpm-lock.yaml` records those exact packages.
- `scripts/deliverable-paths.txt` is the single explicit source of deliverable workspace paths used by both `scripts/scan-explicit-data.sh` and final `git status --short` checks.
- `scripts/deliverable-paths.txt` contains exactly these entries: `apps/`, `backends/`, `packages/`, `docs/`, `.github/`, `scripts/`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, `readme.md`, `PROJECT_GUIDE.md`, `TESTING.md`, and `DEPLOY.md`.
- `scripts/prototype/artboards.ts` is the only source of truth for explicit prototype artboards and platform route mappings. Documentation generation, baseline capture, fidelity comparison, Expo route-map tests, WeChat route-map tests, and manifest validation must import this file instead of duplicating artboard names in separate scripts.
- `scripts/prototype/artboards.ts` exports `ARTBOARD_WIDTH = 446`, `ARTBOARD_HEIGHT = 918`, `PHONE_VIEWPORT_WIDTH = 402`, `PHONE_VIEWPORT_HEIGHT = 874`, `PIXEL_DIFF_THRESHOLD = 0.01`, and an `ARTBOARDS` array with exactly these fourteen entries:
  - `{ id: "NbHome", baselineFile: "nb-home.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb1.jsx", expoRoute: "app/(app)/index.tsx", wechatRoute: "pages/home/home" }`
  - `{ id: "NbAdd", baselineFile: "nb-add.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb1.jsx", expoRoute: "app/(app)/add.tsx", wechatRoute: "pages/add/add" }`
  - `{ id: "NbLedger", baselineFile: "nb-ledger.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb1.jsx", expoRoute: "app/(app)/ledger.tsx", wechatRoute: "pages/ledger/ledger" }`
  - `{ id: "NbReports", baselineFile: "nb-reports.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb1.jsx", expoRoute: "app/(app)/reports.tsx", wechatRoute: "pages/reports/reports" }`
  - `{ id: "NbShared", baselineFile: "nb-shared.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb2.jsx", expoRoute: "app/(app)/shared/[id].tsx", wechatRoute: "subpackages/detail/pages/shared/detail/detail" }`
  - `{ id: "NbDetail", baselineFile: "nb-detail.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb2.jsx", expoRoute: "app/(app)/transactions/[id].tsx", wechatRoute: "subpackages/detail/pages/transactions/detail/detail" }`
  - `{ id: "NbGoal", baselineFile: "nb-goal.png", sourceHtml: "原型/手账本.html", prototypeModule: "原型/app/nb2.jsx", expoRoute: "app/(app)/goals/[id].tsx", wechatRoute: "subpackages/detail/pages/goals/detail/detail" }`
  - `{ id: "AuAppWelcome", baselineFile: "au-app-welcome.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_app.jsx", expoRoute: "app/welcome.tsx" }`
  - `{ id: "AuAppRegister", baselineFile: "au-app-register.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_app.jsx", expoRoute: "app/register.tsx" }`
  - `{ id: "AuAppLogin", baselineFile: "au-app-login.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_app.jsx", expoRoute: "app/signin.tsx" }`
  - `{ id: "AuAppVerify", baselineFile: "au-app-verify.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_app.jsx", expoRoute: "app/verify.tsx" }`
  - `{ id: "AuMiniIntro", baselineFile: "au-mini-intro.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_mini.jsx", wechatRoute: "pages/auth/intro/intro" }`
  - `{ id: "AuMiniPhone", baselineFile: "au-mini-phone.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_mini.jsx", wechatRoute: "pages/auth/phone/phone" }`
  - `{ id: "AuMiniLoading", baselineFile: "au-mini-loading.png", sourceHtml: "原型/手账本-登录注册.html", prototypeModule: "原型/app/nb_auth_mini.jsx", wechatRoute: "pages/auth/loading/loading" }`
- `scripts/prototype/tests/artboards.test.ts` asserts `ARTBOARDS.length === 14`, baseline file names exactly match the manifest requirement, Expo-enabled entries count is exactly eleven, WeChat-enabled entries count is exactly ten, every `Nb*` entry has both Expo and WeChat routes, every `AuApp*` entry has only an Expo route, every `AuMini*` entry has only a WeChat route, and there are no duplicate ids, baseline files, or platform routes.
- `scripts/prototype/prototype-server.ts` starts a localhost-only Playwright fixture server that renders only the two prototype HTML files before cleanup. It rewrites React, ReactDOM, Babel, and the three prototype font families to local workspace files, blocks every external `http:` and `https:` browser request, records attempted external URLs, and exposes that list to capture tests.
- `scripts/prototype/capture-baselines.ts` imports `ARTBOARDS`, captures the fourteen explicit prototype artboards from `原型/手账本.html` and `原型/手账本-登录注册.html` at the 402 x 874 reference viewport before `原型/` is deleted, writes only the fourteen named baseline PNG files under `docs/product/prototype-baselines/`, computes SHA-256 for each PNG, computes `prototypeDataSha256` from `原型/app/data.jsx`, and writes `docs/product/prototype-baselines/manifest.json` from the same `ARTBOARDS` entries.
- `scripts/prototype/compare-fidelity.ts` imports `ARTBOARDS`, reads only `docs/product/prototype-baselines/manifest.json` and its PNG files after baseline capture, and must not read `原型/` during final committed checkout verification. It compares exactly eleven Expo baseline mappings against Expo implementation screenshots, compares exactly ten WeChat baseline mappings against WeChat Developer Tools screenshots, and exits nonzero when any mapped artboard exceeds `PIXEL_DIFF_THRESHOLD` or when a baseline mapping is missing from either platform subset.
- `scripts/prototype/tests/prototype-fidelity-scripts.test.ts` verifies capture writes exactly the fourteen manifest-listed PNGs, compare fails when a platform mapping is missing, compare fails when any PNG exceeds threshold, compare does not open any file under `原型/`, and the prototype server exits nonzero if an external browser request is attempted.
- `scripts/capture-prototype-baselines.sh` is a minimal shell wrapper containing exactly `#!/usr/bin/env bash`, `set -euo pipefail`, and `pnpm exec tsx scripts/prototype/capture-baselines.ts`; it must contain no artboard names.
- `scripts/compare-prototype-fidelity.sh` is a minimal shell wrapper containing exactly `#!/usr/bin/env bash`, `set -euo pipefail`, and `pnpm exec tsx scripts/prototype/compare-fidelity.ts`; it must contain no artboard names.
- `scripts/scan-explicit-data.sh` reads `scripts/deliverable-paths.txt`, expands every listed directory or file currently present after cleanup, and scans tracked and untracked files under those paths while excluding only dependency/build outputs and `scripts/scan-explicit-data.sh` itself.
- `scripts/scan-explicit-data.sh` validates binary baseline PNG files under `docs/product/prototype-baselines/` by checking their path and SHA-256 entries in `manifest.json`; it exits nonzero on missing, extra, or hash-mismatched baseline files. After validation, those manifest-listed PNG files are skipped from text token scanning, and any other binary file under deliverable paths exits nonzero.
- `scripts/scan-explicit-data.sh` treats `apps/mobile/src/testing/prototype-fixtures.ts` as the only allowed text file containing exact prototype fixture values. It validates that the file exports `PROTOTYPE_FIXTURE_SOURCE_SHA256`, that the value equals `docs/product/prototype-baselines/manifest.json.prototypeDataSha256`, and that no runtime file imports it.
- `scripts/scan-explicit-data.sh` exits nonzero if prototype fixture transaction, category, account, payment method, tag, shared-ledger, goal, or auth display values appear outside `apps/mobile/src/testing/prototype-fixtures.ts`, `apps/mobile/tests/`, `scripts/prototype/tests/`, or `docs/product/prototype-baselines/manifest.json`.
- `scripts/clean-old-architecture.sh` deletes non-deliverable paths and exits nonzero if `docs/superpowers/specs/`, `docs/superpowers/plans/`, `原型/`, or `archive/non-deliverable/` still exists on disk, regardless of whether those paths are tracked by git.
- `scripts/scan-explicit-data.sh` fails when any scanned path contains implicit substitute protocol branches, generated user/category/transaction data, open category or currency sentinel keys, or non-packaged font asset substitution.
- `scripts/scan-explicit-data.sh` uses a fixed blocked-token list for implicit substitution, generated-data labels, open sentinel keys, staged-test labels, packaged-asset substitution labels, and Chinese equivalents; the list lives in the script implementation rather than product docs.
- `scripts/scan-explicit-data.sh` self-check verifies the blocked-token list is loaded, nonempty, and reported in scanner diagnostics without scanning the scanner file as deliverable content.
- `scripts/scan-explicit-data.sh` prints every offending file path and line number, then exits nonzero.

**Child Plan 9 implementation verification commands:**

```bash
pnpm install
pnpm exec playwright install chromium
pnpm exec vitest scripts/prototype/tests
pnpm -r --if-present run typecheck
pnpm -r --if-present run test
pnpm --filter @pouchie/core test
pnpm --filter @pouchie/core typecheck
pnpm --filter @pouchie/contracts test
pnpm --filter @pouchie/contracts typecheck
pnpm --filter @pouchie/server-core test
pnpm --filter @pouchie/server-core typecheck
pnpm --filter @pouchie/api-client test
pnpm --filter @pouchie/api-client typecheck
pnpm --filter @pouchie/design-tokens test
pnpm --filter @pouchie/design-tokens typecheck
pnpm --filter @pouchie/cloudflare-worker test
pnpm --filter @pouchie/cloudflare-worker typecheck
pnpm --filter @pouchie/cloudbase-api test
pnpm --filter @pouchie/cloudbase-api typecheck
pnpm --filter @pouchie/mobile test
pnpm --filter @pouchie/mobile typecheck
pnpm --filter @pouchie/wechat-miniprogram test
pnpm --filter @pouchie/wechat-miniprogram typecheck
bash scripts/capture-prototype-baselines.sh
bash scripts/compare-prototype-fidelity.sh
bash scripts/clean-old-architecture.sh
bash scripts/scan-explicit-data.sh
test ! -e docs/superpowers/specs
test ! -e docs/superpowers/plans
test ! -e 原型
test ! -e archive/non-deliverable
bash scripts/deploy-cloudflare-staging.sh
bash scripts/healthcheck-cloudflare-staging.sh
bash scripts/deploy-cloudbase-staging.sh
bash scripts/healthcheck-cloudbase-staging.sh
```

**Final committed checkout verification commands:**

Run these only after Child Plan 9 cleanup, documentation, and script changes are staged and committed, and after the checkout is refreshed from that commit; do not run these during Child Plan 9 implementation.

```bash
bash scripts/clean-old-architecture.sh
bash scripts/scan-explicit-data.sh
bash scripts/compare-prototype-fidelity.sh
test ! -e docs/superpowers/specs
test ! -e docs/superpowers/plans
test ! -e 原型
test ! -e archive/non-deliverable
test -z "$(git status --short -- docs/superpowers/specs docs/superpowers/plans 原型 archive/non-deliverable)"
test -z "$(xargs git status --short -- < scripts/deliverable-paths.txt)"
```

**Release gates:**
- Cloudflare staging Worker deploy is executed by `.github/workflows/cloudflare-deploy.yml` or `scripts/deploy-cloudflare-staging.sh`, then `scripts/healthcheck-cloudflare-staging.sh` passes against public `GET /health`.
- CloudBase staging cloud function deploy is executed by `.github/workflows/cloudbase-deploy.yml` or `scripts/deploy-cloudbase-staging.sh`, then `scripts/healthcheck-cloudbase-staging.sh` passes against public `GET /health`.
- Expo development build opens welcome, register, signin, verify, home, add, ledger, reports, detail, shared, and goal pages.
- WeChat Developer Tools preview opens auth intro, phone authorization, auth loading, home, add, ledger, reports, detail, shared, and goal pages.
- Prototype fidelity comparison passes for Expo and WeChat against the captured `原型/手账本.html` and `原型/手账本-登录注册.html` baselines before `原型/` is removed.
- Old `apps/api-worker` and `packages/domain` code was removed in Child Plan 3 and is absent from runtime scripts.
- Old `packages/ui-tokens` code is removed after Child Plan 6 proves the Expo app uses `@pouchie/design-tokens`.
- `tsconfig.base.json`, root scripts, and `pnpm-lock.yaml` contain no references to `@pouchie/api-worker`, `@pouchie/domain`, or `@pouchie/ui-tokens`.
- `docs/superpowers/specs/`, `docs/superpowers/plans/`, `原型/`, and `archive/non-deliverable/` are absent from the repository after their decisions are captured in `docs/product/*`.
- `scripts/clean-old-architecture.sh` and the explicit `test ! -e ...` checks prove those non-deliverable paths are absent from disk, including untracked files and directories.
- The deliverable-path `git status --short` check runs only in the final committed checkout, reads the same `scripts/deliverable-paths.txt` path source used by `scripts/scan-explicit-data.sh`, and proves there are no unstaged, untracked, or otherwise uncommitted deliverable files that could bypass scanning or release packaging.
- `scripts/scan-explicit-data.sh` self-check passes, then the deliverable scan passes.

## Execution Order

Run child plans in this execution order while preserving their original child-plan numbers:

1. Child Plan 1: Shared Contracts And Core Model
2. Child Plan 2: Shared Server Core
3. Child Plan 8: Design Tokens
4. Child Plan 3: Cloudflare International Backend
5. Child Plan 5: Shared API Client
6. Child Plan 6: Expo International App
7. Child Plan 4: CloudBase China Backend
8. Child Plan 7: WeChat Mini Program China App
9. Child Plan 9: Final Documentation, Verification, Release, And Cleanup

The CloudBase backend may start after Shared Server Core if a second worker is available, but the API contract must already be frozen by Child Plan 1.

## Risk Controls

- Do not mix transitional `@pouchie/domain` entries or old `@xiaohebao/domain` entries with new `@pouchie/server-core` entries in the same runtime.
- Do not let Cloudflare and CloudBase define separate request/response DTOs.
- Do not encode user-facing category labels as canonical data; use stable category keys plus localized labels or custom names.
- Do not use floating-point money in storage, contracts, or reports.
- Do not build cross-region sync between CloudBase and Cloudflare.
- Do not import prototype JSX into production code.
- Do not reinterpret explicit prototype artboards as loose inspiration; screens with `Nb*`, `AuApp*`, or `AuMini*` artboards must pass 1:1 screenshot fidelity checks before feature work on that surface is accepted.
- Do not begin WeChat UI before CloudBase auth and transaction creation work end-to-end.

## Self-Review

- Spec coverage: This master plan covers the prototype's seven primary product screens plus seven auth/onboarding screens with 1:1 visual fidelity gates, settings/profile support, shared ledger, saving goals, reports, receipts, dual backend deployment, and data isolation.
- Scope check: The work spans multiple independent subsystems, so this file is a master roadmap and each subsystem must be converted into a separate executable child plan before code changes begin.
- Explicitness scan: The plan intentionally contains no unresolved fields, temporary labels, open-ended implementation notes, catch-all protocol branches, or catch-all data keys.
- Type consistency: Shared package names, staged old-package removal, workspace discovery, currency fields, settings entities, receipt lifecycle, entity ownership, backend names, routes, and app-specific API wiring are consistent across file structure, execution order, and child plan descriptions.
