# Pouchie Child Plan 9 Final Verification Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture final product documentation, create deterministic prototype baselines, run release verification, and remove non-deliverable planning/prototype paths.

**Architecture:** Final docs are generated from implemented code, prototype baselines are captured before prototype cleanup, final fidelity comparison reads only baseline manifest and PNGs, and scanner scripts enforce no hidden data or runtime drift.

**Tech Stack:** TypeScript, Bash, Playwright, pixelmatch, pngjs, tsx, Vitest, GitHub Actions, Cloudflare deployment scripts, CloudBase deployment scripts.

---

## Preconditions

- Child Plans 1, 2, 8, 3, 5, 6, 4, and 7 have passed in that execution order.
- `原型/` still exists before baseline capture.
- All runtime apps and backends are implemented.

## Files

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
- Create: `scripts/prototype/prototype-server.ts`
- Create: `scripts/prototype/capture-baselines.ts`
- Create: `scripts/prototype/compare-fidelity.ts`
- Create: `scripts/prototype/tests/prototype-fidelity-scripts.test.ts`
- Create: `scripts/scan-explicit-data.sh`
- Create: `scripts/deploy-cloudflare-staging.sh`
- Create: `scripts/healthcheck-cloudflare-staging.sh`
- Create: `scripts/deploy-cloudbase-staging.sh`
- Create: `scripts/healthcheck-cloudbase-staging.sh`
- Create: `scripts/clean-old-architecture.sh`
- Delete after capture: `packages/ui-tokens/`, `docs/superpowers/specs/`, `docs/superpowers/plans/`, `原型/`, and `archive/non-deliverable/`.

## Task 1: Prototype Fidelity Tooling

- [ ] **Step 1: Write prototype tooling tests**

Create `scripts/prototype/tests/prototype-fidelity-scripts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ARTBOARDS, PIXEL_DIFF_THRESHOLD } from "../artboards";

const root = join(__dirname, "..", "..", "..");

describe("prototype fidelity tooling", () => {
  it("keeps the artboard registry fixed at fourteen entries", () => {
    expect(ARTBOARDS).toHaveLength(14);
    expect(ARTBOARDS.filter((artboard) => artboard.platforms.includes("expo"))).toHaveLength(11);
    expect(ARTBOARDS.filter((artboard) => artboard.platforms.includes("wechat"))).toHaveLength(10);
    expect(PIXEL_DIFF_THRESHOLD).toBe(0.01);
  });

  it("creates capture and compare entry points", () => {
    for (const file of [
      "scripts/capture-prototype-baselines.sh",
      "scripts/compare-prototype-fidelity.sh",
      "scripts/prototype/prototype-server.ts",
      "scripts/prototype/capture-baselines.ts",
      "scripts/prototype/compare-fidelity.ts",
    ]) {
      expect(existsSync(join(root, file)), file).toBe(true);
    }
  });

  it("compare code reads only captured baselines and never the prototype directory", () => {
    const source = readFileSync(join(root, "scripts/prototype/compare-fidelity.ts"), "utf8");
    expect(source).toContain("docs/product/prototype-baselines/manifest.json");
    expect(source).not.toContain("原型/");
    expect(source).not.toContain("手账本.html");
    expect(source).not.toContain("手账本-登录注册.html");
  });

  it("prototype server rejects external browser requests", () => {
    const source = readFileSync(join(root, "scripts/prototype/prototype-server.ts"), "utf8");
    expect(source).toContain("request.url()");
    expect(source).toContain("http:");
    expect(source).toContain("https:");
    expect(source).toContain("abort");
  });
});
```

- [ ] **Step 2: Run the failing prototype tooling tests**

Run:

```bash
pnpm exec vitest scripts/prototype/tests/prototype-fidelity-scripts.test.ts
```

Expected: FAIL because final capture/compare tooling does not exist.

- [ ] **Step 3: Implement prototype capture and compare tooling**

