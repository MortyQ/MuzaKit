<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

import VLoader from "@/shared/ui/common/VLoader.vue";

// Types
interface FloatingItem {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
  loader?: boolean;
  active?: boolean;
}

type Placement = "bottom-left" | "bottom-right" | "top-left" | "top-right";

interface Props {
  // Common props
  placement?: Placement;
  teleport?: boolean;
  closeOnClickOutside?: boolean;

  // Dropdown-specific props
  items?: FloatingItem[];
  disabled?: boolean;
  closeOnSelect?: boolean;

  // Styling
  class?: string;
  unstyled?: boolean; // Remove default styles for custom content
  contentClass?: string; // Additional classes for content wrapper
}

interface Emits {
  // eslint-disable-next-line no-unused-vars
  (e: "select", value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom-right",
  teleport: true,
  closeOnClickOutside: true,
  items: () => [],
  disabled: false,
  closeOnSelect: true,
  class: "",
  unstyled: false,
  contentClass: "",
});

const emit = defineEmits<Emits>();

// State
const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const floatingPosition = ref({ top: 0, left: 0, right: 0 });
const isPositioned = ref(false);

// Computed
const isDropdownMode = computed(() => props.items.length > 0);

const hasLoadingItem = computed(() => {
  return props.items.some((item) => item.loader);
});

const isDisabled = computed(() => {
  return props.disabled || hasLoadingItem.value;
});

const floatingClasses = computed(() => {
  // Base classes (always applied for internal logic)
  const baseClasses = {
    "v-floating--bottom-left": props.placement === "bottom-left",
    "v-floating--bottom-right": props.placement === "bottom-right",
    "v-floating--top-left": props.placement === "top-left",
    "v-floating--top-right": props.placement === "top-right",
    "v-floating--teleported": props.teleport,
  };

  // Style-related classes (only if not unstyled)
  if (!props.unstyled) {
    return {
      ...baseClasses,
      "v-floating--dropdown": isDropdownMode.value,
      "v-floating--popover": !isDropdownMode.value,
      "v-floating--styled": true,
      [props.contentClass]: !!props.contentClass,
    };
  }

  // Unstyled mode - only base classes + custom contentClass
  return {
    ...baseClasses,
    "v-floating--unstyled": true,
    [props.contentClass]: !!props.contentClass,
  };
});

// Computed styles - точно как в VPopover
const floatingStyles = computed(() => {
  if (!props.teleport) return {};

  return {
    position: "fixed" as const,
    zIndex: "9999",
    top: `${floatingPosition.value.top}px`,
    left: floatingPosition.value.left !== undefined ? `${floatingPosition.value.left}px` : undefined,
    right: floatingPosition.value.right !== undefined ? `${floatingPosition.value.right}px` : undefined,
  };
});

// Calculate position
const updatePosition = () => {
  if (!triggerRef.value || !floatingRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const gap = 8; // margin between trigger and floating element
  const height = floatingRef.value.offsetHeight;

  if (props.placement === "bottom-left") {
    floatingPosition.value = {
      top: rect.bottom + gap,
      left: rect.left,
      right: undefined as any,
    };
  } else if (props.placement === "bottom-right") {
    floatingPosition.value = {
      top: rect.bottom + gap,
      left: undefined as any,
      right: window.innerWidth - rect.right,
    };
  } else if (props.placement === "top-left") {
    floatingPosition.value = {
      top: rect.top - height - gap,
      left: rect.left,
      right: undefined as any,
    };
  } else if (props.placement === "top-right") {
    floatingPosition.value = {
      top: rect.top - height - gap,
      left: undefined as any,
      right: window.innerWidth - rect.right,
    };
  }

  // Mark as positioned to show the element
  isPositioned.value = true;
};

// Toggle
const toggle = () => {
  if (!isDisabled.value) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      isPositioned.value = false;
      nextTick(() => {
        updatePosition();
      });
    }
  }
};

// Close
const close = () => {
  isOpen.value = false;
  isPositioned.value = false;
};

// Open
const open = () => {
  if (isDisabled.value) return;

  isOpen.value = true;
  isPositioned.value = false;
  nextTick(() => {
    updatePosition();
  });
};

const handleItemClick = (item: FloatingItem) => {
  if (item.disabled || item.loader) return;

  emit("select", item.value);

  if (props.closeOnSelect && !item.loader) {
    close();
  }
};

