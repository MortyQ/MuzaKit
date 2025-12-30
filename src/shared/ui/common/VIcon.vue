<script lang="ts" setup>
import { computed, type Component } from "vue";

import { iconMap, hasIcon } from "@/shared/config/icons";

interface Props {
  /** Icon name in format "collection:name" (e.g., "mdi:home", "heroicons:user-solid") */
  icon: string
  /** Icon size in pixels (default: 24) */
  size?: string | number
  /** Icon color (default: currentColor) */
  color?: string
  /** Additional CSS class */
  class?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: "currentColor",
  class: "",
});

/**
 * Check if color is a Tailwind class (starts with 'text-') or CSS color value
 */
const isTailwindClass = computed(() => {
  return props.color.startsWith("text-");
});

/**
 * Get the color class if it's a Tailwind class
 */
const colorClass = computed(() => {
  return isTailwindClass.value ? props.color : "";
});

/**
 * Fallback component for missing or failed icon imports
 */
const FallbackIcon: Component = {
  template: "<span style=\"font-family: monospace; font-weight: bold; color: #ef4444;\">?</span>",
};

/**
 * Get icon component from icon map
 */
const iconComponent = computed<Component>(() => {
  // Show loading spinner first if loading is true
  if (props.loading) {
    return iconMap["lucide:loading"];
  }

  // Check if icon exists
  if (!hasIcon(props.icon)) {
    console.warn(
      `[VIcon] Icon "${props.icon}" not found. `
      + `Add it to src/config/icons.ts or check the icon name format.`,
    );
    return FallbackIcon;
  }

  return iconMap[props.icon];
});

/**
 * Computed styles for icon wrapper
 */
const iconStyles = computed(() => ({
  width: typeof props.size === "number" ? `${props.size}px` : props.size,
  height: typeof props.size === "number" ? `${props.size}px` : props.size,
  color: isTailwindClass.value ? undefined : props.color,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));
</script>

<template>
  <span
    :class="[{ 'animate-spin': props.loading }, colorClass, props.class]"
    :style="iconStyles"
    class="v-icon"
  >
    <component :is="iconComponent" />
  </span>
</template>
