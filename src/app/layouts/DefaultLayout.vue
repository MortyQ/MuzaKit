<script setup lang="ts">
import { computed } from "vue";
import { RouterView } from "vue-router";

import VIcon from "@/shared/ui/common/VIcon.vue";
import { Sidebar, useSidebar, createSidebarItem } from "@/widgets/sidebar";
import type { SidebarConfig } from "@/widgets/sidebar";

const { isCollapsed, toggleMobile } = useSidebar();

// Advanced Sidebar configuration with nested menus for testing
const sidebarConfig: SidebarConfig = {
  brandName: "Vue Starter",
  items: [
    // Simple link
    createSidebarItem("home", "Home", "mdi:home", {
      to: { name: "Home" },
    }),

    // Parent with children (level 1)
    createSidebarItem("components", "Components", "mdi:hammer", {
      children: [
        createSidebarItem("components-overview", "Overview", "mdi:view-dashboard", {
          to: { name: "Components" },
        }),
        createSidebarItem("components-gallery", "UI Gallery", "mdi:palette", {
          to: { name: "UIGallery" },
        }),
      ],
    }),

    // Parent with nested children (level 2)
    createSidebarItem("data", "Data and Tables", "mdi:package", {
      children: [
        createSidebarItem("data-table", "Table Examples", "mdi:table", {
          to: { name: "Table" },
        }),
        // Nested level 2
        createSidebarItem("data-advanced", "Advanced", "mdi:database", {
          children: [
            createSidebarItem("data-import", "Import Data", "mdi:upload", {
              to: { name: "Home" },
            }),
            createSidebarItem("data-export", "Export Data", "mdi:download", {
              to: { name: "Home" },
            }),
          ],
        }),
      ],
    }),

    // Parent with deeply nested children (level 3)
    createSidebarItem("features", "Features", "mdi:layers", {
      badge: "New",
      children: [
        createSidebarItem("features-forms", "Forms", "mdi:file-document", {
          to: { name: "Home" },
        }),
        createSidebarItem("features-charts", "Charts and Graphs", "mdi:chart-line", {
          children: [
            createSidebarItem("charts-line", "Line Charts", "mdi:chart-line", {
              to: { name: "Home" },
            }),
            createSidebarItem("charts-bar", "Bar Charts", "mdi:chart-bar", {
              to: { name: "Home" },
            }),
            // Deeply nested level 3
            createSidebarItem("charts-advanced", "Advanced Charts", "mdi:chart-box", {
              children: [
                createSidebarItem("charts-combo", "Combo Charts", "mdi:chart-timeline", {
                  to: { name: "Home" },
                }),
                createSidebarItem("charts-custom", "Custom Charts", "mdi:chart-bubble", {
                  to: { name: "Home" },
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // With badge
    createSidebarItem("messages", "Messages", "mdi:mail", {
      to: { name: "Home" },
      badge: "12",
    }),
  ],
  footerItems: [
    createSidebarItem("settings", "Settings", "mdi:settings", {
      to: { name: "About" },
    }),
  ],
};

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
      <main class="flex-1 w-full flex flex-col">
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
