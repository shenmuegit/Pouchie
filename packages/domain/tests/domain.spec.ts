import { describe, expect, it } from "vitest";
import { createAppEntries } from "../src/create-app-entries";
import type { DomainContext } from "../src/context";
import { FixedClock, FakeAuthProvider, createInMemoryRepos } from "./fakes";

function createTestContext(overrides?: Partial<DomainContext["config"]>) {
  const repos = createInMemoryRepos();
  const authProvider = new FakeAuthProvider();
  const clock = new FixedClock(new Date("2026-03-25T12:00:00.000Z"));
  const context: DomainContext = {
    repos,
    services: {
      authProvider,
      clock
    },
    config: {
      enableDevBypass: true,
      sessionTtlHours: 24 * 30,
      ...overrides
    }
  };
  return { context, repos, authProvider };
}

describe("domain entries", () => {
  it("交易记账与列表分组可用", async () => {
    const { context } = createTestContext();
    const entries = createAppEntries(context);

    const login = await entries.auth.devLogin.execute({
      email: "dev@example.com",
      displayName: "开发用户"
    });

    const categories = await entries.category.list.execute({
      userId: login.user.id,
      type: "expense"
    });
    const food = categories.items.find((x) => x.name === "餐饮");
    expect(food).toBeTruthy();

    const tx = await entries.transaction.create.execute({
      userId: login.user.id,
      payload: {
        name: "午餐",
        amountCents: 4500,
        type: "expense",
        categoryId: food!.id,
        occurredAt: "2026-03-25T11:20:00.000Z",
        note: "工作日"
      }
    });

    expect(tx.name).toBe("午餐");
    const list = await entries.transaction.list.execute({
      userId: login.user.id,
      query: { groupBy: "date" }
    });
    expect(list.total).toBe(1);
    expect(list.groups[0].items[0].id).toBe(tx.id);
  });

  it("预算超支计算正确", async () => {
    const { context } = createTestContext();
    const entries = createAppEntries(context);
    const login = await entries.auth.devLogin.execute({
      email: "budget@example.com",
      displayName: "预算用户"
    });
    const expenseCategories = await entries.category.list.execute({
      userId: login.user.id,
      type: "expense"
    });
    const shopping = expenseCategories.items.find((x) => x.name === "购物");
    expect(shopping).toBeTruthy();

    await entries.budget.updateMonthly.execute({
      userId: login.user.id,
      payload: {
        month: "2026-03",
        totalCents: 10000
      }
    });

    await entries.transaction.create.execute({
      userId: login.user.id,
      payload: {
        name: "耳机",
        amountCents: 12000,
        type: "expense",
        categoryId: shopping!.id,
        occurredAt: "2026-03-25T10:00:00.000Z"
      }
    });

    const monthly = await entries.budget.getMonthly.execute({
      userId: login.user.id,
      month: "2026-03"
    });

    expect(monthly.usedCents).toBe(12000);
    expect(monthly.remainingCents).toBe(-2000);
    expect(monthly.progress).toBeGreaterThan(100);
  });

  it("默认分类删除时转为隐藏", async () => {
    const { context } = createTestContext();
    const entries = createAppEntries(context);
    const login = await entries.auth.devLogin.execute({
      email: "category@example.com",
      displayName: "分类用户"
    });
    const categories = await entries.category.list.execute({
      userId: login.user.id,
      type: "expense"
    });
    const target = categories.items.find((x) => x.name === "餐饮");
    expect(target?.isDefault).toBe(true);

    await entries.category.remove.execute({
      userId: login.user.id,
      categoryId: target!.id
    });

    const withHidden = await entries.category.list.execute({
      userId: login.user.id,
      type: "expense",
      includeHidden: true
    });
    const hidden = withHidden.items.find((x) => x.id === target!.id);
    expect(hidden?.isHidden).toBe(true);
  });

  it("统计聚合可返回摘要、趋势与分类占比", async () => {
    const { context } = createTestContext();
    const entries = createAppEntries(context);
    const login = await entries.auth.devLogin.execute({
      email: "analytics@example.com",
      displayName: "统计用户"
    });
    const [expenseCategories, incomeCategories] = await Promise.all([
      entries.category.list.execute({ userId: login.user.id, type: "expense" }),
      entries.category.list.execute({ userId: login.user.id, type: "income" })
    ]);
    const food = expenseCategories.items.find((x) => x.name === "餐饮")!;
    const salary = incomeCategories.items.find((x) => x.name === "工资")!;

    await entries.transaction.create.execute({
      userId: login.user.id,
      payload: {
        name: "午饭",
        amountCents: 3000,
        type: "expense",
        categoryId: food.id,
        occurredAt: "2026-03-24T08:00:00.000Z"
      }
    });
    await entries.transaction.create.execute({
      userId: login.user.id,
      payload: {
        name: "工资",
        amountCents: 2500000,
        type: "income",
        categoryId: salary.id,
        occurredAt: "2026-03-24T09:00:00.000Z"
      }
    });

    const query = {
      period: "month" as const,
      dateFrom: "2026-03-01",
      dateTo: "2026-03-31"
    };
    const summary = await entries.analytics.summary.execute({
      userId: login.user.id,
      query
    });
    const trend = await entries.analytics.trend.execute({
      userId: login.user.id,
      query
    });
    const categories = await entries.analytics.categories.execute({
      userId: login.user.id,
      query
    });

    expect(summary.totalExpenseCents).toBe(3000);
    expect(summary.totalIncomeCents).toBe(2500000);
    expect(trend.items.length).toBe(1);
    expect(categories.items[0].percentage).toBe(100);
  });

  it("会话可登录并失效", async () => {
    const { context, repos } = createTestContext();
    const entries = createAppEntries(context);
    const login = await entries.auth.devLogin.execute({
      email: "session@example.com",
      displayName: "会话用户"
    });

    const created = repos.sessions.items[0];
    const validBefore = await repos.sessions.findValidByTokenHash(
      created.tokenHash,
      "2026-03-26T00:00:00.000Z"
    );
    expect(validBefore).toBeTruthy();

    await entries.auth.logout.execute({
      userId: login.user.id,
      tokenHash: created.tokenHash
    });
    const validAfter = await repos.sessions.findValidByTokenHash(
      created.tokenHash,
      "2026-03-26T00:00:00.000Z"
    );
    expect(validAfter).toBeNull();
  });
});

