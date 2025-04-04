import { createConfig } from "@gluestack-ui/themed";

export const config = createConfig({
  name: "soccer-games-app-theme",
  tokens: {
    colors: {
      primary500: "#4051B5", // Primary color - soccer blue
      secondary500: "#1EB980", // Secondary color - green accent
      tertiary500: "#FF6D00", // Tertiary color - orange accent
      error500: "#DC2626", // Error color
      success500: "#16A34A", // Success color
      warning500: "#EAB308", // Warning color
      info500: "#0EA5E9", // Info color
      coolGray50: "#f9fafb",
      coolGray100: "#f3f4f6",
      coolGray200: "#e5e7eb",
      coolGray300: "#d1d5db",
      coolGray400: "#9ca3af",
      coolGray500: "#6b7280",
      coolGray600: "#4b5563",
      coolGray700: "#374151",
      coolGray800: "#1f2937",
      coolGray900: "#111827",
    },
    fonts: {
      body: "system-ui, sans-serif",
      heading: "system-ui, sans-serif",
      mono: "monospace",
    },
    fontSizes: {
      "2xs": 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
      "6xl": 60,
      "7xl": 72,
      "8xl": 96,
      "9xl": 128,
    },
    space: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      12: 48,
      16: 64,
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      "2xl": 16,
      "3xl": 24,
      full: 9999,
    },
  },
});
