import type {
  AuthResponse,
  Category,
  CreateTransactionRequest,
  DevLoginRequest,
  ListTransactionsResponse,
  ProfileOverview,
  Transaction,
  UpdateTransactionRequest
} from "@xiaohebao/contracts";
import { API_BASE_URL } from "./config";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query);
  const method = options.method ?? "GET";
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "网络请求失败";
    throw new Error(`API 连接失败：${method} ${url} - ${message}`);
  }
  if (!response.ok) {
    let message = "请求失败";
    try {
      const parsed = (await response.json()) as { message?: string };
      message = parsed.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(`请求失败：${method} ${url} (${response.status}) - ${message}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const apiClient = {
  auth: {
    devLogin(payload: DevLoginRequest) {
      return request<AuthResponse>("/v1/auth/dev/login", {
        method: "POST",
        body: payload
      });
    },
    appleLogin(payload: { idToken: string; email?: string; displayName?: string }) {
      return request<AuthResponse>("/v1/auth/apple/login", {
        method: "POST",
        body: payload
      });
    },
    googleLogin(payload: { idToken: string }) {
      return request<AuthResponse>("/v1/auth/google/login", {
        method: "POST",
        body: payload
      });
    },
    me(token: string) {
      return request<AuthResponse["user"]>("/v1/auth/me", { token });
    },
    logout(token: string) {
      return request<{ success: true }>("/v1/auth/logout", {
        method: "POST",
        token
      });
    }
  },
  transactions: {
    list(token: string, query: Record<string, string | undefined>) {
      return request<ListTransactionsResponse>("/v1/transactions", {
        token,
        query
      });
    },
    create(token: string, payload: CreateTransactionRequest) {
      return request<Transaction>("/v1/transactions", {
        method: "POST",
        token,
        body: payload
      });
    },
    update(token: string, id: string, payload: UpdateTransactionRequest) {
      return request<Transaction>(`/v1/transactions/${id}`, {
        method: "PATCH",
        token,
        body: payload
      });
    },
    remove(token: string, id: string) {
      return request<{ success: true }>(`/v1/transactions/${id}`, {
        method: "DELETE",
        token
      });
    }
  },
  categories: {
    list(token: string, params?: { type?: "expense" | "income"; includeHidden?: boolean }) {
      return request<{ items: Category[] }>("/v1/categories", {
        token,
        query: {
          type: params?.type,
          includeHidden: params?.includeHidden ? "true" : undefined
        }
      });
    }
  },
  profile: {
    overview(token: string) {
      return request<ProfileOverview>("/v1/profile/overview", { token });
    }
  }
};
