import { z } from "zod";

export const transactionTypeSchema = z.enum(["expense", "income"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const timePeriodSchema = z.enum(["day", "week", "month", "year"]);
export type TimePeriod = z.infer<typeof timePeriodSchema>;

export const currencySchema = z.literal("CNY");
export type Currency = z.infer<typeof currencySchema>;

export const moneyCentsSchema = z
  .number()
  .int()
  .min(-9_000_000_000_000)
  .max(9_000_000_000_000);

export const idSchema = z.string().min(1).max(128);
export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const isoDateTimeSchema = z.string().min(1);
export const dateSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/);

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(32),
  type: transactionTypeSchema,
  icon: z.string().min(1).max(32),
  color: z.string().min(1).max(32),
  isDefault: z.boolean(),
  isHidden: z.boolean(),
  createdAt: isoDateTimeSchema
});
export type Category = z.infer<typeof categorySchema>;

export const transactionSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(64),
  type: transactionTypeSchema,
  amountCents: moneyCentsSchema.positive(),
  categoryId: idSchema,
  categoryName: z.string().min(1).max(32),
  note: z.string().max(300).nullable(),
  occurredAt: isoDateTimeSchema,
  createdAt: isoDateTimeSchema
});
export type Transaction = z.infer<typeof transactionSchema>;

export const groupedTransactionsSchema = z.object({
  date: dateSchema,
  items: z.array(transactionSchema)
});
export type GroupedTransactions = z.infer<typeof groupedTransactionsSchema>;

export const userSchema = z.object({
  id: idSchema,
  appleSub: z.string().min(1),
  email: z.string().email().nullable(),
  displayName: z.string().min(1).max(64).nullable()
});
export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
  token: z.string().min(16),
  expiresAt: isoDateTimeSchema,
  user: userSchema
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const appleLoginRequestSchema = z.object({
  idToken: z.string().min(10),
  displayName: z.string().min(1).max(64).optional(),
  email: z.string().email().optional()
});
export type AppleLoginRequest = z.infer<typeof appleLoginRequestSchema>;

export const devLoginRequestSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(64)
});
export type DevLoginRequest = z.infer<typeof devLoginRequestSchema>;

export const dashboardSummarySchema = z.object({
  month: monthSchema,
  expenseCents: moneyCentsSchema.nonnegative(),
  incomeCents: moneyCentsSchema.nonnegative(),
  balanceCents: moneyCentsSchema,
  todayExpenseCents: moneyCentsSchema.nonnegative(),
  budgetTotalCents: moneyCentsSchema.nonnegative(),
  budgetUsedCents: moneyCentsSchema.nonnegative(),
  budgetProgress: z.number().min(0).max(100)
});
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

export const dashboardRecentTransactionsSchema = z.object({
  items: z.array(transactionSchema)
});
export type DashboardRecentTransactions = z.infer<
  typeof dashboardRecentTransactionsSchema
>;

export const listTransactionsQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
  search: z.string().max(64).optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
  groupBy: z.enum(["date"]).optional()
});
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;

export const listTransactionsResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  groups: z.array(groupedTransactionsSchema)
});
export type ListTransactionsResponse = z.infer<
  typeof listTransactionsResponseSchema
>;

export const createTransactionRequestSchema = z.object({
  name: z.string().min(1).max(64),
  amountCents: moneyCentsSchema.positive(),
  type: transactionTypeSchema,
  categoryId: idSchema,
  occurredAt: isoDateTimeSchema,
  note: z.string().max(300).optional().nullable()
});
export type CreateTransactionRequest = z.infer<
  typeof createTransactionRequestSchema
>;

export const updateTransactionRequestSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  amountCents: moneyCentsSchema.positive().optional(),
  type: transactionTypeSchema.optional(),
  categoryId: idSchema.optional(),
  occurredAt: isoDateTimeSchema.optional(),
  note: z.string().max(300).optional().nullable()
});
export type UpdateTransactionRequest = z.infer<
  typeof updateTransactionRequestSchema
>;

