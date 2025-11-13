<script setup lang="ts">
import { computed } from "vue";
import { RouterView } from "vue-router";

import { menuItemsToSidebarConfig } from "@/app/router/adapters";
import { menuItems } from "@/app/router/modules";
import VIcon from "@/shared/ui/common/VIcon.vue";
import { Sidebar, useSidebar } from "@/widgets/sidebar";
import type { SidebarConfig } from "@/widgets/sidebar";

const { isCollapsed, toggleMobile } = useSidebar();

// Footer items - can add additional items here if needed
const footerItems = computed(() => {
  const items: Array<{
    id: string;
    label: string;
    icon: string;
    to?: { name: string };
    onClick?: () => void;
  }> = [];

  return items;
});

// Auto-generated sidebar config from router
const sidebarConfig = computed<SidebarConfig>(() =>
  menuItemsToSidebarConfig(menuItems, {
    brandName: "Vue Starter",
    footerItems: footerItems.value,
    showThemeToggle: true,
    showUserMenu: true,
  }),
);

// Computed content margin based on sidebar state
const contentMargin = computed(() => ({
  "lg:ml-64": !isCollapsed.value,
  "lg:ml-20": isCollapsed.value,
}));
</script>

<template>
  <div
    id="app"
    class="flex min-h-screen bg-mainBg text-mainText"
  >
    <!-- Sidebar -->
    <Sidebar :config="sidebarConfig" />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="contentMargin"
    >
      <!-- Top Header with Mobile Menu Toggle -->
      <header class="bg-base-100 shadow-sm border-b border-base-300 flex-shrink-0 lg:hidden">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-base-200 text-neutral transition-colors"
            aria-label="Open menu"
            @click="toggleMobile"
          >
            <VIcon
              icon="mdi:menu"
              :size="24"
            />
          </button>
          <h1 class="text-lg font-semibold text-primary">
            Vue Starter
          </h1>
          <div class="w-10" />
        </div>
      </header>

      <!-- Main Content -->
      <main
        class="flex-1 w-full flex flex-col max-w-[calc(100vw-0.5rem)]"
        :class="{
          'lg:max-w-[calc(100vw-7rem)]': isCollapsed,
          'lg:max-w-[calc(100vw-17rem)]': !isCollapsed,
        }"
      >
        <div
          class="w-full flex-1 py-4 px-2 sm:px-4 lg:px-6 flex flex-col"
        >
          <RouterView v-slot="{ Component }">
            <component
              :is="Component"
              class="flex-1"
            />
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>
