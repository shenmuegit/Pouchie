import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

export function GlassBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[theme.colors.backgroundA, theme.colors.backgroundB, theme.colors.backgroundC]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />
      <View style={[styles.orb, styles.orbCenter]} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.32
  },
  orbTop: {
    width: 260,
    height: 260,
    left: -40,
    top: -20,
    backgroundColor: "#9FD1FF"
  },
  orbBottom: {
    width: 280,
    height: 280,
    right: -50,
    bottom: 70,
    backgroundColor: "#B4CBFF"
  },
  orbCenter: {
    width: 220,
    height: 220,
    alignSelf: "center",
    top: "35%",
    backgroundColor: "#98E9ED"
  }
});

