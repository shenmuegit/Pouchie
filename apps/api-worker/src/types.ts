export interface Env {
  DB: D1Database;
  ENABLE_DEV_BYPASS: string;
  SESSION_TTL_HOURS: string;
  APPLE_AUDIENCE: string;
  APPLE_ISSUER: string;
}

export interface AuthContext {
  userId: string;
  tokenHash: string;
}

