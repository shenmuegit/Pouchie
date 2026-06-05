# Accounting Focus Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize development login diagnostics and remove challenge/community UI from the mobile app.

**Architecture:** Keep the backend contracts and repositories intact for this phase. Change the mobile client boundary so request failures are self-describing, then remove challenge references from Expo routes, profile UI, and the mobile API client.

**Tech Stack:** Expo SDK 54, React Native 0.81, TanStack Query, Vitest, TypeScript.

---

### Task 1: Network Error Diagnostics

**Files:**
- Modify: `apps/mobile/src/lib/http.ts`
- Create: `apps/mobile/src/lib/http.test.ts`

- [ ] **Step 1: Write failing tests**

Add tests that mock `fetch` and assert:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./http";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("apiClient request errors", () => {
  it("includes method and URL when a network request fails", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("Network request timed out");
    }) as unknown as typeof fetch;

    await expect(
      apiClient.auth.devLogin({ email: "seed@example.com", displayName: "测试账号" })
    ).rejects.toThrow(
      "API 连接失败：POST http://127.0.0.1:8787/v1/auth/dev/login - Network request timed out"
    );
  });

  it("includes HTTP status and server message when the API rejects a request", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ message: "开发登录未启用" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      })
    ) as unknown as typeof fetch;

    await expect(
      apiClient.auth.devLogin({ email: "seed@example.com", displayName: "测试账号" })
    ).rejects.toThrow(
      "请求失败：POST http://127.0.0.1:8787/v1/auth/dev/login (403) - 开发登录未启用"
    );
  });
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `pnpm --filter @xiaohebao/mobile test -- src/lib/http.test.ts`

Expected: FAIL because the current request helper does not wrap errors with method, URL, or status.

- [ ] **Step 3: Implement the request helper changes**

Update `request()` in `apps/mobile/src/lib/http.ts` so it:

- Builds the URL once.
- Stores the method once.
- Wraps thrown fetch errors as `API 连接失败：METHOD URL - message`.
- Wraps non-2xx responses as `请求失败：METHOD URL (status) - serverMessage`.

- [ ] **Step 4: Run the focused tests and verify pass**

Run: `pnpm --filter @xiaohebao/mobile test -- src/lib/http.test.ts`

Expected: PASS.

### Task 2: Login Copy and Error Surface

**Files:**
- Modify: `apps/mobile/app/signin.tsx`

- [ ] **Step 1: Adjust dev login error handling**

Wrap `handleDevSignIn` in `catch` and show `Alert.alert("开发登录失败", message)`.

- [ ] **Step 2: Adjust pending copy**

Change the loading text from `正在验证身份...` to `正在连接开发服务...` for dev login, or use a `pendingLabel` state if Apple and dev login still need different wording.

### Task 3: Remove Mobile Challenge Surface

**Files:**
- Modify: `apps/mobile/app/_layout.tsx`
- Modify: `apps/mobile/app/(tabs)/profile.tsx`
- Modify: `apps/mobile/src/lib/http.ts`
- Delete: `apps/mobile/app/challenges.tsx`

- [ ] **Step 1: Remove stack route**

Delete `<Stack.Screen name="challenges" />` from the root layout.

- [ ] **Step 2: Remove profile challenge entry**

Delete the anonymous challenge `Pressable` from profile and remove unused imports/styles.

- [ ] **Step 3: Remove challenge client**

Delete `Challenge` import and `apiClient.challenges`.

- [ ] **Step 4: Delete challenge page**

Delete `apps/mobile/app/challenges.tsx`.

### Task 4: Verification

**Files:**
- Check: mobile package and TypeScript project.

- [ ] **Step 1: Run focused tests**

Run: `pnpm --filter @xiaohebao/mobile test`

Expected: all mobile tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm run typecheck`

Expected: all TypeScript projects pass.
