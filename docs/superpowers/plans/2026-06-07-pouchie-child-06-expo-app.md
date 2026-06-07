# Pouchie Child Plan 6 Expo App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Android/iOS with Expo as a multilingual notebook-style product that matches the explicit prototype artboards 1:1.

**Architecture:** Expo Router owns routes, production routes provide an `ApiClientContext` backed by `@pouchie/api-client/native`, notebook primitives consume `@pouchie/design-tokens`, and prototype fixtures remain test-only.

**Tech Stack:** Expo SDK, React Native, Expo Router, TanStack Query, Zustand, React Hook Form, Zod, react-native-svg, Vitest, Playwright/Expo screenshot checks.

---

## Preconditions

- Child Plan 1, Child Plan 5, and Child Plan 8 have passed.
- Cloudflare backend from Child Plan 3 is available for integration testing.

## Files

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
- Delete old `(tabs)` route files after new route tests pass.
- Delete old Glass components after notebook primitives replace every import.
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

## Task 1: Routes And API Wiring

- [ ] **Step 1: Write route and API boundary tests**

Create `apps/mobile/tests/routes-api-boundary.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

const requiredRoutes = [
  "app/welcome.tsx",
  "app/signin.tsx",
  "app/register.tsx",
  "app/verify.tsx",
  "app/(app)/_layout.tsx",
  "app/(app)/index.tsx",
  "app/(app)/add.tsx",
  "app/(app)/ledger.tsx",
  "app/(app)/reports.tsx",
  "app/(app)/profile.tsx",
  "app/(app)/transactions/[id].tsx",
  "app/(app)/shared/[id].tsx",
  "app/(app)/goals/[id].tsx",
  "app/(app)/settings/categories.tsx",
  "app/(app)/settings/accounts.tsx",
  "app/(app)/settings/payment-methods.tsx",
  "app/(app)/settings/budget.tsx",
  "app/(app)/settings/tags.tsx",
  "app/(app)/settings/currency.tsx",
  "app/(app)/settings/language.tsx",
];

describe("Expo routes and API wiring", () => {
  it("contains the complete notebook route tree", () => {
    for (const route of requiredRoutes) {
      expect(existsSync(join(root, route)), route).toBe(true);
    }
  });

  it("uses the native API client entry point only", () => {
    const source = readFileSync(join(root, "src/api/client.ts"), "utf8");
    expect(source).toContain("@pouchie/api-client/native");
    expect(source).toContain("createClient");
    expect(source).toContain("getAccessToken");
    expect(source).toContain("setAccessToken");
    expect(source).toContain("clearAccessToken");
    expect(source).not.toContain("@pouchie/api-client/wechat");
    expect(source).not.toMatch(/\bwx\b/);
  });

  it("removes old tab route groups", () => {
    expect(existsSync(join(root, "app/(tabs)"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the failing route/API tests**

Run:

```bash
pnpm --filter @pouchie/mobile test -- routes-api-boundary
```

Expected: FAIL because the new route tree and native API client wiring are not complete.

- [ ] **Step 3: Implement routes and native client wiring**

Create each route file listed in the test. Route files should only import and render feature screens, for example:

```tsx
import { HomeScreen } from "../../src/features/dashboard/HomeScreen";

export default HomeScreen;
```

Create `apps/mobile/src/api/config.ts`:

```ts
export const CLOUDFLARE_API_BASE_URL = process.env.EXPO_PUBLIC_CLOUDFLARE_API_BASE_URL;

if (!CLOUDFLARE_API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_CLOUDFLARE_API_BASE_URL is required");
}
```

Create `apps/mobile/src/api/client.ts`:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@pouchie/api-client";
import { createNativeTransport } from "@pouchie/api-client/native";
import { CLOUDFLARE_API_BASE_URL } from "./config";

const ACCESS_TOKEN_KEY = "pouchie.native.accessToken";

export const nativeTokenProvider = {
  getAccessToken: () => AsyncStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => AsyncStorage.setItem(ACCESS_TOKEN_KEY, token),
  clearAccessToken: () => AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
};

export const pouchieClient = createClient({
  transport: createNativeTransport({
    baseUrl: CLOUDFLARE_API_BASE_URL,
    tokenProvider: nativeTokenProvider,
  }),
});
```

