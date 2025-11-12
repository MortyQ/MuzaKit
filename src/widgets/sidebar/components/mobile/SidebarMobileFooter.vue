<script setup lang="ts">
import SidebarMobileNavItem from "./SidebarMobileNavItem.vue";

import type { SidebarNavItem } from "@/widgets/sidebar/types";

interface Props {
  /** Footer items */
  items?: SidebarNavItem[];
}
withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>
<template>
  <div
    v-if="items && items.length > 0"
    class="sidebar-mobile-footer border-t border-base-300/50 px-3 py-4 space-y-1"
  >
    <SidebarMobileNavItem
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>
