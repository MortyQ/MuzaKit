<script setup lang="ts">
import { computed } from "vue";

import { flyoutItemClasses } from "./SidebarMenuFlyout.styles";

import VIcon from "@/shared/ui/common/VIcon.vue";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Parent item to display (has children but no route) */
  item: SidebarNavItem & { level: number }
}

const props = defineProps<Props>();

// Item classes
const itemClasses = computed(() => {
  const classes = [
    flyoutItemClasses.base,
    flyoutItemClasses.nonClickable,
    "text-neutral/60 font-medium",
  ];

  if (props.item.disabled) {
    classes.push(flyoutItemClasses.disabled);
  }

  return classes;
});
</script>

<template>
  <div
    :class="itemClasses"
    :style="{ paddingLeft: `${12 + item.level * 16}px` }"
  >
    <VIcon
      v-if="item.icon"
      :icon="item.icon"
      :size="16"
      :class="flyoutItemClasses.icon"
    />
    <span :class="flyoutItemClasses.label">{{ item.label }}</span>
    <span
      v-if="item.badge"
      :class="flyoutItemClasses.badge"
    >
      {{ item.badge }}
    </span>
  </div>
</template>
