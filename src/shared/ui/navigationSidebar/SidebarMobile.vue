<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";

import SidebarMobileFooter from "./components/mobile/SidebarMobileFooter.vue";
import SidebarMobileHeader from "./components/mobile/SidebarMobileHeader.vue";
import SidebarMobileNav from "./components/mobile/SidebarMobileNav.vue";
import { useSidebar } from "./composables/useSidebar";
import type { SidebarConfig } from "./types";

interface Props {
  /** Sidebar configuration */
  config: SidebarConfig
}

defineProps<Props>();

const { isMobileOpen, closeMobile } = useSidebar();

const sidebarClasses = computed(() => {
  const isOpen = isMobileOpen.value;

  const baseClasses = "sidebar-mobile fixed top-0 left-0 h-screen bg-base-100 flex flex-col transition-transform duration-300 ease-in-out z-50 w-64 border-r border-base-300/50 overflow-y-auto";
  const translateClass = isOpen ? "translate-x-0" : "hidden";

  return `${baseClasses} ${translateClass}`;
});

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
</script>

<template>
  <div>
    <!-- Mobile Sidebar -->
    <aside
      :class="sidebarClasses"
      aria-label="Main navigation"
    >
      <!-- Header -->
      <SidebarMobileHeader
        :logo="config.logo"
        :brand-name="config.brandName"
      />

      <!-- Navigation -->
      <SidebarMobileNav :items="config.items" />

      <!-- Footer -->
      <SidebarMobileFooter
        :items="config.footerItems"
        :show-theme-toggle="config.showThemeToggle"
        :show-user-menu="config.showUserMenu"
      />
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
        class="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        @click="closeMobile"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'assets/styles/sidebar';
</style>
