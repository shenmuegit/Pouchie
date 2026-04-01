import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/create-app";
import { sha256Hex } from "../src/utils";

describe("api routes", () => {
  it("blocks protected endpoint without token", async () => {
    const app = createApiApp();
    const res = await app.request("http://localhost/v1/auth/me");
    expect(res.status).toBe(422);
  });

  it("supports dev login and authenticated me", async () => {
    const rawToken = "token-abc";
    const tokenHash = await sha256Hex(rawToken);
    const authUser = {
      id: "u1",
      appleSub: "dev:seed@example.com",
      email: "seed@example.com",
      displayName: "测试账号"
    };

    const app = createApiApp({
      buildEntries: (() => ({
        repos: {
          sessions: {
            findValidByTokenHash: async (hash: string) =>
              hash === tokenHash
                ? {
                    id: "s1",
                    userId: "u1",
                    tokenHash,
                    expiresAt: "2999-01-01T00:00:00.000Z",
                    createdAt: "2026-01-01T00:00:00.000Z"
                  }
                : null
          }
        },
        entries: {
          auth: {
            devLogin: {
              execute: async () => ({
                token: rawToken,
                expiresAt: "2999-01-01T00:00:00.000Z",
                user: authUser
              })
            },
            me: { execute: async () => authUser },
            appleLogin: { execute: async () => ({ token: "", expiresAt: "", user: authUser }) },
            logout: { execute: async () => ({ success: true as const }) }
          }
        }
      })) as any
    });

    const loginRes = await app.request("http://localhost/v1/auth/dev/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "seed@example.com",
        displayName: "测试账号"
      })
    });
    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as { token: string };
    expect(loginBody.token).toBe(rawToken);

    const meRes = await app.request("http://localhost/v1/auth/me", {
      headers: { Authorization: `Bearer ${rawToken}` }
    });
    expect(meRes.status).toBe(200);
    const meBody = (await meRes.json()) as { id: string };
    expect(meBody.id).toBe("u1");
  });

  it("routes transaction create with authenticated user", async () => {
    const rawToken = "token-create";
    const tokenHash = await sha256Hex(rawToken);
    let receivedUserId = "";
    let receivedName = "";

    const app = createApiApp({
      buildEntries: (() => ({
        repos: {
          sessions: {
            findValidByTokenHash: async () => ({
              id: "s1",
              userId: "u99",
              tokenHash,
              expiresAt: "2999-01-01T00:00:00.000Z",
              createdAt: "2026-01-01T00:00:00.000Z"
            })
          }
        },
        entries: {
          auth: {
            devLogin: { execute: async () => ({ token: rawToken, expiresAt: "", user: {} }) },
            me: { execute: async () => ({}) },
            appleLogin: { execute: async () => ({ token: "", expiresAt: "", user: {} }) },
            logout: { execute: async () => ({ success: true as const }) }
          },
          transaction: {
            create: {
              execute: async (input: any) => {
                receivedUserId = input.userId;
                receivedName = input.payload.name;
                return {
                  id: "tx1",
                  name: input.payload.name,
                  type: input.payload.type,
                  amountCents: input.payload.amountCents,
                  categoryId: input.payload.categoryId,
                  categoryName: "餐饮",
                  note: input.payload.note ?? null,
                  occurredAt: input.payload.occurredAt,
                  createdAt: "2026-01-01T00:00:00.000Z"
                };
              }
            }
          }
        }
      })) as any
    });

    const createRes = await app.request("http://localhost/v1/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${rawToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "午餐",
        amountCents: 3000,
        type: "expense",
        categoryId: "c1",
        occurredAt: "2026-03-25T10:00:00.000Z",
        note: "测试"
      })
    });

    expect(createRes.status).toBe(200);
    expect(receivedUserId).toBe("u99");
    expect(receivedName).toBe("午餐");
  });
});

