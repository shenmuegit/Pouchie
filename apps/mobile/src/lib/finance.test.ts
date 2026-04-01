import { describe, expect, it } from "vitest";
import { buildCategoryBudgetUpdateItems, centsToYuanText, yuanTextToCents } from "./finance";

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
});

