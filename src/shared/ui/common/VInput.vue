<script lang="ts" setup>
import type { BaseValidation } from "@vuelidate/core";
import DOMPurify from "dompurify";
import debounceFunc from "lodash.debounce";
import { ref, computed, useId, onUnmounted, useSlots, watch, type Ref } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";

// Flexible validation type compatible with Vuelidate
type ValidationProp = BaseValidation | {
  $error?: boolean
  $errors?: Array<{ $message: string | Ref<string> }>
};

type Props = {
  name?: string
  modelValue?: string | number
  type?: string
  disabled?: boolean
  helperText?: string
  validation?: ValidationProp
  icon?: string
  size?: "sm" | "md" | "lg"
  id?: string
  // New props from VSearch
  debounce?: boolean | number // true = 800ms, number = custom delay
  loading?: boolean // show loading spinner in icon
  textarea?: boolean // use textarea instead of input
  rows?: number // rows for textarea
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
  "update:modelValue": [value: string | number]
  clear: []
}>();

const slots = useSlots();

const isShowPassword = ref(false);
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

// Local state for the input value
const localValue = ref<string | number>(props.modelValue ?? "");

// Clear input value
const clearInput = () => {
  localValue.value = "";
  emit("update:modelValue", "");
  emit("clear");
  // Focus back on input after clear
  inputRef.value?.focus();
};

// Debounce logic
const debounceDelay = computed(() => {
  if (typeof props.debounce === "number") return props.debounce;
  return props.debounce ? 800 : 0;
});

const debouncedEmitUpdate = debounceFunc((value: string | number) => {
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

// Show right icon: password toggle, clear button for textarea, or slot
const showRightIcon = computed(() => {
  return props.type === "password" || showClearButton.value || !!slots["icon-right"];
});

// Show clear button for textarea when it has content
const showClearButton = computed(() => {
  return props.textarea && localValue.value && String(localValue.value).length > 0;
});

// Get left icon name
const leftIconName = computed(() => {
  if (props.icon) return props.icon;
  if (isSearchType.value) return "mdi:search";
  return "";
});

// Computed properties
const isSearchType = computed(() => props.type === "search");

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  let value: string | number = target.value;

  // Sanitize the value
  const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });

  // Update local value immediately for smooth typing
  localValue.value = sanitizedValue;

  // Convert to number if input type is number
  let finalValue: string | number = sanitizedValue;
  if (props.type === "number" && sanitizedValue !== "") {
    const numValue = Number(sanitizedValue);
    if (!isNaN(numValue)) {
      finalValue = numValue;
    }
  }

  // Emit update (debounced or immediate)
  if (debounceDelay.value > 0) {
    debouncedEmitUpdate(finalValue);
  }
  else {
    emit("update:modelValue", finalValue);
  }
};

// Sync local value when parent prop changes externally
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue ?? "";
  }
});

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
      :class="{ 'is-focused': isFocused }"
      class="v-input-container"
    >
      <!-- Left Icon Slot -->
      <div
        v-if="showLeftIcon"
        :class="{
          'v-input-icon-textarea': textarea,
          'text-primary': isFocused && isSearchType || loading,
          'text-secondaryText': !isFocused || !isSearchType,
        }"
        class="v-input-icon v-input-icon-left"
      >
        <slot name="icon-left">
          <VIcon
            v-if="leftIconName || loading"
            :icon="leftIconName"
            :loading="loading"
            class="w-5 h-5 transition-colors"
          />
        </slot>
      </div>

      <!-- Input / Textarea Field -->
      <component
        :is="textarea ? 'textarea' : 'input'"
        :id="inputId"
        :key="`${textarea ? 'textarea' : 'input'}-${inputId}`"
        ref="inputRef"
        :class="[
          textarea ? 'v-input-textarea' : sizeClasses,
          {
            'v-input-with-left-icon': showLeftIcon,
            'v-input-with-right-icon': showRightIcon,
            'v-input-error': validation?.$error,
            'v-input-disabled': disabled,
            'cursor-pointer': type === 'date' && !textarea,
          },
        ]"
        :disabled="disabled"
        :value="localValue"
        class="v-input"
        v-bind="{
          ...$attrs,
          type: textarea ? undefined : currentInputType,
          rows: textarea ? rows : undefined,
        }"
        @blur="isFocused = false"
        @focus="isFocused = true"
        @input="handleInput"
      />

      <!-- Right Icon / Actions -->
      <div
        v-if="showRightIcon"
        :class="{ 'v-input-icon-textarea': textarea }"
        class="v-input-icon v-input-icon-right"
      >
        <slot name="icon-right">
          <!-- Clear Button for Textarea -->
          <button
            v-if="showClearButton"
            class="
              flex items-center justify-center w-6 h-6 rounded-md
              text-secondaryText hover:text-error hover:bg-lightError
              transition-colors cursor-pointer
            "
            title="Clear"
            type="button"
            @click="clearInput"
          >
            <VIcon
              class="w-4 h-4"
              icon="lucide:x"
            />
          </button>

          <!-- Password Toggle -->
          <button
            v-else-if="props.type === 'password'"
            class="v-input-password-toggle"
            type="button"
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
      mode="out-in"
      name="error-slide"
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
