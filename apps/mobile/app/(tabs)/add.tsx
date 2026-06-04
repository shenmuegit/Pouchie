import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { GlassChip } from "../../src/components/GlassChip";
import { GlassInput } from "../../src/components/GlassInput";
import { Page } from "../../src/components/Page";
import { buildQuickTransactionDraft, yuanTextToCents } from "../../src/lib/finance";
import { apiClient } from "../../src/lib/http";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

const schema = z.object({
  name: z.string().min(1, "请输入账单名称"),
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
  const [quickAmount, setQuickAmount] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const client = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      amount: "",
      note: ""
    }
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => apiClient.categories.list(token, { type })
  });

  const categories = categoriesQuery.data?.items ?? [];
  const selectedCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
  const resolvedCategoryId = selectedCategory?.id ?? "";

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
      setQuickAmount("");
      setQuickNote("");
      await client.invalidateQueries({ queryKey: ["transactions"] });
      await client.invalidateQueries({ queryKey: ["dashboard-summary"] });
      await client.invalidateQueries({ queryKey: ["dashboard-recent"] });
      await client.invalidateQueries({ queryKey: ["analytics"] });
      await client.invalidateQueries({ queryKey: ["budgets"] });
      Alert.alert("保存成功", "账单已记录");
    }
  });

  const submit = form.handleSubmit(async (values) => {
    if (!resolvedCategoryId) {
      Alert.alert("请选择分类");
      return;
    }
    await createMutation.mutateAsync({
      name: values.name,
      amountText: values.amount,
      note: values.note,
      categoryId: resolvedCategoryId,
      type
    });
  });

  const quickAmounts = useMemo(() => [10, 30, 50, 100, 200], []);

  const switchType = (nextType: "expense" | "income") => {
    setType(nextType);
    setCategoryId("");
  };

  const submitQuick = async () => {
    const draft = buildQuickTransactionDraft({
      amountText: quickAmount,
      categoryId: resolvedCategoryId,
      categories,
      note: quickNote
    });
    if (!draft.ok) {
      Alert.alert(draft.message);
      return;
    }
    await createMutation.mutateAsync({
      ...draft.payload,
      amountText: quickAmount,
      type
    });
  };

  return (
    <Page title="快速记账" subtitle="金额、分类、保存，少一步算一步">
      <GlassCard>
        <View style={styles.typeRow}>
          <GlassChip label="支出" selected={type === "expense"} onPress={() => switchType("expense")} />
          <GlassChip label="收入" selected={type === "income"} onPress={() => switchType("income")} />
        </View>
      </GlassCard>

      <GlassCard style={styles.quickEntryCard}>
        <View style={styles.quickHeader}>
          <View>
            <Text style={styles.quickTitle}>极速录入</Text>
            <Text style={styles.quickHint}>默认用分类名作为账单名</Text>
          </View>
          <Text style={styles.quickType}>{type === "expense" ? "支出" : "收入"}</Text>
        </View>
        <Text style={styles.label}>金额</Text>
        <GlassInput
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={quickAmount}
          onChangeText={setQuickAmount}
          style={styles.amountInput}
        />
        <View style={styles.quickRow}>
          {quickAmounts.map((amount) => (
            <Pressable
              key={amount}
              style={styles.quickBtn}
              onPress={() => setQuickAmount(String(amount))}
            >
              <Text style={styles.quickText}>¥{amount}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>分类</Text>
        <View style={styles.categoryGrid}>
          {categories.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.categoryTile,
                resolvedCategoryId === item.id ? styles.categoryTileSelected : null
              ]}
              onPress={() => setCategoryId(item.id)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>备注</Text>
        <GlassInput
          placeholder="可选，例如：和朋友午餐"
          value={quickNote}
          onChangeText={setQuickNote}
        />
        <GlassButton
          label={createMutation.isPending ? "保存中..." : "立即记一笔"}
          onPress={submitQuick}
          disabled={createMutation.isPending}
        />
      </GlassCard>

      <GlassCard>
        <Text style={styles.label}>完整录入</Text>
        <Text style={styles.quickHint}>需要自定义账单名时使用这组字段。</Text>
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
            <Pressable
              key={amount}
              style={styles.quickBtn}
              onPress={() => form.setValue("amount", String(amount))}
            >
              <Text style={styles.quickText}>¥{amount}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>分类</Text>
        <View style={styles.chipsWrap}>
          {categories.map((item) => (
            <GlassChip
              key={item.id}
              label={item.name}
              selected={resolvedCategoryId === item.id}
              onPress={() => setCategoryId(item.id)}
            />
          ))}
        </View>

        <Text style={styles.label}>账单名称</Text>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <GlassInput
              placeholder="例如：午餐"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

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
          label={createMutation.isPending ? "保存中..." : "保存完整账单"}
          onPress={submit}
          disabled={createMutation.isPending}
        />
      </GlassCard>
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
  quickType: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    backgroundColor: theme.colors.accentBlue
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
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs
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
    gap: theme.spacing.sm
  },
  categoryTile: {
    width: "30.5%",
    minHeight: 78,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)"
  },
  categoryTileSelected: {
    borderColor: theme.colors.accentBlue,
    backgroundColor: "rgba(73,145,255,0.18)"
  },
  categoryIcon: {
    fontSize: 22
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textAlign: "center"
  }
});
