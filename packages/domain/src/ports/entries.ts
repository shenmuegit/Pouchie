import type {
  AnalyticsCategoryPoint,
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  AppleLoginRequest,
  AuthResponse,
  Category,
  CreateTransactionRequest,
  DashboardRecentTransactions,
  DashboardSummary,
  DevLoginRequest,
  GoogleLoginRequest,
  ListTransactionsQuery,
  ListTransactionsResponse,
  ProfileOverview,
  Transaction,
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

export interface AnalyticsInput extends AuthenticatedInput {
  query: AnalyticsQuery;
}

export interface AuthEntry {
  appleLogin: Entry<AppleLoginRequest, AuthResponse>;
  googleLogin: Entry<GoogleLoginRequest, AuthResponse>;
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
}

export interface AnalyticsEntry {
  summary: Entry<AnalyticsInput, AnalyticsSummary>;
  trend: Entry<AnalyticsInput, { items: AnalyticsTrendPoint[] }>;
  categories: Entry<AnalyticsInput, { items: AnalyticsCategoryPoint[] }>;
}

export interface ProfileEntry {
  overview: Entry<AuthenticatedInput, ProfileOverview>;
}

export interface AppEntries {
  auth: AuthEntry;
  dashboard: DashboardEntry;
  transaction: TransactionEntry;
  category: CategoryEntry;
  analytics: AnalyticsEntry;
  profile: ProfileEntry;
}
