# Pouchie Child Plan 8 Design Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the shared visual-token contract and prototype artboard registry required by Expo and WeChat 1:1 prototype implementation.

**Architecture:** `@pouchie/design-tokens` exports exact colors, geometry, category tokens, font roles, and packaged font asset references. `scripts/prototype/artboards.ts` exports the single source of truth for explicit prototype artboards, platform routes, baseline file names, viewport geometry, allowed masks, and diff threshold before any UI child plan runs.

**Tech Stack:** TypeScript, Vitest, packaged OFL font assets, `@pouchie/contracts`, prototype registry tooling.

---

## Preconditions

- Child Plan 1 has passed.
- Prototype files exist under `原型/`.

## Files

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
- Create: `scripts/prototype/artboards.ts`
- Create: `scripts/prototype/tests/artboards.test.ts`

## Task 1: Exact Prototype Tokens

- [ ] **Step 1: Write prototype token tests**

Create `packages/design-tokens/tests/prototype-tokens.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { notebookTokens } from "../src";

describe("prototype notebook tokens", () => {
  it("exports exact colors from the prototype", () => {
    expect(notebookTokens.colors).toEqual({
      artboardBackground: "#e3dccb",
      appBackground: "#efe3cc",
      paper: "#fcf8ef",
      ink: "#43403a",
      mutedInk: "#a89e88",
      red: "oklch(0.58 0.19 25)",
      blue: "oklch(0.52 0.14 245)",
      green: "oklch(0.5 0.13 150)",
      tape: "oklch(0.86 0.09 75 / 0.5)",
      redMarginLine: "oklch(0.7 0.16 25 / 0.35)",
    });
  });

  it("exports the exact notebook line texture", () => {
    expect(notebookTokens.lineTexture).toBe("repeating-linear-gradient(transparent 0 31px, rgba(90,130,165,0.14) 31px 32px)");
  });
});
```

- [ ] **Step 2: Run the failing token tests**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- prototype-tokens
```

Expected: FAIL because `@pouchie/design-tokens` and `notebookTokens` do not exist.

- [ ] **Step 3: Implement exact token exports**

Create `packages/design-tokens/src/notebook.ts`:

```ts
export const notebookTokens = {
  colors: {
    artboardBackground: "#e3dccb",
    appBackground: "#efe3cc",
    paper: "#fcf8ef",
    ink: "#43403a",
    mutedInk: "#a89e88",
    red: "oklch(0.58 0.19 25)",
    blue: "oklch(0.52 0.14 245)",
    green: "oklch(0.5 0.13 150)",
    tape: "oklch(0.86 0.09 75 / 0.5)",
    redMarginLine: "oklch(0.7 0.16 25 / 0.35)",
  },
  lineTexture: "repeating-linear-gradient(transparent 0 31px, rgba(90,130,165,0.14) 31px 32px)",
} as const;
```

Export it from `packages/design-tokens/src/index.ts`.

- [ ] **Step 4: Run token verification**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- prototype-tokens
pnpm --filter @pouchie/design-tokens typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit prototype tokens**

```bash
git add packages/design-tokens/package.json packages/design-tokens/tsconfig.json packages/design-tokens/src/notebook.ts packages/design-tokens/src/index.ts packages/design-tokens/tests/prototype-tokens.test.ts
git commit -m "feat: add notebook prototype tokens"
```

## Task 2: Geometry And Auth Tokens

- [ ] **Step 1: Write geometry and auth token tests**

Extend `packages/design-tokens/tests/prototype-tokens.test.ts`:

```ts
import { authTokens, notebookGeometry } from "../src";

it("exports notebook geometry tokens", () => {
  expect(notebookGeometry).toMatchObject({
    sheetMargin: expect.any(Number),
    sheetRadius: expect.any(Number),
    redMarginX: expect.any(Number),
    bottomTabHeight: expect.any(Number),
    raisedAddButtonSize: expect.any(Number),
    keypadKeyHeight: expect.any(Number),
    doodleBorderWidth: expect.any(Number),
    tapeHeight: expect.any(Number),
  });
  expect(notebookGeometry.doodleIrregularRadius).toBeTruthy();
  expect(notebookGeometry.stickyNoteRotations.length).toBeGreaterThan(0);
});