Delete `apps/mobile/app/(tabs)/` after the new routes compile.

- [ ] **Step 4: Run route/API verification**

Run:

```bash
pnpm --filter @pouchie/mobile test -- routes-api-boundary
pnpm --filter @pouchie/mobile typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit routes and API wiring**

```bash
git add apps/mobile/app apps/mobile/src/api apps/mobile/tests/routes-api-boundary.test.ts apps/mobile/package.json pnpm-lock.yaml
git rm -r apps/mobile/app/\(tabs\)
git commit -m "feat: rebuild expo route and api wiring"
```

## Task 2: Notebook Primitives And Tokens

- [ ] **Step 1: Write notebook primitive tests**

Create `apps/mobile/tests/notebook-primitives.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { Text } from "react-native";
import { render } from "../src/testing/render";
import { notebookTokens, fontAssets } from "@pouchie/design-tokens";
import { NotebookPaper } from "../src/notebook/NotebookPaper";
import { NotebookTabBar } from "../src/notebook/NotebookTabBar";
import { NotebookKeypad } from "../src/notebook/NotebookKeypad";
import { MoneyText } from "../src/notebook/MoneyText";

describe("notebook primitives", () => {
  it("renders paper with exact prototype geometry tokens", () => {
    const screen = render(
      <NotebookPaper testID="paper">
        <Text>content</Text>
      </NotebookPaper>,
    );
    expect(screen.getByTestId("paper").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: notebookTokens.colors.paper,
          borderRadius: notebookTokens.geometry.paperRadius,
        }),
      ]),
    );
  });

  it("renders the tab bar labels and raised add action", () => {
    const screen = render(<NotebookTabBar activeRoute="home" />);
    for (const label of ["首页", "明细", "+", "报表", "我的"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    expect(screen.getByTestId("notebook-tab-add").props.accessibilityRole).toBe("button");
  });

  it("renders the prototype keypad grid without changing key count", () => {
    const screen = render(<NotebookKeypad value="128.50" onPressKey={() => undefined} onSubmit={() => undefined} />);
    expect(screen.getAllByTestId(/^notebook-key-/)).toHaveLength(12);
  });

  it("uses packaged handwritten fonts for money text", () => {
    const screen = render(<MoneyText amountCents={12850} currencyCode="USD" />);
    expect(fontAssets.money.familyName).toBe("Caveat");
    expect(screen.getByText("$128.50")).toBeTruthy();
  });
});
```

Create `apps/mobile/tests/notebook-boundary.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "src");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe("notebook visual boundary", () => {
  it("removes old glass visual imports from runtime source", () => {
    const runtime = files(root).filter((path) => /\.(ts|tsx)$/.test(path));
    for (const file of runtime) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/Glass|glassmorphism|@pouchie\/ui-tokens/);
    }
  });
});
```

- [ ] **Step 2: Run the failing primitive tests**

Run:

```bash
pnpm --filter @pouchie/mobile test -- notebook-primitives notebook-boundary
```

Expected: FAIL because notebook primitives, font loading, and import cleanup are not complete.

- [ ] **Step 3: Implement notebook primitives and font loading**

Create `apps/mobile/src/notebook/fonts.ts`:

```ts
import { useFonts } from "expo-font";
import { fontAssets } from "@pouchie/design-tokens";

export function useNotebookFonts() {
  return useFonts({
    [fontAssets.heading.familyName]: fontAssets.heading.module,
    [fontAssets.body.familyName]: fontAssets.body.module,
    [fontAssets.money.familyName]: fontAssets.money.module,
  });
}
```

Create primitives under `apps/mobile/src/notebook/` using only `@pouchie/design-tokens`, `react-native`, and `react-native-svg`. `NotebookPaper` must apply the prototype paper color, red margin line, horizontal rule rhythm, sheet radius, sheet shadow, and stable 402 x 874 reference scaling. `NotebookTabBar` must preserve labels `首页 / 明细 / + / 报表 / 我的`, raised red add button geometry, active underline, and fixed bottom offset. Delete old Glass component files only after all runtime imports are moved to notebook primitives.

- [ ] **Step 4: Run primitive verification**

Run:

```bash
pnpm --filter @pouchie/mobile test -- notebook-primitives notebook-boundary
pnpm --filter @pouchie/mobile typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit notebook primitives**

