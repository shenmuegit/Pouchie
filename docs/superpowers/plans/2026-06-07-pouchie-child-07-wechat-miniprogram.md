# Pouchie Child Plan 7 WeChat Mini Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the independent WeChat Mini Program with native Mini Program pages and CloudBase-only data.

**Architecture:** Native Mini Program pages use WeChat storage and CloudBase API client wiring. Notebook primitives are implemented in WXML/WXSS and aligned with the same design tokens without sharing React Native UI code.

**Tech Stack:** Native WeChat Mini Program TypeScript, WXML, WXSS, Vitest, WeChat Developer Tools, `@pouchie/api-client/wechat`, `@pouchie/design-tokens`.

---

## Preconditions

- Child Plan 1, Child Plan 4, Child Plan 5, and Child Plan 8 have passed.
- WeChat Developer Tools is available for preview and screenshots.

## Files

- Create: `apps/wechat-miniprogram/package.json`
- Create: `apps/wechat-miniprogram/tsconfig.json`
- Create: `apps/wechat-miniprogram/project.config.json`
- Create: `apps/wechat-miniprogram/miniprogram/app.json`
- Create: `apps/wechat-miniprogram/miniprogram/app.ts`
- Create: `apps/wechat-miniprogram/miniprogram/app.wxss`
- Create: `apps/wechat-miniprogram/miniprogram/api/config.ts`
- Create: `apps/wechat-miniprogram/miniprogram/api/client.ts`
- Create auth pages under `apps/wechat-miniprogram/miniprogram/pages/auth/intro/`, `phone/`, and `loading/`, each with `.json`, `.ts`, `.wxml`, and `.wxss`.
- Create main pages under `pages/home/`, `pages/add/`, `pages/ledger/`, `pages/reports/`, and `pages/profile/`, each with `.json`, `.ts`, `.wxml`, and `.wxss`.
- Create detail subpackage pages under `subpackages/detail/pages/transactions/detail/`, `shared/detail/`, and `goals/detail/`, each with `.json`, `.ts`, `.wxml`, and `.wxss`.
- Create settings subpackage pages under `subpackages/settings/pages/categories/`, `accounts/`, `payment-methods/`, `budget/`, and `tags/`, each with `.json`, `.ts`, `.wxml`, and `.wxss`.
- Create notebook components under `components/notebook-paper/`, `doodle-box/`, `tape/`, `money-text/`, `keypad/`, and `chart/`, each with `.json`, `.ts`, `.wxml`, and `.wxss`.
- Create: `apps/wechat-miniprogram/tests/api-client.test.ts`
- Create: `apps/wechat-miniprogram/tests/page-payloads.test.ts`
- Create: `apps/wechat-miniprogram/tests/receipt-upload.test.ts`
- Create: `apps/wechat-miniprogram/tests/settings.test.ts`
- Create: `apps/wechat-miniprogram/tests/prototype-fidelity.test.ts`
- Create: `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts`

## Task 1: Mini Program Shell And App Config

- [ ] **Step 1: Write Mini Program shell tests**

Create `apps/wechat-miniprogram/tests/app-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("WeChat Mini Program app config", () => {
  it("declares only primary pages in the main package", () => {
    const appJson = JSON.parse(readFileSync(join(root, "miniprogram/app.json"), "utf8"));
    expect(appJson.pages).toEqual([
      "pages/auth/intro/intro",
      "pages/auth/phone/phone",
      "pages/auth/loading/loading",
      "pages/home/home",
      "pages/add/add",
      "pages/ledger/ledger",
      "pages/reports/reports",
      "pages/profile/profile",
    ]);
  });

  it("keeps detail and settings pages in subpackages", () => {
    const appJson = JSON.parse(readFileSync(join(root, "miniprogram/app.json"), "utf8"));
    expect(appJson.subpackages).toEqual([
      {
        root: "subpackages/detail",
        pages: ["pages/transactions/detail/detail", "pages/shared/detail/detail", "pages/goals/detail/detail"],
      },
      {
        root: "subpackages/settings",
        pages: ["pages/categories/categories", "pages/accounts/accounts", "pages/payment-methods/payment-methods", "pages/budget/budget", "pages/tags/tags"],
      },
    ]);
    expect(appJson.pages.join("\n")).not.toMatch(/transactions\/detail|shared\/detail|goals\/detail|settings/);
  });

  it("creates required app shell files", () => {
    for (const file of ["project.config.json", "miniprogram/app.json", "miniprogram/app.ts", "miniprogram/app.wxss"]) {
      expect(existsSync(join(root, file)), file).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the failing shell tests**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- app-config
```

