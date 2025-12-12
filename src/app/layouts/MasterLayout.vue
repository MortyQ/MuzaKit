<script setup lang="ts">
import { computed, type Component } from "vue";
import { useRoute } from "vue-router";

import AuthLayout from "./AuthLayout.vue";
import DefaultLayout from "./DefaultLayout.vue";
import EmptyLayout from "./EmptyLayout.vue";

import { useThemeStore } from "@/features/theme";

const layouts: Record<string, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
  empty: EmptyLayout,
};

const route = useRoute();
const themeStore = useThemeStore();

// Initialize theme immediately (synchronous)
themeStore.initTheme();

// Dynamically resolve layout from route meta
const layout = computed(() => {
  const layoutName = (route.meta?.layout as string) || "default";
  return layouts[layoutName] || layouts.default;
});
</script>

<template>
  <component :is="layout" />
</template>

