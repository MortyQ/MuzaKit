<script setup lang="ts">
import { onMounted, ref } from "vue";

import type { KpiComparison } from "@/shared/types";
import KpiViewController from "@/shared/ui/kpis/KpiViewController.vue";
import VKpiCard from "@/shared/ui/kpis/VKpiCard.vue";

withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false,
});

const isLoading = ref(true);
// Real KPI Data that will be loaded
const realKpiData = [
  {
    title: "Revenue",
    value: 5865995,
    icon: "lucide:dollar-sign",
    iconColor: "green" as const,
    format: { unit: "dollar" as const },
    comparisons: [
      {
        name: "PoP" as const,
        difference: -5343924,
        percentage: -48,
        tooltip: "Period over Period: 05/21/2025 - 08/18/2025 vs 02/21/2025 - 05/20/2025",
      },
      {
        name: "MoM" as const,
        difference: -2412950,
        percentage: -100,
        tooltip: "Month over Month comparison",
      },
      {
        name: "YoY" as const,
        difference: -23162177,
        percentage: -32,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  {
    title: "Lost Revenue",
    value: 7271355,
    icon: "lucide:trending-down",
    iconColor: "red" as const,
    format: { unit: "dollar" as const },
    comparisons: [
      {
        name: "PoP" as const,
        difference: 28003793,
        percentage: -79,
        tooltip: "Period over Period comparison",
      },
      {
        name: "WoW" as const,
        difference: 0,
        percentage: 0,
        tooltip: "Week over Week comparison",
      },
      {
        name: "MoM" as const,
        difference: -2124167,
        percentage: -100,
        tooltip: "Month over Month comparison",
      },
      {
        name: "YoY" as const,
        difference: 67683820,
        percentage: 113,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
    reverse: true,
  },
  {
    title: "Weighted Buy Box",
    value: 64.04,
    icon: "lucide:shopping-cart",
    iconColor: "orange" as const,
    format: { unit: "percentage" as const, decimals: 2 },
    comparisons: [
      {
        name: "PoP" as const,
        difference: 0.15,
        percentage: 30,
        tooltip: "Period over Period comparison",
      },
      {
        name: "WoW" as const,
        difference: 0,
        percentage: 0,
        tooltip: "Week over Week comparison",
      },
      {
        name: "MoM" as const,
        difference: -0.53,
        percentage: -100,
        tooltip: "Month over Month comparison",
      },
      {
        name: "YoY" as const,
        difference: -0.19,
        percentage: -27,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  {
    title: "Sessions",
    value: 1762947,
    icon: "lucide:activity",
    iconColor: "blue" as const,
    format: { unit: "number" as const },
    comparisons: [
      {
        name: "PoP" as const,
        difference: -879967,
        percentage: -33,
        tooltip: "Period over Period comparison",
      },
      {
        name: "MoM" as const,
        difference: -697556,
        percentage: -100,
        tooltip: "Month over Month comparison",
      },
      {
        name: "YoY" as const,
        difference: -6805531,
        percentage: -39,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  // {
  //   title: "Positive Ratings",
  //   value: 12599372,
  //   icon: "lucide:thumbs-up",
  //   iconColor: "success" as const,
  //   format: { unit: "number" as const },
  // },
  // {
  //   title: "Negative Ratings",
  //   value: 2468242,
  //   icon: "lucide:thumbs-down",
  //   iconColor: "error" as const,
  //   format: { unit: "number" as const },
  // },
];

const kpiData = ref<any[]>(realKpiData.map((kpi) => ({
  ...kpi,
  value: 0,
  comparisons: [],
})));

const showAllComparisons = ref(false);

/**
 * Performance Fix: Removed artificial 2-second delay
 * - Previous: await new Promise(resolve => setTimeout(resolve, 2000))
 * - Impact: Was adding +2s to FCP/LCP metrics
 * - Now: Data loads immediately, animations still trigger naturally
 */
onMounted(async () => {
  // Load real data immediately - animations will still trigger from 0 to real values
  kpiData.value = realKpiData;

  // Hide loader immediately (or add minimal delay for smoother UX if needed)
  isLoading.value = false;

  // Optional: If you need to simulate API call, use real API instead:
  // const response = await fetch('/api/kpis');
  // kpiData.value = await response.json();
});
</script>

<template>
  <Teleport
    to="#default-header-filters"
    defer
  >
    <KpiViewController v-model="showAllComparisons" />
  </Teleport>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
    <VKpiCard
      v-for="(kpi, index) in kpiData"
      :key="index"
      :title="kpi.title"
      :value="kpi.value"
      :icon="kpi.icon"
      :icon-color="kpi.iconColor"
      :comparisons="kpi.comparisons"
      :show-all-comparisons="showAllComparisons"
      :format="kpi.format"
      :reverse="kpi.reverse"
      :loading="isLoading"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
