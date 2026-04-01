import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowRight, TrendingDown, TrendingUp, Wallet } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../../src/components/GlassCard";
import { Page } from "../../src/components/Page";
import { apiClient } from "../../src/lib/http";
import { currentDateLabel, currentMonthKey } from "../../src/lib/date";
import { formatMoney } from "../../src/lib/format";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

export default function HomePage() {
  const token = useAuthStore((s) => s.token)!;
  const month = currentMonthKey();

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary", month],
    queryFn: () => apiClient.dashboard.summary(token, month)
  });
  const recentQuery = useQuery({
    queryKey: ["dashboard-recent"],
    queryFn: () => apiClient.dashboard.recent(token)
  });

  const summary = summaryQuery.data;

  return (
    <Page title="财务概览" subtitle={currentDateLabel()}>
      <View style={styles.grid}>
        <GlassCard style={styles.halfCard}>
          <View style={styles.metricHead}>
            <TrendingDown size={18} color={theme.colors.accentRed} />
            <Text style={styles.metricLabel}>本月支出</Text>
          </View>
          <Text style={styles.metricValue}>{formatMoney(summary?.expenseCents ?? 0)}</Text>
        </GlassCard>
        <GlassCard style={styles.halfCard}>
          <View style={styles.metricHead}>
            <TrendingUp size={18} color={theme.colors.accentGreen} />
            <Text style={styles.metricLabel}>本月收入</Text>
          </View>
          <Text style={styles.metricValue}>{formatMoney(summary?.incomeCents ?? 0)}</Text>
        </GlassCard>
      </View>

      <GlassCard>
        <View style={styles.balanceTop}>
          <View style={styles.metricHead}>
            <Wallet size={18} color={theme.colors.accentBlue} />
            <Text style={styles.metricLabel}>本月结余</Text>
          </View>
          <Text style={styles.tinyLabel}>
            今日支出 {formatMoney(summary?.todayExpenseCents ?? 0)}
          </Text>
        </View>
        <Text style={styles.balanceValue}>{formatMoney(summary?.balanceCents ?? 0)}</Text>
      </GlassCard>

      <GlassCard>
        <View style={styles.budgetRow}>
          <Text style={styles.metricLabel}>预算进度</Text>
          <Text style={styles.metricLabel}>{(summary?.budgetProgress ?? 0).toFixed(1)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(summary?.budgetProgress ?? 0, 100)}%` }
            ]}
          />
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.tinyLabel}>
            已用 {formatMoney(summary?.budgetUsedCents ?? 0)}
          </Text>
          <Text style={styles.tinyLabel}>
            总预算 {formatMoney(summary?.budgetTotalCents ?? 0)}
          </Text>
        </View>
      </GlassCard>

      <Pressable style={styles.linkCard} onPress={() => router.push("/budget")}>
        <Text style={styles.linkText}>预算管理</Text>
        <ArrowRight size={16} color={theme.colors.accentBlue} />
      </Pressable>
      <Pressable style={styles.linkCard} onPress={() => router.push("/categories")}>
        <Text style={styles.linkText}>分类管理</Text>
        <ArrowRight size={16} color={theme.colors.accentBlue} />
      </Pressable>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>最近账单</Text>
      </View>
      <GlassCard style={styles.listCard}>
        {(recentQuery.data?.items ?? []).map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowMeta}>{item.categoryName}</Text>
            </View>
            <Text style={[styles.rowAmount, item.type === "income" ? styles.income : null]}>
              {item.type === "income" ? "+" : "-"}
              {formatMoney(item.amountCents).replace("¥", "¥")}
            </Text>
          </View>
        ))}
      </GlassCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  halfCard: {
    flex: 1
  },
  metricHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  metricLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600"
  },
  metricValue: {
    marginTop: theme.spacing.md,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tinyLabel: {
    fontSize: 12,
    color: theme.colors.textMuted
  },
  balanceValue: {
    fontSize: 30,
    marginTop: theme.spacing.md,
    fontWeight: "800",
    color: theme.colors.textPrimary
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressTrack: {
    marginVertical: theme.spacing.sm,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(180,203,255,0.4)"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.accentBlue
  },
  linkCard: {
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.62)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.62)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  sectionHead: {
    marginTop: theme.spacing.xs
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  listCard: {
    paddingVertical: 4
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },
  rowMain: {
    gap: 2
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  rowMeta: {
    fontSize: 12,
    color: theme.colors.textMuted
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  income: {
    color: theme.colors.accentGreen
  }
});