```bash
git add apps/mobile/src/notebook apps/mobile/tests/notebook-primitives.test.tsx apps/mobile/tests/notebook-boundary.test.ts apps/mobile/src/theme.ts apps/mobile/package.json pnpm-lock.yaml
git commit -m "feat: add expo notebook primitives"
```

## Task 3: Auth And Product Screens

- [ ] **Step 1: Write auth and product behavior tests**

Create `apps/mobile/tests/screens-payloads.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { renderWithClient } from "../src/testing/render";
import { AddTransactionScreen } from "../src/features/transactions/AddTransactionScreen";
import { RegisterScreen } from "../src/features/auth/RegisterScreen";
import { LoginScreen } from "../src/features/auth/LoginScreen";
import { VerifyScreen } from "../src/features/auth/VerifyScreen";

const calls: Array<{ key: string; payload: unknown }> = [];

const recordingClient = {
  auth: {
    registerWithEmail: (payload: unknown) => calls.push({ key: "auth.registerWithEmail", payload }),
    loginWithEmail: (payload: unknown) => calls.push({ key: "auth.loginWithEmail", payload }),
    requestEmailVerificationCode: (payload: unknown) => calls.push({ key: "auth.requestEmailVerificationCode", payload }),
    verifyEmailCode: (payload: unknown) => calls.push({ key: "auth.verifyEmailCode", payload }),
  },
  transactions: {
    create: (payload: unknown) => calls.push({ key: "transactions.create", payload }),
  },
};

describe("Expo auth and product screens", () => {
  it("submits email registration through the Cloudflare auth endpoint", async () => {
    const screen = renderWithClient(<RegisterScreen />, recordingClient);
    fireEvent.changeText(screen.getByLabelText("Email"), "me@example.com");
    fireEvent.changeText(screen.getByLabelText("Password"), "correct horse battery staple");
    fireEvent.press(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => expect(calls.at(-1)).toMatchObject({ key: "auth.registerWithEmail" }));
  });

  it("submits login and verification-code flows through explicit auth endpoints", async () => {
    const login = renderWithClient(<LoginScreen />, recordingClient);
    fireEvent.changeText(login.getByLabelText("Email"), "me@example.com");
    fireEvent.changeText(login.getByLabelText("Password"), "correct horse battery staple");
    fireEvent.press(login.getByRole("button", { name: "Sign in" }));

    const verify = renderWithClient(<VerifyScreen />, recordingClient);
    fireEvent.changeText(verify.getByLabelText("Email"), "me@example.com");
    fireEvent.press(verify.getByRole("button", { name: "Send code" }));
    fireEvent.changeText(verify.getByLabelText("Verification code"), "123456");
    fireEvent.press(verify.getByRole("button", { name: "Verify" }));

    expect(calls.map((call) => call.key)).toEqual(
      expect.arrayContaining(["auth.loginWithEmail", "auth.requestEmailVerificationCode", "auth.verifyEmailCode"]),
    );
  });

  it("creates transactions with explicit merchant, category, account, tags, and currency", async () => {
    const screen = renderWithClient(<AddTransactionScreen />, recordingClient);
    fireEvent.changeText(screen.getByLabelText("Amount"), "42.90");
    fireEvent.changeText(screen.getByLabelText("Merchant"), "Cafe");
    fireEvent.press(screen.getByText("Food"));
    fireEvent.press(screen.getByText("Wallet"));
    fireEvent.press(screen.getByText("Friends"));
    fireEvent.press(screen.getByRole("button", { name: "Save transaction" }));
    await waitFor(() =>
      expect(calls.at(-1)).toMatchObject({
        key: "transactions.create",
        payload: expect.objectContaining({
          amountCents: 4290,
          merchantName: "Cafe",
          currencyCode: "USD",
          categoryId: expect.any(String),
          accountId: expect.any(String),
          tagIds: expect.any(Array),
        }),
      }),
    );
  });
});
```

