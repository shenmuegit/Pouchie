import type {
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  Category,
  CreateTransactionRequest,
  ListTransactionsQuery,
  Transaction,
  TransactionType,
  UpdateTransactionRequest,
  User
} from "@xiaohebao/contracts";

export interface UserRecord extends User {
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

export interface CategoryRecord extends Category {
  userId: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type CategoryCreateInput = {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
};

export type CategoryUpdateInput = {
  name?: string;
  icon?: string;
  color?: string;
  isHidden?: boolean;
};

export interface TransactionRecord extends Transaction {
  userId: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserRepository {
  findById(userId: string): Promise<UserRecord | null>;
  findByAppleSub(appleSub: string): Promise<UserRecord | null>;
  findByGoogleSub(googleSub: string): Promise<UserRecord | null>;
  create(input: {
    appleSub: string;
    googleSub?: string;
    email: string | null;
    displayName: string | null;
  }): Promise<UserRecord>;
  updateProfile(
    userId: string,
    patch: {
      email?: string | null;
      displayName?: string | null;
    }
  ): Promise<UserRecord>;
}

export interface SessionRepository {
  create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: string;
  }): Promise<SessionRecord>;
  findValidByTokenHash(
    tokenHash: string,
    nowIso: string
  ): Promise<SessionRecord | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
}

export interface CategoryRepository {
  ensureDefaultCategories(userId: string): Promise<void>;
  listByUser(
    userId: string,
    options?: {
      type?: TransactionType;
      includeHidden?: boolean;
    }
  ): Promise<CategoryRecord[]>;
  findById(userId: string, categoryId: string): Promise<CategoryRecord | null>;
  create(userId: string, payload: CategoryCreateInput): Promise<CategoryRecord>;
  update(
    userId: string,
    categoryId: string,
    patch: CategoryUpdateInput
  ): Promise<CategoryRecord | null>;
  softDelete(userId: string, categoryId: string, deletedAt: string): Promise<void>;
  countByUser(userId: string): Promise<number>;
}

export interface TransactionRepository {
  listByUser(
    userId: string,
    query: ListTransactionsQuery
  ): Promise<TransactionRecord[]>;
  listRecent(userId: string, limit: number): Promise<TransactionRecord[]>;
  findById(userId: string, transactionId: string): Promise<TransactionRecord | null>;
  create(
    userId: string,
    payload: CreateTransactionRequest
  ): Promise<TransactionRecord>;
  update(
    userId: string,
    transactionId: string,
    patch: UpdateTransactionRequest
  ): Promise<TransactionRecord | null>;
  softDelete(
    userId: string,
    transactionId: string,
    deletedAt: string
  ): Promise<void>;
  summarizeMonth(userId: string, month: string, todayDate: string): Promise<{
    expenseCents: number;
    incomeCents: number;
    todayExpenseCents: number;
  }>;
  sumByCategoryForMonth(
    userId: string,
    month: string,
    type: TransactionType
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  >;
  countByUser(userId: string): Promise<number>;
  countActiveDaysByUser(userId: string): Promise<number>;
}

export interface AnalyticsRepository {
  getSummary(userId: string, query: AnalyticsQuery): Promise<AnalyticsSummary>;
  getTrend(
    userId: string,
    query: AnalyticsQuery
  ): Promise<AnalyticsTrendPoint[]>;
  getCategoryDistribution(
    userId: string,
    query: AnalyticsQuery
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  >;
}
