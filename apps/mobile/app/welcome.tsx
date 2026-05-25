import { router } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Wallet } from "lucide-react-native";
import { Page } from "../src/components/Page";
import { GlassCard } from "../src/components/GlassCard";
import { GlassButton } from "../src/components/GlassButton";
import { theme } from "../src/theme";

export default function WelcomePage() {
  return (
    <Page scroll={false}>
      <View style={styles.container}>
        <GlassCard style={styles.logoCard}>
          <Wallet size={56} color={theme.colors.accentBlue} />
        </GlassCard>
        <View style={styles.titleBlock}>
          <Text style={styles.brand}>小荷包</Text>
          <Text style={styles.slogan}>优雅记录，轻盈理财</Text>
        </View>
        <View style={styles.actions}>
          <GlassButton
            label={Platform.OS === "android" ? "使用 Google 登录" : "使用 Apple 登录"}
            onPress={() => router.push("/signin")}
          />
          <Text style={styles.note}>所有数据通过端到端加密保护</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 32
  },
  logoCard: {
    alignSelf: "center",
    padding: 24,
    borderRadius: theme.radius.xl
  },
  titleBlock: {
    alignItems: "center",
    gap: 10
  },
  brand: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.colors.textPrimary
  },
  slogan: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.textSecondary
  },
  actions: {
    gap: 14
  },
  note: {
    textAlign: "center",
    fontSize: 13,
    color: theme.colors.textMuted
  }
});

