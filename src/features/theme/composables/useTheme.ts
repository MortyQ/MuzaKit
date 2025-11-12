import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

/**
 * Theme store for managing application theme state
 * Uses Composition API style for better TypeScript support
 * Supports light, dark and auto (system) modes
 */
export const useThemeStore = defineStore("theme", () => {
  const themeMode = ref<ThemeMode>("auto");
  const resolvedTheme = ref<ResolvedTheme>("light");

  const isDark = computed(() => resolvedTheme.value === "dark");
  const isLight = computed(() => resolvedTheme.value === "light");
  const isAuto = computed(() => themeMode.value === "auto");

  /**
   * Get system color scheme preference
   */
  const getSystemTheme = (): ResolvedTheme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  /**
   * Resolve actual theme based on mode
   */
  const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
    if (mode === "auto") {
      return getSystemTheme();
    }
    return mode;
  };

  /**
   * Update DOM with current theme
   */
  const updateDocumentTheme = (theme: ResolvedTheme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  /**
   * Set theme mode (light, dark, or auto)
   */
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode;
    const resolved = resolveTheme(mode);
    resolvedTheme.value = resolved;
    updateDocumentTheme(resolved);
    localStorage.setItem("theme-mode", mode);
  };

  /**
   * Toggle between light and dark modes
   */
  const toggleTheme = () => {
    // Cycle through: light -> dark -> auto -> light
    const newMode: ThemeMode =
      themeMode.value === "light" ? "dark" :
        themeMode.value === "dark" ? "auto" :
          "light";
    setThemeMode(newMode);
  };

  /**
   * Initialize theme from localStorage or system preference
   */
  const initTheme = () => {
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
    const mode = savedMode || "auto";
    setThemeMode(mode);

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode.value === "auto") {
        resolvedTheme.value = e.matches ? "dark" : "light";
        updateDocumentTheme(resolvedTheme.value);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
  };

  return {
    themeMode,
    resolvedTheme,
    isDark,
    isLight,
    isAuto,
    setThemeMode,
    toggleTheme,
    initTheme,
  };
});
