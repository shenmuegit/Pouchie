import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "../src/components/GlassButton";
import { GlassCard } from "../src/components/GlassCard";
import { GlassInput } from "../src/components/GlassInput";
import { Page } from "../src/components/Page";
import {
  buildCategoryBudgetUpdateItems,
  centsToYuanText
} from "../src/lib/finance";
import { apiClient } from "../src/lib/http";
import { currentMonthKey } from "../src/lib/date";
import { formatMoney } from "../src/lib/format";
import { useAuthStore } from "../src/store/auth-store";
import { theme } from "../src/theme";

export default function BudgetPage() {
  const token = useAuthStore((s) => s.token)!;
  const month = currentMonthKey();
  const client = useQueryClient();
  const [editingTotal, setEditingTotal] = useState("");
  const [categoryDrafts, setCategoryDrafts] = useState<Record<string, string>>({});

  const monthlyQuery = useQuery({
    queryKey: ["budget-monthly", month],
    queryFn: () => apiClient.budgets.monthly(token, month)
  });
  const categoryBudgetQuery = useQuery({
    queryKey: ["budget-categories", month],
    queryFn: () => apiClient.budgets.categoryList(token, month)
  });

  const updateMonthly = useMutation({
    mutationFn: (totalCents: number) =>
      apiClient.budgets.updateMonthly(token, {
        month,
        totalCents
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["budget-monthly", month] });
      await client.invalidateQueries({ queryKey: ["dashboard-summary", month] });
    }
  });
  const updateCategoryBudgets = useMutation({
    mutationFn: () =>
      apiClient.budgets.updateCategories(token, {
        month,
        items: buildCategoryBudgetUpdateItems(categoryItems, categoryDrafts)
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["budget-categories", month] });
      await client.invalidateQueries({ queryKey: ["budget-monthly", month] });
      await client.invalidateQueries({ queryKey: ["dashboard-summary", month] });
    }
  });

  const monthly = monthlyQuery.data;
  const categoryItems = categoryBudgetQuery.data?.items ?? [];
  const safeTotal = monthly?.totalCents ?? 0;
  const quickSet = useMemo(() => [200000, 500000, 1000000, 1500000], []);

  useEffect(() => {
    if (categoryItems.length === 0) return;
    setCategoryDrafts((prev) => {
      const next = { ...prev };
      for (const item of categoryItems) {
        if (next[item.categoryId] === undefined) {
          next[item.categoryId] = centsToYuanText(item.budgetCents);
        }
      }
      return next;
    });
  }, [categoryItems]);

  return (
    <Page title="预算管理" subtitle="分类预算与超支提醒">
      <Pressable style={styles.back} onPress={() => router.back()}>
        <ArrowLeft size={18} color={theme.colors.textSecondary} />
        <Text style={styles.backText}>返回</Text>
      </Pressable>

      <GlassCard>
        <Text style={styles.label}>本月预算</Text>
        <Text style={styles.total}>{formatMoney(monthly?.totalCents ?? 0)}</Text>
        <Text style={styles.sub}>
          已用 {formatMoney(monthly?.usedCents ?? 0)} · 剩余 {formatMoney(monthly?.remainingCents ?? 0)}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(monthly?.progress ?? 0, 100)}%` }]} />
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.label}>更新预算</Text>
        <GlassInput
          keyboardType="number-pad"
          placeholder="输入预算金额（元）"
          value={editingTotal}
          onChangeText={setEditingTotal}
        />
        <View style={styles.quickRow}>
          {quickSet.map((value) => (
            <Pressable
              key={value}
              onPress={() => setEditingTotal(String(value / 100))}
              style={styles.quickBtn}
            >
              <Text style={styles.quickLabel}>{formatMoney(value)}</Text>
            </Pressable>
          ))}
        </View>
        <GlassButton
          label={updateMonthly.isPending ? "保存中..." : "保存本月预算"}
          onPress={() =>
            updateMonthly.mutate(Math.round((Number(editingTotal) || safeTotal / 100) * 100))
          }
        />
      </GlassCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>分类预算</Text>
      </View>
      {categoryItems.map((item) => (
        <GlassCard key={item.categoryId}>
          <View style={styles.row}>
            <Text style={styles.rowName}>{item.categoryName}</Text>
            <Text style={styles.rowStat}>{item.progress.toFixed(1)}%</Text>
          </View>
          <Text style={styles.sub}>
            预算 {formatMoney(item.budgetCents)} · 已用 {formatMoney(item.usedCents)} · 剩余{" "}
            {formatMoney(item.remainingCents)}
          </Text>
          <View style={styles.editLine}>
            <Text style={styles.editLabel}>编辑分类预算（元）</Text>
            <GlassInput
              keyboardType="number-pad"
              value={categoryDrafts[item.categoryId] ?? ""}
              onChangeText={(text) =>
                setCategoryDrafts((prev) => ({ ...prev, [item.categoryId]: text }))
              }
              placeholder="0"
              style={styles.editInput}
            />
          </View>
        </GlassCard>
      ))}

      {categoryItems.length > 0 ? (
        <GlassButton
          label={updateCategoryBudgets.isPending ? "保存中..." : "保存分类预算"}
          onPress={() => updateCategoryBudgets.mutate()}
        />
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  backText: {
    color: theme.colors.textSecondary,
    fontWeight: "600"
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "700"
  },
  total: {
    marginTop: theme.spacing.sm,
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.textPrimary
  },
  sub: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.textMuted
  },
  track: {
    marginTop: theme.spacing.md,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(180,203,255,0.4)"
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.accentBlue
  },
  quickRow: {
    marginVertical: theme.spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs
  },
  quickBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  quickLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "700"
  },
  sectionHeader: {
    marginTop: theme.spacing.xs
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  rowStat: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.accentBlue
  },
  editLine: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs
  },
  editLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700"
  },
  editInput: {
    fontSize: 14
  }
});
