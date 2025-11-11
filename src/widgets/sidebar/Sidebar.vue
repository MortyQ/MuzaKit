<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";

import SidebarFooter from "./components/SidebarFooter.vue";
import SidebarHeader from "./components/SidebarHeader.vue";
import SidebarNav from "./components/SidebarNav.vue";
import { useSidebar } from "./composables/useSidebar";
import type { SidebarConfig } from "./types";

interface Props {
  /** Sidebar configuration */
  config: SidebarConfig;
}

defineProps<Props>();

const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

// Computed classes
const sidebarClasses = computed(() => [
  "sidebar fixed top-0 left-0 h-screen bg-base-100 border-r border-base-300",
  "flex flex-col transition-all duration-300 ease-in-out z-40",
  {
    "w-64": !isCollapsed.value,
    "w-20": isCollapsed.value,
  },
]);

const mobileSidebarClasses = computed(() => [
  "sidebar-mobile fixed top-0 left-0 h-screen bg-base-100 border-r border-base-300",
  "flex flex-col transition-transform duration-300 ease-in-out z-50 w-64",
  {
    "translate-x-0": isMobileOpen.value,
    "-translate-x-full": !isMobileOpen.value,
  },
]);

// Handle escape key to close mobile menu
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isMobileOpen.value) {
    closeMobile();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

// Prevent body scroll when mobile menu is open
watch(isMobileOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      :class="sidebarClasses"
      class="hidden lg:flex"
      aria-label="Main navigation"
    >
      <!-- Header -->
      <SidebarHeader
        :logo="config.logo"
        :brand-name="config.brandName"
      />

      <!-- Navigation -->
      <SidebarNav :items="config.items" />

      <!-- Footer -->
      <SidebarFooter :items="config.footerItems" />
    </aside>

    <!-- Mobile Sidebar -->
    <aside
      :class="mobileSidebarClasses"
      class="lg:hidden"
      aria-label="Main navigation"
    >
      <!-- Header -->
      <SidebarHeader
        :logo="config.logo"
        :brand-name="config.brandName"
        show-close
      />

      <!-- Navigation -->
      <SidebarNav :items="config.items" />

      <!-- Footer -->
      <SidebarFooter :items="config.footerItems" />
    </aside>

    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        aria-hidden="true"
        @click="closeMobile"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.sidebar,
.sidebar-mobile {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}
</style>

