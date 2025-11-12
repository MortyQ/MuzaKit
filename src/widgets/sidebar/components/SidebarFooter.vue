<script setup lang="ts">
import SidebarNavItemComponent from "./SidebarNavItem.vue";

import { ThemeToggle } from "@/features/theme";
import { useSidebar } from "@/widgets/sidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/sidebar/types";

interface Props {
  /** Footer navigation items (e.g., Settings) */
  items?: SidebarNavItem[];
  /** Show theme toggle */
  showThemeToggle?: boolean;
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  showThemeToggle: true,
});

const { isCollapsed } = useSidebar();
</script>

<template>
  <div
    class="sidebar-footer border-t border-base-300 mt-auto"
    :class="{ 'px-2 py-3': isCollapsed, 'px-3 py-4': !isCollapsed }"
  >
    <!-- Theme Toggle -->
    <div
      v-if="showThemeToggle"
      class="mb-3"
    >
      <ThemeToggle
        :show-label="!isCollapsed"
        :compact="isCollapsed"
        :class="!isCollapsed ? 'w-full' : ''"
      />
    </div>

    <!-- Footer Navigation Items -->
    <div
      v-if="items.length > 0"
      class="space-y-1"
    >
      <SidebarNavItemComponent
        v-for="item in items"
        :key="item.id"
        :item="item"
        :level="0"
      />
    </div>
  </div>
</template>

