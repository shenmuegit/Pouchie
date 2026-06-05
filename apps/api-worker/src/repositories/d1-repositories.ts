import type {
  AnalyticsQuery,
  AnalyticsSummary,
  AnalyticsTrendPoint,
  CreateTransactionRequest,
  ListTransactionsQuery,
  TransactionType,
  UpdateTransactionRequest
} from "@xiaohebao/contracts";
import {
  DEFAULT_CATEGORIES,
  type AnalyticsRepository,
  type CategoryCreateInput,
  type CategoryRecord,
  type CategoryRepository,
  type CategoryUpdateInput,
  type SessionRecord,
  type SessionRepository,
  type TransactionRecord,
  type TransactionRepository,
  getDateKeyInShanghai,
  type UserRecord,
  type UserRepository
} from "@xiaohebao/domain";
import { nowIso, uuid } from "../utils";

type D1Bool = 0 | 1;

interface UserRow {
  id: string;
  apple_sub: string;
  google_sub: string | null;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
}

interface CategoryRow {
  id: string;
  user_id: string;
  type: TransactionType;
  name: string;
  icon: string;
  color: string;
  is_default: D1Bool;
  is_hidden: D1Bool;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface TransactionRow {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  amount_cents: number;
  category_id: string;
  category_name: string | null;
  note: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

function toBool(value: D1Bool): boolean {
  return value === 1;
}

function asD1Bool(value: boolean): D1Bool {
  return value ? 1 : 0;
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    appleSub: row.apple_sub,
    email: row.email,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSession(row: SessionRow): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    createdAt: row.created_at
  };
}

function mapCategory(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    isDefault: toBool(row.is_default),
    isHidden: toBool(row.is_hidden),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

function mapTransaction(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    amountCents: row.amount_cents,
    categoryId: row.category_id,
    categoryName: row.category_name ?? "未知分类",
    note: row.note,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

async function queryAll<T>(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await db.prepare(sql).bind(...params).all<T>();
  if (!result.success) {
    throw new Error(result.error ?? "D1 查询失败");
  }
  return result.results ?? [];
}

async function queryOne<T>(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const row = await db.prepare(sql).bind(...params).first<T>();
  return row ?? null;
}

async function execute(db: D1Database, sql: string, params: unknown[] = []): Promise<void> {
  const result = await db.prepare(sql).bind(...params).run();
  if (!result.success) {
    throw new Error(result.error ?? "D1 写入失败");
  }
}

function bucketFromDate(date: string, period: AnalyticsQuery["period"]): string {
  if (period === "day") return date;
  if (period === "week") {
    const input = new Date(`${date}T00:00:00.000+08:00`);
    const day = input.getDay() === 0 ? 7 : input.getDay();
    const monday = new Date(input.getTime() - (day - 1) * 24 * 60 * 60 * 1000);
    return getDateKeyInShanghai(monday);
  }
  if (period === "month") return date.slice(0, 7);
  return date.slice(0, 4);
}

export class D1UserRepository implements UserRepository {
  constructor(private readonly db: D1Database) {}

  async findById(userId: string): Promise<UserRecord | null> {
    const row = await queryOne<UserRow>(this.db, "SELECT * FROM users WHERE id = ?", [userId]);
    return row ? mapUser(row) : null;
  }

  async findByAppleSub(appleSub: string): Promise<UserRecord | null> {
    const row = await queryOne<UserRow>(this.db, "SELECT * FROM users WHERE apple_sub = ?", [
      appleSub
    ]);
    return row ? mapUser(row) : null;
  }

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    const row = await queryOne<UserRow>(this.db, "SELECT * FROM users WHERE google_sub = ?", [
      googleSub
    ]);
    return row ? mapUser(row) : null;
  }

  async create(input: {
    appleSub: string;
    googleSub?: string;
    email: string | null;
    displayName: string | null;
  }): Promise<UserRecord> {
    const id = uuid();
    const now = nowIso();
    await execute(
      this.db,
      `INSERT INTO users (id, apple_sub, google_sub, email, display_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.appleSub, input.googleSub ?? null, input.email, input.displayName, now, now]
    );
    const row = await this.findById(id);
    if (!row) throw new Error("用户创建失败");
    return row;
  }

  async updateProfile(
    userId: string,
    patch: {
      email?: string | null;
      displayName?: string | null;
    }
  ): Promise<UserRecord> {
    const current = await this.findById(userId);
    if (!current) throw new Error("用户不存在");
    const email = patch.email !== undefined ? patch.email : current.email;
    const displayName =
      patch.displayName !== undefined ? patch.displayName : current.displayName;
    const now = nowIso();
    await execute(
      this.db,
      "UPDATE users SET email = ?, display_name = ?, updated_at = ? WHERE id = ?",
      [email, displayName, now, userId]
    );
    const row = await this.findById(userId);
    if (!row) throw new Error("用户更新失败");
    return row;
  }
}

export class D1SessionRepository implements SessionRepository {
  constructor(private readonly db: D1Database) {}

  async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: string;
  }): Promise<SessionRecord> {
    const id = uuid();
    const createdAt = nowIso();
    await execute(
      this.db,
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, input.userId, input.tokenHash, input.expiresAt, createdAt]
    );
    const row = await queryOne<SessionRow>(this.db, "SELECT * FROM sessions WHERE id = ?", [
      id
    ]);
    if (!row) throw new Error("会话创建失败");
    return mapSession(row);
  }

  async findValidByTokenHash(
    tokenHash: string,
    now: string
  ): Promise<SessionRecord | null> {
    const row = await queryOne<SessionRow>(
      this.db,
      "SELECT * FROM sessions WHERE token_hash = ? AND expires_at > ?",
      [tokenHash, now]
    );
    return row ? mapSession(row) : null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await execute(this.db, "DELETE FROM sessions WHERE token_hash = ?", [tokenHash]);
  }
}

export class D1CategoryRepository implements CategoryRepository {
  constructor(private readonly db: D1Database) {}

  async ensureDefaultCategories(userId: string): Promise<void> {
    const now = nowIso();
    for (const preset of DEFAULT_CATEGORIES) {
      await execute(
        this.db,
        `INSERT OR IGNORE INTO categories (
          id, user_id, type, name, icon, color, is_default, is_hidden, created_at, updated_at, deleted_at
        ) VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, ?, NULL)`,
        [uuid(), userId, preset.type, preset.name, preset.icon, preset.color, now, now]
      );
    }
  }

  async listByUser(
    userId: string,
    options?: {
      type?: TransactionType;
      includeHidden?: boolean;
    }
  ): Promise<CategoryRecord[]> {
    let sql = "SELECT * FROM categories WHERE user_id = ? AND deleted_at IS NULL";
    const params: unknown[] = [userId];
    if (options?.type) {
      sql += " AND type = ?";
      params.push(options.type);
    }
    if (!options?.includeHidden) {
      sql += " AND is_hidden = 0";
    }
    sql += " ORDER BY created_at ASC";
    const rows = await queryAll<CategoryRow>(this.db, sql, params);
    return rows.map(mapCategory);
  }

  async findById(userId: string, categoryId: string): Promise<CategoryRecord | null> {
    const row = await queryOne<CategoryRow>(
      this.db,
      "SELECT * FROM categories WHERE user_id = ? AND id = ?",
      [userId, categoryId]
    );
    return row ? mapCategory(row) : null;
  }

  async create(userId: string, payload: CategoryCreateInput): Promise<CategoryRecord> {
    const id = uuid();
    const now = nowIso();
    await execute(
      this.db,
      `INSERT INTO categories (
        id, user_id, type, name, icon, color, is_default, is_hidden, created_at, updated_at, deleted_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, NULL)`,
      [id, userId, payload.type, payload.name, payload.icon, payload.color, now, now]
    );
    const row = await this.findById(userId, id);
    if (!row) throw new Error("分类创建失败");
    return row;
  }

  async update(
    userId: string,
    categoryId: string,
    patch: CategoryUpdateInput
  ): Promise<CategoryRecord | null> {
    const current = await this.findById(userId, categoryId);
    if (!current || current.deletedAt) return null;
    const now = nowIso();
    await execute(
      this.db,
      `UPDATE categories
       SET name = ?, icon = ?, color = ?, is_hidden = ?, updated_at = ?
       WHERE user_id = ? AND id = ?`,
      [
        patch.name ?? current.name,
        patch.icon ?? current.icon,
        patch.color ?? current.color,
        patch.isHidden === undefined ? asD1Bool(current.isHidden) : asD1Bool(patch.isHidden),
        now,
        userId,
        categoryId
      ]
    );
    return this.findById(userId, categoryId);
  }

  async softDelete(userId: string, categoryId: string, deletedAt: string): Promise<void> {
    await execute(
      this.db,
      "UPDATE categories SET deleted_at = ?, updated_at = ? WHERE user_id = ? AND id = ?",
      [deletedAt, deletedAt, userId, categoryId]
    );
  }

  async countByUser(userId: string): Promise<number> {
    const row = await queryOne<{ count: number }>(
      this.db,
      "SELECT COUNT(*) as count FROM categories WHERE user_id = ? AND deleted_at IS NULL",
      [userId]
    );
    return row?.count ?? 0;
  }
}

export class D1TransactionRepository implements TransactionRepository {
  constructor(private readonly db: D1Database) {}

  private async listRaw(userId: string): Promise<TransactionRow[]> {
    return queryAll<TransactionRow>(
      this.db,
      `SELECT t.*, c.name as category_name
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.deleted_at IS NULL`,
      [userId]
    );
  }

  async listByUser(userId: string, query: ListTransactionsQuery): Promise<TransactionRecord[]> {
    const rows = await this.listRaw(userId);
    return rows
      .filter((row) => {
        if (query.type && row.type !== query.type) return false;
        if (
          query.search &&
          !row.name.toLowerCase().includes(query.search.trim().toLowerCase())
        ) {
          return false;
        }
        const day = getDateKeyInShanghai(new Date(row.occurred_at));
        if (query.dateFrom && day < query.dateFrom) return false;
        if (query.dateTo && day > query.dateTo) return false;
        return true;
      })
      .sort((a, b) => (a.occurred_at < b.occurred_at ? 1 : -1))
      .map(mapTransaction);
  }

  async listRecent(userId: string, limit: number): Promise<TransactionRecord[]> {
    const rows = await queryAll<TransactionRow>(
      this.db,
      `SELECT t.*, c.name as category_name
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.deleted_at IS NULL
       ORDER BY t.occurred_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows.map(mapTransaction);
  }

  async findById(userId: string, transactionId: string): Promise<TransactionRecord | null> {
    const row = await queryOne<TransactionRow>(
      this.db,
      `SELECT t.*, c.name as category_name
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.id = ?`,
      [userId, transactionId]
    );
    return row ? mapTransaction(row) : null;
  }

  async create(
    userId: string,
    payload: CreateTransactionRequest
  ): Promise<TransactionRecord> {
    const id = uuid();
    const now = nowIso();
    await execute(
      this.db,
      `INSERT INTO transactions (
        id, user_id, name, type, amount_cents, category_id, note, occurred_at, created_at, updated_at, deleted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
      [
        id,
        userId,
        payload.name,
        payload.type,
        payload.amountCents,
        payload.categoryId,
        payload.note ?? null,
        payload.occurredAt,
        now,
        now
      ]
    );
    const row = await this.findById(userId, id);
    if (!row) throw new Error("账单创建失败");
    return row;
  }

  async update(
    userId: string,
    transactionId: string,
    patch: UpdateTransactionRequest
  ): Promise<TransactionRecord | null> {
    const current = await this.findById(userId, transactionId);
    if (!current || current.deletedAt) return null;
    const now = nowIso();
    await execute(
      this.db,
      `UPDATE transactions
       SET name = ?, type = ?, amount_cents = ?, category_id = ?, note = ?, occurred_at = ?, updated_at = ?
       WHERE user_id = ? AND id = ?`,
      [
        patch.name ?? current.name,
        patch.type ?? current.type,
        patch.amountCents ?? current.amountCents,
        patch.categoryId ?? current.categoryId,
        patch.note === undefined ? current.note : patch.note,
        patch.occurredAt ?? current.occurredAt,
        now,
        userId,
        transactionId
      ]
    );
    return this.findById(userId, transactionId);
  }

  async softDelete(userId: string, transactionId: string, deletedAt: string): Promise<void> {
    await execute(
      this.db,
      "UPDATE transactions SET deleted_at = ?, updated_at = ? WHERE user_id = ? AND id = ?",
      [deletedAt, deletedAt, userId, transactionId]
    );
  }

  async summarizeMonth(
    userId: string,
    month: string,
    todayDate: string
  ): Promise<{
    expenseCents: number;
    incomeCents: number;
    todayExpenseCents: number;
  }> {
    const rows = await this.listRaw(userId);
    let expenseCents = 0;
    let incomeCents = 0;
    let todayExpenseCents = 0;
    for (const row of rows) {
      const dateKey = getDateKeyInShanghai(new Date(row.occurred_at));
      if (!dateKey.startsWith(month)) continue;
      if (row.type === "expense") {
        expenseCents += row.amount_cents;
        if (dateKey === todayDate) {
          todayExpenseCents += row.amount_cents;
        }
      } else {
        incomeCents += row.amount_cents;
      }
    }
    return { expenseCents, incomeCents, todayExpenseCents };
  }

  async sumByCategoryForMonth(
    userId: string,
    month: string,
    type: TransactionType
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  > {
    const rows = await this.listRaw(userId);
    const map = new Map<string, { categoryName: string; amount: number }>();
    for (const row of rows) {
      const dateKey = getDateKeyInShanghai(new Date(row.occurred_at));
      if (!dateKey.startsWith(month) || row.type !== type) continue;
      const prev = map.get(row.category_id);
      if (!prev) {
        map.set(row.category_id, {
          categoryName: row.category_name ?? "未知分类",
          amount: row.amount_cents
        });
      } else {
        prev.amount += row.amount_cents;
      }
    }
    return [...map.entries()].map(([categoryId, value]) => ({
      categoryId,
      categoryName: value.categoryName,
      amountCents: value.amount
    }));
  }

  async countByUser(userId: string): Promise<number> {
    const row = await queryOne<{ count: number }>(
      this.db,
      "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND deleted_at IS NULL",
      [userId]
    );
    return row?.count ?? 0;
  }

  async countActiveDaysByUser(userId: string): Promise<number> {
    const rows = await queryAll<{ occurred_at: string }>(
      this.db,
      "SELECT occurred_at FROM transactions WHERE user_id = ? AND deleted_at IS NULL",
      [userId]
    );
    const set = new Set<string>();
    for (const row of rows) {
      set.add(getDateKeyInShanghai(new Date(row.occurred_at)));
    }
    return set.size;
  }
}

export class D1AnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly db: D1Database) {}

  private async listRaw(userId: string, query: AnalyticsQuery): Promise<TransactionRow[]> {
    const rows = await queryAll<TransactionRow>(
      this.db,
      `SELECT t.*, c.name as category_name
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.deleted_at IS NULL`,
      [userId]
    );
    return rows.filter((row) => {
      const day = getDateKeyInShanghai(new Date(row.occurred_at));
      if (query.dateFrom && day < query.dateFrom) return false;
      if (query.dateTo && day > query.dateTo) return false;
      return true;
    });
  }

  async getSummary(userId: string, query: AnalyticsQuery): Promise<AnalyticsSummary> {
    const rows = await this.listRaw(userId, query);
    const totalExpenseCents = rows
      .filter((x) => x.type === "expense")
      .reduce((sum, row) => sum + row.amount_cents, 0);
    const totalIncomeCents = rows
      .filter((x) => x.type === "income")
      .reduce((sum, row) => sum + row.amount_cents, 0);
    return {
      totalExpenseCents,
      totalIncomeCents,
      netCents: totalIncomeCents - totalExpenseCents
    };
  }

  async getTrend(userId: string, query: AnalyticsQuery): Promise<AnalyticsTrendPoint[]> {
    const rows = await this.listRaw(userId, query);
    const map = new Map<string, { expenseCents: number; incomeCents: number }>();
    for (const row of rows) {
      const day = getDateKeyInShanghai(new Date(row.occurred_at));
      const bucket = bucketFromDate(day, query.period);
      const current = map.get(bucket) ?? { expenseCents: 0, incomeCents: 0 };
      if (row.type === "expense") current.expenseCents += row.amount_cents;
      else current.incomeCents += row.amount_cents;
      map.set(bucket, current);
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([bucket, value]) => ({
        bucket,
        expenseCents: value.expenseCents,
        incomeCents: value.incomeCents
      }));
  }

  async getCategoryDistribution(
    userId: string,
    query: AnalyticsQuery
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      amountCents: number;
    }>
  > {
    const rows = (await this.listRaw(userId, query)).filter((x) => x.type === "expense");
    const map = new Map<string, { categoryName: string; amount: number }>();
    for (const row of rows) {
      const current = map.get(row.category_id) ?? {
        categoryName: row.category_name ?? "未知分类",
        amount: 0
      };
      current.amount += row.amount_cents;
      map.set(row.category_id, current);
    }
    return [...map.entries()].map(([categoryId, value]) => ({
      categoryId,
      categoryName: value.categoryName,
      amountCents: value.amount
    }));
  }
}
