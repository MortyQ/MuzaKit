<script setup lang="ts">
import { computed, onMounted, type Component } from "vue";
import { useRoute } from "vue-router";

// Import all available layouts
import AuthLayout from "./AuthLayout.vue";
import DefaultLayout from "./DefaultLayout.vue";
import EmptyLayout from "./EmptyLayout.vue";

import { useAuthStore } from "@/features/auth";
import { useThemeStore } from "@/features/theme";
import VLoader from "@/shared/ui/common/VLoader.vue";

/**
 * MasterLayout - Dynamic layout switcher based on route meta
 *
 * Responsibilities:
 * 1. Initialize app state (theme, auth)
 * 2. Show loader during initialization
 * 3. Switch between layouts based on route meta
 *
 * Usage in router:
 * {
 *   path: '/login',
 *   component: LoginPage,
 *   meta: { layout: 'auth' }
 * }
 */

// Layout registry - add new layouts here
const layouts: Record<string, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
  empty: EmptyLayout,
};

const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Initialize theme immediately (synchronously) before any rendering
// This prevents theme "flash" on page load/refresh
themeStore.initTheme();


// Dynamically resolve layout from route meta
const layout = computed(() => {
  const layoutName = (route.meta.layout as string) || "default";
  return layouts[layoutName] || layouts.default;
});

// Show loader only during initial auth initialization
// For protected routes (requiresAuth !== false), also wait for authentication
const shouldShowContent = computed(() => {
  // Always wait for initialization first
  if (!authStore.isInitialized) {
    return false;
  }

  // Check if current route requires authentication
  const requiresAuth = route.meta.requiresAuth !== false;

  // For public routes - show immediately after init
  if (!requiresAuth) {
    return true;
  }

  // For protected routes - only show if authenticated
  // This prevents DefaultLayout from flashing before redirect to login
  return authStore.isAuthenticated;
});

// Initialize auth state on mount
// This loads user data if token exists, ensuring guards work synchronously
onMounted(async () => {
  await authStore.initialize();
});
</script>

<template>
  <!-- Show global loader until we can show content -->
  <div
    v-if="!shouldShowContent"
    class="min-h-screen bg-mainBg flex items-center justify-center"
  >
    <VLoader size="large" />
  </div>

  <!-- Show layout when ready -->
  <component
    :is="layout"
    v-else
  />
</template>

