import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { z } from "zod";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { GlassChip } from "../../src/components/GlassChip";
import { GlassInput } from "../../src/components/GlassInput";
import { CategoryIcon } from "../../src/components/CategoryIcon";
import { MotionPressable, MotionView } from "../../src/components/Motion";
import { Page } from "../../src/components/Page";
import { localizeCategory } from "../../src/lib/category-i18n";
import { yuanTextToCents } from "../../src/lib/finance";
import { apiClient } from "../../src/lib/http";
import { motionScale, motionStagger } from "../../src/lib/motion";
import { nextSaveFeedback, type SaveFeedback } from "../../src/lib/save-feedback";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

const schema = z.object({
  amount: z
    .string()
    .min(1, "请输入金额")
    .refine((value) => yuanTextToCents(value) > 0, "请输入有效金额"),
  note: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function AddTransactionPage() {
  const token = useAuthStore((s) => s.token)!;
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [feedback, setFeedback] = useState<SaveFeedback>(() =>
    nextSaveFeedback("idle", "reset")
  );
  const client = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      note: ""
    }
  });
  const { width } = useWindowDimensions();

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => apiClient.categories.list(token, { type })
  });

  const categories = (categoriesQuery.data?.items ?? []).map(localizeCategory);
  const selectedCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
  const resolvedCategoryId = selectedCategory?.id ?? "";

  useEffect(() => {
    if (feedback.state !== "success") return;
    const timer = setTimeout(() => {
      setFeedback(nextSaveFeedback("success", "reset"));
    }, 1800);
    return () => clearTimeout(timer);
  }, [feedback.state]);

  const createMutation = useMutation({
    mutationFn: (values: {
      name: string;
      amountText: string;
      note?: string | null;
      categoryId: string;
      type: "expense" | "income";
    }) =>
      apiClient.transactions.create(token, {
        name: values.name,
        amountCents: yuanTextToCents(values.amountText),
        type: values.type,
        categoryId: values.categoryId,
        note: values.note || null,
        occurredAt: new Date().toISOString()
      }),
    onSuccess: async () => {
      form.reset();
      setCategoryId("");
      await client.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

  const submit = form.handleSubmit(async (values) => {
    if (!resolvedCategoryId || !selectedCategory) {
      Alert.alert("请选择分类");
      return;
    }
    setFeedback(nextSaveFeedback("idle", "start"));
    try {
      await createMutation.mutateAsync({
        name: selectedCategory.name,
        amountText: values.amount,
        note: values.note?.trim() || null,
        categoryId: resolvedCategoryId,
        type
      });
      setFeedback(nextSaveFeedback("saving", "success"));
    } catch (error) {
      setFeedback(nextSaveFeedback("saving", "error"));
      const message = error instanceof Error ? error.message : "保存失败，请重试";
      Alert.alert("保存失败", message);
    }
  });

  const quickAmounts = useMemo(() => [10, 30, 50, 100, 200], []);
  const categoryLayout = useMemo(() => {
    const horizontalPagePadding = theme.spacing.lg * 2;
    const cardPadding = theme.spacing.lg * 2;
    const availableWidth = Math.max(220, width - horizontalPagePadding - cardPadding);
    const columns = Math.max(4, Math.min(6, Math.floor(availableWidth / 54)));
    const columnWidth = Math.floor(availableWidth / columns);
    const tileSize = Math.max(48, Math.min(60, columnWidth - theme.spacing.xs));
    return { columnWidth, tileSize };
  }, [width]);

  const switchType = (nextType: "expense" | "income") => {
    setType(nextType);
    setCategoryId("");
  };

  const selectCategory = (nextCategory: (typeof categories)[number]) => {
    setCategoryId(nextCategory.id);
  };

  return (
    <Page title="记一笔" subtitle="金额、分类、备注">
      <MotionView>
        <GlassCard style={styles.quickEntryCard}>
        <View style={styles.quickHeader}>
          <View>
            <Text style={styles.quickTitle}>{type === "expense" ? "支出" : "收入"}</Text>
            <Text style={styles.quickHint}>分类用于归档，备注记录具体细节</Text>
          </View>
          <View style={styles.typeRow}>
            <GlassChip label="支出" selected={type === "expense"} onPress={() => switchType("expense")} />
            <GlassChip label="收入" selected={type === "income"} onPress={() => switchType("income")} />
          </View>
        </View>

        <Text style={styles.label}>金额</Text>
        <Controller
          control={form.control}
          name="amount"
          render={({ field }) => (
            <GlassInput
              keyboardType="decimal-pad"
              placeholder="0.00"
              value={field.value}
              onChangeText={field.onChange}
              style={styles.amountInput}
            />
          )}
        />
        <View style={styles.quickRow}>
          {quickAmounts.map((amount) => (
            <MotionPressable
              key={amount}
              contentStyle={styles.quickBtn}
              onPress={() => form.setValue("amount", String(amount))}
            >
              <Text style={styles.quickText}>¥{amount}</Text>
            </MotionPressable>
          ))}
        </View>

        <Text style={styles.label}>分类</Text>
        <View style={styles.categoryGrid}>
          {categories.map((item, index) => (
            <MotionPressable
              key={item.id}
              scaleTo={motionScale.category}
              accessibilityRole="button"
              accessibilityLabel={item.name}
              style={[styles.categoryColumn, { width: categoryLayout.columnWidth }]}
              contentStyle={[
                styles.categoryTile,
                {
                  width: categoryLayout.tileSize,
                  height: categoryLayout.tileSize,
                  borderRadius: categoryLayout.tileSize / 2
                },
                resolvedCategoryId === item.id ? styles.categoryTileSelected : null
              ]}
              onPress={() => selectCategory(item)}
            >
              <MotionView delay={index * motionStagger.icon} distance={6}>
                <CategoryIcon
                  name={item.icon}
                  color={
                    resolvedCategoryId === item.id ? theme.colors.accentBlue : item.color
                  }
                  size={26}
                />
              </MotionView>
            </MotionPressable>
          ))}
        </View>

        <Text style={styles.label}>备注</Text>
        <Controller
          control={form.control}
          name="note"
          render={({ field }) => (
            <GlassInput
              placeholder="可选备注"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <GlassButton
          label={feedback.state === "saving" || createMutation.isPending ? "保存中..." : "保存"}
          onPress={submit}
          disabled={createMutation.isPending}
        />
        {feedback.message ? (
          <MotionView distance={4} style={styles.feedback}>
            <Text
              style={[
                styles.feedbackText,
                feedback.state === "error" ? styles.feedbackError : null
              ]}
            >
              {feedback.message}
            </Text>
          </MotionView>
        ) : null}
        </GlassCard>
      </MotionView>
    </Page>
  );
}

const styles = StyleSheet.create({
  typeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  quickEntryCard: {
    gap: theme.spacing.sm
  },
  quickHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  quickTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary
  },
  amountInput: {
    fontSize: 28,
    fontWeight: "800"
  },
  quickRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    gap: theme.spacing.xs,
    flexWrap: "wrap"
  },
  quickBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.68)"
  },
  quickText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSecondary
  },
  quickHint: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: theme.spacing.md
  },
  categoryColumn: {
    alignItems: "center"
  },
  categoryTile: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)"
  },
  categoryTileSelected: {
    borderColor: theme.colors.accentBlue,
    backgroundColor: "rgba(73,145,255,0.18)"
  },
  feedback: {
    alignItems: "center",
    paddingTop: theme.spacing.xs
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.accentGreen
  },
  feedbackError: {
    color: theme.colors.accentRed
  }
});
