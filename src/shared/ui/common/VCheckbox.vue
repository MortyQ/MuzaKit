<script lang="ts" setup>
import { computed, ref, useId, watchEffect } from "vue";

interface Props {
  modelValue?: boolean | string | number | any
  id?: string
  label?: string
  value?: string | number | boolean | any
  disabled?: boolean
  indeterminate?: boolean
}

const props = defineProps<Props>();
const emit = defineEmits<{

  (event: "update:modelValue", value: boolean | string | number | any): void
}>();

// Generate unique ID if not provided
const generatedId = useId();
const uniqueId = computed(() => props.id || generatedId);

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const inputRef = ref<HTMLInputElement | null>(null);

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = !!props.indeterminate;
  }
});
</script>

<template>
  <div class="inline-flex items-center gap-2 select-none">
    <input
      :id="uniqueId"
      ref="inputRef"
      v-model="modelValue"
      :disabled="props.disabled"
      :value="value"
      class="checkbox-base"
      type="checkbox"
      v-bind="$attrs"
    >
    <label
      v-if="label || $slots.label"
      :class="[
        'text-[14px] text-secondaryText flex items-center gap-2',
        props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ]"
      :for="!props.disabled ? uniqueId : undefined"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>
  </div>
</template>
