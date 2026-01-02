<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import VIcon from "@/shared/ui/common/VIcon.vue";
import { useSidebar } from "@/shared/ui/navigationSidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/shared/ui/navigationSidebar/types";

interface Props {
  /** Navigation item */
  item: SidebarNavItem
  /** Current nesting level (for indentation) */
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

const route = useRoute();
const { isExpanded, toggleExpanded, closeMobile } = useSidebar();

// Check if item has children
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// Check if this item is expanded
const isItemExpanded = computed(() => {
  return hasChildren.value && isExpanded(props.item.id);
});

// Check if item is active (current route)
const isActive = computed(() => {
  if (!props.item.to) return false;

  if (typeof props.item.to === "string") {
    return route.path === props.item.to;
  }

  if (props.item.to.name) {
    return route.name === props.item.to.name;
  }

  return false;
});

// Check if any child is active (for parent highlighting)
const hasActiveChild = computed((): boolean => {
  if (!hasChildren.value) return false;

  const checkChildren = (children: SidebarNavItem[]): boolean => {
    for (const child of children) {
      // Check if child has a route and is active
      if (child.to) {
        if (typeof child.to === "string" && route.path === child.to) {
          return true;
        }
        if (typeof child.to === "object" && child.to.name === route.name) {
          return true;
        }
      }

      // Recursively check child's children
      if (child.children && checkChildren(child.children)) {
        return true;
      }
    }
    return false;
  };

  return checkChildren(props.item.children!);
});

// Handle click
const handleClick = () => {
  if (props.item.disabled) return;

  // If item has onClick handler, call it
  if (props.item.onClick) {
    props.item.onClick();
    closeMobile();
    return;
  }

  // If item has children, toggle expansion
  if (hasChildren.value) {
    toggleExpanded(props.item.id);
  }
  else {
    // Close mobile menu when navigating
    closeMobile();
  }
};

// Item classes
const itemClasses = computed(() => {
  const baseClasses = [
    "flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 cursor-pointer group",
    "outline-none focus:outline-none focus-visible:outline-none",
    "relative w-full",
  ];

  // Active state
  if (isActive.value) {
    baseClasses.push("bg-primary/10 text-primary font-medium sidebar-item-active");
  }
  else if (hasActiveChild.value && hasChildren.value) {
    // Parent with active child
    baseClasses.push("text-primary/80 hover:bg-base-200/50");
  }
  else {
    // Default state
    baseClasses.push("text-neutral/70 hover:bg-base-200 hover:text-neutral");
  }

  // Disabled state
  if (props.item.disabled) {
    baseClasses.push("opacity-50 cursor-not-allowed");
  }

  return baseClasses;
});
</script>

<template>
  <div class="sidebar-mobile-nav-item">
    <!-- Item Button/Link -->
    <component
      :is="hasChildren || !item.to ? 'button' : 'router-link'"
      :to="!hasChildren && item.to ? item.to : undefined"
      :type="hasChildren || !item.to ? 'button' : undefined"
      :class="itemClasses"
      :aria-label="item.label"
      :aria-expanded="hasChildren ? isItemExpanded : undefined"
      :disabled="item.disabled"
      @click="handleClick"
    >
      <!-- Icon -->
      <VIcon
        v-if="item.icon"
        :icon="item.icon"
        :size="20"
        class="flex-shrink-0"
      />

      <!-- Label -->
      <span class="flex-1 text-left truncate text-sm">
        {{ item.label }}
      </span>

      <!-- Badge -->
      <span
        v-if="item.badge"
        class="flex-shrink-0 px-2 py-0.5 text-xs font-semibold
         rounded-full bg-primary/20 text-primary"
      >
        {{ item.badge }}
      </span>

      <!-- Expand/Collapse Icon (for parent items) -->
      <VIcon
        v-if="hasChildren"
        :icon="isItemExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        :size="16"
        class="flex-shrink-0 transition-transform duration-200"
      />
    </component>

    <!-- Children (Nested Navigation) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="hasChildren && isItemExpanded"
        class="mt-1 space-y-1 overflow-hidden"
      >
        <SidebarMobileNavItem
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Remove all default focus/active/visited states */
.sidebar-mobile-nav-item button,
.sidebar-mobile-nav-item a {
  outline: none !important;
  box-shadow: none !important;
}

/* Focus indicator with background and left accent bar */
.sidebar-mobile-nav-item button:focus-visible,
.sidebar-mobile-nav-item a:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.sidebar-mobile-nav-item button:focus-visible:hover,
.sidebar-mobile-nav-item a:focus-visible:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

/* Left accent bar on focus */
.sidebar-mobile-nav-item button:focus-visible::before,
.sidebar-mobile-nav-item a:focus-visible::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  background-color: #3b82f6;
  border-radius: 0 2px 2px 0;
}

/* Active state accent bar */
.sidebar-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  background-color: #3b82f6;
  border-radius: 0 2px 2px 0;
}

/* Remove router-link active states */
.sidebar-mobile-nav-item a.router-link-active:focus,
.sidebar-mobile-nav-item a.router-link-exact-active:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
