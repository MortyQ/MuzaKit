<script setup lang="ts">
import SidebarNavItemComponent from "./SidebarNavItem.vue";

import { UserMenu } from "@/features/auth";
import { ThemeToggle } from "@/features/theme";
import { useSidebar } from "@/widgets/navigationSidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Footer navigation items (e.g., Settings) */
  items?: SidebarNavItem[]
  /** Show theme toggle */
  showThemeToggle?: boolean
  /** Show user menu */
  showUserMenu?: boolean
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  showThemeToggle: true,
  showUserMenu: true,
});

const { isCollapsed } = useSidebar();
</script>

<template>
  <div
    class="sidebar-footer mt-auto"
    :class="{ 'px-2 py-3': isCollapsed, 'px-3 py-4': !isCollapsed }"
  >
    <!-- User Menu -->
    <div
      v-if="showUserMenu"
      class="mb-3"
    >
      <UserMenu :compact="isCollapsed" />
    </div>

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
