<script setup lang="ts">
import AccordionTab from "@/pages/UIGallery/components/DisplayComponents/AccordionTab.vue";
import CardsTab from "@/pages/UIGallery/components/DisplayComponents/CardsTab.vue";
import DropdownTab from "@/pages/UIGallery/components/DisplayComponents/DropdownTab.vue";
import IconsTab from "@/pages/UIGallery/components/DisplayComponents/IconsTab.vue";
import PopoverTab from "@/pages/UIGallery/components/DisplayComponents/PopoverTab.vue";
import TabsComponentTab from "@/pages/UIGallery/components/DisplayComponents/TabsComponentTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "cards", label: "Cards", icon: "lucide:square" },
  { id: "icons", label: "Icons", icon: "lucide:shapes" },
  { id: "tabs", label: "Tabs", icon: "lucide:folder" },
  { id: "accordion", label: "Accordion", icon: "lucide:list" },
  { id: "popover", label: "Popover", icon: "lucide:message-circle" },
  { id: "dropdown", label: "Dropdown", icon: "lucide:chevron-down" },
];

const componentMap = {
  cards: CardsTab,
  icons: IconsTab,
  tabs: TabsComponentTab,
  accordion: AccordionTab,
  popover: PopoverTab,
  dropdown: DropdownTab,
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
