<script setup lang="ts">
import SidebarMobileNavItem from "./SidebarMobileNavItem.vue";

import { UserMenu } from "@/features/auth";
import { ThemeToggle } from "@/features/theme";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Footer items */
  items?: SidebarNavItem[];
  /** Show theme toggle */
  showThemeToggle?: boolean;
  /** Show user menu */
  showUserMenu?: boolean;
}
withDefaults(defineProps<Props>(), {
  items: () => [],
  showThemeToggle: true,
  showUserMenu: true,
});
</script>
<template>
  <div class="sidebar-mobile-footer border-t border-base-300/50 px-3 py-4">
    <!-- User Menu -->
    <div
      v-if="showUserMenu"
      class="mb-3"
    >
      <UserMenu class="w-full" />
    </div>

    <!-- Theme Toggle -->
    <div
      v-if="showThemeToggle"
      class="mb-3"
    >
      <ThemeToggle
        show-label
        class="w-full"
      />
    </div>

    <!-- Footer Navigation Items -->
    <div
      v-if="items && items.length > 0"
      class="space-y-1"
    >
      <SidebarMobileNavItem
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
