<script setup lang="ts">
import DashboardEChartMix from "@/features/dashboard/components/DashboardEChartMix.vue";
import DashboardEChartRadial from "@/features/dashboard/components/DashboardEChartRadial.vue";
import DashboardExpandTable from "@/features/dashboard/components/DashboardExpandTable.vue";
import DashboardKpis from "@/features/dashboard/components/DashboardKpis.vue";

</script>

<template>
  <div class="page-container grid grid-cols-12 auto-rows-min gap-2">
    <div class="col-span-full">
      <DashboardKpis
        :loading="false"
      />
    </div>
    <DashboardEChartMix class="col-span-full xl:col-span-8" />
    <DashboardEChartRadial class="col-span-full xl:col-span-4" />
    <DashboardExpandTable class="col-span-full xl:col-span-full" />
  </div>
</template>