Add root dev dependencies: `@babel/standalone`, `@playwright/test`, `pixelmatch`, `pngjs`, `tsx`, `vitest`, `react`, and `react-dom`; root `react` and `react-dom` versions must equal `apps/mobile/package.json`. Implement `scripts/prototype/prototype-server.ts` as a localhost-only renderer for `原型/手账本.html` and `原型/手账本-登录注册.html`; it must resolve React, ReactDOM, Babel, and font files from local workspace paths and abort every external `http:` or `https:` request. Implement `capture-baselines.ts` to write exactly the fourteen PNG names listed in this plan plus `manifest.json` containing artboard ids, viewport, mask data, PNG SHA-256 hashes, and `prototypeDataSha256` from `原型/app/data.jsx`. Implement `compare-fidelity.ts` so comparison reads only `docs/product/prototype-baselines/manifest.json` and PNG files.

- [ ] **Step 4: Run prototype tooling verification**

Run:

```bash
pnpm install
pnpm exec playwright install chromium
pnpm exec vitest scripts/prototype/tests/artboards.test.ts
pnpm exec vitest scripts/prototype/tests/prototype-fidelity-scripts.test.ts
bash scripts/capture-prototype-baselines.sh
bash scripts/compare-prototype-fidelity.sh
```

Expected: all commands exit 0, `docs/product/prototype-baselines/manifest.json` lists exactly fourteen PNG files, and both Expo and WeChat comparisons are at or below the fixed diff threshold.

- [ ] **Step 5: Commit prototype tooling**

```bash
git add package.json pnpm-lock.yaml scripts/capture-prototype-baselines.sh scripts/compare-prototype-fidelity.sh scripts/prototype docs/product/prototype-baselines
git commit -m "test: add final prototype fidelity tooling"
```

## Task 2: Final Product Docs

- [ ] **Step 1: Write product documentation tests**

Create `scripts/product-docs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");
const docs = [
  "docs/product/pouchie-screen-map.md",
  "docs/product/pouchie-data-model.md",
  "docs/product/pouchie-api-contract.md",
  "docs/product/pouchie-visual-language.md",
  "docs/product/pouchie-prototype-fidelity.md",
  "docs/product/pouchie-release-checklist.md",
];

describe("final product docs", () => {
  it("creates every product document", () => {
    for (const doc of docs) {
      expect(existsSync(join(root, doc)), doc).toBe(true);
    }
  });

  it("documents generated facts from deliverable code", () => {
    const screenMap = readFileSync(join(root, "docs/product/pouchie-screen-map.md"), "utf8");
    expect(screenMap).toContain("app/(app)/index.tsx");
    expect(screenMap).toContain("pages/home/home");

    const api = readFileSync(join(root, "docs/product/pouchie-api-contract.md"), "utf8");
    expect(api).toContain("PRODUCT_ENDPOINTS");
    expect(api).toContain("/v1/auth/wechat/login");
    expect(api).toContain("/v1/auth/apple/login");
  });

  it("keeps product docs free of prototype imports and old architecture claims", () => {
    for (const doc of docs) {
      const source = readFileSync(join(root, doc), "utf8");
      expect(source, doc).not.toContain("from \"../原型");
      expect(source, doc).not.toContain("@pouchie/api-worker");
      expect(source, doc).not.toContain("@pouchie/domain");
      expect(source, doc).not.toContain("@pouchie/ui-tokens");
    }
  });
});
```

- [ ] **Step 2: Run the failing product documentation tests**

Run:

```bash
pnpm exec vitest scripts/product-docs.test.ts
```

Expected: FAIL because final product docs have not been generated.

- [ ] **Step 3: Generate final product docs from implemented code**

Generate `docs/product/pouchie-screen-map.md` from Expo Router files and WeChat `app.json`; generate `pouchie-data-model.md` from contracts exports, Cloudflare D1 migrations, and CloudBase collection metadata; generate `pouchie-api-contract.md` from `PRODUCT_ENDPOINTS`, `OPERATIONAL_ENDPOINTS`, and exported schemas; generate `pouchie-visual-language.md` from `@pouchie/design-tokens`; generate `pouchie-prototype-fidelity.md` from baseline manifest and final screenshot comparison results; generate `pouchie-release-checklist.md` with final verification commands, deployment gates, and manual preview gates.

