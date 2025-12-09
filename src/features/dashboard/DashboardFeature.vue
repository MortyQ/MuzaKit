<script setup lang="ts">
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
    <DashboardExpandTable class="col-span-full" />
  </div>
</template>
