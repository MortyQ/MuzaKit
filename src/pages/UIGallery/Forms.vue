<script setup lang="ts">
import FileInputsTab from "@/pages/UIGallery/components/FileInputsTab.vue";
import MultiSelectTab from "@/pages/UIGallery/components/FormComponents/MultiSelectTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "multiSelect", label: "Multi Select", icon: "lucide:list-checks" },
  { id: "fileInputs", label: "File Inputs", icon: "lucide:upload" },
];

const componentMap = {
  multiSelect: MultiSelectTab,
  fileInputs: FileInputsTab,
};
</script>

<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-mainText mb-3">
        Form Components
      </h1>
      <p class="text-secondaryText">
        Form inputs, controls, and validation components.
        Build powerful forms with dropdowns, file uploads, inputs, and more.
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

