import { glassTokens } from "@xiaohebao/ui-tokens";

export const theme = {
  ...glassTokens,
  typography: {
    title: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: glassTokens.colors.textPrimary
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "500" as const,
      color: glassTokens.colors.textSecondary
    },
    body: {
      fontSize: 14,
      fontWeight: "500" as const,
      color: glassTokens.colors.textSecondary
    }
  }
} as const;