Expected: FAIL because the Mini Program package and app shell do not exist.

- [ ] **Step 3: Implement Mini Program shell and app config**

Create `apps/wechat-miniprogram/package.json`:

```json
{
  "name": "@pouchie/wechat-miniprogram",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@pouchie/api-client": "workspace:*",
    "@pouchie/design-tokens": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*",
    "vitest": "workspace:*"
  }
}
```

Create `miniprogram/app.json` exactly as asserted by the test. Create empty page folders with `.json`, `.ts`, `.wxml`, and `.wxss` files for every main, detail, and settings page listed in the Files section.

- [ ] **Step 4: Run shell verification**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- app-config
pnpm --filter @pouchie/wechat-miniprogram typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit shell**

```bash
git add apps/wechat-miniprogram/package.json apps/wechat-miniprogram/tsconfig.json apps/wechat-miniprogram/project.config.json apps/wechat-miniprogram/miniprogram apps/wechat-miniprogram/tests/app-config.test.ts pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "feat: add wechat miniprogram shell"
```

## Task 2: CloudBase API Wiring And Auth

- [ ] **Step 1: Write CloudBase API and auth tests**

Create `apps/wechat-miniprogram/tests/api-client.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("WeChat API client wiring", () => {
  it("uses the WeChat transport entry point and injected wx runtime", () => {
    const source = readFileSync(join(root, "miniprogram/api/client.ts"), "utf8");
    expect(source).toContain("@pouchie/api-client/wechat");
    expect(source).toContain("createWechatTransport");
    expect(source).toContain("WechatRuntime");
    expect(source).toContain("wx");
    expect(source).not.toContain("@pouchie/api-client/native");
  });

  it("keeps CloudBase URL config in the Mini Program app layer", () => {
    const source = readFileSync(join(root, "miniprogram/api/config.ts"), "utf8");
    expect(source).toContain("CLOUDBASE_API_BASE_URL");
    expect(source).toContain("miniprogram");
  });
});
```

Create `apps/wechat-miniprogram/tests/auth-flow.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("WeChat auth pages", () => {
  it("implements only Mini Program auth artboards", () => {
    for (const page of ["intro", "phone", "loading"]) {
      const wxml = readFileSync(join(root, `miniprogram/pages/auth/${page}/${page}.wxml`), "utf8");
      const source = readFileSync(join(root, `miniprogram/pages/auth/${page}/${page}.ts`), "utf8");
      expect(wxml).toContain(`data-artboard="AuMini${page === "intro" ? "Intro" : page === "phone" ? "Phone" : "Loading"}"`);
      expect(source).not.toMatch(/Apple|Google|email/i);
    }
  });

  it("logs in with wx.login and phone authorization code", () => {
    const source = readFileSync(join(root, "miniprogram/pages/auth/phone/phone.ts"), "utf8");
    expect(source).toContain("wx.login");
    expect(source).toContain("getPhoneNumber");
    expect(source).toContain("loginWithWechatMiniProgram");
    expect(source).toContain("setStorageSync");
    expect(source).toContain("reLaunch");
  });
});
```

- [ ] **Step 2: Run the failing API/auth tests**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- api-client auth-flow
```

Expected: FAIL because WeChat transport wiring and auth pages are not implemented.

- [ ] **Step 3: Implement CloudBase client and WeChat-only auth**

Create `miniprogram/api/client.ts`:

```ts
import { createClient } from "@pouchie/api-client";
import { createWechatTransport, type WechatRuntime } from "@pouchie/api-client/wechat";
import { CLOUDBASE_API_BASE_URL } from "./config";

const ACCESS_TOKEN_KEY = "pouchie.wechat.accessToken";

export function createMiniProgramClient(wxRuntime: WechatRuntime) {
  return createClient({
    transport: createWechatTransport({
      baseUrl: CLOUDBASE_API_BASE_URL,
      runtime: wxRuntime,
      tokenProvider: {
        getAccessToken: () => Promise.resolve(wxRuntime.getStorageSync(ACCESS_TOKEN_KEY) || null),
        setAccessToken: (token: string) => Promise.resolve(wxRuntime.setStorageSync(ACCESS_TOKEN_KEY, token)),
        clearAccessToken: () => Promise.resolve(wxRuntime.removeStorageSync(ACCESS_TOKEN_KEY)),
      },
    }),
  });
}

