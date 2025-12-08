<script setup lang="ts">
import DashboardExpandTable from "@/features/dashboard/components/DashboardExpandTable.vue";
import DashboardKpis from "@/features/dashboard/components/DashboardKpis.vue";

</script>

<template>
  <div class="page-container gap-4">
    <!-- KPI Cards Grid -->
    <DashboardKpis
      :loading="false"
    />
    <DashboardExpandTable />
  </div>
</template>
