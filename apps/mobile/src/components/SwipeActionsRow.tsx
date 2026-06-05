import { PropsWithChildren, useMemo, useRef, useState } from "react";
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
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PropsWithChildren<{
  onEdit: () => void;
  onDelete: () => void;
}>;

export function SwipeActionsRow({ children, onEdit, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opened = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const animateTo = (toValue: number) => {
    const nextOpen = toValue !== 0;
    opened.current = nextOpen;
    setIsOpen(nextOpen);
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      bounciness: 6,
      speed: 18
    }).start();
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
          if (gestureState.dx < -24 || gestureState.vx < -0.25) {
            animateTo(-TOTAL_ACTION_WIDTH);
            return;
          }
          if (gestureState.dx > 14 || gestureState.vx > 0.2) {
            animateTo(0);
            return;
          }
          animateTo(opened.current ? -TOTAL_ACTION_WIDTH : 0);
        }
      }),
    [translateX]
  );
  const actionsOpacity = translateX.interpolate({
    inputRange: [-TOTAL_ACTION_WIDTH, -12, 0],
    outputRange: [1, 0.35, 0],
    extrapolate: "clamp"
  });

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[styles.actions, { opacity: actionsOpacity }]}
      >
        <Pressable
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => {
            animateTo(0);
            onEdit();
          }}
        >
          <Text style={[styles.actionText, styles.editText]}>编辑</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => {
            animateTo(0);
            onDelete();
          }}
        >
          <Text style={[styles.actionText, styles.deleteText]}>删除</Text>
        </Pressable>
      </Animated.View>
      <AnimatedPressable
        onPress={() => {
          if (opened.current) animateTo(0);
        }}
        style={[styles.foreground, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: theme.radius.lg
  },
  actions: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255,255,255,0.46)"
  },
  actionBtn: {
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2
  },
  editBtn: {
    backgroundColor: "rgba(42,123,255,0.16)",
    borderTopLeftRadius: theme.radius.lg,
    borderBottomLeftRadius: theme.radius.lg
  },
  deleteBtn: {
    backgroundColor: "rgba(239,68,68,0.14)",
    borderTopRightRadius: theme.radius.lg,
    borderBottomRightRadius: theme.radius.lg
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700"
  },
  editText: {
    color: theme.colors.accentBlue
  },
  deleteText: {
    color: theme.colors.accentRed
  },
  foreground: {
    zIndex: 1,
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    backgroundColor: `rgba(255,255,255,${theme.alpha.glassSurface})`
  }
});
