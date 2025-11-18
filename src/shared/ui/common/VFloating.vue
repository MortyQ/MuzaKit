<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";

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
  adaptive?: boolean; // NEW: enable smart repositioning
  offset?: number; // gap between trigger & floating (default 8)
  autoUpdate?: boolean; // re-position on scroll/resize (default true)
  viewportPadding?: number; // clamp inside viewport (default 4)

  // Dropdown-specific props
  items?: FloatingItem[];
  disabled?: boolean;
  closeOnSelect?: boolean;

  // Styling
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
  adaptive: true,
  offset: 8,
  autoUpdate: true,
  viewportPadding: 4,
  items: () => [],
  disabled: false,
  closeOnSelect: true,
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

// Performance helpers NEW
let pendingFrame = false;
let resizeObserver: ResizeObserver | null = null;

function scheduleUpdate() {
  if (!isOpen.value || !floatingRef.value) return;
  if (pendingFrame) return;
  pendingFrame = true;
  requestAnimationFrame(() => {
    pendingFrame = false;
    updatePosition();
  });
}

// Computed
const isDropdownMode = computed(() => props.items.length > 0);

const isDisabled = computed(() => {
  return props.disabled;
});

const floatingClasses = computed(() => {
  const current = props.placement;

  // Base classes (always applied for internal logic)
  const baseClasses = {
    "v-floating--bottom-left": current === "bottom-left",
    "v-floating--bottom-right": current === "bottom-right",
    "v-floating--top-left": current === "top-left",
    "v-floating--top-right": current === "top-right",
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

// Adjust floatingStyles type
const floatingStyles = computed<Record<string, string | undefined>>(() => {
  if (!props.teleport) {
    return {};
  }
  return {
    position: "fixed",
    zIndex: "9999",
    top: `${floatingPosition.value.top}px`,
    left: floatingPosition.value.left !== undefined ? `${floatingPosition.value.left}px` : undefined,
    right: floatingPosition.value.right !== undefined ? `${floatingPosition.value.right}px` : undefined,
  };
});

// Calculate position
const updatePosition = () => {
  if (!triggerRef.value || !floatingRef.value) return;
  const triggerRect = triggerRef.value.getBoundingClientRect();
  const el = floatingRef.value;
  const height = el.offsetHeight;
  const width = el.offsetWidth;
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  let [vert, horiz] = props.placement.split("-") as ["top"|"bottom", "left"|"right"];

  if (props.adaptive) {
    const gap = props.offset;
    const spaceBelow = vpH - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const needV = height + gap;
    if (vert === "bottom" && spaceBelow < needV && spaceAbove >= spaceBelow) vert = "top"; else if (vert === "top" && spaceAbove < needV && spaceBelow >= spaceAbove) vert = "bottom";
    const spaceRight = vpW - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const needH = width + gap;
    if (horiz === "right" && spaceRight < needH && spaceLeft >= spaceRight) horiz = "left"; else if (horiz === "left" && spaceLeft < needH && spaceRight >= spaceLeft) horiz = "right";
  }

  const gap = props.offset;
  let top: number;
  if (vert === "bottom") top = triggerRect.bottom + gap; else top = triggerRect.top - height - gap;
  // Clamp vertically inside viewport with padding
  top = Math.max(props.viewportPadding, Math.min(top, vpH - height - props.viewportPadding));

  // Horizontal placement
  let left: number | undefined = undefined;
  let right: number | undefined = undefined;
  if (horiz === "left") {
    left = triggerRect.left;
    left = Math.max(props.viewportPadding, Math.min(left, vpW - width - props.viewportPadding));
  } else {
    // align right edges
    right = vpW - triggerRect.right;
    right = Math.max(props.viewportPadding, Math.min(right, vpW - width - props.viewportPadding));
  }

  floatingPosition.value.top = top;
  if (left !== undefined) {
    floatingPosition.value.left = left;
    floatingPosition.value.right = undefined as any;
  }
  if (right !== undefined) {
    floatingPosition.value.right = right;
    floatingPosition.value.left = undefined as any;
  }
  isPositioned.value = true;
};

// Toggle
const toggle = () => {
  if (isDisabled.value) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    isPositioned.value = false;
    nextTick(() => { updatePosition(); });
    initAutoUpdate();
  } else { teardownAutoUpdate(); }
};

// Close
const close = () => {
  if (!isOpen.value) return;
  isOpen.value = false;
  isPositioned.value = false;
  teardownAutoUpdate();
};

// Open
const open = () => {
  if (isDisabled.value) return;
  if (isOpen.value) return;
  isOpen.value = true;
  isPositioned.value = false;
  nextTick(() => { updatePosition(); });
  initAutoUpdate();
};

const handleItemClick = (item: FloatingItem) => {
  if (item.disabled || item.loader) return;

  emit("select", item.value);

  if (props.closeOnSelect && !item.loader) {
    close();
  }
};

// Escape key handling NEW
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isOpen.value) close();
};

// Click outside handling (ensure mounted listener)
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside || !isOpen.value) return;
  const target = event.target as Node;
  if (triggerRef.value && floatingRef.value &&
      !triggerRef.value.contains(target) &&
      !floatingRef.value.contains(target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  teardownAutoUpdate();
});

// Update position on scroll and resize (only if open and teleported)
const handleScroll = () => {
  if (props.autoUpdate && isOpen.value && props.teleport) {
    scheduleUpdate();
  }
};
const handleResize = () => {
  if (props.autoUpdate && isOpen.value && props.teleport) {
    scheduleUpdate();
  }
};

function initAutoUpdate() {
  if (!props.autoUpdate) return;
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("keydown", handleKeyDown);
  // ResizeObserver to track trigger size changes
  if (!resizeObserver && triggerRef.value) {
    resizeObserver = new ResizeObserver(() => scheduleUpdate());
    resizeObserver.observe(triggerRef.value);
  }
}

function teardownAutoUpdate() {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("keydown", handleKeyDown);
  if (resizeObserver && triggerRef.value) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}

// Expose
defineExpose({
  isOpen,
  open,
  close,
  toggle,
});
</script>

<template>
  <div class="v-floating">
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
        <slot name="content">
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
              <span class="v-floating-item-label">{{ item.label }}</span>
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
