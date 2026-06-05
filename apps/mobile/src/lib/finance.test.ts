import { describe, expect, it } from "vitest";
import {
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
});
