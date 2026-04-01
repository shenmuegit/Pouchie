import { PropsWithChildren, useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { theme } from "../theme";

const ACTION_WIDTH = 72;
const TOTAL_ACTION_WIDTH = ACTION_WIDTH * 2;

type Props = PropsWithChildren<{
  onEdit: () => void;
  onDelete: () => void;
}>;

export function SwipeActionsRow({ children, onEdit, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opened = useRef(false);

  const animateTo = (toValue: number) => {
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      bounciness: 6,
      speed: 18
    }).start(() => {
      opened.current = toValue !== 0;
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 8,
        onPanResponderMove: (_, gestureState) => {
          const base = opened.current ? -TOTAL_ACTION_WIDTH : 0;
          const next = Math.max(
            -TOTAL_ACTION_WIDTH,
            Math.min(0, base + gestureState.dx)
          );
          translateX.setValue(next);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -28) {
            animateTo(-TOTAL_ACTION_WIDTH);
            return;
          }
          if (gestureState.dx > 28) {
            animateTo(0);
            return;
          }
          animateTo(opened.current ? -TOTAL_ACTION_WIDTH : 0);
        }
      }),
    [translateX]
  );

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={onEdit}>
          <Text style={styles.actionText}>编辑</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
          <Text style={styles.actionText}>删除</Text>
        </Pressable>
      </View>
      <Animated.View
        style={[styles.foreground, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  actions: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row"
  },
  actionBtn: {
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  },
  editBtn: {
    backgroundColor: "#4B7EFF"
  },
  deleteBtn: {
    backgroundColor: "#EF4444"
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700"
  },
  foreground: {
    backgroundColor: `rgba(255,255,255,${theme.alpha.glassSurface})`
  }
});

