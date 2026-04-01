const env = (
  globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;

export const API_BASE_URL = env?.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8787";
