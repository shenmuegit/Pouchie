import type { Context } from "hono";
import { DomainError } from "@xiaohebao/domain";
import { apiErrorSchema } from "@xiaohebao/contracts";

export function nowIso(): string {
  return new Date().toISOString();
}

export function uuid(): string {
  return crypto.randomUUID();
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function readBearerToken(authHeader?: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim();
}

export function monthKeyFromDate(input: Date): string {
  const year = input.getUTCFullYear();
  const month = String(input.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function toErrorResponse(c: Context, error: unknown) {
  if (error instanceof DomainError) {
    return c.json(
      apiErrorSchema.parse({
        code: error.code,
        message: error.message
      }),
      error.status as 400
    );
  }

  const message = error instanceof Error ? error.message : "服务器内部错误";
  return c.json(
    apiErrorSchema.parse({
      code: "INTERNAL_ERROR",
      message
    }),
    500
  );
}

export function normalizeBooleanString(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

