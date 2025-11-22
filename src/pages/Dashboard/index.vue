<script setup lang="ts">
import DashboardKpisOnlyTab from "@/pages/Dashboard/components/DashboardKpisOnlyTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id:"kpis", label: "Kpi's Only", component: DashboardKpisOnlyTab, icon: "lucide:bar-chart-3" },
];
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-mainText mb-2 text-gradient-animated">
        Dashboard
      </h1>
      <p class="text-secondaryText">
        Key Performance Indicators Overview
      </p>
    </div>
    <VTabs
      :tabs="tabs"
    >
      <template
        v-for="tab in tabs"
        :key="tab.id"
        #[tab.id]
      >
        <component
          :is="tab.component"
          v-if="tab.component"
        />
      </template>
    </VTabs>
  </div>
</template>
