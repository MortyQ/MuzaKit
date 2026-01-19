<script setup lang="ts">
import { computed } from "vue";

import VIcon from "./VIcon.vue";

export type TagVariant = "solid"
  | "soft"
  | "outline"
  | "ghost";

export type TagColor = "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "gray";

export type TagSize = "xs" | "sm" | "md" | "lg";

interface Props {
  /** Text content of the tag */
  label?: string
  /** Visual variant */
  variant?: TagVariant
  /** Color scheme */
  color?: TagColor
  /** Size variant */
  size?: TagSize
  /** Icon to display (lucide format) */
  icon?: string
  /** Icon position */
  iconPosition?: "left" | "right"
  /** Make tag rounded/pill shaped */
  rounded?: boolean
  /** Custom class */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  variant: "soft",
  color: "primary",
  size: "sm",
  icon: undefined,
  iconPosition: "left",
  rounded: false,
  class: "",
});

// Icon size based on tag size
const iconSize = computed(() => {
  const sizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };
  return sizes[props.size];
});

// Size class
const sizeClass = computed(() => `vtag--${props.size}`);

// Variant and color class
const variantColorClass = computed(() => `vtag--${props.variant}-${props.color}`);

// Rounded class
const roundedClass = computed(() => props.rounded ? "vtag--rounded" : "vtag--square");
</script>

<template>
  <span
    :class="[sizeClass, variantColorClass, roundedClass, props.class]"
    class="vtag"
  >
    <!-- Left Icon -->
    <VIcon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      :size="iconSize"
    />

    <!-- Label or Slot Content -->
    <span v-if="label || $slots.default">
      <slot>{{ label }}</slot>
    </span>

    <!-- Right Icon -->
    <VIcon
      v-if="icon && iconPosition === 'right'"
      :icon="icon"
      :size="iconSize"
    />
  </span>
</template>
