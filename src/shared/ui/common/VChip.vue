<script setup lang="ts">
import { computed } from "vue";

import VIcon from "./VIcon.vue";

import { SelectValue, VModelValue } from "@/shared/types";
import VTag, { type TagColor } from "@/shared/ui/common/VTag.vue";

export type ChipVariant = "filled" | "outlined" | "soft";

export type ChipColor
  = | "default"
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
  label?: string
  /** Visual variant */
  variant?: ChipVariant
  /** Color scheme */
  color?: ChipColor
  /** Color to use when active (only applies when color="default") */
  selectedColor?: Exclude<ChipColor, "default">
  /** Size variant */
  size?: ChipSize
  /** Icon to display (iconify format) */
  icon?: string
  /** Show close/delete button */
  closable?: boolean
  /** Active/selected state */
  active?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom badge text (e.g., "Category", "New") */
  badge?: string
  /** Badge color theme */
  badgeColor?: TagColor
  /** Custom class */
  class?: string
  /** Value for v-model (unique identifier for this chip) */
  value?: any
  /** Model value for v-model */
  modelValue?: any
  /** Multiple selection mode (for array modelValue) */
  multiple?: boolean
  /**
   * Custom comparison function for complex values (objects)
   * If not provided, uses JSON.stringify for objects, === for primitives
   */

  valueComparator?: (a: any, b: any) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  variant: "soft",
  color: "default",
  selectedColor: "primary",
  size: "md",
  icon: undefined,
  closable: false,
  active: false,
  disabled: false,
  badge: undefined,
  badgeColor: "primary",
  class: "",
  value: undefined,
  modelValue: undefined,
  multiple: false,
  valueComparator: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent]
  close: [event: MouseEvent]
  "update:modelValue": [value: SelectValue]
}>();

// Helper function to compare values (supports primitives and objects)
const isEqual = <T = VModelValue>(a: T, b: T): boolean => {
  // Use custom comparator if provided
  if (props.valueComparator) {
    return props.valueComparator(a, b);
  }

  // Handle null/undefined
  if (a === b) return true;
  if (a == null || b == null) return false;

  // For objects, use JSON comparison (deep equality)
  if (typeof a === "object" && typeof b === "object") {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    catch {
      return false;
    }
  }

  // For primitives, use strict equality
  return a === b;
};

// Compute if chip is selected (for v-model support)
const isSelected = computed(() => {
  // If v-model is used (modelValue is defined)
  if (props.modelValue !== undefined && props.value !== undefined) {
    if (props.multiple) {
      // Multiple mode: check if value is in array using isEqual
      return Array.isArray(props.modelValue)
        && props.modelValue.some((v) => isEqual(v, props.value));
    }
    else {
      // Single mode: check if value equals modelValue using isEqual
      return isEqual(props.modelValue, props.value);
    }
  }
  // Fallback to active prop
  return props.active;
});

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
  // For "default" color, use selectedColor when active
  if (props.color === "default" && isSelected.value) {
    return `vchip--${props.variant}-${props.selectedColor}-selected`;
  }

  const base = `vchip--${props.variant}-${props.color}`;
  return isSelected.value ? `${base}-selected` : base;
});

// State class
const stateClass = computed(() => {
  if (props.disabled) return "vchip--disabled";
  return "vchip--interactive";
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    // Handle v-model update if value and modelValue are defined
    if (props.value !== undefined && props.modelValue !== undefined) {
      if (props.multiple) {
        // Multiple selection mode: toggle value in array
        const currentValue = Array.isArray(props.modelValue)
          ? props.modelValue
          : [];

        // Find index using isEqual for object comparison
        const index = currentValue.findIndex((v) => isEqual(v, props.value));

        if (index > -1) {
          // Remove from array
          const newValue = currentValue.filter((v) => !isEqual(v, props.value));
          emit("update:modelValue", newValue);
        }
        else {
          // Add to array
          emit("update:modelValue", [...currentValue, props.value]);
        }
      }
      else {
        // Single selection mode: toggle value
        if (isEqual(props.modelValue, props.value)) {
          // Deselect if already selected
          emit("update:modelValue", null);
        }
        else {
          // Select new value
          emit("update:modelValue", props.value);
        }
      }
    }

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
      <slot name="badge">
        <VTag
          v-if="badge"
          variant="outline"
          :color="badgeColor"
          :label="badge"
          size="sm"
        />
      </slot>
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
