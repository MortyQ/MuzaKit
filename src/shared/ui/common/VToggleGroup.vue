<script generic="T extends string | number" lang="ts" setup>
import VIcon from "@/shared/ui/common/VIcon.vue";

export interface ToggleOption<V = string | number> {
  label: string
  value: V
  icon?: string
  disabled?: boolean
}

withDefaults(defineProps<{
  modelValue: T
  options: ToggleOption<T>[]
  size?: "sm" | "md" | "lg"
}>(), {
  size: "md",
});

const emit = defineEmits<{
  "update:modelValue": [value: T]
}>();

const sizeClasses = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const handleSelect = (option: ToggleOption<T>) => {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
};
</script>

<template>
  <div class="inline-flex items-center gap-1 bg-base-200 rounded-lg p-1">
    <button
      v-for="option in options"
      :key="String(option.value)"
      :class="[
        sizeClasses[size],
        modelValue === option.value
          ? 'bg-primary text-white shadow-sm'
          : 'text-secondaryText hover:text-mainText hover:bg-base-300',
        option.disabled && 'opacity-50 cursor-not-allowed',
      ]"
      :disabled="option.disabled"
      class="flex items-center rounded-md font-medium transition-all"
      type="button"
      @click="handleSelect(option)"
    >
      <VIcon
        v-if="option.icon"
        :class="iconSizeClasses[size]"
        :icon="option.icon"
      />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
