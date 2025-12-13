<script setup lang="ts">
import SidebarMobileNavItem from "./SidebarMobileNavItem.vue";

import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Navigation items */
  items: SidebarNavItem[];
}

defineProps<Props>();
</script>

<template>
  <nav
    class="sidebar-mobile-nav flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1"
    aria-label="Mobile navigation"
  >
    <SidebarMobileNavItem
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </nav>
</template>

