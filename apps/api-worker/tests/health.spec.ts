import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/create-app";

describe("api health", () => {
  it("returns health payload", async () => {
    const app = createApiApp();
    const res = await app.request("http://localhost/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });
});

