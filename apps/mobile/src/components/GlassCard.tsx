import { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../theme";

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function GlassCard({ children, style }: Props) {
  return (
    <BlurView intensity={theme.blur.card} tint="light" style={[styles.blur, style]}>
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: `rgba(255,255,255,${theme.alpha.glassBorder})`,
    backgroundColor: `rgba(255,255,255,${theme.alpha.glassSurface})`,
    ...theme.shadow.card
  },
  inner: {
    padding: theme.spacing.lg
  }
});

