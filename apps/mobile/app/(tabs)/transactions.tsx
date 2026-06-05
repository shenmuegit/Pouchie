import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { GlassChip } from "../../src/components/GlassChip";
import { GlassInput } from "../../src/components/GlassInput";
import { GlassModal } from "../../src/components/GlassModal";
import { Page } from "../../src/components/Page";
import { SwipeActionsRow } from "../../src/components/SwipeActionsRow";
import { localizeCategoryName } from "../../src/lib/category-i18n";
import { yuanTextToCents } from "../../src/lib/finance";
import { apiClient } from "../../src/lib/http";
import { formatMoney } from "../../src/lib/format";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

type TabKey = "all" | "expense" | "income";

export default function TransactionsPage() {
  const token = useAuthStore((s) => s.token)!;
  const [tab, setTab] = useState<TabKey>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    id: string;
    amountText: string;
    note: string;
  } | null>(null);
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions", tab],
    queryFn: () =>
      apiClient.transactions.list(token, {
        type: tab === "all" ? undefined : tab,
        groupBy: "date"
      })
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiClient.transactions.remove(token, id),
    onSuccess: async () => {
      setPendingDeleteId(null);
      await client.invalidateQueries({ queryKey: ["transactions"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; amountText: string; note: string }) =>
      apiClient.transactions.update(token, payload.id, {
        amountCents: yuanTextToCents(payload.amountText),
        note: payload.note.trim() || null
      }),
    onSuccess: async () => {
      setEditing(null);
      await client.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

  const grouped = query.data?.groups ?? [];
  const totals = useMemo(() => {
    let expense = 0;
    let income = 0;
    for (const group of grouped) {
      for (const item of group.items) {
        if (item.type === "expense") expense += 1;
        else income += 1;
      }
    }
    return {
      all: expense + income,
      expense,
      income
    };
  }, [grouped]);

  return (
    <Page title="账单明细" subtitle="按日期查看收支记录">
      <View style={styles.chips}>
        <GlassChip label={`全部 ${totals.all}`} selected={tab === "all"} onPress={() => setTab("all")} />
        <GlassChip
          label={`支出 ${totals.expense}`}
          selected={tab === "expense"}
          onPress={() => setTab("expense")}
        />
        <GlassChip
          label={`收入 ${totals.income}`}
          selected={tab === "income"}
          onPress={() => setTab("income")}
        />
      </View>

      {grouped.length === 0 ? (
        <GlassCard>
          <Text style={styles.empty}>暂无账单记录</Text>
        </GlassCard>
      ) : (
        grouped.map((group) => (
          <View key={group.date} style={styles.group}>
            <Text style={styles.groupTitle}>{group.date}</Text>
            <GlassCard>
              {group.items.map((item) => {
                const note = item.note?.trim();
                const categoryName = localizeCategoryName(item.categoryName);

                return (
                  <SwipeActionsRow
                    key={item.id}
                    onEdit={() =>
                      setEditing({
                        id: item.id,
                        amountText: (item.amountCents / 100).toFixed(2),
                        note: item.note ?? ""
                      })
                    }
                    onDelete={() => setPendingDeleteId(item.id)}
                  >
                    <View style={styles.row}>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle}>{note || categoryName}</Text>
                        {note ? <Text style={styles.rowMeta}>{categoryName}</Text> : null}
                      </View>
                      <Text
                        style={[
                          styles.rowAmount,
                          item.type === "income" ? styles.income : null
                        ]}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {formatMoney(item.amountCents)}
                      </Text>
                    </View>
                  </SwipeActionsRow>
                );
              })}
            </GlassCard>
          </View>
        ))
      )}

      <GlassModal
        visible={Boolean(pendingDeleteId)}
        title="删除账单"
        description="删除后不可恢复，确认删除这条记录吗？"
        confirmText="删除"
        cancelText="取消"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            removeMutation.mutate(pendingDeleteId);
          }
        }}
      />

      <Modal visible={Boolean(editing)} transparent animationType="fade">
        <View style={styles.modalMask}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>编辑账单</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>金额（元）</Text>
              <GlassInput
                value={editing?.amountText ?? ""}
                onChangeText={(text) =>
                  setEditing((prev) => (prev ? { ...prev, amountText: text } : prev))
                }
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>备注</Text>
              <GlassInput
                value={editing?.note ?? ""}
                onChangeText={(text) =>
                  setEditing((prev) => (prev ? { ...prev, note: text } : prev))
                }
                placeholder="可选备注"
              />
            </View>
            <View style={styles.modalActions}>
              <GlassButton
                variant="secondary"
                label="取消"
                onPress={() => setEditing(null)}
              />
              <GlassButton
                label={updateMutation.isPending ? "保存中..." : "保存编辑"}
                onPress={() => {
                  if (!editing) return;
                  if (yuanTextToCents(editing.amountText) <= 0) {
                    Alert.alert("请输入有效金额");
                    return;
                  }
                  updateMutation.mutate(editing);
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
  chips: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  empty: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 14
  },
  group: {
    gap: theme.spacing.xs
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMuted
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 2
  },
  rowMain: {
    flex: 1
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
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  income: {
    color: theme.colors.accentGreen
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
