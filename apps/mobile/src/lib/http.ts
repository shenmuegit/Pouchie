import type {
  AnalyticsCategoryPoint,
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  AuthResponse,
  Category,
  CategoryBudget,
  CreateCategoryRequest,
  CreateTransactionRequest,
  DashboardRecentTransactions,
  DashboardSummary,
  DevLoginRequest,
  ListTransactionsResponse,
  MonthlyBudget,
  PatchProfilePreferencesRequest,
  ProfileOverview,
  ProfilePreferences,
  Transaction,
  UpdateCategoryBudgetsRequest,
  UpdateCategoryRequest,
  UpdateMonthlyBudgetRequest,
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
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    let message = "请求失败";
    try {
      const parsed = (await response.json()) as { message?: string };
      message = parsed.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
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
  dashboard: {
    summary(token: string, month: string) {
      return request<DashboardSummary>("/v1/dashboard/summary", {
        token,
        query: { month }
      });
    },
    recent(token: string) {
      return request<DashboardRecentTransactions>("/v1/dashboard/recent-transactions", {
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
    },
    create(token: string, payload: CreateCategoryRequest) {
      return request<Category>("/v1/categories", {
        method: "POST",
        token,
        body: payload
      });
    },
    update(token: string, id: string, payload: UpdateCategoryRequest) {
      return request<Category>(`/v1/categories/${id}`, {
        method: "PATCH",
        token,
        body: payload
      });
    },
    remove(token: string, id: string) {
      return request<{ success: true }>(`/v1/categories/${id}`, {
        method: "DELETE",
        token
      });
    }
  },
  budgets: {
    monthly(token: string, month: string) {
      return request<MonthlyBudget>("/v1/budgets/monthly", {
        token,
        query: { month }
      });
    },
    updateMonthly(token: string, payload: UpdateMonthlyBudgetRequest) {
      return request<MonthlyBudget>("/v1/budgets/monthly", {
        method: "PUT",
        token,
        body: payload
      });
    },
    categoryList(token: string, month: string) {
      return request<{ items: CategoryBudget[] }>("/v1/budgets/categories", {
        token,
        query: { month }
      });
    },
    updateCategories(token: string, payload: UpdateCategoryBudgetsRequest) {
      return request<{ items: CategoryBudget[] }>("/v1/budgets/categories", {
        method: "PUT",
        token,
        body: payload
      });
    }
  },
  analytics: {
    summary(token: string, query: AnalyticsQuery) {
      return request<AnalyticsSummary>("/v1/analytics/summary", {
        token,
        query
      });
    },
    trend(token: string, query: AnalyticsQuery) {
      return request<{ items: AnalyticsTrendPoint[] }>("/v1/analytics/trend", {
        token,
        query
      });
    },
    categories(token: string, query: AnalyticsQuery) {
      return request<{ items: AnalyticsCategoryPoint[] }>("/v1/analytics/categories", {
        token,
        query
      });
    }
  },
  profile: {
    overview(token: string) {
      return request<ProfileOverview>("/v1/profile/overview", { token });
    },
    preferences(token: string) {
      return request<ProfilePreferences>("/v1/profile/preferences", { token });
    },
    patchPreferences(token: string, payload: PatchProfilePreferencesRequest) {
      return request<ProfilePreferences>("/v1/profile/preferences", {
        method: "PATCH",
        token,
        body: payload
      });
    }
  }
};

