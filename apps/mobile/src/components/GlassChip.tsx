import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../theme";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function GlassChip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : null]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.56)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)"
  },
  selected: {
    backgroundColor: "rgba(42,123,255,0.18)",
    borderColor: "rgba(42,123,255,0.42)"
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600"
  },
  selectedLabel: {
    color: theme.colors.accentBlue
  }
});

