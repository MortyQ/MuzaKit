<script setup lang="ts">
import SidebarNavItemComponent from "./SidebarNavItem.vue";

import { useSidebar } from "@/widgets/sidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/sidebar/types";

interface Props {
  /** Footer navigation items (e.g., Settings) */
  items?: SidebarNavItem[];
}

withDefaults(defineProps<Props>(), {
  items: () => [],
});

const { isCollapsed } = useSidebar();
</script>

<template>
  <div
    v-if="items.length > 0"
    class="sidebar-footer border-t border-base-300 px-3 py-4"
    :class="{ 'px-2': isCollapsed }"
  >
    <div class="space-y-1">
      <SidebarNavItemComponent
        v-for="item in items"
        :key="item.id"
        :item="item"
        :level="0"
      />
    </div>
  </div>
</template>

