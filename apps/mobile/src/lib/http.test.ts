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
