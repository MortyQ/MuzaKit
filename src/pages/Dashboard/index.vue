<script setup lang="ts">
import { ref, onMounted } from "vue";

import type { KpiComparison } from "@/shared/types/kpi";
import VSwitch from "@/shared/ui/common/VSwitch.vue";
import VKpiCard from "@/shared/ui/kpis/VKpiCard.vue";
import VKpiMultiMetric from "@/shared/ui/kpis/VKpiMultiMetric.vue";

// Loading state
const isLoading = ref(true);

// Toggle for showing all comparisons
const showAllComparisons = ref(false);

// Simulate data loading from server
onMounted(async () => {
  // Simulate 2 second delay for server response
  await new Promise(resolve => setTimeout(resolve, 2000));
  isLoading.value = false;
});

// Simple Comparison (2 metrics per card)
const simpleComparisonData = [
  {
    title: "Premium Products",
    metrics: [
      { label: "Avg Price", value: 149.99, icon: "lucide:dollar-sign", iconColor: "primary" as const, format: { unit: "dollar" as const } },
      { label: "Sales", value: 2456, icon: "lucide:shopping-cart", iconColor: "success" as const },
    ],
  },
  {
    title: "Standard Products",
    metrics: [
      { label: "Avg Price", value: 49.99, icon: "lucide:dollar-sign", iconColor: "primary" as const, format: { unit: "dollar" as const } },
      { label: "Sales", value: 15234, icon: "lucide:shopping-cart", iconColor: "success" as const },
    ],
  },
];

// Comprehensive Dashboard (8 metrics per card)
const comprehensiveDashboardData = [
  {
    title: "Q4 2024 Performance Overview",
    metrics: [
      { label: "Revenue", value: 5865995, icon: "lucide:dollar-sign", iconColor: "success" as const, format: { unit: "dollar" as const } },
      { label: "Orders", value: 45678, icon: "lucide:shopping-bag", iconColor: "primary" as const },
      { label: "Avg Order", value: 128.45, icon: "lucide:receipt", iconColor: "info" as const, format: { unit: "dollar" as const } },
      { label: "Customers", value: 23456, icon: "lucide:users", iconColor: "primary" as const },
      { label: "Conversion", value: 3.42, icon: "lucide:percent", iconColor: "success" as const, format: { unit: "percentage" as const, decimals: 2 } },
      { label: "Sessions", value: 687234, icon: "lucide:activity", iconColor: "info" as const },
      { label: "Rating", value: 4.5, icon: "lucide:star", iconColor: "warning" as const, format: { decimals: 1 } },
      { label: "Reviews", value: 12345, icon: "lucide:message-square", iconColor: "neutral" as const },
    ],
  },
];

// Unified KPI Data with optional comparisons
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
  <div class="dashboard-page flex flex-col gap-5">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-mainText mb-2 text-gradient-animated">
        Dashboard
      </h1>
      <p class="text-secondaryText">
        Key Performance Indicators Overview
      </p>
    </div>

    <!-- Simple Comparison (2 metrics) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VKpiMultiMetric
        v-for="(comparison, index) in simpleComparisonData"
        :key="index"
        :title="comparison.title"
        :metrics="comparison.metrics"
        :columns="2"
        icon="lucide:tags"
        :loading="isLoading"
      />
    </div>



    <!-- Unified KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

    <!-- Filters Section (Mock UI for context) -->
    <div class="p-4 bg-cardBg border border-cardBorder rounded-lg">
      <div class="flex items-center gap-2">
        <VSwitch
          v-model="showAllComparisons"
          label="Show additional comparisons"
        />
      </div>
    </div>

    <!-- Comprehensive Dashboard (8 metrics) -->
    <div class="grid grid-cols-1 gap-4">
      <VKpiMultiMetric
        v-for="(dashboard, index) in comprehensiveDashboardData"
        :key="index"
        :title="dashboard.title"
        :metrics="dashboard.metrics"
        icon="lucide:layout-dashboard"
        :loading="isLoading"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  @apply p-6;
}
</style>

