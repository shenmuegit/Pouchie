import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { GlassChip } from "../../src/components/GlassChip";
import { GlassInput } from "../../src/components/GlassInput";
import { Page } from "../../src/components/Page";
import { yuanTextToCents } from "../../src/lib/finance";
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
  const [inputMode, setInputMode] = useState<"full" | "quick">("full");
  const [quickVisible, setQuickVisible] = useState(false);
  const [quickName, setQuickName] = useState("");
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
  const resolvedCategoryId = categoryId || categories[0]?.id || "";

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
      setQuickName("");
      setQuickAmount("");
      setQuickNote("");
      setQuickVisible(false);
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

  return (
    <Page title="快速记账" subtitle="支持极速录入与完整录入">
      <GlassCard>
        <View style={styles.typeRow}>
          <GlassChip label="支出" selected={type === "expense"} onPress={() => setType("expense")} />
          <GlassChip label="收入" selected={type === "income"} onPress={() => setType("income")} />
        </View>
      </GlassCard>
      <GlassCard>
        <View style={styles.modeRow}>
          <GlassChip
            label="完整页面"
            selected={inputMode === "full"}
            onPress={() => setInputMode("full")}
          />
          <GlassChip
            label="快速弹窗"
            selected={inputMode === "quick"}
            onPress={() => setInputMode("quick")}
          />
        </View>
      </GlassCard>

      {inputMode === "full" ? (
        <>
          <GlassCard>
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
          </GlassCard>

          <GlassCard>
            <Text style={styles.label}>分类</Text>
            <View style={styles.chipsWrap}>
              {categories.map((item) => (
                <GlassChip
                  key={item.id}
                  label={item.name}
                  selected={(categoryId || categories[0]?.id) === item.id}
                  onPress={() => setCategoryId(item.id)}
                />
              ))}
            </View>
          </GlassCard>

          <GlassCard>
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
          </GlassCard>

          <GlassCard>
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
          </GlassCard>

          <GlassButton
            label={createMutation.isPending ? "保存中..." : "保存账单"}
            onPress={submit}
          />
        </>
      ) : (
        <GlassCard>
          <Text style={styles.label}>快速录入模式</Text>
          <Text style={styles.quickHint}>
            点击下方按钮弹出快速记账层，完成后自动返回当前页面。
          </Text>
          <GlassButton
            label="打开快速记账弹窗"
            onPress={() => setQuickVisible(true)}
          />
        </GlassCard>
      )}

      <Modal visible={quickVisible} transparent animationType="fade">
        <View style={styles.modalMask}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>快速记账弹窗</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>金额（元）</Text>
              <GlassInput
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={quickAmount}
                onChangeText={setQuickAmount}
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>账单名称</Text>
              <GlassInput
                placeholder="例如：咖啡"
                value={quickName}
                onChangeText={setQuickName}
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>分类</Text>
              <View style={styles.chipsWrap}>
                {categories.map((item) => (
                  <GlassChip
                    key={item.id}
                    label={item.name}
                    selected={(categoryId || categories[0]?.id) === item.id}
                    onPress={() => setCategoryId(item.id)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>备注</Text>
              <GlassInput
                placeholder="可选备注"
                value={quickNote}
                onChangeText={setQuickNote}
              />
            </View>
            <View style={styles.modalActions}>
              <GlassButton
                variant="secondary"
                label="取消"
                onPress={() => setQuickVisible(false)}
              />
              <GlassButton
                label={createMutation.isPending ? "保存中..." : "快速保存"}
                onPress={async () => {
                  if (!resolvedCategoryId) {
                    Alert.alert("请选择分类");
                    return;
                  }
                  if (!quickName.trim() || !quickAmount.trim()) {
                    Alert.alert("请填写名称和金额");
                    return;
                  }
                  if (yuanTextToCents(quickAmount) <= 0) {
                    Alert.alert("请输入有效金额");
                    return;
                  }
                  await createMutation.mutateAsync({
                    name: quickName,
                    amountText: quickAmount,
                    note: quickNote,
                    categoryId: resolvedCategoryId,
                    type
                  });
                }}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  typeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  modeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "700",
    marginBottom: theme.spacing.sm
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
  modalMask: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: "rgba(7,16,27,0.28)"
  },
  modalCard: {
    borderRadius: theme.radius.xl
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  modalField: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs
  },
  modalLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700"
  },
  modalActions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm
  }
});
