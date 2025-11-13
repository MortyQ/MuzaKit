<script setup lang="ts">
import CardsTab from "@/pages/UIGallery/components/DisplayComponents/CardsTab.vue";
import IconsTab from "@/pages/UIGallery/components/DisplayComponents/IconsTab.vue";
import TabsComponentTab from "@/pages/UIGallery/components/DisplayComponents/TabsComponentTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "cards", label: "Cards", icon: "lucide:square" },
  { id: "icons", label: "Icons", icon: "lucide:shapes" },
  { id: "tabs", label: "Tabs", icon: "lucide:folder" },
];

const componentMap = {
  cards: CardsTab,
  icons: IconsTab,
  tabs: TabsComponentTab,
};
</script>

<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-mainText mb-3">
        Display Components
      </h1>
      <p class="text-secondaryText">
        Components for displaying content and presenting information.
        Cards, icons, badges, avatars, and other visual elements.
      </p>
    </div>

    <VTabs
      :tabs="tabs"
      use-hash
    >
      <template
        v-for="tab in tabs"
        :key="tab.id"
        #[tab.id]
      >
        <component :is="componentMap[tab.id]" />
      </template>
    </VTabs>
  </div>
</template>
