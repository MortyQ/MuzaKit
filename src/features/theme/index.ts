/**
 * Theme Feature
 *
 * Provides theme management functionality including:
 * - Theme toggle component with light/dark/auto modes
 * - Theme state management with Pinia
 * - Theme utilities for Tailwind CSS
 * - System theme detection and synchronization
 *
 * @example
 * ```ts
 * import { ThemeToggle, useThemeStore } from '@/features/theme';
 *
 * const themeStore = useThemeStore();
 * const { isDark, themeMode, toggleTheme } = themeStore;
 * ```
 */

export { default as ThemeToggle } from "./components/ThemeToggle.vue";
export { useThemeStore } from "./composables/useTheme";
export type { ThemeMode, ResolvedTheme } from "./composables/useTheme";
export { createThemes } from "./utils/createThemes";
