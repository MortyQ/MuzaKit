<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import SidebarMenuFlyout from "./SidebarMenuFlyout.vue";

import VIcon from "@/shared/ui/common/VIcon.vue";
import VTag from "@/shared/ui/common/VTag.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";
import { useSidebar } from "@/widgets/navigationSidebar/composables/useSidebar";
import type { SidebarNavItem } from "@/widgets/navigationSidebar/types";

interface Props {
  /** Navigation item */
  item: SidebarNavItem;
  /** Current nesting level (for indentation) */
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

const route = useRoute();
const { isCollapsed, isExpanded, toggleExpanded, closeMobile } = useSidebar();

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
  } else {
    // Close mobile menu when navigating
    closeMobile();
  }
};


// Item classes
const itemClasses = computed(() => {
  const baseClasses = [
    "flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 cursor-pointer group",
    "outline-none focus:outline-none focus-visible:outline-none",
    "relative", // For accent bar positioning
  ];

  // Add w-full only when sidebar is expanded (prevents icon shifting on collapse)
  if (!isCollapsed.value) {
    baseClasses.push("w-full");
  }

  // Active state
  if (isActive.value) {
    baseClasses.push("bg-primary/10 text-primary font-medium sidebar-item-active");
  } else if (hasActiveChild.value && hasChildren.value) {
    // Parent with active child
    baseClasses.push("text-primary/80 hover:bg-base-200/50");
  } else {
    // Default state
    baseClasses.push("text-neutral/70 hover:bg-base-200 hover:text-neutral");
  }

  // Disabled state
  if (props.item.disabled) {
    baseClasses.push("opacity-50 cursor-not-allowed");
  }

  // Collapsed state
  if (isCollapsed.value) {
    baseClasses.push("justify-center");
  }

  return baseClasses;
});
</script>

<template>
  <div class="sidebar-nav-item">
    <!-- Item Button/Link with Flyout Menu (collapsed state with children) -->
    <SidebarMenuFlyout
      v-if="isCollapsed && hasChildren && !item.disabled"
      :item="item"
    >
      <component
        :is="'button'"
        :type="'button'"
        :class="itemClasses"
        :aria-label="item.label"
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
      </component>
    </SidebarMenuFlyout>

    <!-- Item Button/Link with Tooltip (collapsed state without children) -->
    <VTooltip
      v-else-if="isCollapsed && !item.disabled"
      :text="item.label"
      placement="right"
      :delay="200"
    >
      <component
        :is="!item.to ? 'button' : 'router-link'"
        :to="item.to"
        :type="!item.to ? 'button' : undefined"
        :class="itemClasses"
        :aria-label="item.label"
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
      </component>
    </VTooltip>

    <!-- Expanded state or disabled items -->
    <component
      :is="hasChildren || !item.to ? 'button' : 'router-link'"
      v-else
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

      <!-- Label (hidden when collapsed) -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <span
          v-if="!isCollapsed"
          class="flex-1 text-left truncate text-sm"
        >
          {{ item.label }}
        </span>
      </Transition>

      <!-- Badge -->
      <VTag
        v-if="item.badge && !isCollapsed"
        :label="item.badge as string"
        variant="soft"
        color="primary"
      />

      <!-- Expand/Collapse Icon (for parent items) -->
      <VIcon
        v-if="hasChildren && !isCollapsed"
        :icon="isItemExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        :size="16"
        class="flex-shrink-0 transition-transform duration-200"
      />
    </component>

    <!-- Children (Nested Navigation) -->
    <div
      v-if="hasChildren && !isCollapsed"
      class="children-wrapper"
      :class="{ 'is-expanded': isItemExpanded }"
    >
      <div class="children-content">
        <SidebarNavItem
          v-for="(child, index) in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          :style="{ transitionDelay: isItemExpanded ? `${index * 30}ms` : '0ms' }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all default focus/active/visited states */
.sidebar-nav-item button,
.sidebar-nav-item a {
  outline: none !important;
  box-shadow: none !important;
}

/* Focus indicator with background and left accent bar */
.sidebar-nav-item button:focus-visible,
.sidebar-nav-item a:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.sidebar-nav-item button:focus-visible:hover,
.sidebar-nav-item a:focus-visible:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

/* Left accent bar on focus */
.sidebar-nav-item button:focus-visible::before,
.sidebar-nav-item a:focus-visible::before {
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
.sidebar-nav-item a.router-link-active:focus,
.sidebar-nav-item a.router-link-exact-active:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Grid-based smooth expand/collapse animation for children */
.children-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 300ms ease-out;
  will-change: grid-template-rows;
}

.children-wrapper.is-expanded {
  grid-template-rows: 1fr;
}

.children-content {
  min-height: 0;
  margin-top: 0.25rem;
  /* Force GPU acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
}

.children-content > * {
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
  will-change: opacity, transform;
}

.children-wrapper.is-expanded .children-content > * {
  opacity: 1;
  transform: translateY(0);
}
</style>
