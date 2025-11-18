<script setup lang="ts">
import AccordionTab from "@/pages/UIGallery/components/DisplayComponents/AccordionTab.vue";
import CardsTab from "@/pages/UIGallery/components/DisplayComponents/CardsTab.vue";
import FloatingTab from "@/pages/UIGallery/components/DisplayComponents/FloatingTab.vue";
import IconsTab from "@/pages/UIGallery/components/DisplayComponents/IconsTab.vue";
import KpiTab from "@/pages/UIGallery/components/DisplayComponents/KpiTab.vue";
import TabsComponentTab from "@/pages/UIGallery/components/DisplayComponents/TabsComponentTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "cards", label: "Cards", icon: "lucide:square" },
  { id: "kpi", label: "KPI Cards", icon: "lucide:bar-chart-3" },
  { id: "icons", label: "Icons", icon: "lucide:shapes" },
  { id: "tabs", label: "Tabs", icon: "lucide:folder" },
  { id: "accordion", label: "Accordion", icon: "lucide:list" },
  { id: "floating", label: "Floating (Dropdown/Popover)", icon: "lucide:layers" },
];

const componentMap = {
  cards: CardsTab,
  kpi: KpiTab,
  icons: IconsTab,
  tabs: TabsComponentTab,
  accordion: AccordionTab,
  floating: FloatingTab,
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
