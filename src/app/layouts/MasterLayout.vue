<script setup lang="ts">
import { computed, type Component, watch } from "vue";
import { useRoute } from "vue-router";

import AuthLayout from "./AuthLayout.vue";
import DefaultLayout from "./DefaultLayout.vue";
import EmptyLayout from "./EmptyLayout.vue";

import router from "@/app/router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useThemeStore } from "@/features/theme";
import { useGlobalFiltersStore } from "@/shared/stores";

const layouts: Record<string, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
  empty: EmptyLayout,
};

const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const globalFiltersStore = useGlobalFiltersStore();

// Initialize theme immediately (synchronous)
themeStore.initTheme();

// Initialize global filters once when user is authenticated
watch(() => authStore.user, async () => {
  if (!authStore.user) return;

  // Wait for router to be ready (query params parsed)
  await router.isReady();

  // Initialize all filters from URL (loads data and restores all filters including dates)
  await globalFiltersStore.initFilters(route.query as Record<string, string | undefined>);
}, {
  immediate: true,
});

// Dynamically resolve layout from route meta
const layout = computed(() => {
  const layoutName = (route.meta?.layout as string) || "default";
  return layouts[layoutName] || layouts.default;
});
</script>

<template>
  <component :is="layout" />
</template>
