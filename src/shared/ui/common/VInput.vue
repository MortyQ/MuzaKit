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
  placeholder?: string
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
  showClearButton?: boolean // show clear button for textarea
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
  showClearButton: true,
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
  return props.type !== "password"
    && localValue.value
    && String(localValue.value).length > 0
    && props.showClearButton;
  // return props.textarea && localValue.value && String(localValue.value).length > 0;
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

const hasValue = computed(() => {
  return localValue.value !== "" && localValue.value !== null && localValue.value !== undefined;
});

const computedPlaceholder = computed(() => {
  if (!props.name) return props.placeholder;
  // MUI logic: Show placeholder only when focused if a floating label exists
  return isFocused.value ? props.placeholder : "";
});

// Cleanup debounce on unmount
onUnmounted(() => {
  if (debounceDelay.value > 0) {
    debouncedEmitUpdate.cancel();
  }
});
</script>

<template>
  <div class="v-input-wrapper relative w-full group">
    <!-- 2. Input Container (Relative) -->
    <div class="relative flex items-center w-full">
      <!-- 1. Floating Label -->
      <label
        v-if="props.name"
        :class="[
          {
            'v-label--active': isFocused || hasValue,
            'v-label--error': validation?.$error
          },
          showLeftIcon && !(isFocused || hasValue) ? 'left-10' : 'left-3',
          textarea ? 'top-3' : 'top-1/2 -translate-y-1/2'
        ]"
        :for="inputId"
        class="v-label"
      >
        {{ props.name }}
      </label>
      <!-- Left Icon Slot -->
      <div
        v-if="showLeftIcon"
        :class="{
          'top-3 items-start': textarea,
          'h-full items-center': !textarea,
          'text-primary': isFocused && isSearchType || loading,
          'text-secondaryText': !isFocused || !isSearchType,
        }"
        class="absolute left-0 z-20 pl-3 flex justify-center pointer-events-none"
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
      <!-- Removed borders/bg, added z-10 and full transparency -->
      <component
        :is="textarea ? 'textarea' : 'input'"
        :id="inputId"
        :key="`${textarea ? 'textarea' : 'input'}-${inputId}`"
        ref="inputRef"
        :class="[
          textarea ? 'py-3 px-4 min-h-[100px]' : sizeClasses,
          {
            'pl-10': showLeftIcon,
            'pr-10': showRightIcon,
            'cursor-pointer': type === 'date' && !textarea,
            'cursor-not-allowed text-neutral/70': disabled,
          },
        ]"
        :disabled="disabled"
        :placeholder="computedPlaceholder"
        :value="localValue"
        class="
          !appearance-none !border-none !outline-none !ring-0 !shadow-none bg-transparent
          rounded-md w-full z-10 relative text-neutral placeholder:text-neutral/50
        "
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
        :class="{ 'top-3': textarea }"
        class="z-20 pr-3 absolute right-0 flex items-center justify-center"
      >
        <slot name="icon-right">
          <!-- Clear Button for Input -->
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
            class="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer"
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

      <!-- 3. The Fieldset Border (Absolute Background) -->
      <fieldset
        :class="{
          'v-fieldset--active': isFocused,
          'v-fieldset--error': validation?.$error,
          'v-fieldset--disabled': disabled
        }"
        aria-hidden="true"
        class="v-fieldset"
      >
        <legend
          :class="{ 'v-legend--visible': props.name && (hasValue || isFocused) }"
          class="v-legend"
        >
          <span>{{ props.name }}</span>
        </legend>
      </fieldset>
    </div>

    <!-- Helper Text -->
    <slot name="helper-text">
      <p
        v-if="helperText && !validation?.$error"
        class="v-input-helper-text mt-1 text-xs text-secondaryText ml-3"
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
          class="v-input-error-message mt-1 text-xs text-error ml-3"
        >
          {{ validation?.$errors[0]?.$message }}
        </p>
      </slot>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.v-input-wrapper {
  /* Hide native search input clear button */
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  /* 1. Label Styling */
  .v-label {
    @apply absolute text-neutral/60 text-sm transition-all duration-200 pointer-events-none origin-top-left;
    z-index: 20;
    max-width: calc(100% - 24px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.v-label--active {
      @apply top-0;
      transform: translateY(-50%) scale(0.75) !important;
      @apply text-primary font-medium;
    }

    &.v-label--error {
      @apply text-error;
    }
  }

  /* 2. Fieldset Styling */
  .v-fieldset {
    @apply absolute inset-0 rounded-lg pointer-events-none transition-colors duration-200 border-cardBorder;
    margin: 0;
    padding: 0 8px;
    border-width: 1px;
    border-style: solid; // Neutral border default
    top: 0;

    &.v-fieldset--active {
      @apply border-primary;
      border-width: 2px;
    }

    &.v-fieldset--error {
      @apply border-error;
      &.v-fieldset--active {
        @apply border-error;
      }
    }

    &.v-fieldset--disabled {
      @apply bg-base-200 border-neutral/20;
    }
  }

  /* Autofill Overrides for Dark Mode */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  textarea:-webkit-autofill:active {
    /* 1. Transition Trick: Delays the white background indefinitely to keep it transparent */
    transition: background-color 5000s ease-in-out 0s;

    /* 2. Text Color Fix */
    -webkit-text-fill-color: theme('colors.neutral') !important;

    /* 3. Box Shadow Hack (Fallback if transparency fails) */
    box-shadow: 0 0 0 1000px theme('colors.base-100') inset !important;

    /* Ensure caret is visible */
    caret-color: theme('colors.neutral');
  }

  .v-legend {
    @apply h-0 text-sm transition-all duration-200 border-none p-0;
    max-width: 0;
    width: auto;
    white-space: nowrap;
    overflow: hidden;

    span {
      @apply opacity-0 inline-block;
    }

    &.v-legend--visible {
      max-width: 100%;
      @apply px-1;
    }
  }
}
</style>
