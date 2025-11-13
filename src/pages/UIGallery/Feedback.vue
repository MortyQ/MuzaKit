<script setup lang="ts">
import ModalsTab from "@/pages/UIGallery/components/FeedbackComponents/ModalsTab.vue";
import ToastsTab from "@/pages/UIGallery/components/FeedbackComponents/ToastsTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "modals", label: "Modals", icon: "lucide:layout-panel-top" },
  { id: "toasts", label: "Toasts", icon: "lucide:message-square" },
];

const componentMap = {
  modals: ModalsTab,
  toasts: ToastsTab,
};
</script>

<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-mainText mb-3">
        Feedback Components
      </h1>
      <p class="text-secondaryText">
        Components for user feedback, notifications, and dialogs.
        Provide clear communication with users through modals, toasts, and alerts.
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
