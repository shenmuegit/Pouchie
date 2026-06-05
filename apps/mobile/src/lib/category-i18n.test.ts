import { describe, expect, it } from "vitest";
import {
  localizeCategoryNameForLanguage,
  resolveCategoryLanguage
} from "./category-labels";

describe("category i18n", () => {
  it("localizes default category names", () => {
    expect(localizeCategoryNameForLanguage("餐饮", "en")).toBe("Food");
    expect(localizeCategoryNameForLanguage("工资", "en")).toBe("Salary");
    expect(localizeCategoryNameForLanguage("餐饮", "zh")).toBe("餐饮");
  });

  it("localizes previously stored English default category names", () => {
    expect(localizeCategoryNameForLanguage("Food", "zh")).toBe("餐饮");
    expect(localizeCategoryNameForLanguage("Salary", "zh")).toBe("工资");
    expect(localizeCategoryNameForLanguage("Food", "en")).toBe("Food");
  });

  it("keeps custom category names unchanged", () => {
    expect(localizeCategoryNameForLanguage("Coffee", "en")).toBe("Coffee");
  });

  it("resolves Chinese iOS locales to Chinese labels", () => {
    expect(resolveCategoryLanguage([{ languageCode: "zh", languageTag: "zh-Hans-CN" }])).toBe(
      "zh"
    );
    expect(resolveCategoryLanguage([{ languageTag: "zh-Hant-TW" }])).toBe("zh");
    expect(resolveCategoryLanguage([{ languageCode: "en", languageTag: "en-US" }])).toBe("en");
  });
});
