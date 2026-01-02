<script lang="ts" setup>
import { computed } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";

import { flyoutItemClasses } from "./SidebarMenuFlyout.styles";

import { prefetchRoute } from "@/app/router/utils/prefetch";
import VIcon from "@/shared/ui/common/VIcon.vue";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Child item to display */
  item: SidebarNavItem & { level: number }
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [item: SidebarNavItem]
}>();

const route = useRoute();
const router = useRouter();

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

const handleMouseEnter = () => {
  if (props.item.disabled || !props.item.to) return;

  prefetchRoute(router, props.item.to as RouteLocationRaw);
};

const handleClick = () => {
  if (!props.item.disabled) {
    emit("click", props.item);
  }
};
</script>

<template>
  <router-link
    v-if="item.to"
    :class="itemClasses"
    :style="{ paddingLeft: `${12 + item.level * 16}px` }"
    :to="item.to as any"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <VIcon
      v-if="item.icon"
      :class="flyoutItemClasses.icon"
      :icon="item.icon"
      :size="16"
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
