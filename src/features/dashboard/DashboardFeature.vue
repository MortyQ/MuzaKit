<script setup lang="ts">
import { defineAsyncComponent } from "vue";

import VLoader from "@/shared/ui/common/VLoader.vue";

const DashboardKpis = defineAsyncComponent({
  loader: () => import("@/features/dashboard/components/DashboardKpis.vue"),
  loadingComponent: VLoader,
});

const DashboardEChartMix = defineAsyncComponent({
  loader: () => import("@/features/dashboard/components/DashboardEChartMix.vue"),
  loadingComponent: VLoader,
});

const DashboardEChartRadial = defineAsyncComponent({
  loader: () => import("@/features/dashboard/components/DashboardEChartRadial.vue"),
  loadingComponent: VLoader,
});

const DashboardExpandTable = defineAsyncComponent({
  loader: () => import("@/features/dashboard/components/DashboardExpandTable.vue"),
  loadingComponent: VLoader,
});
</script>

<template>
  <div class="page-container grid grid-cols-12 auto-rows-min gap-2">
    <div class="col-span-full">
      <DashboardKpis :loading="false" />
    </div>

    <DashboardEChartMix class="col-span-full xl:col-span-8" />
    <DashboardEChartRadial class="col-span-full xl:col-span-4" />

    <DashboardExpandTable class="col-span-full xl:col-span-full" />
  </div>
</template>