it("exports exact auth tokens", () => {
  expect(authTokens).toMatchObject({
    brandCoinFill: "oklch(0.88 0.16 92)",
    fieldBackground: "#fffdf7",
    authButtonHeight: 52,
    authButtonIrregularRadius: "14px 12px 15px 12px",
    verificationCodeBoxRadius: "12px 10px 13px 11px",
    wechatGreen: "#07c160",
    miniProgramCapsule: { width: 78, height: 30 },
    miniProgramAuthSheetTopRadius: 18,
  });
});
```

- [ ] **Step 2: Run the failing geometry tests**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- prototype-tokens
```

Expected: FAIL until geometry and auth tokens are exported.

- [ ] **Step 3: Implement geometry and auth exports**

Add `notebookGeometry` and `authTokens` to `packages/design-tokens/src/notebook.ts`:

```ts
export const notebookGeometry = {
  sheetMargin: 12,
  sheetRadius: 18,
  redMarginX: 34,
  bottomTabHeight: 74,
  bottomTabOffset: 10,
  raisedAddButtonSize: 58,
  raisedAddButtonOffset: -18,
  keypadKeyHeight: 54,
  doodleBorderWidth: 2,
  doodleIrregularRadius: "18px 14px 20px 13px",
  tapeHeight: 24,
  stickyNoteRotations: [-2, 1.5, -1],
} as const;

export const authTokens = {
  brandCoinFill: "oklch(0.88 0.16 92)",
  fieldBackground: "#fffdf7",
  authButtonHeight: 52,
  authButtonIrregularRadius: "14px 12px 15px 12px",
  verificationCodeBoxRadius: "12px 10px 13px 11px",
  wechatGreen: "#07c160",
  miniProgramCapsule: { width: 78, height: 30 },
  miniProgramAuthSheetTopRadius: 18,
} as const;
```

- [ ] **Step 4: Run geometry verification**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- prototype-tokens
pnpm --filter @pouchie/design-tokens typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit geometry tokens**

```bash
git add packages/design-tokens/src/notebook.ts packages/design-tokens/src/index.ts packages/design-tokens/tests/prototype-tokens.test.ts
git commit -m "feat: add notebook geometry and auth tokens"
```

## Task 3: Fonts And Category Tokens

- [ ] **Step 1: Write font and category tests**

Create `packages/design-tokens/tests/fonts.test.ts`:

```ts
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FONT_ASSETS, fontRoles } from "../src";

const root = join(__dirname, "..");

describe("font assets", () => {
  it("uses packaged OFL fonts with stable hashes", () => {
    for (const asset of Object.values(FONT_ASSETS)) {
      const path = join(root, "assets/fonts", asset.fileName);
      expect(existsSync(path)).toBe(true);
      expect(asset.license).toBe("OFL-1.1");
      expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(asset.sha256);
    }
    expect(existsSync(join(root, "assets/fonts/OFL.txt"))).toBe(true);
  });

  it("maps every font role to a packaged asset", () => {
    expect(fontRoles.chineseHeading.asset).toBe("maShanZheng");
    expect(fontRoles.chineseBody.asset).toBe("zhiMangXing");
    expect(fontRoles.handwrittenNumerals.asset).toBe("caveat");
  });
});
```

Create `packages/design-tokens/tests/categories.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PREDEFINED_CATEGORIES } from "@pouchie/contracts";
import { categoryTokens } from "../src";

describe("category tokens", () => {
  it("resolves every category catalog token", () => {
    for (const category of PREDEFINED_CATEGORIES) {
      expect(categoryTokens).toHaveProperty(category.colorToken);
      expect(categoryTokens).toHaveProperty(category.iconToken);
    }
  });
});
```

- [ ] **Step 2: Run the failing font/category tests**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- fonts categories
```

Expected: FAIL because font assets and category tokens do not exist.

- [ ] **Step 3: Implement font and category exports**

Copy font files from `原型/assets/fonts/` into `packages/design-tokens/assets/fonts/`. Create `packages/design-tokens/src/fonts.ts` with `FONT_ASSETS` entries for `maShanZheng`, `zhiMangXing`, and `caveat`, including exact SHA-256 hashes computed from the copied files. Create `packages/design-tokens/src/categories.ts` where every catalog `colorToken` and `iconToken` resolves to a concrete value.

- [ ] **Step 4: Run font/category verification**

Run:

```bash
pnpm --filter @pouchie/design-tokens test -- fonts categories
pnpm --filter @pouchie/design-tokens typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit font and category tokens**