- [ ] **Step 2: Run the failing screen tests**

Run:

```bash
pnpm --filter @pouchie/mobile test -- screens-payloads
```

Expected: FAIL because auth, product screens, and payload construction are not implemented.

- [ ] **Step 3: Implement auth and product screens**

Implement the four App auth screens from `AuAppWelcome`, `AuAppRegister`, `AuAppLogin`, and `AuAppVerify`. Implement product screens from `NbHome`, `NbAdd`, `NbLedger`, `NbReports`, `NbShared`, `NbDetail`, and `NbGoal`; all route-level data must come from an `ApiClientContext` value, TanStack Query, Zustand session/preferences state, or explicit empty/loading/error state objects. Production routes provide `pouchieClient`; tests use `renderWithClient`. Profile/settings screens must support data export, account deletion, logout, currency preference, and language switching without reading prototype values.

- [ ] **Step 4: Run screen verification**

Run:

```bash
pnpm --filter @pouchie/mobile test -- screens-payloads
pnpm --filter @pouchie/mobile typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit screens**

```bash
git add apps/mobile/app apps/mobile/src/features apps/mobile/src/i18n apps/mobile/src/state apps/mobile/tests/screens-payloads.test.tsx
git commit -m "feat: implement expo auth and product screens"
```

## Task 4: Prototype Fidelity Tests

- [ ] **Step 1: Write prototype mapping and fidelity tests**

Create `apps/mobile/tests/prototype-screen-map.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ARTBOARDS } from "../../../scripts/prototype/artboards";
import { EXPO_PROTOTYPE_SCREEN_MAP } from "../src/testing/prototype-screen-map";

describe("Expo prototype screen map", () => {
  it("maps exactly the eleven Expo artboards", () => {
    const expoArtboards = ARTBOARDS.filter((artboard) => artboard.platforms.includes("expo"));
    expect(EXPO_PROTOTYPE_SCREEN_MAP.map((entry) => entry.artboardId).sort()).toEqual(
      expoArtboards.map((artboard) => artboard.id).sort(),
    );
    expect(EXPO_PROTOTYPE_SCREEN_MAP).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ artboardId: "NbHome", route: "app/(app)/index.tsx" }),
        expect.objectContaining({ artboardId: "NbAdd", route: "app/(app)/add.tsx" }),
        expect.objectContaining({ artboardId: "NbLedger", route: "app/(app)/ledger.tsx" }),
        expect.objectContaining({ artboardId: "NbReports", route: "app/(app)/reports.tsx" }),
        expect.objectContaining({ artboardId: "NbShared", route: "app/(app)/shared/[id].tsx" }),
        expect.objectContaining({ artboardId: "NbDetail", route: "app/(app)/transactions/[id].tsx" }),
        expect.objectContaining({ artboardId: "NbGoal", route: "app/(app)/goals/[id].tsx" }),
        expect.objectContaining({ artboardId: "AuAppWelcome", route: "app/welcome.tsx" }),
        expect.objectContaining({ artboardId: "AuAppRegister", route: "app/register.tsx" }),
        expect.objectContaining({ artboardId: "AuAppLogin", route: "app/signin.tsx" }),
        expect.objectContaining({ artboardId: "AuAppVerify", route: "app/verify.tsx" }),
      ]),
    );
  });
});
```

Create `apps/mobile/tests/prototype-fixtures-boundary.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(__dirname, "..");
const allowed = new Set(["src/testing/prototype-fixtures.ts", "tests/prototype-fidelity.test.ts"]);
const deniedRoots = ["app", "src/api", "src/features", "src/state", "src/i18n"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe("prototype data boundary", () => {
  it("keeps prototype values out of runtime source", () => {
    const runtimeFiles = deniedRoots.flatMap((dir) => files(join(root, dir))).filter((file) => /\.(ts|tsx)$/.test(file));
    for (const file of runtimeFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, relative(root, file)).not.toContain("prototype-fixtures");
      expect(source, relative(root, file)).not.toContain("PROTOTYPE_FIXTURE_SOURCE_SHA256");
    }
  });

  it("allows prototype values only in screenshot testing files", () => {
    const imports = files(root)
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .filter((file) => readFileSync(file, "utf8").includes("prototype-fixtures"))
      .map((file) => relative(root, file).replaceAll("\\\\", "/"));
    expect(imports.every((file) => allowed.has(file))).toBe(true);
  });
});
```

Create `apps/mobile/tests/prototype-fidelity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ARTBOARDS, PHONE_VIEWPORT_HEIGHT, PHONE_VIEWPORT_WIDTH, PIXEL_DIFF_THRESHOLD } from "../../../scripts/prototype/artboards";
import { EXPO_PROTOTYPE_SCREEN_MAP } from "../src/testing/prototype-screen-map";
import { PROTOTYPE_FIXTURE_SOURCE_SHA256 } from "../src/testing/prototype-fixtures";

