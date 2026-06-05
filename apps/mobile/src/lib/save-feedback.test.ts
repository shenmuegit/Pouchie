import { describe, expect, it } from "vitest";
import { nextSaveFeedback } from "./save-feedback";

describe("save feedback state", () => {
  it("moves from idle to saving", () => {
    expect(nextSaveFeedback("idle", "start")).toEqual({
      state: "saving",
      message: "正在保存..."
    });
  });

  it("moves from saving to success", () => {
    expect(nextSaveFeedback("saving", "success")).toEqual({
      state: "success",
      message: "已记录"
    });
  });

  it("moves from saving to error", () => {
    expect(nextSaveFeedback("saving", "error")).toEqual({
      state: "error",
      message: "保存失败，请重试"
    });
  });
});
