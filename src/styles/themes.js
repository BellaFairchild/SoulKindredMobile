// src/styles/themes.js
import { colors, gradients } from "./colors";

const moodColors = {
  happy: { border: "#73F4FF", shadow: "rgba(115,244,255,0.6)" },
  calm: { border: "#26C7D9", shadow: "rgba(38,199,217,0.6)" },
  sad: { border: "#6F7A93", shadow: "rgba(111,122,147,0.6)" },
  anxious: { border: "#FFC857", shadow: "rgba(255,200,87,0.45)" },
  overwhelmed: { border: "#FF5C9E", shadow: "rgba(255,92,158,0.55)" },
  default: { border: colors.border, shadow: "rgba(0,0,0,0.2)" }
};

export const darkTheme = {
  name: "dark",
  background: colors.background,
  surface: colors.surface,
  surfaceMuted: colors.surfaceMuted,
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  border: colors.border,
  accent: colors.accent,
  chatGradient: gradients.chat,
  cardGradient: gradients.card,
  buttonGradient: gradients.button,
  userBubbleBg: "rgba(115,244,255,0.08)",
  aiBubbleBg: "rgba(255,255,255,0.05)",
  userBubbleBorder: "rgba(115,244,255,0.35)",
  aiBubbleBorder: "rgba(255,255,255,0.14)",
  userBubbleText: colors.textPrimary,
  aiBubbleText: colors.textPrimary,
  moodColors
};

export const lightTheme = {
  ...darkTheme,
  name: "light",
  background: "#F7FBFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F0F4FA",
  text: "#0B172A",
  textSecondary: "#364157",
  border: "#CBD5E1",
  chatGradient: ["#F2F6FF", "#E6F0FF", "#DCE7FB"],
  userBubbleBg: "#E3F8FF",
  aiBubbleBg: "#F5F7FB",
  userBubbleBorder: "#26C7D9",
  aiBubbleBorder: "#CBD5E1",
  userBubbleText: "#0B172A",
  aiBubbleText: "#0B172A"
};
