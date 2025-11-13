<script setup lang="ts">
import SidebarNavItemComponent from "./SidebarNavItem.vue";

import { useSidebar } from "@/widgets/sidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/sidebar/types";

interface Props {
  /** Navigation items */
  items: SidebarNavItem[];
}

defineProps<Props>();

const { isCollapsed } = useSidebar();
</script>

<template>
  <nav
    class="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
    :class="{ 'px-2': isCollapsed }"
  >
    <div class="space-y-1 nav-items-container">
      <SidebarNavItemComponent
        v-for="item in items"
        :key="item.id"
        :item="item"
        :level="0"
      />
    </div>
  </nav>
</template>

<style scoped>
.sidebar-nav {
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Navigation items container - smooth layout with grid */
</style>

