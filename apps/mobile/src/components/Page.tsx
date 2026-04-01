import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassBackground } from "./GlassBackground";
import { theme } from "../theme";

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  scroll?: boolean;
}>;

export function Page({ children, title, subtitle, scroll = true }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <GlassBackground />
      <Body
        contentContainerStyle={styles.content}
        style={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        ) : null}
        {children}
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  body: {
    flex: 1
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: 130
  },
  header: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs
  },
  title: {
    ...theme.typography.title
  },
  subtitle: {
    ...theme.typography.subtitle
  }
});

