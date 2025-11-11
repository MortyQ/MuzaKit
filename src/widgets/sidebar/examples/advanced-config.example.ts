// Example: Advanced Sidebar Configuration
// Copy this to your layout or page component

import { computed } from "vue";

import { useSidebar, createSidebarItem, type SidebarConfig } from "@/widgets/sidebar";

// Get sidebar state
const { isCollapsed } = useSidebar();
// Content margin based on sidebar state
const contentMargin = computed(() => ({
  "lg:ml-64": !isCollapsed.value,
  "lg:ml-20": isCollapsed.value,
}));

// Sidebar configuration
const sidebarConfig: SidebarConfig = {
  logo: "https://via.placeholder.com/40",
  brandName: "My Application",

  // Main navigation items
  items: [
    // Simple link
    createSidebarItem("dashboard", "Dashboard", "mdi:view-dashboard", {
      to: { name: "Dashboard" },
    }),

    // With badge
    createSidebarItem("messages", "Messages", "mdi:email", {
      to: { name: "Messages" },
      badge: "12",
    }),

    // Parent with children (collapsible)
    createSidebarItem("products", "Products", "mdi:package", {
      children: [
        createSidebarItem("products-list", "All Products", "mdi:format-list-bulleted", {
          to: { name: "ProductsList" },
        }),
        createSidebarItem("products-new", "Add New", "mdi:plus", {
          to: { name: "ProductsNew" },
        }),
        // Nested children (infinite depth)
        createSidebarItem("products-categories", "Categories", "mdi:folder", {
          children: [
            createSidebarItem("cat-electronics", "Electronics", "mdi:laptop", {
              to: { name: "CategoryElectronics" },
            }),
            createSidebarItem("cat-clothing", "Clothing", "mdi:tshirt-crew", {
              to: { name: "CategoryClothing" },
            }),
            createSidebarItem("cat-food", "Food & Drinks", "mdi:food", {
              to: { name: "CategoryFood" },
            }),
          ],
        }),
      ],
    }),

    // Analytics section
    createSidebarItem("analytics", "Analytics", "mdi:chart-line", {
      children: [
        createSidebarItem("analytics-overview", "Overview", "mdi:view-dashboard", {
          to: { name: "AnalyticsOverview" },
        }),
        createSidebarItem("analytics-reports", "Reports", "mdi:file-chart", {
          to: { name: "AnalyticsReports" },
        }),
      ],
    }),

    // Users section
    createSidebarItem("users", "Users", "mdi:account-group", {
      badge: "3",
      children: [
        createSidebarItem("users-list", "All Users", "mdi:account-multiple", {
          to: { name: "UsersList" },
        }),
        createSidebarItem("users-roles", "Roles", "mdi:shield-account", {
          to: { name: "UsersRoles" },
        }),
      ],
    }),

    // Disabled item example
    createSidebarItem("notifications", "Notifications", "mdi:bell", {
      to: { name: "Notifications" },
      disabled: true,
      badge: "Coming Soon",
    }),
  ],

  // Footer items (always at bottom)
  footerItems: [
    createSidebarItem("settings", "Settings", "mdi:settings", {
      to: { name: "Settings" },
    }),
    createSidebarItem("help", "Help & Support", "mdi:help-circle", {
      to: { name: "Help" },
    }),
    createSidebarItem("profile", "My Profile", "mdi:account", {
      to: { name: "Profile" },
    }),
  ],
};

// Template usage:
/*
<template>
  <div class="flex min-h-screen bg-mainBg">
    <!-- Sidebar -->
    <Sidebar :config="sidebarConfig" />

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="contentMargin"
    >
      <!-- Mobile Header with Menu Toggle -->
      <header class="bg-base-100 shadow-sm border-b border-base-300 lg:hidden">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            class="p-2 rounded-lg hover:bg-base-200"
            @click="toggleMobile"
          >
            <VIcon icon="mdi:menu" :size="24" />
          </button>
          <h1 class="text-lg font-semibold">My App</h1>
          <div class="w-10" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>
*/

export { sidebarConfig, contentMargin };