```bash
git add packages/design-tokens/assets/fonts packages/design-tokens/src/fonts.ts packages/design-tokens/src/categories.ts packages/design-tokens/src/index.ts packages/design-tokens/tests/fonts.test.ts packages/design-tokens/tests/categories.test.ts
git commit -m "feat: add packaged fonts and category tokens"
```

## Task 4: Prototype Artboard Registry

- [ ] **Step 1: Write artboard registry tests**

Create `scripts/prototype/tests/artboards.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ARTBOARDS, ARTBOARD_HEIGHT, ARTBOARD_WIDTH, PHONE_VIEWPORT_HEIGHT, PHONE_VIEWPORT_WIDTH, PIXEL_DIFF_THRESHOLD } from "../artboards";

describe("prototype artboard registry", () => {
  it("declares exact viewport geometry and threshold", () => {
    expect({ ARTBOARD_WIDTH, ARTBOARD_HEIGHT, PHONE_VIEWPORT_WIDTH, PHONE_VIEWPORT_HEIGHT, PIXEL_DIFF_THRESHOLD }).toEqual({
      ARTBOARD_WIDTH: 446,
      ARTBOARD_HEIGHT: 918,
      PHONE_VIEWPORT_WIDTH: 402,
      PHONE_VIEWPORT_HEIGHT: 874,
      PIXEL_DIFF_THRESHOLD: 0.01,
    });
  });

  it("contains exactly fourteen artboards with expected platform counts", () => {
    expect(ARTBOARDS).toHaveLength(14);
    expect(ARTBOARDS.filter((artboard) => artboard.platforms.includes("expo"))).toHaveLength(11);
    expect(ARTBOARDS.filter((artboard) => artboard.platforms.includes("wechat"))).toHaveLength(10);
  });

  it("has no duplicate ids, baseline files, or platform routes", () => {
    expect(new Set(ARTBOARDS.map((artboard) => artboard.id)).size).toBe(14);
    expect(new Set(ARTBOARDS.map((artboard) => artboard.baselineFile)).size).toBe(14);
    const routes = ARTBOARDS.flatMap((artboard) => [artboard.expoRoute, artboard.wechatRoute].filter(Boolean));
    expect(new Set(routes).size).toBe(routes.length);
  });
});
```

- [ ] **Step 2: Run the failing artboard tests**

Run:

```bash
pnpm exec vitest scripts/prototype/tests/artboards.test.ts
```

Expected: FAIL because `scripts/prototype/artboards.ts` does not exist.

- [ ] **Step 3: Implement artboard registry**

Create `scripts/prototype/artboards.ts` with exact constants and the fourteen artboard entries from the master plan: `NbHome`, `NbAdd`, `NbLedger`, `NbReports`, `NbShared`, `NbDetail`, `NbGoal`, `AuAppWelcome`, `AuAppRegister`, `AuAppLogin`, `AuAppVerify`, `AuMiniIntro`, `AuMiniPhone`, and `AuMiniLoading`. Export fixed masks only for OS safe area, status bar, and WeChat capsule; each mask must be outside the 402 x 874 notebook content viewport.

- [ ] **Step 4: Run artboard verification**

Run:

```bash
pnpm exec vitest scripts/prototype/tests/artboards.test.ts
pnpm -r --if-present run typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit artboard registry**

```bash
git add scripts/prototype/artboards.ts scripts/prototype/tests/artboards.test.ts
git commit -m "feat: add prototype artboard registry"
```

## Verification Commands

```bash
pnpm --filter @pouchie/design-tokens test
pnpm --filter @pouchie/design-tokens typecheck
pnpm --filter @pouchie/ui-tokens typecheck
pnpm exec vitest scripts/prototype/tests/artboards.test.ts
pnpm -r --if-present run typecheck
```

## Completion Criteria

- Every exact prototype token listed in this plan is exported without renamed, rounded, or substituted values.
- Font tests prove packaged font files exist and no remote font URL is referenced.
- Category token tests prove every catalog token resolves.
- `scripts/prototype/artboards.ts` exists before UI implementation and is the only source of truth for artboard ids, platform mappings, baseline names, masks, and diff threshold.
- `packages/ui-tokens/` remains unchanged for Child Plan 9 cleanup.
