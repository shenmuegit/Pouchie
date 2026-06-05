import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";
import { PropsWithChildren, useEffect, useRef } from "react";
import { motionDurations, motionScale } from "../lib/motion";

type MotionViewProps = PropsWithChildren<{
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function MotionView({
  children,
  delay = 0,
  distance = 14,
  style
}: MotionViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motionDurations.enter,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true
      })
    ]);

    animation.start();
    return () => animation.stop();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

type MotionPressableProps = PropsWithChildren<Omit<PressableProps, "children"> & {
  scaleTo?: number;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function MotionPressable({
  children,
  disabled,
  onPressIn,
  onPressOut,
  scaleTo = motionScale.press,
  contentStyle,
  ...props
}: MotionPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      speed: 28,
      bounciness: 4,
      useNativeDriver: true
    }).start();
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        if (!disabled) animateTo(scaleTo);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1);
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[contentStyle, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
