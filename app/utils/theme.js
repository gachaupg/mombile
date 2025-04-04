// App theme and style constants

// Colors
export const colors = {
  primary: "#4051B5", // Soccer blue
  secondary: "#1EB980", // Green accent
  tertiary: "#FF6D00", // Orange accent
  background: "#F5F7FA",
  white: "#FFFFFF",
  black: "#000000",
  text: {
    primary: "#333333",
    secondary: "#666666",
    tertiary: "#999999",
    light: "#FFFFFF",
  },
  success: "#16A34A",
  error: "#DC2626",
  warning: "#EAB308",
  info: "#0EA5E9",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

// Spacing
export const spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Typography
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Shadows
export const shadows = {
  light: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  strong: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Border radius
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Common style components
export const commonStyles = {
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.m,
    ...shadows.light,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
  },
  screenTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.m,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    secondary: {
      backgroundColor: colors.white,
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      backgroundColor: "transparent",
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      alignItems: "center",
      justifyContent: "center",
    },
  },
  buttonText: {
    primary: {
      color: colors.white,
      fontWeight: typography.fontWeights.medium,
      fontSize: typography.fontSizes.md,
    },
    secondary: {
      color: colors.primary,
      fontWeight: typography.fontWeights.medium,
      fontSize: typography.fontSizes.md,
    },
    text: {
      color: colors.primary,
      fontWeight: typography.fontWeights.medium,
      fontSize: typography.fontSizes.md,
    },
  },
};
