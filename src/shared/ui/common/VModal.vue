<script setup lang="ts">
import { computed } from "vue";

import { useModal } from "@/shared/composables/useModal";

interface Props {
  id: string
  title?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  showCloseButton: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  maxWidth: "md",
});

const emit = defineEmits<{
  close: []
  open: []
}>();

const { isOpen, close, zIndex } = useModal(props.id);

const maxWidthClass = computed(() => {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };
  return widths[props.maxWidth];
});

const handleClose = () => {
  close();
  emit("close");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === "Escape") {
    handleClose();
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal"
      @after-enter="emit('open')"
    >
      <div
        v-if="isOpen"
        class="modal-backdrop"
        :style="{ zIndex }"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      >
        <div
          class="modal-container"
          :class="maxWidthClass"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="title || showCloseButton || $slots.header"
            class="modal-header"
          >
            <slot name="header">
              <h3
                v-if="title"
                class="modal-title"
              >
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="showCloseButton"
              class="modal-close-btn"
              type="button"
              aria-label="Close modal"
              @click="handleClose"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="modal-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
