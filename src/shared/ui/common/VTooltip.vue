<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  /** Tooltip text */
  text: string;
  /** Placement of tooltip */
  placement?: "top" | "bottom" | "left" | "right";
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class for tooltip content */
  tooltipClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "right",
  delay: 300,
  disabled: false,
  tooltipClass: "",
});

const isVisible = ref(false);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const tooltipPosition = ref({ top: 0, left: 0 });

const calculatePosition = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();

  switch (props.placement) {
    case "top":
      tooltipPosition.value = {
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      };
      break;
    case "bottom":
      tooltipPosition.value = {
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      };
      break;
    case "left":
      tooltipPosition.value = {
        top: rect.top + rect.height / 2,
        left: rect.left - 8,
      };
      break;
    case "right":
    default:
      tooltipPosition.value = {
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      };
      break;
  }
};

const showTooltip = () => {
  if (props.disabled || !props.text) return;

  calculatePosition();

  timeout.value = setTimeout(() => {
    isVisible.value = true;
  }, props.delay);
};

const hideTooltip = () => {
  if (timeout.value) {
    clearTimeout(timeout.value);
    timeout.value = null;
  }
  isVisible.value = false;
};

const tooltipTransform = computed(() => {
  switch (props.placement) {
    case "top":
      return "-translate-x-1/2 -translate-y-full";
    case "bottom":
      return "-translate-x-1/2";
    case "left":
      return "-translate-x-full -translate-y-1/2";
    case "right":
    default:
      return "-translate-y-1/2";
  }
});
</script>

<template>
  <div
    ref="triggerRef"
    class="relative inline-flex"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
  >
    <!-- Trigger Element -->
    <slot />

    <!-- Tooltip (Teleported to body) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVisible && text"
          class="fixed z-[100] pointer-events-none"
          :style="{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }"
          :class="tooltipTransform"
        >
          <!-- Tooltip Content -->
          <div
            :class="[
              'bg-neutral/90 text-white text-sm font-medium ' +
                'px-3 py-1.5 rounded-lg shadow-lg max-w-[200px] break-words',
              tooltipClass,
            ]"
          >
            {{ text }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

