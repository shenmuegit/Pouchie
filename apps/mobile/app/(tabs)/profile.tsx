import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LogOut, User } from "lucide-react-native";
import { GlassButton } from "../../src/components/GlassButton";
import { GlassCard } from "../../src/components/GlassCard";
import { Page } from "../../src/components/Page";
import { apiClient } from "../../src/lib/http";
import { useAuthStore } from "../../src/store/auth-store";
import { theme } from "../../src/theme";

export default function ProfilePage() {
  const token = useAuthStore((s) => s.token)!;
  const clearSession = useAuthStore((s) => s.clearSession);

  const overviewQuery = useQuery({
    queryKey: ["profile-overview"],
    queryFn: () => apiClient.profile.overview(token)
  });

  const overview = overviewQuery.data;

  const stats = useMemo(
    () => [
      { label: "总账单数", value: overview?.totalTransactions ?? 0 },
      { label: "记账天数", value: overview?.activeDays ?? 0 }
    ],
    [overview]
  );

  return (
    <Page title="我的" subtitle="账户与记账状态">
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

      <GlassButton
        label={overviewQuery.isFetching ? "刷新中..." : "刷新资料"}
        variant="secondary"
        onPress={() => overviewQuery.refetch()}
      />

      <Pressable style={styles.logout} onPress={() => clearSession()}>
        <LogOut size={18} color={theme.colors.accentRed} />
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>
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
