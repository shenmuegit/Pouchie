type CategoryLabel = { zh: string; en: string };

const DEFAULT_CATEGORY_LABELS: CategoryLabel[] = [
  { zh: "餐饮", en: "Food" },
  { zh: "交通", en: "Transport" },
  { zh: "购物", en: "Shopping" },
  { zh: "买菜", en: "Groceries" },
  { zh: "娱乐", en: "Entertainment" },
  { zh: "医疗", en: "Healthcare" },
  { zh: "学习", en: "Learning" },
  { zh: "居住", en: "Housing" },
  { zh: "通讯", en: "Mobile" },
  { zh: "其他", en: "Other" },
  { zh: "工资", en: "Salary" },
  { zh: "奖金", en: "Bonus" },
  { zh: "投资", en: "Investment" },
  { zh: "其他收入", en: "Other income" }
];

const CATEGORY_LABELS = DEFAULT_CATEGORY_LABELS.reduce<Record<string, CategoryLabel>>(
  (labels, item) => {
    labels[item.zh] = item;
    labels[item.en] = item;
    return labels;
  },
  {}
);

export type CategoryLanguage = "zh" | "en";

export function resolveCategoryLanguage(
  locales: Array<{ languageCode?: string | null; languageTag?: string | null }>
): CategoryLanguage {
  const primary = locales[0];
  const languageCode = primary?.languageCode?.toLowerCase();
  const languageTag = primary?.languageTag?.toLowerCase();

  if (languageCode === "zh" || languageTag?.startsWith("zh")) {
    return "zh";
  }

  return "en";
}

export function localizeCategoryNameForLanguage(
  name: string,
  language: CategoryLanguage
): string {
  return CATEGORY_LABELS[name]?.[language] ?? name;
}
