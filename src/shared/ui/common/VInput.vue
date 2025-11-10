<script setup lang="ts">
import DOMPurify from "dompurify";
import { ref, computed } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";

type ValidationError = {
  $message: string;
};

type Validation = {
  $error: boolean;
  $errors: ValidationError[];
};

type Props = {
  name?: string;
  // eslint-disable-next-line vue/require-prop-types
  modelValue?: string | number;
  type?: string;
  disabled?: boolean;
  supportText?: string;
  validation?: Validation;
  icon?: string;
  size?: "sm" | "md" | "lg";
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "md",
  name: "",
  placeholder: "",
  disabled: false,
  supportText: "",
  validation: undefined,
  icon: "",
  modelValue: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>();

const isShowPassword = ref(false);

const currentInputType = computed(() => {
  if (props.type === "password") {
    return isShowPassword.value ? "text" : "password";
  }
  return props.type;
});

const changeInputType = () => {
  isShowPassword.value = !isShowPassword.value;
};

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-9 text-sm px-3",
    md: "h-11 text-base px-4",
    lg: "h-12 text-lg px-5",
  };
  return sizes[props.size];
});

const internalValue = computed({
  get: () => props.modelValue ?? "",
  set: (value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    emit("update:modelValue", sanitizedValue);
  },
});
</script>

<template>
  <div class="v-input-wrapper">
    <!-- Label -->
    <slot name="name">
      <label
        v-if="props.name"
        class="v-input-label"
      >
        {{ props.name }}
      </label>
    </slot>

    <!-- Input Container -->
    <div class="v-input-container">
      <!-- Left Icon Slot -->
      <div
        v-if="$slots['icon-left'] || props.icon"
        class="v-input-icon v-input-icon-left"
      >
        <slot name="icon-left">
          <VIcon
            v-if="props.icon"
            :icon="props.icon"
            class="w-5 h-5 text-secondaryText transition-colors"
          />
        </slot>
      </div>

      <!-- Input Field -->
      <input
        v-model="internalValue"
        :type="currentInputType"
        class="v-input"
        :class="[
          sizeClasses,
          {
            'v-input-with-left-icon': $slots['icon-left'] || props.icon,
            'v-input-with-right-icon': $slots['icon-right'] || props.type === 'password',
            'v-input-error': validation?.$error,
            'v-input-disabled': disabled,
            'cursor-pointer': type === 'date',
          },
        ]"
        v-bind="$attrs"
        :disabled="disabled"
      >

      <div
        v-if="$slots['icon-right'] || props.type === 'password'"
        class="v-input-icon v-input-icon-right"
      >
        <slot name="icon-right">
          <button
            v-if="props.type === 'password'"
            type="button"
            class="v-input-password-toggle"
            @click="changeInputType"
          >
            <VIcon
              :icon="currentInputType === 'text' ? 'mdi:eye-off' : 'mdi:eye'"
              class="w-5 h-5 text-secondaryText hover:text-mainText transition-colors"
            />
          </button>
        </slot>
      </div>
    </div>

    <!-- Support Text -->
    <slot name="support-text">
      <p
        v-if="supportText && !validation?.$error"
        class="v-input-support-text"
      >
        {{ supportText }}
      </p>
    </slot>

    <!-- Error Message -->
    <transition
      name="error-slide"
      mode="out-in"
    >
      <slot name="error-message">
        <p
          v-if="validation?.$error"
          class="v-input-error-message"
        >
          {{ validation?.$errors[0]?.$message }}
        </p>
      </slot>
    </transition>
  </div>
</template>

