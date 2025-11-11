<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";
import { Sidebar, useSidebar, createSidebarItem } from "@/widgets/sidebar";
import type { SidebarConfig } from "@/widgets/sidebar";

const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile } = useSidebar();

// Example sidebar configuration
const sidebarConfig = ref<SidebarConfig>({
  logo: "https://via.placeholder.com/40",
  brandName: "LAYZER",
  items: [
    createSidebarItem("home", "Home", "mdi:home", {
      to: { name: "Home" },
    }),
    createSidebarItem("build", "Build", "mdi:hammer", {
      to: { name: "Components" },
    }),
    createSidebarItem("cloud", "Cloud", "mdi:cloud", {
      to: { name: "About" },
    }),
    createSidebarItem("stacks", "Stacks", "mdi:layers", {
      children: [
        createSidebarItem("stack-1", "Frontend", "mdi:layers", {
          to: { name: "Table" },
        }),
        createSidebarItem("stack-2", "Backend", "mdi:layers", {
          children: [
            createSidebarItem("stack-2-1", "API", "mdi:layers", {
              to: { name: "UIGallery" },
            }),
            createSidebarItem("stack-2-2", "Database", "mdi:layers", {
              to: { name: "Components" },
            }),
          ],
        }),
        createSidebarItem("stack-3", "DevOps", "mdi:layers", {
          to: { name: "About" },
        }),
      ],
    }),
    createSidebarItem("mail", "Mail", "mdi:mail", {
      to: { name: "Home" },
      badge: "12",
    }),
  ],
  footerItems: [
    createSidebarItem("settings", "Settings", "mdi:settings", {
      to: { name: "About" },
    }),
  ],
});
</script>

<template>
  <div class="min-h-screen bg-base-200 p-8">
    <!-- Sidebar Demo -->
    <Sidebar :config="sidebarConfig" />

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="{
        'lg:ml-64': !isCollapsed,
        'lg:ml-20': isCollapsed,
      }"
    >
      <div class="max-w-4xl mx-auto">
        <div class="bg-base-100 rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-primary mb-4">
            Sidebar Component Demo
          </h1>

          <div class="space-y-6">
            <!-- Description -->
            <div class="prose">
              <p class="text-neutral/80">
                This is a fully-featured sidebar component with:
              </p>
              <ul class="list-disc list-inside space-y-2 text-sm text-neutral/70">
                <li>Collapsible desktop sidebar</li>
                <li>Mobile-friendly overlay menu</li>
                <li>Infinite nested navigation support</li>
                <li>Active route highlighting</li>
                <li>Tooltips when collapsed</li>
                <li>State persistence in localStorage</li>
                <li>Badge support</li>
                <li>Icons from any collection</li>
              </ul>
            </div>

            <!-- Controls -->
            <div class="flex flex-wrap gap-4">
              <VButton
                text="Toggle Sidebar (Desktop)"
                variant="primary"
                icon="mdi:menu"
                class="hidden lg:flex"
                @click="toggleCollapse"
              />

              <VButton
                text="Toggle Sidebar (Mobile)"
                variant="primary"
                icon="mdi:menu"
                class="lg:hidden"
                @click="toggleMobile"
              />

              <div class="flex items-center gap-2 text-sm">
                <span class="text-neutral/60">Collapsed:</span>
                <span class="font-semibold">{{ isCollapsed ? "Yes" : "No" }}</span>
              </div>

              <div class="flex items-center gap-2 text-sm lg:hidden">
                <span class="text-neutral/60">Mobile Open:</span>
                <span class="font-semibold">{{ isMobileOpen ? "Yes" : "No" }}</span>
              </div>
            </div>

            <!-- Usage Example -->
            <div class="bg-base-200 rounded-lg p-4">
              <h3 class="font-semibold text-sm mb-2 text-neutral">
                Basic Usage:
              </h3>
              <pre class="text-xs overflow-x-auto">
                <code>&lt;Sidebar :config="sidebarConfig" /&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

