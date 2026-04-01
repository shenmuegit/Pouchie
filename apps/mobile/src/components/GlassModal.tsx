import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { theme } from "../theme";

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GlassModal({
  visible,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.mask} onPress={onCancel}>
        <Pressable>
          <GlassCard style={styles.card}>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              {description ? <Text style={styles.desc}>{description}</Text> : null}
              <View style={styles.actions}>
                <GlassButton label={cancelText} variant="secondary" onPress={onCancel} />
                <GlassButton label={confirmText} onPress={onConfirm} />
              </View>
            </View>
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xl,
    backgroundColor: "rgba(10,20,30,0.22)"
  },
  card: {
    borderRadius: theme.radius.xl
  },
  content: {
    gap: theme.spacing.md
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary
  },
  actions: {
    gap: theme.spacing.sm
  }
});

