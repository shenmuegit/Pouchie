import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../../src/components/GlassCard";
import { GlassChip } from "../../src/components/GlassChip";
import { Page } from "../../src/components/Page";
import { apiClient } from "../../src/lib/http";
import { formatMoney } from "../../src/lib/format";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

const periodOptions = [
  { key: "day", label: "日" },
  { key: "week", label: "周" },
  { key: "month", label: "月" },
  { key: "year", label: "年" }
] as const;

export default function AnalyticsPage() {
  const token = useAuthStore((s) => s.token)!;
  const [period, setPeriod] = useState<(typeof periodOptions)[number]["key"]>("month");
  const query = useMemo(() => ({ period }), [period]);

  const summary = useQuery({
    queryKey: ["analytics-summary", query],
    queryFn: () => apiClient.analytics.summary(token, query)
  });
  const trend = useQuery({
    queryKey: ["analytics-trend", query],
    queryFn: () => apiClient.analytics.trend(token, query)
  });
  const categories = useQuery({
    queryKey: ["analytics-categories", query],
    queryFn: () => apiClient.analytics.categories(token, query)
  });

  const peak = Math.max(...(trend.data?.items.map((x) => x.expenseCents) ?? [1]), 1);

  return (
    <Page title="统计分析" subtitle="按时间与分类查看收支">
      <View style={styles.chips}>
        {periodOptions.map((item) => (
          <GlassChip
            key={item.key}
            label={item.label}
            selected={period === item.key}
            onPress={() => setPeriod(item.key)}
          />
        ))}
      </View>

      <View style={styles.summaryGrid}>
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.metricName}>总支出</Text>
          <Text style={styles.metricValue}>{formatMoney(summary.data?.totalExpenseCents ?? 0)}</Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.metricName}>总收入</Text>
          <Text style={styles.metricValue}>{formatMoney(summary.data?.totalIncomeCents ?? 0)}</Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.metricName}>净结余</Text>
          <Text style={styles.metricValue}>{formatMoney(summary.data?.netCents ?? 0)}</Text>
        </GlassCard>
      </View>

      <GlassCard>
        <Text style={styles.sectionTitle}>收支趋势</Text>
        <View style={styles.chartRow}>
          {(trend.data?.items ?? []).map((point) => (
            <View key={point.bucket} style={styles.barCol}>
              <View style={styles.barWrap}>
                <View
                  style={[
                    styles.expenseBar,
                    { height: `${Math.max((point.expenseCents / peak) * 100, 5)}%` }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{point.bucket.slice(5)}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>分类占比</Text>
        {(categories.data?.items ?? []).map((item) => (
          <View key={item.categoryId} style={styles.row}>
            <Text style={styles.rowName}>{item.categoryName}</Text>
            <Text style={styles.rowPercent}>{item.percentage.toFixed(1)}%</Text>
            <Text style={styles.rowMoney}>{formatMoney(item.amountCents)}</Text>
          </View>
        ))}
      </GlassCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  summaryGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  summaryCard: {
    flex: 1
  },
  metricName: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700"
  },
  metricValue: {
    marginTop: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: "800"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 140
  },
  barCol: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.xs
  },
  barWrap: {
    width: 16,
    height: 110,
    borderRadius: 10,
    justifyContent: "flex-end",
    backgroundColor: "rgba(180,203,255,0.45)"
  },
  expenseBar: {
    width: 16,
    borderRadius: 10,
    backgroundColor: theme.colors.accentBlue
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.textMuted
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8
  },
  rowName: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "600"
  },
  rowPercent: {
    width: 52,
    textAlign: "right",
    fontSize: 13,
    color: theme.colors.textMuted
  },
  rowMoney: {
    width: 110,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary
  }
});