export const pouchieClient = createMiniProgramClient(wx);
```

Implement auth intro, phone, and loading pages from `AuMiniIntro`, `AuMiniPhone`, and `AuMiniLoading`. The phone page must call `wx.login`, collect the phone authorization code from `getPhoneNumber`, call `pouchieClient.auth.loginWithWechatMiniProgram`, persist the returned token in WeChat storage, and `wx.reLaunch` to `pages/home/home`.

- [ ] **Step 4: Run API/auth verification**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- api-client auth-flow
pnpm --filter @pouchie/wechat-miniprogram typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit API/auth wiring**

```bash
git add apps/wechat-miniprogram/miniprogram/api apps/wechat-miniprogram/miniprogram/pages/auth apps/wechat-miniprogram/tests/api-client.test.ts apps/wechat-miniprogram/tests/auth-flow.test.ts
git commit -m "feat: wire wechat cloudbase auth"
```

## Task 3: Notebook Pages And Product Flows

- [ ] **Step 1: Write page payload, receipt, and settings tests**

Create `apps/wechat-miniprogram/tests/page-payloads.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("WeChat product page payloads", () => {
  it("forces CNY on every money-bearing Mini Program write", () => {
    const writePages = [
      "miniprogram/pages/add/add.ts",
      "miniprogram/subpackages/detail/pages/goals/detail/detail.ts",
      "miniprogram/subpackages/detail/pages/shared/detail/detail.ts",
    ];
    for (const page of writePages) {
      const source = readFileSync(join(root, page), "utf8");
      expect(source, page).toContain('currencyCode: "CNY"');
      expect(source, page).not.toMatch(/currencyPicker|CurrencySettings|USD|EUR|JPY/);
    }
  });

  it("binds product pages to CloudBase API client methods", () => {
    const source = [
      "miniprogram/pages/home/home.ts",
      "miniprogram/pages/add/add.ts",
      "miniprogram/pages/ledger/ledger.ts",
      "miniprogram/pages/reports/reports.ts",
    ].map((file) => readFileSync(join(root, file), "utf8")).join("\n");
    for (const method of ["dashboard.getHome", "transactions.create", "transactions.list", "reports.getSummary"]) {
      expect(source).toContain(method);
    }
  });
});
```

Create `apps/wechat-miniprogram/tests/receipt-upload.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(__dirname, "..", "miniprogram/pages/add/add.ts"), "utf8");

describe("WeChat receipt uploads", () => {
  it("uses WeChat media selection and upload APIs", () => {
    expect(source).toContain("wx.chooseMedia");
    expect(source).toContain("wx.uploadFile");
    expect(source).toContain("receipts.createUploadTarget");
    expect(source).toContain("receipts.attachToTransaction");
  });
});
```

Create `apps/wechat-miniprogram/tests/settings.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("WeChat settings", () => {
  it("implements data settings without a currency picker", () => {
    for (const page of ["categories", "accounts", "payment-methods", "budget", "tags"]) {
      expect(existsSync(join(root, `miniprogram/subpackages/settings/pages/${page}/${page}.ts`)), page).toBe(true);
    }
    const profile = readFileSync(join(root, "miniprogram/pages/profile/profile.ts"), "utf8");
    expect(profile).toContain("profile.export");
    expect(profile).toContain("profile.deleteAccount");
    expect(profile).toContain("auth.logout");
    expect(profile).toContain("clearStorageSync");
    expect(profile).not.toMatch(/currency picker|currencyPicker|settings\/currency/i);
  });
});
```

- [ ] **Step 2: Run the failing product-flow tests**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- page-payloads receipt-upload settings
```

Expected: FAIL because notebook pages, CNY payloads, receipt upload, and settings flows are not implemented.

- [ ] **Step 3: Implement notebook pages and product flows**

Implement notebook WXML/WXSS components under `components/` using values exported by `@pouchie/design-tokens`. Implement home, add, ledger, reports, profile, shared detail, transaction detail, and goal detail against `pouchieClient`. Every money-bearing request in Mini Program code must include `currencyCode: "CNY"` directly in the payload builder and must not render a currency picker. Implement receipt attachment through `wx.chooseMedia`, `pouchieClient.receipts.createUploadTarget`, `wx.uploadFile`, and `pouchieClient.receipts.attachToTransaction`.

- [ ] **Step 4: Run product-flow verification**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- page-payloads receipt-upload settings
pnpm --filter @pouchie/wechat-miniprogram typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit product flows**

