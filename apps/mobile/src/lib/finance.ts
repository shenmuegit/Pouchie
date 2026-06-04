import type { CategoryBudget } from "@xiaohebao/contracts";

type QuickTransactionCategory = {
  id: string;
  name: string;
};

type QuickTransactionDraftInput = {
  amountText: string;
  categoryId: string;
  categories: QuickTransactionCategory[];
  note?: string;
};

type QuickTransactionDraftResult =
  | {
      ok: true;
      payload: {
        name: string;
        amountCents: number;
        categoryId: string;
        note: string | null;
      };
    }
  | {
      ok: false;
      message: string;
    };

type BudgetInsightInput = {
  budgetTotalCents: number;
  budgetUsedCents: number;
  budgetProgress: number;
};

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

export function buildQuickTransactionDraft(
  input: QuickTransactionDraftInput
): QuickTransactionDraftResult {
  const amountCents = yuanTextToCents(input.amountText);
  if (amountCents <= 0) {
    return { ok: false, message: "请输入有效金额" };
  }

  const category = input.categories.find((item) => item.id === input.categoryId);
  if (!category) {
    return { ok: false, message: "请选择分类" };
  }

  const note = input.note?.trim() || null;
  return {
    ok: true,
    payload: {
      name: category.name,
      amountCents,
      categoryId: category.id,
      note
    }
  };
}

export function buildBudgetInsight(input: BudgetInsightInput): {
  tone: "normal" | "danger" | "muted";
  title: string;
  detail: string;
} {
  if (input.budgetTotalCents <= 0) {
    return {
      tone: "muted",
      title: "还未设置月预算",
      detail: "设置后首页会显示剩余额度"
    };
  }

  const remainingCents = input.budgetTotalCents - input.budgetUsedCents;
  const progressText = input.budgetProgress.toFixed(1);
  if (remainingCents < 0) {
    return {
      tone: "danger",
      title: `已超预算 ${centsToYuanText(Math.abs(remainingCents)).replace(/^/, "¥")}`,
      detail: `本月已用 ${progressText}%`
    };
  }

  return {
    tone: "normal",
    title: `预算剩余 ${centsToYuanText(remainingCents).replace(/^/, "¥")}`,
    detail: `本月已用 ${progressText}%`
  };
}
