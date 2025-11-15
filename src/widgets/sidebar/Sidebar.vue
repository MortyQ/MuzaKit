<script setup lang="ts">
import SidebarMobile from "./SidebarMobile.vue";
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

const { isCollapsed } = useSidebar();
</script>

<template>
  <div>
    <!-- Desktop Sidebar - shown on lg+ screens -->
    <aside
      class="sidebar fixed top-0 left-0 h-screen glass
             flex flex-col transition-all duration-300 ease-in-out z-40
             border-r border-base-300/50 hidden lg:flex"
      :class="{
        'w-64': !isCollapsed,
        'w-20': isCollapsed,
      }"
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
      <SidebarFooter
        :items="config.footerItems"
        :show-theme-toggle="config.showThemeToggle"
        :show-user-menu="config.showUserMenu"
      />
    </aside>

    <!-- Mobile Sidebar - shown on <lg screens -->
    <div class="lg:hidden">
      <SidebarMobile :config="config" />
    </div>
  </div>
</template>

<style lang="scss">
@use './assets/styles/sidebar.scss';
</style>

