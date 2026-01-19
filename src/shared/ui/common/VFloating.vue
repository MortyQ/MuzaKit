<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";

import VLoader from "@/shared/ui/common/VLoader.vue";

// Types
interface FloatingItem {
  label: string
  value: string | number
  icon?: string
  disabled?: boolean
  loading?: boolean
  active?: boolean
}

type Placement = "bottom-left" | "bottom-right" | "top-left" | "top-right";

interface Props {
  // Common props
  placement?: Placement
  teleport?: boolean
  closeOnClickOutside?: boolean
  offset?: number // gap between trigger & floating (default 8)

  // Dropdown-specific props
  items?: FloatingItem[]
  disabled?: boolean
  closeOnSelect?: boolean

  // Styling
  unstyled?: boolean // Remove default styles for custom content
  contentClass?: string // Additional classes for content wrapper
}

interface Emits {
  (e: "select", value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom-right",
  teleport: true, // Always teleport to body - avoids z-index issues
  closeOnClickOutside: true,
  offset: 8,
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

// Performance helpers
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
  // Non-teleport mode - relative positioning
  if (!props.teleport) {
    return {};
  }

  // Only apply position styles when positioned
  if (!isPositioned.value) {
    return {};
  }

  // Use fixed positioning with viewport coordinates
  return {
    position: "fixed",
    zIndex: "9999",
    top: `${floatingPosition.value.top}px`,
    left: floatingPosition.value.left !== undefined ? `${floatingPosition.value.left}px` : undefined,
    right: floatingPosition.value.right !== undefined ? `${floatingPosition.value.right}px` : undefined,
    // Prevent following scroll by using fixed positioning as-is
    // The dropdown will stay in place relative to viewport, not following the trigger
  };
});

// Calculate position - SIMPLIFIED
const updatePosition = () => {
  if (!triggerRef.value || !floatingRef.value) return;

  if (props.teleport) {
    // Teleport mode: use viewport coordinates (fixed positioning)
    const triggerRect = triggerRef.value.getBoundingClientRect();
    const width = floatingRef.value.offsetWidth;
    const height = floatingRef.value.offsetHeight;

    const [vert, horiz] = props.placement.split("-") as ["top" | "bottom", "left" | "right"];
    const gap = props.offset;

    // Calculate vertical position
    let top: number;
    if (vert === "bottom") {
      top = triggerRect.bottom + gap;
    }
    else {
      top = triggerRect.top - height - gap;
    }

    // Calculate horizontal position
    let left: number;
    if (horiz === "left") {
      left = triggerRect.left;
    }
    else {
      left = triggerRect.right - width;
    }

    floatingPosition.value.top = top;
    floatingPosition.value.left = left;
    floatingPosition.value.right = undefined as any;
  }
  else {
    // Non-teleport mode: use relative positioning (simpler, no calculations needed)
    // Position is handled by CSS - just mark as positioned
    floatingPosition.value.top = 0;
    floatingPosition.value.left = 0;
  }

  isPositioned.value = true;
};

// Toggle
const toggle = () => {
  if (isDisabled.value) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    isPositioned.value = false;
    // Strategy: render → measure → position → show (Headless UI approach)
    nextTick(() => {
      if (floatingRef.value && triggerRef.value) {
        updatePosition();
        initAutoUpdate();
      }
    });
  }
  else {
    teardownAutoUpdate();
  }
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
  // Strategy: render → measure → position → show (Headless UI approach)
  nextTick(() => {
    if (floatingRef.value && triggerRef.value) {
      updatePosition();
      initAutoUpdate();
    }
  });
};

const handleItemClick = (item: FloatingItem) => {
  if (item.disabled || item.loading) return;

  emit("select", item.value);

  if (props.closeOnSelect && !item.loading) {
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
  if (triggerRef.value && floatingRef.value
    && !triggerRef.value.contains(target)
    && !floatingRef.value.contains(target)) {
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

// Smooth position update on scroll/resize (Floating UI approach)
const handleScroll = () => {
  if (!isOpen.value || !props.teleport) return;
  scheduleUpdate();
};

const handleResize = () => {
  if (!isOpen.value || !props.teleport) return;
  scheduleUpdate();
};

function initAutoUpdate() {
  if (!props.teleport) return;

  // Listen for scroll events (capture phase catches all scrollable elements)
  window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
  window.addEventListener("resize", handleResize, { passive: true });

  // Track trigger element size/position changes
  if (triggerRef.value) {
    resizeObserver = new ResizeObserver(() => scheduleUpdate());
    resizeObserver.observe(triggerRef.value);
  }

  // Always listen for Escape key
  document.addEventListener("keydown", handleKeyDown);
}

function teardownAutoUpdate() {
  window.removeEventListener("scroll", handleScroll, { capture: true });
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("keydown", handleKeyDown);

  if (resizeObserver) {
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
                'v-floating-item--loading': item.loading,
                'v-floating-item--active': item.active,
                'v-floating-item--disabled': item.disabled,
              }"
              :disabled="item.disabled || item.loading"
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
                  v-if="item.loading"
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
@use "@/shared/assets/styles/components/_vfloating";
</style>
