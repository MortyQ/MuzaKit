<script lang="ts" setup>
import { computed, ref } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";
import VLoader from "@/shared/ui/common/VLoader.vue";
import { formatBytes, truncateString } from "@/shared/utils/formatters";

interface Props {
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  loading?: boolean
  disabled?: boolean
  maxSize?: number // bytes
  label?: string
  subLabel?: string
  showList?: boolean
  variant?: "default" | "compact"
  immediate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: "*",
  multiple: false,
  loading: false,
  disabled: false,
  maxSize: undefined,
  label: "Click to upload or drag and drop",
  subLabel: "SVG, PNG, JPG or GIF (max. 800x400px)",
  showList: true,
  variant: "default",
  immediate: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", files: File[]): void
  (e: "change", files: File[]): void
  (e: "upload", files: File[], reset: () => void): void
  (e: "error", error: string): void
  (e: "file-select", file: File | null): void
}>();

const isDragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// Internal state for uncontrolled usage or when we want to display files before upload
const internalFiles = ref<File[]>(props.modelValue);

const files = computed({
  get: () => props.modelValue.length ? props.modelValue : internalFiles.value,
  set: (val) => {
    internalFiles.value = val;
    emit("update:modelValue", val);
  },
});

const reset = () => {
  files.value = [];
  if (inputRef.value) {
    inputRef.value.value = "";
  }
};

const handleFiles = (newFiles: File[]) => {
  if (props.loading || props.disabled) return;

  // Validate size
  if (props.maxSize) {
    const invalidFiles = newFiles.filter((f) => f.size > props.maxSize!);
    if (invalidFiles.length) {
      emit("error", `File size exceeds limit of ${formatBytes(props.maxSize)}`);
      return;
    }
  }

  // Immediate mode - emit both file-select and upload events without adding to list
  if (props.immediate) {
    const selectedFile = newFiles[0] || null;
    emit("file-select", selectedFile);
    emit("upload", newFiles, reset);
    // Don't reset input here - let the parent component handle it via reset callback
    return;
  }

  // Normal mode - add files to list
  if (props.multiple) {
    files.value = [...files.value, ...newFiles];
  }
  else {
    files.value = newFiles.slice(0, 1);
  }

  emit("change", files.value);
  emit("upload", files.value, reset);
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  const droppedFiles = Array.from(e.dataTransfer?.files || []);
  if (droppedFiles.length) {
    handleFiles(droppedFiles);
  }
};

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  if (selectedFiles.length) {
    handleFiles(selectedFiles);
  }
};

const removeFile = (index: number) => {
  if (props.loading || props.disabled) return;
  const newFiles = [...files.value];
  newFiles.splice(index, 1);
  files.value = newFiles;
  emit("change", newFiles);
};

const openFileDialog = () => {
  if (!props.loading && !props.disabled) {
    inputRef.value?.click();
  }
};
</script>

<template>
  <div class="v-file-upload w-full">
    <!-- Drop Zone -->
    <div
      :class="{
        'v-file-upload__dropzone--dragging': isDragging,
        'v-file-upload__dropzone--loading': loading,
        'v-file-upload__dropzone--disabled': disabled,
        'v-file-upload__dropzone--compact': variant === 'compact',
      }"
      class="v-file-upload__dropzone"
      @click="openFileDialog"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent="isDragging = true"
      @drop.prevent="onDrop"
    >
      <input
        ref="inputRef"
        :accept="accept"
        :disabled="disabled || loading"
        :multiple="multiple"
        class="hidden"
        type="file"
        @change="onChange"
      >

      <div class="v-file-upload__content">
        <template v-if="loading">
          <div class="flex items-center gap-3">
            <VLoader
              :size="variant === 'compact' ? 'small' : 'medium'"
              variant="primary"
            />
            <p
              :class="{ 'mt-2': variant !== 'compact' }"
              class="text-secondaryText text-sm"
            >
              Uploading...
            </p>
          </div>
        </template>

        <template v-else>
          <div class="v-file-upload__icon-wrapper">
            <slot name="icon">
              <VIcon
                :size="variant === 'compact' ? 'md' : 'xl'"
                class="text-secondaryText"
                icon="lucide:cloud-upload"
              />
            </slot>
          </div>
          <div class="v-file-upload__text-container">
            <div class="v-file-upload__text">
              <span class="font-medium text-primary hover:text-primary-dark transition-colors">
                Click to upload
              </span>
              <span class="text-secondaryText">
                or drag and drop
              </span>
            </div>
            <p
              v-if="subLabel"
              :class="{ 'mt-1': variant !== 'compact' }"
              class="text-xs text-secondaryText"
            >
              {{ subLabel }}
            </p>
          </div>
        </template>
      </div>
    </div>

    <!-- File List -->
    <div
      v-if="showList && files.length > 0 && !immediate"
      class="v-file-upload__list"
    >
      <div
        v-for="(file, index) in files"
        :key="index"
        class="v-file-upload__item"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="v-file-upload__item-icon">
            <VIcon
              class="text-primary"
              icon="lucide:file"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span
              :title="file.name"
              class="text-sm font-medium text-mainText truncate"
            >
              {{ truncateString(file.name, 30) }}
            </span>
            <span class="text-xs text-secondaryText">
              {{ formatBytes(file.size) }}
            </span>
          </div>
        </div>

        <button
          :disabled="loading || disabled"
          class="v-file-upload__remove"
          @click.stop="removeFile(index)"
        >
          <VIcon
            icon="lucide:trash-2"
            size="sm"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-file-upload {
  @apply flex flex-col gap-3;

  &__dropzone {
    @apply relative flex flex-col items-center justify-center p-6 border-2 border-dashed
    border-base-300 rounded-lg transition-all duration-200 cursor-pointer bg-base-100;

    min-height: 160px;

    &--compact {
      min-height: auto;
      @apply p-3 border border-dashed;

      .v-file-upload__content {
        @apply flex-row gap-3 items-center text-left w-full justify-center;
      }

      .v-file-upload__icon-wrapper {
        @apply p-0 bg-transparent mb-0;
      }
    }

    &:hover:not(&--disabled):not(&--loading) {
      @apply border-primary bg-primary-100/10;

      .v-file-upload__icon-wrapper {
        @apply scale-110;
      }
    }

    &--dragging {
      @apply border-primary bg-primary-50/20 shadow-inner;
    }

    &--disabled {
      @apply opacity-60 cursor-not-allowed bg-base-200 border-base-300;
    }

    &--loading {
      @apply cursor-wait bg-base-100;
    }
  }

  &__content {
    @apply flex flex-col items-center text-center;
  }

  &__icon-wrapper {
    @apply flex items-center justify-center p-4 rounded-full bg-base-200 mb-3 transition-transform duration-200 text-secondaryText;
  }

  &__text-container {
    @apply flex flex-col;
  }

  &__text {
    @apply text-sm flex items-center gap-1;
  }

  &__list {
    @apply flex flex-col gap-2;
  }

  &__item {
    @apply flex items-center justify-between p-3 rounded-md border border-base-200 bg-base-100 transition-all duration-200;

    &:hover {
      @apply border-base-300 shadow-sm;
    }
  }

  &__item-icon {
    @apply flex items-center justify-center w-8 h-8 rounded bg-primary-50 text-primary;
  }

  &__remove {
    @apply p-1.5 rounded-md text-secondaryText transition-colors hover:text-red-500 hover:bg-red-50;

    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  }
}
</style>