// Click outside handling
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside) return;

  const target = event.target as Node;
  if (
    triggerRef.value &&
    floatingRef.value &&
    !triggerRef.value.contains(target) &&
    !floatingRef.value.contains(target)
  ) {
    close();
  }
};

// Watch for loader changes
watch(
  () => hasLoadingItem.value,
  (newVal, oldVal) => {
    if (oldVal && !newVal && isOpen.value && props.closeOnSelect) {
      close();
    }
  },
);

// Update position on scroll and resize (only if open and teleported)
const handleScroll = () => {
  if (isOpen.value && props.teleport) {
    updatePosition();
  }
};

const handleResize = () => {
  if (isOpen.value && props.teleport) {
    updatePosition();
  }
};

// Setup event listeners once on mount
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScroll, true); // true = capture phase for all scrolls
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScroll, true);
  window.removeEventListener("resize", handleResize);
});

// Expose
defineExpose({
  isOpen,
  open,
  close,
  toggle,
});
</script>

<template>
  <div
    class="v-floating"
    :class="props.class"
  >
    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="v-floating-trigger"
      :class="{ 'v-floating-trigger--disabled': isDisabled }"
      @click="toggle"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :is-disabled="isDisabled"
      />
    </div>

    <!-- Floating Content -->
    <Teleport
      to="body"
      :disabled="!teleport"
    >
      <div
        v-if="isOpen"
        ref="floatingRef"
        class="v-floating-content"
        :class="[floatingClasses, { 'v-floating--positioning': !isPositioned }]"
        :style="floatingStyles"
      >
        <!-- Slot for custom content (Popover mode) -->
        <slot name="content">
          <!-- Default Dropdown items rendering -->
          <template v-if="isDropdownMode">
            <button
              v-for="item in items"
              :key="item.value"
              class="v-floating-item"
              :class="{
                'v-floating-item--loading': item.loader,
                'v-floating-item--active': item.active,
                'v-floating-item--disabled': item.disabled,
              }"
              :disabled="item.disabled || item.loader"
              @click="handleItemClick(item)"
            >
              <!-- Icon -->
              <slot
                name="item-icon"
                :item="item"
              >
                <span
                  v-if="item.icon"
                  class="v-floating-item-icon"
                >
                  <slot
                    name="icon"
                    :icon="item.icon"
                  />
                </span>
              </slot>

              <!-- Label -->
              <span class="v-floating-item-label">
                {{ item.label }}
              </span>

              <!-- Loader -->
              <slot
                name="item-loader"
                :item="item"
              >
                <span
                  v-if="item.loader"
                  class="v-floating-item-loading"
                >
                  <VLoader size="small" />
                </span>
              </slot>
            </button>
          </template>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss">
// Base styles
.v-floating {
  @apply relative inline-block;
}

.v-floating-trigger {
  @apply cursor-pointer;

  &--disabled {
    @apply cursor-not-allowed opacity-50;
  }
}

.v-floating-content {
  // Base positioning (always applied)
  @apply relative;

  // Hide element while positioning (maintains layout for offsetHeight)
  &.v-floating--positioning {
    visibility: hidden !important;
    pointer-events: none !important;
    transition: none !important;
    animation: none !important;
    transform: none !important;
    opacity: 0 !important;
  }

  &:not(.v-floating--positioning) {
    animation: floatingFadeIn 0.15s ease-out;
  }

  // Styled mode (default)
  &.v-floating--styled {
    @apply bg-cardBg border border-cardBorder rounded-lg shadow-lg backdrop-blur-md;
    @apply min-w-[160px] max-w-[320px];
  }

  // Dropdown-specific styles
  &.v-floating--dropdown {
    @apply py-1;
  }

  // Popover-specific styles
  &.v-floating--popover {
    @apply p-4;
  }

  // Unstyled mode - no default styles, full control to user
  &.v-floating--unstyled {
    // Only critical styles for functionality
    @apply block;
  }
}

@keyframes floatingFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.v-floating-item {
  @apply w-full px-4 py-2.5 text-left flex items-center gap-3;
  @apply text-mainText hover:bg-base-200 transition-colors;
  @apply border-none bg-transparent cursor-pointer;

  &--active {
    @apply bg-primary/10 text-primary;
  }

  &--disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  &--loading {
    @apply cursor-wait;
  }
}

.v-floating-item-icon {
  @apply flex-shrink-0;
}

.v-floating-item-label {
  @apply flex-1 truncate;
}

.v-floating-item-loading {
  @apply ml-auto flex-shrink-0;
}
</style>