describe("Expo prototype fidelity contract", () => {
  it("uses the reference 402 x 874 viewport and one percent threshold", () => {
    expect(PHONE_VIEWPORT_WIDTH).toBe(402);
    expect(PHONE_VIEWPORT_HEIGHT).toBe(874);
    expect(PIXEL_DIFF_THRESHOLD).toBe(0.01);
  });

  it("renders every Expo artboard with source-traceable screenshot data", () => {
    expect(PROTOTYPE_FIXTURE_SOURCE_SHA256).toMatch(/^[a-f0-9]{64}$/);
    const mapped = new Set(EXPO_PROTOTYPE_SCREEN_MAP.map((entry) => entry.artboardId));
    for (const artboard of ARTBOARDS.filter((entry) => entry.platforms.includes("expo"))) {
      expect(mapped.has(artboard.id), artboard.id).toBe(true);
      expect(artboard.allowedMasks.every((mask) => mask.scope !== "notebook-content")).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the failing fidelity tests**

Run:

```bash
pnpm --filter @pouchie/mobile test -- prototype-screen-map prototype-fixtures-boundary prototype-fidelity
```

Expected: FAIL because the Expo prototype map, screenshot-only data file, and fidelity contract are not implemented.

- [ ] **Step 3: Implement Expo prototype fidelity support**

Create `apps/mobile/src/testing/prototype-screen-map.ts` from `scripts/prototype/artboards.ts` with exactly the eleven Expo mappings in the test. Create `apps/mobile/src/testing/prototype-fixtures.ts` by transcribing only the values needed to render the eleven explicit Expo artboards for screenshot comparison; export `PROTOTYPE_FIXTURE_SOURCE_SHA256` as the SHA-256 of `原型/app/data.jsx`. Keep screenshot data imports out of route, feature, state, API, and i18n files.

- [ ] **Step 4: Run fidelity verification**

Run:

```bash
pnpm --filter @pouchie/mobile test -- prototype-screen-map prototype-fixtures-boundary prototype-fidelity
pnpm --filter @pouchie/mobile typecheck
```

Expected: both commands exit 0. Full pixel comparison is executed by Child Plan 9 after baselines are captured.

- [ ] **Step 5: Commit Expo fidelity contract**

```bash
git add apps/mobile/src/testing apps/mobile/tests/prototype-screen-map.test.ts apps/mobile/tests/prototype-fixtures-boundary.test.ts apps/mobile/tests/prototype-fidelity.test.ts
git commit -m "test: lock expo prototype fidelity contract"
```

## Verification Commands

```bash
pnpm --filter @pouchie/mobile test
pnpm --filter @pouchie/mobile typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- Expo renders all explicit App auth and product artboards at 1:1 fidelity.
- Runtime code imports no prototype JSX and no prototype fixture data.
- Android/iOS share Cloudflare-backed data.
- International currency preferences persist and sync through profile data.
