import type { Category } from "@xiaohebao/contracts";
import * as Localization from "expo-localization";
import {
  localizeCategoryNameForLanguage,
  resolveCategoryLanguage
} from "./category-labels";

function currentLanguage(): "zh" | "en" {
  const locales = Localization.getLocales();
  if (locales.length > 0) {
    return resolveCategoryLanguage(locales);
  }

  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  return resolveCategoryLanguage([{ languageTag: locale }]);
}

export function localizeCategoryName(name: string): string {
  return localizeCategoryNameForLanguage(name, currentLanguage());
}

export function localizeCategory(category: Category): Category {
  return {
    ...category,
    name: localizeCategoryName(category.name)
  };
}
