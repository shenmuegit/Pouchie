import { router } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AuthResponse } from "@xiaohebao/contracts";
import { Page } from "../src/components/Page";
import { GlassCard } from "../src/components/GlassCard";
import { GlassButton } from "../src/components/GlassButton";
import { useDevLogin } from "../src/hooks/use-session";
import { apiClient } from "../src/lib/http";
import { useAuthStore } from "../src/store/auth-store";
import { theme } from "../src/theme";

// 必须在模块顶层调用，用于 Android 浏览器会话完成后自动关闭
WebBrowser.maybeCompleteAuthSession();

// TODO: 在 Google Cloud Console 创建 OAuth Client ID 后填入
// https://console.cloud.google.com/apis/credentials
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "";

function AndroidGoogleSignInButton({
  pending,
  setPending,
  setSession
}: {
  pending: boolean;
  setPending: Dispatch<SetStateAction<boolean>>;
  setSession: (session: { token: string; user: AuthResponse["user"] }) => Promise<void>;
}) {
  const [, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["openid", "profile", "email"]
  });

  useEffect(() => {
    const handleGoogleIdToken = async (idToken: string) => {
      try {
        const auth = await apiClient.auth.googleLogin({ idToken });
        await setSession({ token: auth.token, user: auth.user });
        router.replace("/(tabs)");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Google 登录失败，请重试";
        Alert.alert("登录失败", message);
      } finally {
        setPending(false);
      }
    };

    if (googleResponse?.type === "success") {
      const idToken = googleResponse.authentication?.idToken;
      if (idToken) {
        handleGoogleIdToken(idToken);
      } else {
        Alert.alert("Google 登录失败", "未获取到 ID Token，请重试");
        setPending(false);
      }
    } else if (googleResponse?.type === "error") {
      Alert.alert("Google 登录失败", googleResponse.error?.message ?? "未知错误");
      setPending(false);
    } else if (googleResponse?.type === "dismiss") {
      setPending(false);
    }
  }, [googleResponse, setPending, setSession]);

  const handleGoogleSign = () => {
    if (!GOOGLE_WEB_CLIENT_ID || !GOOGLE_ANDROID_CLIENT_ID) {
      Alert.alert("配置缺失", "Google 登录尚未配置，请使用开发测试账号登录");
      return;
    }
    setPending(true);
    googlePromptAsync();
  };

  return (
    <GlassButton
      label={pending ? "正在登录..." : "使用 Google 登录"}
      onPress={handleGoogleSign}
    />
  );
}

export default function SignInPage() {
  const devLogin = useDevLogin();
  const setSession = useAuthStore((s) => s.setSession);
  const [pending, setPending] = useState(false);
  const [pendingLabel, setPendingLabel] = useState("正在验证身份...");

  // ── Apple Sign In (iOS) ───────────────────────────────────────────────────
  const handleAppleSign = async () => {
    setPendingLabel("正在验证身份...");
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
    setPendingLabel("正在连接开发服务...");
    setPending(true);
    try {
      await devLogin.mutateAsync({
        email: "seed@example.com",
        displayName: "测试账号"
      });
      router.replace("/(tabs)");
    } catch (error) {
      const message = error instanceof Error ? error.message : "开发登录失败，请重试";
      Alert.alert("开发登录失败", message);
    } finally {
      setPending(false);
    }
  };

  const isAndroid = Platform.OS === "android";

  return (
    <Page title="欢迎使用小荷包" subtitle="登录后开始记账">
      <GlassCard>
        <View style={styles.signInCard}>
          {isAndroid ? (
            <AndroidGoogleSignInButton
              pending={pending}
              setPending={setPending}
              setSession={setSession}
            />
          ) : (
            <GlassButton
              label={pending ? "正在登录..." : "使用 Apple 登录"}
              onPress={handleAppleSign}
            />
          )}
          <GlassButton label="开发测试账号登录" variant="secondary" onPress={handleDevSignIn} />
          {pending ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.accentBlue} />
              <Text style={styles.tip}>{pendingLabel}</Text>
            </View>
          ) : null}
        </View>
      </GlassCard>

      <Text style={styles.devNote}>开发阶段优先使用测试账号，便于快速验证记账流程。</Text>
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
    lineHeight: 18,
    textAlign: "center"
  }
});
