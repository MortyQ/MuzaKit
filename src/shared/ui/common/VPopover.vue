<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

interface Props {
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom-right",
  closeOnClickOutside: true,
});

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const popoverPosition = ref({ top: 0, left: 0, right: 0 });

// Calculate popover position based on trigger element
const updatePosition = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const gap = 8; // margin between trigger and popover

  if (props.placement === "bottom-left") {
    popoverPosition.value = {
      top: rect.bottom + gap,
      left: rect.left,
      right: undefined as any,
    };
  } else if (props.placement === "bottom-right") {
    popoverPosition.value = {
      top: rect.bottom + gap,
      left: undefined as any,
      right: window.innerWidth - rect.right,
    };
  } else if (props.placement === "top-left") {
    const popoverHeight = popoverRef.value?.offsetHeight || 0;
    popoverPosition.value = {
      top: rect.top - popoverHeight - gap,
      left: rect.left,
      right: undefined as any,
    };
  } else if (props.placement === "top-right") {
    const popoverHeight = popoverRef.value?.offsetHeight || 0;
    popoverPosition.value = {
      top: rect.top - popoverHeight - gap,
      left: undefined as any,
      right: window.innerWidth - rect.right,
    };
  }
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      updatePosition();
    });
  }
};

const close = () => {
  isOpen.value = false;
};

const open = () => {
  isOpen.value = true;
  nextTick(() => {
    updatePosition();
  });
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside) return;

  const target = event.target as Node;
  if (
    triggerRef.value &&
    popoverRef.value &&
    !triggerRef.value.contains(target) &&
    !popoverRef.value.contains(target)
  ) {
    close();
  }
};

// Update position on scroll and resize
const handleScroll = () => {
  if (isOpen.value) {
    updatePosition();
  }
};

const handleResize = () => {
  if (isOpen.value) {
    updatePosition();
  }
};

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

// Computed styles for popover
const popoverStyles = computed(() => ({
  position: "fixed" as const,
  top: `${popoverPosition.value.top}px`,
  left: popoverPosition.value.left !== undefined ? `${popoverPosition.value.left}px` : undefined,
  right: popoverPosition.value.right !== undefined ? `${popoverPosition.value.right}px` : undefined,
}));

defineExpose({
  isOpen,
  toggle,
  close,
  open,
});
</script>

<template>
  <div
    ref="triggerRef"
    class="v-popover"
  >
    <div
      class="v-popover-trigger"
      @click="toggle"
    >
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <Transition name="popover-fade">
        <div
          v-if="isOpen"
          ref="popoverRef"
          class="v-popover-content v-popover-content--teleported"
          :class="[`v-popover-content--${placement}`]"
          :style="popoverStyles"
        >
          <slot name="content" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.v-popover {
  display: inline-block;
}

.v-popover-trigger {
  cursor: pointer;
}

.v-popover-content {
  z-index: 9999;
  min-width: 200px;

  // Teleported version uses fixed positioning
  &--teleported {
    position: fixed;
  }
}

/* Transition animations */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.v-popover-content--top-left,
.v-popover-content--top-right {
  &.popover-fade-enter-from,
  &.popover-fade-leave-to {
    transform: translateY(8px);
  }
}
</style>

