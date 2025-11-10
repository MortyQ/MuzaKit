<script lang="ts" setup>
import DOMPurify from "dompurify";
import debounce from "lodash.debounce";
import { computed, onUnmounted, ref } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";

type Props = {
  text?: string
  modelValue?: string
  placeholder?: string
  debounceProp?: boolean
  textArea?: boolean
  loading?: boolean
};

const props = withDefaults(defineProps<Props>(), {
  text: "Search",
  debounceProp: true,
  loading: false,
  modelValue: "",
  textArea: false,
  placeholder:"",
});

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>();

const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

const internalValue = computed({
  get: () => props.modelValue ?? "",
  set: (value: string) => {
    // DOMPurify already handles HTML escaping and XSS protection
    const sanitizedValue = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });

    if (props.debounceProp) {
      debouncedEmitUpdate(sanitizedValue);
    } else {
      emit("update:modelValue", sanitizedValue);
    }
  },
});

const debouncedEmitUpdate = debounce((value: string) => {
  emit("update:modelValue", value);
}, 800);

const clearInput = () => {
  emit("update:modelValue", "");
  inputRef.value?.focus();
};

onUnmounted(() => {
  debouncedEmitUpdate.cancel();
});
</script>

<template>
  <div
    class="relative w-full"
    :class="{ 'is-focused': isFocused }"
  >
    <!-- Search Icon -->
    <span
      class="search-icon"
      :class="[
        isFocused ? 'text-primary' : 'text-secondaryText',
        { 'search-icon-textarea': props.textArea }
      ]"
    >
      <VIcon
        icon="mdi:search"
        :loading="props.loading"
      />
    </span>

    <!-- Input Field -->
    <input
      v-if="!props.textArea"
      ref="inputRef"
      :placeholder="props.placeholder ?? 'Search...'"
      :value="internalValue"
      class="search-input"
      type="text"
      v-bind="$attrs"
      @input="internalValue = ($event.target as HTMLInputElement).value"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >

    <!-- Textarea Field -->
    <textarea
      v-else
      ref="inputRef"
      :placeholder="props.placeholder ?? 'Type here...'"
      :value="internalValue"
      class="search-textarea"
      v-bind="$attrs"
      @input="internalValue = ($event.target as HTMLTextAreaElement).value"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <!-- Clear Button -->
    <button
      v-if="props.modelValue && props.modelValue.length > 0"
      class="clear-button"
      :class="{ 'clear-button-textarea': props.textArea }"
      type="button"
      aria-label="Clear search"
      @click="clearInput"
    >
      <VIcon icon="mdi:close-circle" />
    </button>
  </div>
</template>