export const createCategoryRequestSchema = z.object({
  name: z.string().min(1).max(32),
  type: transactionTypeSchema,
  icon: z.string().min(1).max(32),
  color: z.string().min(1).max(32)
});
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;

export const updateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(32).optional(),
  icon: z.string().min(1).max(32).optional(),
  color: z.string().min(1).max(32).optional(),
  isHidden: z.boolean().optional()
});
export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;

export const monthlyBudgetSchema = z.object({
  month: monthSchema,
  totalCents: moneyCentsSchema.nonnegative(),
  usedCents: moneyCentsSchema.nonnegative(),
  remainingCents: moneyCentsSchema,
  progress: z.number().min(0)
});
export type MonthlyBudget = z.infer<typeof monthlyBudgetSchema>;

export const categoryBudgetSchema = z.object({
  categoryId: idSchema,
  categoryName: z.string().min(1).max(32),
  budgetCents: moneyCentsSchema.nonnegative(),
  usedCents: moneyCentsSchema.nonnegative(),
  remainingCents: moneyCentsSchema,
  progress: z.number().min(0),
  isOverBudget: z.boolean()
});
export type CategoryBudget = z.infer<typeof categoryBudgetSchema>;

export const updateMonthlyBudgetRequestSchema = z.object({
  month: monthSchema,
  totalCents: moneyCentsSchema.nonnegative()
});
export type UpdateMonthlyBudgetRequest = z.infer<
  typeof updateMonthlyBudgetRequestSchema
>;

export const upsertCategoryBudgetItemSchema = z.object({
  categoryId: idSchema,
  budgetCents: moneyCentsSchema.nonnegative()
});
export type UpsertCategoryBudgetItem = z.infer<
  typeof upsertCategoryBudgetItemSchema
>;

export const updateCategoryBudgetsRequestSchema = z.object({
  month: monthSchema,
  items: z.array(upsertCategoryBudgetItemSchema)
});
export type UpdateCategoryBudgetsRequest = z.infer<
  typeof updateCategoryBudgetsRequestSchema
>;

export const analyticsSummarySchema = z.object({
  totalExpenseCents: moneyCentsSchema.nonnegative(),
  totalIncomeCents: moneyCentsSchema.nonnegative(),
  netCents: moneyCentsSchema
});
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;

export const analyticsTrendPointSchema = z.object({
  bucket: z.string().min(1),
  expenseCents: moneyCentsSchema.nonnegative(),
  incomeCents: moneyCentsSchema.nonnegative()
});
export type AnalyticsTrendPoint = z.infer<typeof analyticsTrendPointSchema>;

export const analyticsCategoryPointSchema = z.object({
  categoryId: idSchema,
  categoryName: z.string().min(1).max(32),
  amountCents: moneyCentsSchema.nonnegative(),
  percentage: z.number().min(0).max(100)
});
export type AnalyticsCategoryPoint = z.infer<typeof analyticsCategoryPointSchema>;

export const analyticsQuerySchema = z.object({
  period: timePeriodSchema,
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional()
});
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

export const profilePreferencesSchema = z.object({
  faceIdEnabled: z.boolean(),
  defaultCurrency: currencySchema,
  notificationsEnabled: z.boolean(),
  iCloudSyncStatus: z.string().min(1),
  exportStatus: z.string().min(1)
});
export type ProfilePreferences = z.infer<typeof profilePreferencesSchema>;

export const patchProfilePreferencesRequestSchema = z.object({
  faceIdEnabled: z.boolean().optional(),
  defaultCurrency: currencySchema.optional(),
  notificationsEnabled: z.boolean().optional()
});
export type PatchProfilePreferencesRequest = z.infer<
  typeof patchProfilePreferencesRequestSchema
>;

export const profileOverviewSchema = z.object({
  user: userSchema,
  totalTransactions: z.number().int().nonnegative(),
  activeDays: z.number().int().nonnegative(),
  categoryCount: z.number().int().nonnegative(),
  preferences: profilePreferencesSchema
});
export type ProfileOverview = z.infer<typeof profileOverviewSchema>;

export const apiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1)
});
export type ApiError = z.infer<typeof apiErrorSchema>;

