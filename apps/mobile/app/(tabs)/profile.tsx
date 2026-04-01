import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Cloud, Download, Lock, LogOut, User } from "lucide-react-native";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { Page } from "../../src/components/Page";
import { apiClient } from "../../src/lib/http";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

export default function ProfilePage() {
  const token = useAuthStore((s) => s.token)!;
  const clearSession = useAuthStore((s) => s.clearSession);
  const client = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["profile-overview"],
    queryFn: () => apiClient.profile.overview(token)
  });
  const patchPreferences = useMutation({
    mutationFn: apiClient.profile.patchPreferences.bind(null, token),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["profile-overview"] });
      await client.invalidateQueries({ queryKey: ["profile-preferences"] });
    }
  });

  const overview = overviewQuery.data;
  const prefs = overview?.preferences;

  const stats = useMemo(
    () => [
      { label: "总账单数", value: overview?.totalTransactions ?? 0 },
      { label: "记账天数", value: overview?.activeDays ?? 0 },
      { label: "分类数量", value: overview?.categoryCount ?? 0 }
    ],
    [overview]
  );

  return (
    <Page title="我的" subtitle="账户与偏好设置">
      <GlassCard>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <User color="#fff" size={22} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{overview?.user.displayName ?? "Apple 用户"}</Text>
            <Text style={styles.userEmail}>{overview?.user.email ?? "未绑定邮箱"}</Text>
          </View>
        </View>
      </GlassCard>

      <View style={styles.stats}>
        {stats.map((item) => (
          <GlassCard style={styles.statCard} key={item.label}>
            <Text style={styles.statNum}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </GlassCard>
        ))}
      </View>

      <GlassCard>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Lock size={16} color={theme.colors.textSecondary} />
            <Text style={styles.settingText}>Face ID</Text>
          </View>
          <Switch
            value={prefs?.faceIdEnabled ?? false}
            onValueChange={(value) => patchPreferences.mutate({ faceIdEnabled: value })}
          />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Cloud size={16} color={theme.colors.textSecondary} />
            <Text style={styles.settingText}>iCloud 同步</Text>
          </View>
          <Text style={styles.placeholderText}>占位</Text>
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Download size={16} color={theme.colors.textSecondary} />
            <Text style={styles.settingText}>导出数据</Text>
          </View>
          <Text style={styles.placeholderText}>占位</Text>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.placeholderLong}>{prefs?.iCloudSyncStatus}</Text>
        <Text style={styles.placeholderLong}>{prefs?.exportStatus}</Text>
      </GlassCard>

      <Pressable style={styles.logout} onPress={() => clearSession()}>
        <LogOut size={18} color={theme.colors.accentRed} />
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>

      <GlassButton label="刷新资料" variant="secondary" onPress={() => overviewQuery.refetch()} />
    </Page>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentBlue
  },
  userInfo: {
    gap: 2
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.textMuted
  },
  stats: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  statCard: {
    flex: 1
  },
  statNum: {
    fontSize: 21,
    fontWeight: "800",
    color: theme.colors.textPrimary
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textMuted
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  settingText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary
  },
  placeholderText: {
    fontSize: 12,
    color: theme.colors.textMuted
  },
  placeholderLong: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18
  },
  logout: {
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    backgroundColor: "rgba(255,230,230,0.66)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  logoutText: {
    color: theme.colors.accentRed,
    fontWeight: "700"
  }
});

