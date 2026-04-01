import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { theme } from "../theme";

type Props = TextInputProps;

export function GlassInput(props: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    paddingHorizontal: theme.spacing.md
  },
  input: {
    height: 50,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600"
  }
});

