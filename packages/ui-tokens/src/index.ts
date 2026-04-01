export const glassTokens = {
  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
    pill: 999
  },
  blur: {
    card: 28,
    tab: 34,
    modal: 36
  },
  alpha: {
    glassSurface: 0.72,
    glassBorder: 0.52,
    glassOverlay: 0.2
  },
  shadow: {
    card: {
      shadowColor: "#1F2A37",
      shadowOpacity: 0.13,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8
    },
    floating: {
      shadowColor: "#152238",
      shadowOpacity: 0.17,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 16 },
      elevation: 10
    }
  },
  colors: {
    textPrimary: "#0B1A2A",
    textSecondary: "#435A70",
    textMuted: "#6E8398",
    accentBlue: "#2A7BFF",
    accentCyan: "#30C6E8",
    accentGreen: "#22C55E",
    accentRed: "#EF4444",
    accentOrange: "#F97316",
    backgroundA: "#E8F3FF",
    backgroundB: "#E6F9F7",
    backgroundC: "#EEF0FF",
    cardWhite: "#FFFFFF"
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  motion: {
    short: 160,
    medium: 240,
    long: 380
  }
} as const;

export type GlassTokens = typeof glassTokens;

