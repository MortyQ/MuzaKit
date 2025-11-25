<script setup lang="ts">
import { computed } from "vue";

import VIcon from "./VIcon.vue";

import VTag from "@/shared/ui/common/VTag.vue";

export type ChipVariant = "filled" | "outlined" | "soft";

export type ChipColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type ChipSize = "sm" | "md" | "lg";

interface Props {
  /** Label text of the chip */
  label?: string;
  /** Visual variant */
  variant?: ChipVariant;
  /** Color scheme */
  color?: ChipColor;
  /** Size variant */
  size?: ChipSize;
  /** Icon to display (iconify format) */
  icon?: string;
  /** Show close/delete button */
  closable?: boolean;
  /** Active/selected state */
  active?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom badge text (e.g., "Category", "New") */
  badge?: string;
  /** Custom class */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  variant: "soft",
  color: "primary",
  size: "md",
  icon: undefined,
  closable: false,
  active: false,
  disabled: false,
  badge: undefined,
  class: "",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  close: [event: MouseEvent];
}>();

// Icon size based on chip size
const iconSize = computed(() => {
  const sizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };
  return sizes[props.size];
});

// Size class
const sizeClass = computed(() => `vchip--${props.size}`);

// Variant and color class
const variantColorClass = computed(() => {
  const base = `vchip--${props.variant}-${props.color}`;
  return props.active ? `${base}-active` : base;
});

// State class
const stateClass = computed(() => {
  if (props.disabled) return "vchip--disabled";
  return "vchip--interactive";
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};

const handleClose = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("close", event);
  }
};
</script>

<template>
  <span
    :class="[sizeClass, variantColorClass, stateClass, props.class]"
    class="vchip"
    @click="handleClick"
  >
    <!-- Content wrapper -->
    <span class="vchip__content">
      <!-- Left Icon -->
      <VIcon
        v-if="icon"
        :icon="icon"
        :size="iconSize"
        class="vchip__icon"
      />

      <!-- Label or Slot Content -->
      <span
        v-if="label || $slots.default"
        class="vchip__label"
      >
        <slot>{{ label }}</slot>
      </span>

      <!-- Badge (positioned after label like on screenshot) -->
      <VTag
        v-if="badge"
        variant="outline"
        color="primary"
        :label="badge"
        size="sm"
      />
    </span>

    <!-- Close Button (outside of content wrapper) -->
    <button
      v-if="closable"
      class="vchip__close"
      type="button"
      :disabled="disabled"
      @click.stop="handleClose"
    >
      <VIcon
        icon="lucide:x"
        :size="iconSize - 2"
      />
    </button>
  </span>
</template>