- [ ] **Step 4: Run product documentation verification**

Run:

```bash
pnpm exec vitest scripts/product-docs.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit product docs**

```bash
git add docs/product scripts/product-docs.test.ts readme.md PROJECT_GUIDE.md TESTING.md DEPLOY.md
git commit -m "docs: publish final pouchie product docs"
```

## Task 3: Explicit Data Scan And Cleanup

- [ ] **Step 1: Write explicit-data scan and cleanup tests**

Create `scripts/explicit-data-scan.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("explicit deliverable scan", () => {
  it("uses the exact deliverable path allow list", () => {
    const paths = readFileSync(join(root, "scripts/deliverable-paths.txt"), "utf8").trim().split(/\n/);
    expect(paths).toEqual([
      "apps/",
      "backends/",
      "packages/",
      "docs/",
      ".github/",
      "scripts/",
      "package.json",
      "pnpm-workspace.yaml",
      "pnpm-lock.yaml",
      "tsconfig.base.json",
      "readme.md",
      "PROJECT_GUIDE.md",
      "TESTING.md",
      "DEPLOY.md",
    ]);
  });

  it("defines blocked generated-data markers without spelling them as source text", () => {
    const source = readFileSync(join(root, "scripts/scan-explicit-data.sh"), "utf8");
    expect(source).toContain('join_token "fall" "back"');
    expect(source).toContain('join_token "mo" "ck"');
    expect(source).toContain('join_token "place" "holder"');
    expect(source).toContain('join_token "dum" "my"');
    expect(source).toContain('join_token "sam" "ple"');
    expect(source).toContain('join_token "de" "mo"');
    expect(source).toContain('join_token "兜" "底"');
  });

  it("runs scanner and cleanup scripts", () => {
    execFileSync("bash", ["scripts/scan-explicit-data.sh"], { cwd: root, stdio: "pipe" });
    execFileSync("bash", ["scripts/clean-old-architecture.sh", "--check"], { cwd: root, stdio: "pipe" });
  });

  it("proves non-deliverable paths are absent after cleanup", () => {
    for (const path of ["docs/superpowers/specs", "docs/superpowers/plans", "原型", "archive/non-deliverable"]) {
      expect(existsSync(join(root, path)), path).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run the failing explicit-data tests**

Run:

```bash
pnpm exec vitest scripts/explicit-data-scan.test.ts
```

Expected: FAIL because deliverable-path list, scanner script, cleanup script, and cleanup result are not complete.

- [ ] **Step 3: Implement scanner and cleanup**

Create `scripts/deliverable-paths.txt` with exactly the path list asserted by the test. Create `scripts/scan-explicit-data.sh` with `set -euo pipefail`, a `join_token()` helper, and a blocked-token array assembled from split parts so the script can detect generated-data markers without storing those markers as full source strings. The scanner must validate baseline PNG paths and SHA-256 hashes through `docs/product/prototype-baselines/manifest.json`, validate `PROTOTYPE_FIXTURE_SOURCE_SHA256` equals `manifest.json.prototypeDataSha256`, and reject prototype transaction, category, account, payment method, tag, shared-ledger, goal, or auth display values outside `apps/mobile/src/testing/prototype-fixtures.ts`, `apps/mobile/tests/`, `scripts/prototype/tests/`, and `docs/product/prototype-baselines/manifest.json`. Create `scripts/clean-old-architecture.sh` with normal mode and `--check`; normal mode deletes `packages/ui-tokens/`, `docs/superpowers/specs/`, `docs/superpowers/plans/`, `原型/`, and `archive/non-deliverable/`, while `--check` exits nonzero if any remains.

- [ ] **Step 4: Run explicit-data verification**

Run:

```bash
bash scripts/clean-old-architecture.sh
bash scripts/scan-explicit-data.sh
pnpm exec vitest scripts/explicit-data-scan.test.ts
test ! -e docs/superpowers/specs
test ! -e docs/superpowers/plans
test ! -e 原型
test ! -e archive/non-deliverable
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit scan and cleanup**

```bash
git add scripts/deliverable-paths.txt scripts/scan-explicit-data.sh scripts/clean-old-architecture.sh scripts/explicit-data-scan.test.ts docs/product apps/mobile/src/testing/prototype-fixtures.ts
git rm -r packages/ui-tokens docs/superpowers/specs docs/superpowers/plans 原型 archive/non-deliverable
git commit -m "chore: enforce explicit deliverables and cleanup"
```

## Task 4: Release Workflows And Verification

- [ ] **Step 1: Write release workflow tests**

Create `scripts/release-workflows.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..");

describe("release workflows", () => {
  it("creates CI and deploy workflows", () => {
    for (const file of [
      ".github/workflows/typecheck-test.yml",
      ".github/workflows/cloudflare-deploy.yml",
      ".github/workflows/cloudbase-deploy.yml",
    ]) {
      expect(existsSync(join(root, file)), file).toBe(true);
    }
  });

  it("runs final verification in documented order", () => {
    const source = readFileSync(join(root, "scripts/verify-all.sh"), "utf8");
    const expectedOrder = [
      "pnpm -r --if-present run typecheck",
      "pnpm -r --if-present run test",
      "bash scripts/capture-prototype-baselines.sh",
      "bash scripts/compare-prototype-fidelity.sh",
      "bash scripts/clean-old-architecture.sh",
      "bash scripts/scan-explicit-data.sh",
      "bash scripts/deploy-cloudflare-staging.sh",
      "bash scripts/healthcheck-cloudflare-staging.sh",
      "bash scripts/deploy-cloudbase-staging.sh",
      "bash scripts/healthcheck-cloudbase-staging.sh",
    ];
    let cursor = -1;
    for (const command of expectedOrder) {
      const index = source.indexOf(command);
      expect(index, command).toBeGreaterThan(cursor);
      cursor = index;
    }
  });
});
```

- [ ] **Step 2: Run the failing release workflow tests**

Run:

```bash
pnpm exec vitest scripts/release-workflows.test.ts
```

Expected: FAIL because final release workflows and verification script do not exist.

- [ ] **Step 3: Implement workflows and deploy scripts**

Create `.github/workflows/typecheck-test.yml` to run install, typecheck, and tests for all packages. Create `.github/workflows/cloudflare-deploy.yml` and `.github/workflows/cloudbase-deploy.yml` with explicit staging deploy jobs. Create `scripts/deploy-cloudflare-staging.sh`, `scripts/healthcheck-cloudflare-staging.sh`, `scripts/deploy-cloudbase-staging.sh`, and `scripts/healthcheck-cloudbase-staging.sh`; each script must require the relevant environment variables and fail on missing configuration. Create `scripts/verify-all.sh` to run the exact command order asserted by the test.

- [ ] **Step 4: Run release verification**

Run:

```bash
pnpm exec vitest scripts/release-workflows.test.ts
bash scripts/verify-all.sh
```

Expected: both commands exit 0 in staging-ready environments.

- [ ] **Step 5: Commit release workflows**

```bash
git add .github/workflows scripts/deploy-cloudflare-staging.sh scripts/healthcheck-cloudflare-staging.sh scripts/deploy-cloudbase-staging.sh scripts/healthcheck-cloudbase-staging.sh scripts/verify-all.sh scripts/release-workflows.test.ts docs/product/pouchie-release-checklist.md
git commit -m "ci: add final release verification workflows"
```

## Verification Commands

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

## Completion Criteria

- Final committed checkout has no `docs/superpowers/specs/`, `docs/superpowers/plans/`, `原型/`, or `archive/non-deliverable/`.
- Prototype compare reads only baselines and manifest after cleanup.
- Deliverable scan passes and reports blocked-token diagnostics.
- Cloudflare and CloudBase staging healthchecks pass.
- Expo and WeChat explicit artboards pass 1:1 fidelity comparison.
