<script setup lang="ts">
import { computed } from "vue";
import { RouterView } from "vue-router";

import { menuItemsToSidebarConfig } from "@/app/router/adapters";
import { menuItems } from "@/app/router/modules";
import { useAuth } from "@/shared/composables/useAuth";
import VIcon from "@/shared/ui/common/VIcon.vue";
import { Sidebar, useSidebar } from "@/widgets/sidebar";
import type { SidebarConfig } from "@/widgets/sidebar";

const { isCollapsed, toggleMobile } = useSidebar();
const { isAuthenticated, logout } = useAuth();

// Footer items based on auth state
const footerItems = computed(() => {
  const items: Array<{
    id: string;
    label: string;
    icon: string;
    to?: { name: string };
    onClick?: () => void;
  }> = [
    {
      id: "about",
      label: "About",
      icon: "mdi:information",
      to: { name: "About" },
    },
  ];

  // Add logout button if authenticated
  if (isAuthenticated.value) {
    items.push({
      id: "logout",
      label: "Logout",
      icon: "mdi:logout",
      onClick: logout,
    });
  } else {
    items.push({
      id: "login",
      label: "Login",
      icon: "mdi:login",
      to: { name: "Login" },
    });
  }

  return items;
});

// Auto-generated sidebar config from router
const sidebarConfig = computed<SidebarConfig>(() =>
  menuItemsToSidebarConfig(menuItems, {
    brandName: "Vue Starter",
    footerItems: footerItems.value,
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
        class="flex-1 w-full flex flex-col"
        :style="{
          maxWidth: isCollapsed ? 'calc(100vw - 5rem)' : 'calc(100vw - 16rem)',
        }"
      >
        <div class="w-full flex-1 py-4 px-2 sm:px-4 lg:px-6 flex flex-col">
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
