import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "../src/components/GlassButton";
import { GlassCard } from "../src/components/GlassCard";
import { GlassChip } from "../src/components/GlassChip";
import { GlassInput } from "../src/components/GlassInput";
import { GlassModal } from "../src/components/GlassModal";
import { Page } from "../src/components/Page";
import { apiClient } from "../src/lib/http";
import { useAuthStore } from "../src/store/auth-store";
import { theme } from "../src/theme";

const ICON_OPTIONS = [
  "utensils",
  "car",
  "shopping",
  "apple",
  "gamepad",
  "heart",
  "book",
  "home",
  "phone",
  "spark"
];
const COLOR_OPTIONS = [
  "#F97316",
  "#3B82F6",
  "#A855F7",
  "#22C55E",
  "#EC4899",
  "#EF4444",
  "#06B6D4",
  "#14B8A6"
];

export default function CategoriesPage() {
  const token = useAuthStore((s) => s.token)!;
  const [type, setType] = useState<"expense" | "income">("expense");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("spark");
  const [color, setColor] = useState("#F97316");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null>(null);
  const client = useQueryClient();

  useEffect(() => {
    setColor(type === "expense" ? "#F97316" : "#22C55E");
  }, [type]);

  const query = useQuery({
    queryKey: ["category-manage", type],
    queryFn: () => apiClient.categories.list(token, { type, includeHidden: true })
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.categories.create(token, {
        type,
        name,
        color: color || (type === "expense" ? "#F97316" : "#22C55E"),
        icon: icon || "spark"
      }),
    onSuccess: async () => {
      setName("");
      setIcon("spark");
      setColor(type === "expense" ? "#F97316" : "#22C55E");
      await client.invalidateQueries({ queryKey: ["category-manage"] });
      await client.invalidateQueries({ queryKey: ["categories"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; name: string; icon: string; color: string }) =>
      apiClient.categories.update(token, payload.id, {
        name: payload.name,
        icon: payload.icon,
        color: payload.color
      }),
    onSuccess: async () => {
      setEditing(null);
      await client.invalidateQueries({ queryKey: ["category-manage"] });
      await client.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.categories.remove(token, id),
    onSuccess: async () => {
      setPendingDeleteId(null);
      await client.invalidateQueries({ queryKey: ["category-manage"] });
      await client.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const items = query.data?.items ?? [];

  return (
    <Page title="分类管理" subtitle="新增、隐藏与维护分类">
      <Pressable style={styles.back} onPress={() => router.back()}>
        <ArrowLeft size={18} color={theme.colors.textSecondary} />
        <Text style={styles.backText}>返回</Text>
      </Pressable>

      <GlassCard>
        <View style={styles.switcher}>
          <GlassChip label="支出分类" selected={type === "expense"} onPress={() => setType("expense")} />
          <GlassChip label="收入分类" selected={type === "income"} onPress={() => setType("income")} />
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.label}>新增分类</Text>
        <View style={styles.createRow}>
          <GlassInput
            placeholder="输入分类名称"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              if (!name.trim()) return;
              createMutation.mutate();
            }}
          >
            <Plus size={18} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.editArea}>
          <Text style={styles.editLabel}>图标</Text>
          <View style={styles.iconWrap}>
            {ICON_OPTIONS.map((item) => (
              <GlassChip
                key={item}
                label={item}
                selected={icon === item}
                onPress={() => setIcon(item)}
              />
            ))}
          </View>
          <Text style={styles.editLabel}>颜色</Text>
          <View style={styles.colorWrap}>
            {COLOR_OPTIONS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setColor(item)}
                style={[
                  styles.colorDot,
                  { backgroundColor: item },
                  color === item ? styles.colorDotActive : null
                ]}
              />
            ))}
          </View>
        </View>
      </GlassCard>

      {items.map((item) => (
        <GlassCard key={item.id}>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemName}>
                {item.name}
                {item.isDefault ? "（默认）" : ""}
                {item.isHidden ? "（已隐藏）" : ""}
              </Text>
              <Text style={styles.itemMeta}>
                {item.type === "expense" ? "支出" : "收入"} · 图标 {item.icon}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  setEditing({
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    color: item.color
                  })
                }
                style={styles.delete}
              >
                <Pencil size={16} color={theme.colors.accentBlue} />
              </Pressable>
              <Pressable
                onPress={() => setPendingDeleteId(item.id)}
                disabled={item.isHidden}
                style={styles.delete}
              >
                <Trash2 size={16} color={theme.colors.accentRed} />
              </Pressable>
            </View>
          </View>
          <View style={[styles.itemColorBar, { backgroundColor: item.color }]} />
        </GlassCard>
      ))}

      <GlassButton
        variant="secondary"
        label="刷新分类"
        onPress={() => query.refetch()}
      />

      <GlassModal
        visible={Boolean(pendingDeleteId)}
        title="删除或隐藏分类"
        description="默认分类会自动转为隐藏，自定义分类会被删除。"
        confirmText="确认"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            deleteMutation.mutate(pendingDeleteId);
          }
        }}
      />

      <Modal visible={Boolean(editing)} transparent animationType="fade">
        <View style={styles.modalMask}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>编辑分类</Text>
            <View style={styles.modalField}>
              <Text style={styles.editLabel}>名称</Text>
              <GlassInput
                value={editing?.name ?? ""}
                onChangeText={(text) =>
                  setEditing((prev) => (prev ? { ...prev, name: text } : prev))
                }
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.editLabel}>图标</Text>
              <View style={styles.iconWrap}>
                {ICON_OPTIONS.map((item) => (
                  <GlassChip
                    key={item}
                    label={item}
                    selected={editing?.icon === item}
                    onPress={() =>
                      setEditing((prev) => (prev ? { ...prev, icon: item } : prev))
                    }
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalField}>
              <Text style={styles.editLabel}>颜色</Text>
              <View style={styles.colorWrap}>
                {COLOR_OPTIONS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setEditing((prev) => (prev ? { ...prev, color: item } : prev))
                    }
                    style={[
                      styles.colorDot,
                      { backgroundColor: item },
                      editing?.color === item ? styles.colorDotActive : null
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <GlassButton
                variant="secondary"
                label="取消"
                onPress={() => setEditing(null)}
              />
              <GlassButton
                label={updateMutation.isPending ? "保存中..." : "保存修改"}
                onPress={() => {
                  if (!editing) return;
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
  switcher: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "700",
    marginBottom: theme.spacing.sm
  },
  createRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center"
  },
  input: {
    flex: 1
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentBlue
  },
  editArea: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm
  },
  editLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700"
  },
  iconWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs
  },
  colorWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: "#fff"
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  delete: {
    padding: 8
  },
  itemColorBar: {
    marginTop: theme.spacing.sm,
    height: 4,
    borderRadius: 999
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
  modalActions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm
  }
});
