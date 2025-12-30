<script lang="ts" setup>
import { computed } from "vue";

import { useModal } from "@/shared/composables/useModal";

interface Props {
  id: string
  title?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  position?: "left" | "right"
  width?: "sm" | "md" | "lg" | "xl" | "full"
  backdropBlur?: "none" | "xs" | "sm" | "md" | "lg"
  keepAlive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  showCloseButton: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  position: "right",
  width: "md",
  backdropBlur: "xs",
  keepAlive: false,
});

const emit = defineEmits<{
  close: []
  open: []
}>();

const { isOpen, close, zIndex } = useModal(props.id);

const widthClass = computed(() => {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };
  return widths[props.width];
});

const positionClass = computed(() => {
  return props.position === "left" ? "drawer-left" : "drawer-right";
});

const backdropBlurClass = computed(() => {
  const blurs = {
    none: "",
    xs: "backdrop-blur-xs",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };
  return blurs[props.backdropBlur];
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
      name="drawer"
      @after-enter="emit('open')"
    >
      <div
        v-if="keepAlive ? true : isOpen"
        v-show="keepAlive ? isOpen : true"
        :class="backdropBlurClass"
        :style="{ zIndex }"
        class="drawer-backdrop"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      >
        <div
          :class="[widthClass, positionClass]"
          class="drawer-container"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="title || showCloseButton || $slots.header"
            class="drawer-header"
          >
            <slot name="header">
              <h3
                v-if="title"
                class="drawer-title"
              >
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="showCloseButton"
              aria-label="Close drawer"
              class="drawer-close-btn"
              type="button"
              @click="handleClose"
            >
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="18"
                  x2="6"
                  y1="6"
                  y2="18"
                />
                <line
                  x1="6"
                  x2="18"
                  y1="6"
                  y2="18"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="drawer-content">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="drawer-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
