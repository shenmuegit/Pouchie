import type { CategoryBudget } from "@xiaohebao/contracts";

export function yuanTextToCents(input: string, fallback = 0): number {
  const value = Number(input.trim());
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }
  return Math.round(value * 100);
}

export function centsToYuanText(cents: number): string {
  return (cents / 100).toFixed(2).replace(/\.00$/, "");
}

export function buildCategoryBudgetUpdateItems(
  items: CategoryBudget[],
  drafts: Record<string, string>
): Array<{ categoryId: string; budgetCents: number }> {
  return items.map((item) => {
    const draft = drafts[item.categoryId];
    return {
      categoryId: item.categoryId,
      budgetCents: yuanTextToCents(draft ?? "", item.budgetCents)
    };
  });
}

