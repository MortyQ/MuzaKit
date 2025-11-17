<script setup lang="ts">
import { ref } from "vue";

import type { KpiComparison } from "@/shared/types/kpi";
import VSwitch from "@/shared/ui/common/VSwitch.vue";
import VKpiCard from "@/shared/ui/kpis/VKpiCard.vue";


// Toggle for showing all comparisons
const showAllComparisons = ref(false);

// Mock KPI Data
const kpiData = [
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
  {
    title: "Conversion",
    value: 10.69,
    icon: "lucide:percent",
    iconColor: "green" as const,
    format: { unit: "percentage" as const, decimals: true },
    comparisons: [
      {
        name: "PoP" as const,
        difference: 0.01,
        percentage: 7,
        tooltip: "Period over Period comparison",
      },
      {
        name: "MoM" as const,
        difference: -0.11,
        percentage: -100,
        tooltip: "Month over Month comparison",
      },
      {
        name: "YoY" as const,
        difference: -0.01,
        percentage: -12,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  {
    title: "Ad Revenue",
    value: 2247941,
    icon: "lucide:megaphone",
    iconColor: "purple" as const,
    format: { unit: "dollar" as const },
    comparisons: [
      {
        name: "PoP" as const,
        difference: -1071745,
        percentage: -32,
        tooltip: "Period over Period comparison",
      },
      {
        name: "YoY" as const,
        difference: -4554816,
        percentage: -28,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  {
    title: "Ad Spend",
    value: 797836,
    icon: "lucide:wallet",
    iconColor: "orange" as const,
    format: { unit: "dollar" as const },
    comparisons: [
      {
        name: "PoP" as const,
        difference: -332667,
        percentage: -29,
        tooltip: "Period over Period comparison",
      },
      {
        name: "YoY" as const,
        difference: -1991393,
        percentage: -37,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
  {
    title: "ROAS",
    value: 2.82,
    icon: "lucide:trending-up",
    iconColor: "cyan" as const,
    format: { unit: "number" as const, decimals: 2 },
    comparisons: [
      {
        name: "PoP" as const,
        difference: -0.12,
        percentage: -4,
        tooltip: "Period over Period comparison",
      },
      {
        name: "YoY" as const,
        difference: 0.39,
        percentage: 13,
        tooltip: "Year over Year comparison",
      },
    ] as KpiComparison[],
  },
];

// Short KPI Data (without comparisons)
const shortKpiData = [
  {
    title: "Positive Ratings",
    value: 12599372,
    icon: "lucide:thumbs-up",
    iconColor: "success" as const,
    format: { unit: "number" as const },
  },
  {
    title: "Negative Ratings",
    value: 2468242,
    icon: "lucide:thumbs-down",
    iconColor: "error" as const,
    format: { unit: "number" as const },
  },
];
</script>

<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-mainText mb-2 text-gradient-animated">
        Dashboard
      </h1>
      <p class="text-secondaryText">
        Key Performance Indicators Overview
      </p>
    </div>

    <!-- Filters Section (Mock UI for context) -->
    <div class="mb-6 p-4 bg-cardBg border border-cardBorder rounded-lg">
      <div class="flex items-center gap-2">
        <VSwitch
          v-model="showAllComparisons"
          label="Show additional comparisons"
        />
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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
      />
    </div>

    <!-- Short KPI Cards (using VKpiCard without comparisons) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <VKpiCard
        v-for="(kpi, index) in shortKpiData"
        :key="index"
        :title="kpi.title"
        :value="kpi.value"
        :icon="kpi.icon"
        :icon-color="kpi.iconColor"
        :format="kpi.format"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  @apply p-6;
}
</style>

