import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuthStore } from "../src/store/auth-store";
import { theme } from "../src/theme";

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  const initialized = useAuthStore((s) => s.initialized);
  const boot = useAuthStore((s) => s.boot);

  useEffect(() => {
    boot().catch(() => {
      // ignore
    });
  }, [boot]);

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.accentBlue} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF6FF"
  }
});
