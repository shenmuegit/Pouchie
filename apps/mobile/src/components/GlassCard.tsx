import { PropsWithChildren, type ComponentType } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../theme";

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

const Blur = BlurView as unknown as ComponentType<any>;

export function GlassCard({ children, style }: Props) {
  return (
    <Blur intensity={theme.blur.card} tint="light" style={[styles.blur, style]}>
      <View style={styles.inner}>{children}</View>
    </Blur>
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
