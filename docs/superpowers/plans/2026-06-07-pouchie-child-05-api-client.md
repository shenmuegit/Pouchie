# Pouchie Child Plan 5 API Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create one typed API client package with native and WeChat transport entry points.

**Architecture:** The root client uses `PRODUCT_ENDPOINTS` and exported schemas. Platform transports live behind subpath exports and receive token/runtime dependencies by injection.

**Tech Stack:** TypeScript, Vitest, `@pouchie/contracts`, package subpath exports.

---

## Preconditions

- Child Plan 1 has passed.
- Backends may be incomplete, but endpoint registry must be frozen.

## Files

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

## Task 1: Package Exports And Boundaries

- [ ] **Step 1: Write export boundary tests**

Create `packages/api-client/tests/exports.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");

describe("api-client exports", () => {
  it("declares root, native, and wechat subpath exports", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(Object.keys(pkg.exports).sort()).toEqual([".", "./native", "./wechat"]);
  });

  it("keeps root export platform neutral", () => {
    const rootSource = readFileSync(join(root, "src/index.ts"), "utf8");
    expect(rootSource).not.toContain("native-transport");
    expect(rootSource).not.toContain("wechat-transport");
    expect(rootSource).not.toContain("wx");
    expect(rootSource).not.toContain("react-native");
    expect(rootSource).not.toContain("expo");
  });

  it("maps workspace paths to the same subpath entry files", () => {
    const tsconfig = readFileSync(join(root, "../../tsconfig.base.json"), "utf8");
    expect(tsconfig).toContain('"@pouchie/api-client/native"');
    expect(tsconfig).toContain("packages/api-client/src/native.ts");
    expect(tsconfig).toContain('"@pouchie/api-client/wechat"');
    expect(tsconfig).toContain("packages/api-client/src/wechat.ts");
  });
});
```

- [ ] **Step 2: Run the failing export tests**

Run:

```bash
pnpm --filter @pouchie/api-client test -- exports
```

Expected: FAIL because `@pouchie/api-client` does not exist.

- [ ] **Step 3: Implement package exports**

Create `packages/api-client/package.json` with:

```json
{
  "name": "@pouchie/api-client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./native": "./src/native.ts",
    "./wechat": "./src/wechat.ts"
  },
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@pouchie/contracts": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^3.0.0"
  }
}
```

Create platform-neutral root exports in `src/index.ts`; export native transport only from `src/native.ts`; export WeChat runtime and transport only from `src/wechat.ts`.

- [ ] **Step 4: Run export verification**

Run:

```bash
pnpm --filter @pouchie/api-client test -- exports
pnpm --filter @pouchie/api-client typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit export boundaries**

```bash
git add packages/api-client/package.json packages/api-client/tsconfig.json packages/api-client/src/index.ts packages/api-client/src/native.ts packages/api-client/src/wechat.ts packages/api-client/tests/exports.test.ts tsconfig.base.json
git commit -m "feat: add api client package boundaries"
```

## Task 2: Transport And Token Provider

- [ ] **Step 1: Write transport tests**

Create `packages/api-client/tests/transport.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createNativeTransport } from "../src/native";
import { createWechatTransport } from "../src/wechat";

