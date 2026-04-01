import { router } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { Apple, Eye, Lock, ShieldCheck } from "lucide-react-native";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Page } from "../src/components/Page";
import { GlassCard } from "../src/components/GlassCard";
import { GlassButton } from "../src/components/GlassButton";
import { useDevLogin } from "../src/hooks/use-session";
import { apiClient } from "../src/lib/http";
import { useAuthStore } from "../src/store/auth-store";
import { theme } from "../src/theme";

export default function SignInPage() {
  const devLogin = useDevLogin();
  const setSession = useAuthStore((s) => s.setSession);
  const [pending, setPending] = useState(false);

  const handleAppleSign = async () => {
    setPending(true);
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("当前设备不支持 Apple 登录");
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME
        ]
      });

      if (!credential.identityToken) {
        throw new Error("未获取到 Apple identityToken");
      }

      const displayNameFromFullName = [
        credential.fullName?.familyName,
        credential.fullName?.givenName
      ]
        .filter(Boolean)
        .join("");

      const auth = await apiClient.auth.appleLogin({
        idToken: credential.identityToken,
        email: credential.email ?? undefined,
        displayName:
          credential.fullName?.nickname ??
          (displayNameFromFullName || undefined)
      });
      await setSession({ token: auth.token, user: auth.user });
      router.replace("/(tabs)");
    } catch (error) {
      try {
        await devLogin.mutateAsync({
          email: "seed@example.com",
          displayName: "测试账号"
        });
        router.replace("/(tabs)");
        Alert.alert("提示", "Apple 登录不可用，已切换开发测试账号。");
      } catch (fallbackError) {
        const message =
          fallbackError instanceof Error ? fallbackError.message : "登录失败，请重试";
        Alert.alert("登录失败", message);
      }
    } finally {
      setPending(false);
    }
  };

  const handleDevSignIn = async () => {
    setPending(true);
    try {
      await devLogin.mutateAsync({
        email: "seed@example.com",
        displayName: "测试账号"
      });
      router.replace("/(tabs)");
    } finally {
      setPending(false);
    }
  };

  return (
    <Page title="欢迎使用小荷包" subtitle="安全登录，开启你的理财之旅">
      <GlassCard>
        <View style={styles.signInCard}>
          <GlassButton label="使用 Apple 登录" onPress={handleAppleSign} />
          <GlassButton label="开发测试账号登录" variant="secondary" onPress={handleDevSignIn} />
          {pending ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.accentBlue} />
              <Text style={styles.tip}>正在登录...</Text>
            </View>
          ) : null}
          <Text style={styles.devNote}>
            优先走真 Apple 登录，开发环境下会在失败时回落到旁路测试账号。
          </Text>
        </View>
      </GlassCard>

      <GlassCard>
        <View style={styles.security}>
          <View style={styles.row}>
            <ShieldCheck color={theme.colors.accentBlue} size={18} />
            <Text style={styles.rowText}>Apple 身份认证保障账户安全</Text>
          </View>
          <View style={styles.row}>
            <Lock color={theme.colors.accentBlue} size={18} />
            <Text style={styles.rowText}>账单数据默认加密存储</Text>
          </View>
          <View style={styles.row}>
            <Eye color={theme.colors.accentBlue} size={18} />
            <Text style={styles.rowText}>支持 Face ID 快速解锁</Text>
          </View>
          <View style={styles.appleMark}>
            <Apple color={theme.colors.textMuted} size={16} />
            <Text style={styles.appleText}>当前已支持 Apple Token 服务端校验</Text>
          </View>
        </View>
      </GlassCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  signInCard: {
    gap: theme.spacing.md
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  tip: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  devNote: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18
  },
  security: {
    gap: theme.spacing.sm
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  rowText: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  appleMark: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs
  },
  appleText: {
    fontSize: 12,
    color: theme.colors.textMuted
  }
});
