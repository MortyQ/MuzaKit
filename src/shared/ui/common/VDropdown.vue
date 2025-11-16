<script setup lang="ts">
import { ref, computed, watch } from "vue";

import VLoader from "@/shared/ui/common/VLoader.vue";

interface DropdownItem {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
  loader?: boolean;
  active?: boolean;
}

interface Props {
  items: DropdownItem[];
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  disabled?: boolean;
  closeOnSelect?: boolean;
  teleport?: boolean;
}

interface Emits {
  // eslint-disable-next-line no-unused-vars
  (e: "select", value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom-right",
  disabled: false,
  closeOnSelect: true,
  teleport: true,
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const isPositioned = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);


// Computed classes for dropdown position
const dropdownClasses = computed(() => ({
  "v-dropdown-menu--bottom-left": props.placement === "bottom-left",
  "v-dropdown-menu--bottom-right": props.placement === "bottom-right",
  "v-dropdown-menu--top-left": props.placement === "top-left",
  "v-dropdown-menu--top-right": props.placement === "top-right",
}));

// Check if any item is loading
const hasLoadingItem = computed(() => {
  return props.items.some((item) => item.loader);
});

// Check if dropdown should be disabled
const isDisabled = computed(() => {
  return props.disabled || hasLoadingItem.value;
});

// Update dropdown position when teleported
const updatePosition = () => {
  if (!props.teleport || !isOpen.value || !triggerRef.value || !dropdownRef.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const dropdown = dropdownRef.value;
  const offset = 8; // Gap between trigger and dropdown

  // Reset styles
  dropdown.style.position = "fixed";
  dropdown.style.zIndex = "9999";

  // Calculate position based on placement
  switch (props.placement) {
    case "bottom-left":
      dropdown.style.top = `${triggerRect.bottom + offset}px`;
      dropdown.style.left = `${triggerRect.left}px`;
      dropdown.style.right = "auto";
      break;
    case "bottom-right":
      dropdown.style.top = `${triggerRect.bottom + offset}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.left = "auto";
      break;
    case "top-left":
      dropdown.style.bottom = `${window.innerHeight - triggerRect.top + offset}px`;
      dropdown.style.left = `${triggerRect.left}px`;
      dropdown.style.right = "auto";
      dropdown.style.top = "auto";
      break;
    case "top-right":
      dropdown.style.bottom = `${window.innerHeight - triggerRect.top + offset}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.left = "auto";
      dropdown.style.top = "auto";
      break;
  }

  // Mark as positioned to show the dropdown
  isPositioned.value = true;
};

// Toggle dropdown
const toggle = () => {
  if (!isDisabled.value) {
    isOpen.value = !isOpen.value;
  }
};

// Close dropdown
const close = () => {
  isOpen.value = false;
  isPositioned.value = false;
};

// Handle item click
const handleItemClick = (item: DropdownItem) => {
  if (item.disabled || item.loader) return;

  emit("select", item.value);

  // Close dropdown if closeOnSelect is enabled and item doesn't have a loader
  if (props.closeOnSelect && !item.loader) {
    close();
  }
};

// Click outside directive
interface HTMLElementWithClickOutside extends HTMLElement {
  // eslint-disable-next-line no-unused-vars
  clickOutsideEvent?: (event: Event) => void;
}

const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: { value: () => void }) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
    }
  },
};

// Watch for loader changes to auto-close dropdown when loading finishes
watch(
  () => hasLoadingItem.value,
  (newVal, oldVal) => {
    // If we were loading, and now we're not, close the dropdown
    if (oldVal && !newVal && isOpen.value && props.closeOnSelect) {
      close();
    }
  },
);

// Watch isOpen to update position and setup/cleanup event listeners
watch(isOpen, async (newVal) => {
  if (newVal && props.teleport) {
    // Reset positioned state
    isPositioned.value = false;

    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 0));

    // Update position
    updatePosition();

    // Add event listeners for repositioning
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  } else {
    if (props.teleport) {
      // Cleanup event listeners
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    }
    isPositioned.value = false;
  }
});


// Expose methods for parent component
defineExpose({
  toggle,
  close,
  isOpen,
});
</script>

<template>
  <div
    v-click-outside="close"
    class="v-dropdown"
  >
    <!-- Trigger slot -->
    <div
      ref="triggerRef"
      class="v-dropdown-trigger"
      :class="{ 'v-dropdown-trigger--disabled': isDisabled }"
      @click="toggle"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :is-disabled="isDisabled"
      />
    </div>

    <!-- Dropdown menu -->
    <Teleport
      to="body"
      :disabled="!teleport"
    >
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="v-dropdown-menu"
          :class="[dropdownClasses, { 'v-dropdown-menu--teleported': teleport }]"
          :style="{ opacity: teleport && !isPositioned ? '0' : '' }"
        >
          <slot name="content">
            <!-- Default items rendering -->
            <button
              v-for="item in items"
              :key="item.value"
              class="v-dropdown-item"
              :class="{
                'v-dropdown-item--loading': item.loader,
                'v-dropdown-item--active': item.active
              }"
              :disabled="item.disabled || item.loader"
              @click="handleItemClick(item)"
            >
              <!-- Icon slot -->
              <slot
                name="item-icon"
                :item="item"
              >
                <span
                  v-if="item.icon"
                  class="v-dropdown-item-icon"
                >
                  <slot
                    name="icon"
                    :icon="item.icon"
                  />
                </span>
              </slot>

              <!-- Label -->
              <span class="v-dropdown-item-label">
                {{ item.label }}
              </span>

              <!-- Loading indicator slot -->
              <slot
                name="item-loader"
                :item="item"
              >
                <span
                  v-if="item.loader"
                  class="v-dropdown-item-loading"
                >
                  <VLoader size="small" />
                </span>
              </slot>
            </button>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
