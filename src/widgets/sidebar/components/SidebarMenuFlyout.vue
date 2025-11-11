<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import VIcon from "@/shared/ui/common/VIcon.vue";
import { useSidebar } from "@/widgets/sidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/sidebar/types";

interface Props {
  /** Parent item with children */
  item: SidebarNavItem;
}

const props = defineProps<Props>();

const router = useRouter();
const { closeMobile } = useSidebar();

const isHovered = ref(false);
const hoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const flyoutRef = ref<HTMLElement | null>(null);
const menuPosition = ref({ top: 0, left: 0, right: 0 });
const showOnLeft = ref(false);

// Calculate menu position based on button position
const checkPosition = () => {
  if (!buttonRef.value || !flyoutRef.value) return;

  const buttonRect = buttonRef.value.getBoundingClientRect();
  const menuRect = flyoutRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  // Position menu to the right of button by default
  const leftPosition = buttonRect.right + 8;
  const rightPosition = leftPosition + menuRect.width;

  // Check if menu would overflow on the right
  if (rightPosition > viewportWidth - 20) {
    // Show on left side instead
    showOnLeft.value = true;
    menuPosition.value = {
      top: buttonRect.top,
      right: viewportWidth - buttonRect.left + 8,
      left: 0,
    };
  } else {
    // Show on right side
    showOnLeft.value = false;
    menuPosition.value = {
      top: buttonRect.top,
      left: leftPosition,
      right: 0,
    };
  }
};

const showMenu = () => {
  // Clear hide timeout if exists
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }

  // Show immediately if already visible, otherwise with small delay
  if (!isHovered.value) {
    // Pre-calculate position before showing to prevent jump
    if (buttonRef.value) {
      const buttonRect = buttonRef.value.getBoundingClientRect();
      menuPosition.value = {
        top: buttonRect.top,
        left: buttonRect.right + 8,
        right: 0,
      };
    }

    hoverTimeout.value = setTimeout(() => {
      isHovered.value = true;
      // Fine-tune positioning after menu is rendered
      setTimeout(checkPosition, 10);
    }, 150);
  }
};

const hideMenu = () => {
  // Clear any pending show timeout
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }

  // Delay hiding to allow mouse movement between button and menu
  hoverTimeout.value = setTimeout(() => {
    isHovered.value = false;
  }, 100);
};

// Recheck position on window resize
const handleResize = () => {
  if (isHovered.value) {
    checkPosition();
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleChildClick = (child: SidebarNavItem) => {
  if (child.to && !child.disabled) {
    if (typeof child.to === "string") {
      router.push(child.to);
    } else {
      router.push(child.to);
    }
    closeMobile();
    hideMenu();
  }
};

// Flatten all nested children for display
const flattenChildren = (
  items: SidebarNavItem[],
  level = 0,
): Array<SidebarNavItem & { level: number }> => {
  const result: Array<SidebarNavItem & { level: number }> = [];

  for (const item of items) {
    result.push({ ...item, level });

    if (item.children && item.children.length > 0) {
      result.push(...flattenChildren(item.children, level + 1));
    }
  }

  return result;
};

const allChildren = computed(() => {
  return props.item.children ? flattenChildren(props.item.children) : [];
});
</script>

<template>
  <div
    ref="buttonRef"
    class="relative"
    @mouseenter="showMenu"
    @mouseleave="hideMenu"
  >
    <slot />

    <!-- Flyout Menu (Teleported to body to escape fixed parent) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isHovered && item.children && item.children.length > 0"
          class="fixed z-[100]"
          :style="{
            top: `${menuPosition.top}px`,
            ...(showOnLeft
              ? { right: `${menuPosition.right - 8}px` }
              : { left: `${menuPosition.left - 8}px` }),
          }"
          @mouseenter="showMenu"
          @mouseleave="hideMenu"
        >
          <!-- Invisible bridge to prevent flickering -->
          <div
            :class="[
              'absolute top-0 h-full w-[24px]',
              showOnLeft ? 'left-full ml-[-16px]' : 'right-full mr-[-16px]',
            ]"
          />

          <!-- Menu Content -->
          <div
            ref="flyoutRef"
            class="relative min-w-[200px] max-w-[280px] ml-2"
          >
            <div
              class="bg-base-100 border border-base-300 rounded-lg shadow-xl py-2
                max-h-[calc(100vh-100px)] overflow-y-auto"
            >
              <!-- Menu Title -->
              <div class="px-4 py-2 border-b border-base-300 mb-1">
                <span class="text-sm font-semibold text-neutral">{{ item.label }}</span>
              </div>

              <!-- Children List -->
              <div class="space-y-0.5 px-1">
                <button
                  v-for="child in allChildren"
                  :key="child.id"
                  type="button"
                  :class="[
                    'w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors',
                    'hover:bg-base-200 text-neutral/80 hover:text-neutral',
                    { 'opacity-50 cursor-not-allowed': child.disabled },
                  ]"
                  :style="{ paddingLeft: `${12 + child.level * 16}px` }"
                  :disabled="child.disabled"
                  @click="handleChildClick(child)"
                >
                  <VIcon
                    v-if="child.icon"
                    :icon="child.icon"
                    :size="16"
                    class="flex-shrink-0"
                  />
                  <span class="flex-1 text-left truncate">{{ child.label }}</span>
                  <span
                    v-if="child.badge"
                    class="flex-shrink-0 px-1.5 py-0.5 text-xs font-semibold
                      rounded-full bg-primary/20 text-primary"
                  >
                    {{ child.badge }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Custom scrollbar for menu */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
</style>

