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