describe("api transports", () => {
  it("attaches bearer tokens through TokenProvider in native transport", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const transport = createNativeTransport({
      baseUrl: "https://api.example",
      fetch: fetchImpl,
      tokenProvider: { getAccessToken: async () => "token-1", setAccessToken: async () => {}, clearAccessToken: async () => {} },
    });

    await transport.request({ method: "GET", path: "/v1/dashboard" });

    expect(fetchImpl).toHaveBeenCalledWith("https://api.example/v1/dashboard", expect.objectContaining({
      headers: expect.objectContaining({ authorization: "Bearer token-1" }),
    }));
  });

  it("uses injected WeChat runtime without global wx", async () => {
    const runtime = { request: vi.fn((input) => input.success({ statusCode: 200, data: { ok: true } })), uploadFile: vi.fn() };
    const transport = createWechatTransport({
      baseUrl: "https://mini.example",
      runtime,
      tokenProvider: { getAccessToken: async () => undefined, setAccessToken: async () => {}, clearAccessToken: async () => {} },
    });

    await transport.request({ method: "GET", path: "/v1/dashboard" });

    expect(runtime.request).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the failing transport tests**

Run:

```bash
pnpm --filter @pouchie/api-client test -- transport
```

Expected: FAIL because transports and token provider interfaces do not exist.

- [ ] **Step 3: Implement transports and errors**

Create `token-provider.ts`, `transport.ts`, `errors.ts`, `native-transport.ts`, `wechat-runtime.ts`, and `wechat-transport.ts`. `ApiError` must include method, URL, status, code, and server message. Both transports attach bearer tokens from the injected provider; WeChat transport must not reference global `wx`.

- [ ] **Step 4: Run transport verification**

Run:

```bash
pnpm --filter @pouchie/api-client test -- transport
pnpm --filter @pouchie/api-client typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit transports**

```bash
git add packages/api-client/src/transport.ts packages/api-client/src/token-provider.ts packages/api-client/src/errors.ts packages/api-client/src/native-transport.ts packages/api-client/src/wechat-runtime.ts packages/api-client/src/wechat-transport.ts packages/api-client/src/native.ts packages/api-client/src/wechat.ts packages/api-client/tests/transport.test.ts
git commit -m "feat: add platform api transports"
```

## Task 3: Endpoint-Backed Client Methods

- [ ] **Step 1: Write endpoint coverage tests**

Create `packages/api-client/tests/create-client.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { OPERATIONAL_ENDPOINTS, PRODUCT_ENDPOINTS } from "@pouchie/contracts";
import { createClient } from "../src";

describe("createClient", () => {
  it("exposes a method for every app-facing product endpoint", () => {
    const client = createClient({ transport: { request: async () => ({ ok: true }) } });
    const methodKeys = client.__endpointKeysForTests().sort();
    expect(methodKeys).toEqual(PRODUCT_ENDPOINTS.map((endpoint) => endpoint.key).sort());
  });

  it("does not expose operational endpoints", () => {
    const client = createClient({ transport: { request: async () => ({ ok: true }) } });
    const methodKeys = client.__endpointKeysForTests();
    for (const endpoint of OPERATIONAL_ENDPOINTS) {
      expect(methodKeys).not.toContain(endpoint.key);
    }
  });
});
```

- [ ] **Step 2: Run the failing client coverage tests**

Run:

```bash
pnpm --filter @pouchie/api-client test -- create-client
```

Expected: FAIL because `createClient` does not cover every product endpoint.

- [ ] **Step 3: Implement endpoint-backed client**

Create `src/create-client.ts` where every client method is generated from or explicitly bound to `PRODUCT_ENDPOINTS`. Include methods for auth, dashboard, transactions, reports, categories, accounts, payment methods, tags, budgets, goals, deposits, shared ledgers, members, settlements, receipts, profile update, profile export, and account deletion. Keep `__endpointKeysForTests` exported only on the created client object for coverage verification.

- [ ] **Step 4: Run client verification**

Run:

```bash
pnpm --filter @pouchie/api-client test
pnpm --filter @pouchie/api-client typecheck
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit endpoint-backed client**

```bash
git add packages/api-client/src/create-client.ts packages/api-client/src/index.ts packages/api-client/tests/create-client.test.ts
git commit -m "feat: add endpoint backed api client"
```

## Verification Commands

```bash
pnpm --filter @pouchie/api-client test
pnpm --filter @pouchie/api-client typecheck
pnpm -r --if-present run typecheck
```

## Completion Criteria

- Root export is platform-neutral.
- Native and WeChat transports are isolated by subpath.
- Every app-facing product endpoint has a typed client method.
- Operational endpoints are absent from the app client.
