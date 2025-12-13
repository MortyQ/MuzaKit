<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { flyoutItemClasses } from "./SidebarMenuFlyout.styles";

import VIcon from "@/shared/ui/common/VIcon.vue";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Child item to display */
  item: SidebarNavItem & { level: number };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [item: SidebarNavItem];
}>();

const route = useRoute();

// Check if item is active (current route)
const isActive = computed(() => {
  if (!props.item.to) return false;

  if (typeof props.item.to === "string") {
    return route.path === props.item.to;
  }

  if (props.item.to.name) {
    return route.name === props.item.to.name;
  }

  return false;
});

// Item classes
const itemClasses = computed(() => {
  const classes = [
    flyoutItemClasses.base,
    flyoutItemClasses.interactive,
  ];

  if (isActive.value) {
    classes.push(flyoutItemClasses.active);
  }

  if (props.item.disabled) {
    classes.push(flyoutItemClasses.disabled);
  }

  return classes;
});

const handleClick = () => {
  if (!props.item.disabled) {
    emit("click", props.item);
  }
};
</script>

<template>
  <router-link
    v-if="item.to"
    :to="item.to as any"
    :class="itemClasses"
    :style="{ paddingLeft: `${12 + item.level * 16}px` }"
    @click="handleClick"
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
  </router-link>
</template>

