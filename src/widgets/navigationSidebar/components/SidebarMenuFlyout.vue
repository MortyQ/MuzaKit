<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

import {
  flyoutContainerClasses,
  transitionClasses,
} from "./SidebarMenuFlyout.styles";
import SidebarMenuFlyoutItem from "./SidebarMenuFlyoutItem.vue";
import SidebarMenuFlyoutParent from "./SidebarMenuFlyoutParent.vue";

import { useSidebar } from "@/widgets/navigationSidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Parent item with children */
  item: SidebarNavItem;
}

const props = defineProps<Props>();

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

const handleLinkClick = (child: SidebarNavItem) => {
  if (!child.disabled) {
    closeMobile();
    hideMenu();
  }
};
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
        :enter-active-class="transitionClasses.enterActive"
        :enter-from-class="transitionClasses.enterFrom"
        :enter-to-class="transitionClasses.enterTo"
        :leave-active-class="transitionClasses.leaveActive"
        :leave-from-class="transitionClasses.leaveFrom"
        :leave-to-class="transitionClasses.leaveTo"
      >
        <div
          v-if="isHovered && item.children && item.children.length > 0"
          :class="flyoutContainerClasses.wrapper"
          :style="{
            top: `${menuPosition.top}px`,
            ...(showOnLeft
              ? { right: `${menuPosition.right - 8}px` }
              : { left: `${menuPosition.left - 8}px` })
          }"
          @mouseenter="showMenu"
          @mouseleave="hideMenu"
        >
          <!-- Invisible bridge to prevent flickering -->
          <div :class="flyoutContainerClasses.bridge(showOnLeft)" />

          <!-- Menu Content -->
          <div
            ref="flyoutRef"
            :class="flyoutContainerClasses.content"
          >
            <div :class="flyoutContainerClasses.menu">
              <!-- Menu Title -->
              <div :class="flyoutContainerClasses.title">
                <span :class="flyoutContainerClasses.titleText">{{ item.label }}</span>
              </div>

              <!-- Children List -->
              <div :class="flyoutContainerClasses.list">
                <template
                  v-for="child in allChildren"
                  :key="child.id"
                >
                  <!-- Clickable item with route -->
                  <SidebarMenuFlyoutItem
                    v-if="child.to"
                    :item="child"
                    @click="handleLinkClick"
                  />

                  <!-- Non-clickable parent item (has children but no route) -->
                  <SidebarMenuFlyoutParent
                    v-else
                    :item="child"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>


