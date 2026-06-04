import { describe, expect, it } from "vitest";
import {
  buildBudgetInsight,
  buildCategoryBudgetUpdateItems,
  buildQuickTransactionDraft,
  centsToYuanText,
  yuanTextToCents
} from "./finance";

describe("finance utils", () => {
  it("parses yuan text to cents", () => {
    expect(yuanTextToCents("12.34")).toBe(1234);
    expect(yuanTextToCents("x", 500)).toBe(500);
  });

  it("formats cents to compact yuan text", () => {
    expect(centsToYuanText(1000)).toBe("10");
    expect(centsToYuanText(1050)).toBe("10.50");
  });

  it("builds category budget payload from drafts", () => {
    const payload = buildCategoryBudgetUpdateItems(
      [
        {
          categoryId: "c1",
          categoryName: "餐饮",
          budgetCents: 1000,
          usedCents: 300,
          remainingCents: 700,
          progress: 30,
          isOverBudget: false
        }
      ],
      { c1: "20.5" }
    );
    expect(payload).toEqual([{ categoryId: "c1", budgetCents: 2050 }]);
  });

  it("builds quick transaction draft with category name as fallback", () => {
    const draft = buildQuickTransactionDraft({
      amountText: "18.5",
      categoryId: "food",
      categories: [{ id: "food", name: "餐饮" }],
      note: " 午餐 "
    });

    expect(draft).toEqual({
      ok: true,
      payload: {
        name: "餐饮",
        amountCents: 1850,
        categoryId: "food",
        note: "午餐"
      }
    });
  });

  it("rejects quick transaction draft without valid amount or category", () => {
    expect(
      buildQuickTransactionDraft({
        amountText: "0",
        categoryId: "food",
        categories: [{ id: "food", name: "餐饮" }]
      })
    ).toEqual({ ok: false, message: "请输入有效金额" });

    expect(
      buildQuickTransactionDraft({
        amountText: "12",
        categoryId: "",
        categories: []
      })
    ).toEqual({ ok: false, message: "请选择分类" });
  });

  it("builds budget insight for remaining, over-budget, and unset states", () => {
    expect(
      buildBudgetInsight({
        budgetTotalCents: 100000,
        budgetUsedCents: 32000,
        budgetProgress: 32
      })
    ).toEqual({
      tone: "normal",
      title: "预算剩余 ¥680",
      detail: "本月已用 32.0%"
    });

    expect(
      buildBudgetInsight({
        budgetTotalCents: 100000,
        budgetUsedCents: 112000,
        budgetProgress: 112
      })
    ).toEqual({
      tone: "danger",
      title: "已超预算 ¥120",
      detail: "本月已用 112.0%"
    });

    expect(
      buildBudgetInsight({
        budgetTotalCents: 0,
        budgetUsedCents: 0,
        budgetProgress: 0
      })
    ).toEqual({
      tone: "muted",
      title: "还未设置月预算",
      detail: "设置后首页会显示剩余额度"
    });
  });
});