```bash
git add apps/wechat-miniprogram/miniprogram/components apps/wechat-miniprogram/miniprogram/pages apps/wechat-miniprogram/miniprogram/subpackages apps/wechat-miniprogram/tests/page-payloads.test.ts apps/wechat-miniprogram/tests/receipt-upload.test.ts apps/wechat-miniprogram/tests/settings.test.ts
git commit -m "feat: implement wechat notebook product flows"
```

## Task 4: Prototype Fidelity Tests

- [ ] **Step 1: Write Mini Program prototype fidelity tests**

Create `apps/wechat-miniprogram/tests/prototype-screen-map.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ARTBOARDS } from "../../../scripts/prototype/artboards";

const wechatMap = [
  { artboardId: "AuMiniIntro", page: "pages/auth/intro/intro" },
  { artboardId: "AuMiniPhone", page: "pages/auth/phone/phone" },
  { artboardId: "AuMiniLoading", page: "pages/auth/loading/loading" },
  { artboardId: "NbHome", page: "pages/home/home" },
  { artboardId: "NbAdd", page: "pages/add/add" },
  { artboardId: "NbLedger", page: "pages/ledger/ledger" },
  { artboardId: "NbReports", page: "pages/reports/reports" },
  { artboardId: "NbShared", page: "subpackages/detail/pages/shared/detail/detail" },
  { artboardId: "NbDetail", page: "subpackages/detail/pages/transactions/detail/detail" },
  { artboardId: "NbGoal", page: "subpackages/detail/pages/goals/detail/detail" },
] as const;

describe("WeChat prototype screen map", () => {
  it("maps exactly the ten WeChat artboards", () => {
    const wechatArtboards = ARTBOARDS.filter((artboard) => artboard.platforms.includes("wechat"));
    expect(wechatMap.map((entry) => entry.artboardId).sort()).toEqual(wechatArtboards.map((artboard) => artboard.id).sort());
  });

  it("uses only masks outside notebook content", () => {
    for (const artboard of ARTBOARDS.filter((entry) => entry.platforms.includes("wechat"))) {
      expect(artboard.allowedMasks.every((mask) => mask.scope !== "notebook-content")).toBe(true);
    }
  });
});
```

Create `apps/wechat-miniprogram/tests/prototype-fidelity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PHONE_VIEWPORT_HEIGHT, PHONE_VIEWPORT_WIDTH, PIXEL_DIFF_THRESHOLD } from "../../../scripts/prototype/artboards";

describe("WeChat prototype fidelity contract", () => {
  it("uses the reference viewport and unmasked diff threshold", () => {
    expect(PHONE_VIEWPORT_WIDTH).toBe(402);
    expect(PHONE_VIEWPORT_HEIGHT).toBe(874);
    expect(PIXEL_DIFF_THRESHOLD).toBe(0.01);
  });
});
```

- [ ] **Step 2: Run the failing fidelity tests**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- prototype-screen-map prototype-fidelity
```

Expected: FAIL until the page map and fidelity contract are implemented.

- [ ] **Step 3: Implement Mini Program fidelity hooks**

Add `data-artboard` attributes to each page root WXML for the ten WeChat artboards. Ensure notebook sheet content is positioned in the same 402 x 874 reference viewport after WeChat status-bar and capsule offsets. Do not add masks for notebook content; use only the fixed masks already exported by `scripts/prototype/artboards.ts`.

- [ ] **Step 4: Run fidelity verification**

Run:

```bash
pnpm --filter @pouchie/wechat-miniprogram test -- prototype-screen-map prototype-fidelity
pnpm --filter @pouchie/wechat-miniprogram typecheck
```

Expected: both commands exit 0. Full WeChat Developer Tools screenshot comparison is executed by Child Plan 9 after baselines are captured.

- [ ] **Step 5: Commit Mini Program fidelity contract**

```bash
git add apps/wechat-miniprogram/miniprogram apps/wechat-miniprogram/tests/prototype-screen-map.test.ts apps/wechat-miniprogram/tests/prototype-fidelity.test.ts
git commit -m "test: lock wechat prototype fidelity contract"
```

## Verification Commands

```bash
pnpm --filter @pouchie/wechat-miniprogram test
pnpm --filter @pouchie/wechat-miniprogram typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- WeChat data is CloudBase-only and independent from Android/iOS data.
- Mini Program auth is WeChat-only.
- Main package and subpackage structure matches the page paths listed in this plan exactly.
- Every explicit Mini Program auth and product artboard passes 1:1 fidelity comparison.
