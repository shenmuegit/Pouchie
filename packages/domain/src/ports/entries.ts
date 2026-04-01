import type {
  AnalyticsCategoryPoint,
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  AppleLoginRequest,
  AuthResponse,
  Category,
  CategoryBudget,
  CreateCategoryRequest,
  CreateTransactionRequest,
  DashboardRecentTransactions,
  DashboardSummary,
  DevLoginRequest,
  ListTransactionsQuery,
  ListTransactionsResponse,
  MonthlyBudget,
  PatchProfilePreferencesRequest,
  ProfileOverview,
  ProfilePreferences,
  Transaction,
  UpdateCategoryBudgetsRequest,
  UpdateCategoryRequest,
  UpdateMonthlyBudgetRequest,
  UpdateTransactionRequest,
  User
} from "@xiaohebao/contracts";

export interface Entry<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface AuthenticatedInput {
  userId: string;
}

export interface LogoutInput extends AuthenticatedInput {
  tokenHash: string;
}

export interface GetDashboardSummaryInput extends AuthenticatedInput {
  month: string;
}

export interface ListTransactionsInput extends AuthenticatedInput {
  query: ListTransactionsQuery;
}

export interface GetCategoriesInput extends AuthenticatedInput {
  type?: "expense" | "income";
  includeHidden?: boolean;
}

export interface CreateTransactionInput extends AuthenticatedInput {
  payload: CreateTransactionRequest;
}

export interface UpdateTransactionInput extends AuthenticatedInput {
  transactionId: string;
  payload: UpdateTransactionRequest;
}

export interface DeleteTransactionInput extends AuthenticatedInput {
  transactionId: string;
}

export interface CreateCategoryInput extends AuthenticatedInput {
  payload: CreateCategoryRequest;
}

export interface UpdateCategoryInput extends AuthenticatedInput {
  categoryId: string;
  payload: UpdateCategoryRequest;
}

export interface DeleteCategoryInput extends AuthenticatedInput {
  categoryId: string;
}

export interface UpdateMonthlyBudgetInput extends AuthenticatedInput {
  payload: UpdateMonthlyBudgetRequest;
}

export interface UpdateCategoryBudgetsInput extends AuthenticatedInput {
  payload: UpdateCategoryBudgetsRequest;
}

export interface AnalyticsInput extends AuthenticatedInput {
  query: AnalyticsQuery;
}

export interface PatchProfileInput extends AuthenticatedInput {
  payload: PatchProfilePreferencesRequest;
}

export interface AuthEntry {
  appleLogin: Entry<AppleLoginRequest, AuthResponse>;
  devLogin: Entry<DevLoginRequest, AuthResponse>;
  logout: Entry<LogoutInput, { success: true }>;
  me: Entry<AuthenticatedInput, User>;
}

export interface DashboardEntry {
  summary: Entry<GetDashboardSummaryInput, DashboardSummary>;
  recentTransactions: Entry<AuthenticatedInput, DashboardRecentTransactions>;
}

export interface TransactionEntry {
  list: Entry<ListTransactionsInput, ListTransactionsResponse>;
  create: Entry<CreateTransactionInput, Transaction>;
  update: Entry<UpdateTransactionInput, Transaction>;
  remove: Entry<DeleteTransactionInput, { success: true }>;
}

export interface CategoryEntry {
  list: Entry<GetCategoriesInput, { items: Category[] }>;
  create: Entry<CreateCategoryInput, Category>;
  update: Entry<UpdateCategoryInput, Category>;
  remove: Entry<DeleteCategoryInput, { success: true }>;
}

export interface BudgetEntry {
  getMonthly: Entry<GetDashboardSummaryInput, MonthlyBudget>;
  updateMonthly: Entry<UpdateMonthlyBudgetInput, MonthlyBudget>;
  listCategoryBudgets: Entry<GetDashboardSummaryInput, { items: CategoryBudget[] }>;
  updateCategoryBudgets: Entry<UpdateCategoryBudgetsInput, { items: CategoryBudget[] }>;
}

export interface AnalyticsEntry {
  summary: Entry<AnalyticsInput, AnalyticsSummary>;
  trend: Entry<AnalyticsInput, { items: AnalyticsTrendPoint[] }>;
  categories: Entry<AnalyticsInput, { items: AnalyticsCategoryPoint[] }>;
}

export interface ProfileEntry {
  overview: Entry<AuthenticatedInput, ProfileOverview>;
  patchPreferences: Entry<PatchProfileInput, ProfilePreferences>;
}

export interface AppEntries {
  auth: AuthEntry;
  dashboard: DashboardEntry;
  transaction: TransactionEntry;
  category: CategoryEntry;
  budget: BudgetEntry;
  analytics: AnalyticsEntry;
  profile: ProfileEntry;
}

