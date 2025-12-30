<script lang="ts" setup>
import { computed } from "vue";

import VIcon from "./VIcon.vue";

export interface SegmentOption {
  label: string
  value: string | number
  icon?: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: SegmentOption[]
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  fullWidth: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-xs px-2 py-1";
    case "lg":
      return "text-base px-4 py-2.5";
    default:
      return "text-sm px-3 py-2";
  }
});

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return 14;
    case "lg":
      return 20;
    default:
      return 16;
  }
});

const handleSelect = (option: SegmentOption) => {
  if (option.disabled || props.disabled) return;
  emit("update:modelValue", option.value);
};

const isSelected = (option: SegmentOption) => {
  return props.modelValue === option.value;
};
</script>

<template>
  <div
    :class="{ 'w-full': fullWidth, 'opacity-50 pointer-events-none': disabled }"
    class="v-segmented-control inline-flex items-center rounded-lg
    bg-base-200 p-1 border-[1px] border-cardBorder shadow-md gap-1"
  >
    <button
      v-for="option in options"
      :key="option.value"
      :aria-pressed="isSelected(option)"
      :class="[
        sizeClasses,
        fullWidth ? 'flex-1' : '',
        isSelected(option)
          ? 'bg-cardBg text-primary shadow-sm'
          : 'text-secondaryText hover:text-mainText',
        option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      :disabled="option.disabled || disabled"
      class="
        relative flex items-center justify-center gap-1.5 rounded-md
        font-medium transition-all duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
      "
      type="button"
      @click="handleSelect(option)"
    >
      <VIcon
        v-if="option.icon"
        :icon="option.icon"
        :size="iconSize"
      />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.v-segmented-control button {
  min-width: 0;
  white-space: nowrap;
}
</style>
