<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import { getMenuItems } from "@/app/router/modules";
import { menuItemsToSidebarConfig } from "@/app/router/utils/adapters";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useModal } from "@/shared/composables";
import VButton from "@/shared/ui/common/VButton.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import GlobalFilterFeature from "@/widgets/filters/GlobalFilterFeature.vue";
import { Sidebar, useSidebar } from "@/widgets/sidebar";
import type { SidebarConfig } from "@/widgets/sidebar";

const { open } = useModal("global-filter");

const route = useRoute();
const authStore = useAuthStore();
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
// Recomputes when user permissions change
const sidebarConfig = computed<SidebarConfig>(() => {
  // Pass authStore to filter menu items by permissions
  // Computed automatically reacts to authStore.user changes
  return menuItemsToSidebarConfig(getMenuItems(authStore), {
    brandName: "MuzaKit",
    footerItems: footerItems.value,
    showThemeToggle: true,
    showUserMenu: true,
  });
});

// Computed content margin based on sidebar state
const contentMargin = computed(() => ({
  "lg:ml-64": !isCollapsed.value,
  "lg:ml-20": isCollapsed.value,
}));
</script>

<template>
  <div
    id="app"
    class="flex min-h-screen bg-mainBg text-mainText overflow-x-hidden p-4"
  >
    <!-- Sidebar -->
    <Sidebar :config="sidebarConfig" />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col transition-all duration-300
      overflow-x-hidden bg-cardBg rounded-xl shadow-glass-soft"
      :class="contentMargin"
    >
      <!-- Top Header with Mobile Menu Toggle -->
      <header
        class="bg-base-100 shadow-sm border-b border-base-300 flex-shrink-0 lg:hidden"
      >
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
            MuzaKit
          </h1>
          <div class="w-10" />
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-x-hidden">
        <div class="flex-1 py-4 px-4 sm:px-6 flex flex-col min-w-0">
          <!-- Page Header -->
          <header
            class="flex justify-between items-center min-h-16 mb-4 gap-4 pb-4
          border-b border-base-300"
          >
            <h1
              class="text-3xl font-bold text-mainText flex-shrink-0"
            >
              {{ route.meta.title || "" }}
            </h1>
            <div class="flex items-center gap-3 flex-shrink-0">
              <div
                id="default-header-filters"
                class="contents"
              />
              <VButton
                icon="lucide:sliders-horizontal"
                aria-label="Global Filters"
                @click="open"
              />
              <GlobalFilterFeature />
            </div>
          </header>

          <!-- Page Content -->
          <RouterView v-slot="{ Component }">
            <component
              :is="Component"
              class="flex-1 min-w-0"
            />
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>
