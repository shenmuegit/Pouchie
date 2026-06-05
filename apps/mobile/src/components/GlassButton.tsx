import type { ComponentType } from "react";
import { StyleSheet, Text, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { MotionPressable } from "./Motion";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
};

const Gradient = LinearGradient as unknown as ComponentType<any>;

export function GlassButton({
  label,
  onPress,
  variant = "primary",
  style,
  disabled = false
}: Props) {
  if (variant === "secondary") {
    return (
      <MotionPressable
        onPress={onPress}
        contentStyle={[
          styles.secondary,
          disabled ? styles.disabled : null,
          style
        ]}
        disabled={disabled}
      >
        <Text style={styles.secondaryLabel}>{label}</Text>
      </MotionPressable>
    );
  }

  const colors: [string, string] =
    variant === "danger"
      ? ["#EF4444", "#DC2626"]
      : [theme.colors.accentBlue, theme.colors.accentCyan];
  return (
    <MotionPressable
      onPress={onPress}
      contentStyle={style}
      disabled={disabled}
    >
      <Gradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.primary, disabled ? styles.disabled : null]}>
        <Text style={styles.primaryLabel}>{label}</Text>
      </Gradient>
    </MotionPressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 52,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadow.floating
  },
  primaryLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  secondary: {
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.58)"
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary
  },
  disabled: {
    opacity: 0.58
  }
});
