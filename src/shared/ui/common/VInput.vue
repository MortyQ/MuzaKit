<script setup lang="ts">
import DOMPurify from "dompurify";
import debounceFunc from "lodash.debounce";
import { ref, computed, useId, onUnmounted, useSlots, type Ref } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";

type ValidationError = {
  $message: string | Ref<string>;
  [key: string]: any;
};

type Validation = {
  $error?: boolean;
  $errors?: ValidationError[];
  $dirty?: boolean;
  $touch?: () => void;
  [key: string]: any;
};

type Props = {
  name?: string;
  // eslint-disable-next-line vue/require-prop-types
  modelValue?: string | number;
  type?: string;
  disabled?: boolean;
  helperText?: string;
  validation?: Validation;
  icon?: string;
  size?: "sm" | "md" | "lg";
  id?: string;
  // New props from VSearch
  debounce?: boolean | number; // true = 800ms, number = custom delay
  loading?: boolean; // show loading spinner in icon
  textarea?: boolean; // use textarea instead of input
  rows?: number; // rows for textarea
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "md",
  name: "",
  placeholder: "",
  disabled: false,
  helperText: "",
  validation: undefined,
  icon: "",
  modelValue: "",
  id: undefined,
  debounce: false,
  loading: false,
  textarea: false,
  rows: 4,
});

// Generate unique ID for input if not provided
const inputId = computed(() => props.id || `v-input-${useId()}`);

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>();

const slots = useSlots();

const isShowPassword = ref(false);
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

// Debounce logic
const debounceDelay = computed(() => {
  if (typeof props.debounce === "number") return props.debounce;
  return props.debounce ? 800 : 0;
});

const debouncedEmitUpdate = debounceFunc((value: string) => {
  emit("update:modelValue", value);
}, debounceDelay.value);

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

// Show left icon: either custom icon, search icon, or slot
const showLeftIcon = computed(() => {
  return props.icon || isSearchType.value || !!slots["icon-left"] || props.loading;
});

// Show right icon: password toggle or slot
const showRightIcon = computed(() => {
  return props.type === "password" || !!slots["icon-right"];
});

// Get left icon name
const leftIconName = computed(() => {
  if (props.icon) return props.icon;
  if (isSearchType.value) return "mdi:search";
  return "";
});

const internalValue = computed({
  get: () => props.modelValue ?? "",
  set: (value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });

    if (debounceDelay.value > 0) {
      debouncedEmitUpdate(sanitizedValue);
    } else {
      emit("update:modelValue", sanitizedValue);
    }
  },
});

// Computed properties
const isSearchType = computed(() => props.type === "search");

// Cleanup debounce on unmount
onUnmounted(() => {
  if (debounceDelay.value > 0) {
    debouncedEmitUpdate.cancel();
  }
});
</script>

<template>
  <div class="v-input-wrapper">
    <!-- Label -->
    <slot name="name">
      <label
        v-if="props.name"
        :for="inputId"
        class="v-input-label"
      >
        {{ props.name }}
      </label>
    </slot>

    <!-- Input Container -->
    <div
      class="v-input-container"
      :class="{ 'is-focused': isFocused }"
    >
      <!-- Left Icon Slot -->
      <div
        v-if="showLeftIcon"
        class="v-input-icon v-input-icon-left"
        :class="{
          'v-input-icon-textarea': textarea,
          'text-primary': isFocused && isSearchType || loading,
          'text-secondaryText': !isFocused || !isSearchType,
        }"
      >
        <slot name="icon-left">
          <VIcon
            v-if="leftIconName"
            :icon="leftIconName"
            :loading="loading"
            class="w-5 h-5 transition-colors"
          />
        </slot>
      </div>

      <!-- Input Field -->
      <input
        v-if="!textarea"
        :id="inputId"
        ref="inputRef"
        v-model="internalValue"
        :type="currentInputType"
        class="v-input"
        :class="[
          sizeClasses,
          {
            'v-input-with-left-icon': showLeftIcon,
            'v-input-with-right-icon': showRightIcon,
            'v-input-error': validation?.$error,
            'v-input-disabled': disabled,
            'cursor-pointer': type === 'date',
          },
        ]"
        v-bind="$attrs"
        :disabled="disabled"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >

      <!-- Textarea Field -->
      <textarea
        v-else
        :id="inputId"
        ref="inputRef"
        v-model="internalValue"
        :rows="rows"
        class="v-input v-input-textarea"
        :class="[
          {
            'v-input-with-left-icon': showLeftIcon,
            'v-input-with-right-icon': showRightIcon,
            'v-input-error': validation?.$error,
            'v-input-disabled': disabled,
          },
        ]"
        v-bind="$attrs"
        :disabled="disabled"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Right Icon / Actions -->
      <div
        v-if="showRightIcon"
        class="v-input-icon v-input-icon-right"
        :class="{ 'v-input-icon-textarea': textarea }"
      >
        <slot name="icon-right">
          <!-- Password Toggle -->
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

    <!-- Helper Text -->
    <slot name="helper-text">
      <p
        v-if="helperText && !validation?.$error"
        class="v-input-helper-text"
      >
        {{ helperText }}
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

