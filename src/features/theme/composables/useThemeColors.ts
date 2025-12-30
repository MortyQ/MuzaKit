import { computed } from "vue";

import { useThemeStore } from "./useTheme";

export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryActive: string
  primarySubtle: string
  success: string
  warning: string
  error: string
  info: string
  bgBase: string
  bgElevated: string
  bgSubtle: string
  textPrimary: string
  textSecondary: string
  borderDefault: string
  borderStrong: string
}

export interface ThemeGradients {
  blue: string
  blueSubtle: string
  blueDark: string
  radialBlue: string
  mesh: string
}

export const useThemeColors = () => {
  const themeStore = useThemeStore();

  const colors = computed<ThemeColors>(() => {
    const isDark = themeStore.isDark;
    return {
      primary: isDark ? "#38bdf8" : "#0ea5e9",
      primaryHover: isDark ? "#0ea5e9" : "#0284c7",
      primaryActive: isDark ? "#0284c7" : "#0369a1",
      primarySubtle: isDark ? "#082f49" : "#e0f2fe",
      success: isDark ? "#4ade80" : "#22c55e",
      warning: isDark ? "#fbbf24" : "#f59e0b",
      error: isDark ? "#f87171" : "#ef4444",
      info: isDark ? "#22d3ee" : "#06b6d4",
      bgBase: isDark ? "#0f172a" : "#ffffff",
      bgElevated: isDark ? "#1e293b" : "#f8fafc",
      bgSubtle: isDark ? "#334155" : "#f1f5f9",
      textPrimary: isDark ? "#f1f5f9" : "#1e293b",
      textSecondary: isDark ? "#94a3b8" : "#64748b",
      borderDefault: isDark ? "#334155" : "#e2e8f0",
      borderStrong: isDark ? "#475569" : "#cbd5e1",
    };
  });

  const gradients = computed<ThemeGradients>(() => {
    const isDark = themeStore.isDark;
    return {
      blue: isDark ? "linear-gradient(135deg,#0c4a6e 0%,#075985 50%,#082f49 100%)" : "linear-gradient(135deg,#87CEEB 0%,#4A90E2 50%,#00008B 100%)",
      blueSubtle: "linear-gradient(135deg,#e0f2fe 0%,#bae6fd 50%,#7dd3fc 100%)",
      blueDark: "linear-gradient(135deg,#0c4a6e 0%,#075985 50%,#082f49 100%)",
      radialBlue: isDark ? "radial-gradient(circle at top,#0c4a6e,#075985,#082f49)" : "radial-gradient(circle at top,#87CEEB,#4A90E2,#00008B)",
      mesh: "radial-gradient(at 0% 0%, #87CEEB 0px, transparent 50%), radial-gradient(at 100% 100%, #00008B 0px, transparent 50%), radial-gradient(at 50% 50%, #4A90E2 0px, transparent 50%)",
    };
  });

  const getColor = (key: keyof ThemeColors) => colors.value[key];
  const getGradient = (key: keyof ThemeGradients) => gradients.value[key];

  return {
    colors,
    gradients,
    getColor,
    getGradient,
    isDark: computed(() => themeStore.isDark),
    isLight: computed(() => themeStore.isLight),
  };
};

export const useStatusColors = () => {
  const { colors } = useThemeColors();
  const statusColorMap = computed(() => ({
    success: colors.value.success,
    warning: colors.value.warning,
    error: colors.value.error,
    info: colors.value.info,
    active: colors.value.success,
    inactive: colors.value.error,
    pending: colors.value.warning,
  }));
  const getStatusColor = (
    status: keyof typeof statusColorMap.value,
  ) => statusColorMap.value[status];
  return { statusColorMap, getStatusColor };
};
