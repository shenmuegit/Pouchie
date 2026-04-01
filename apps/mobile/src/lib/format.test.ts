import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats cents to CNY string", () => {
    expect(formatMoney(123456)).toBe("¥1,234.56");
  });
});
