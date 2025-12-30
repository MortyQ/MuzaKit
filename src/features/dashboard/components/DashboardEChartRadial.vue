<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed } from "vue";
import VChart from "vue-echarts";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const ratingsData = [
  { rating: 1, count: 21_500, color: "#991b1b" }, // Dark Red
  { rating: 2, count: 18_300, color: "#ef4444" }, // Red
  { rating: 3, count: 35_700, color: "#f59e0b" }, // Orange
  { rating: 4, count: 67_800, color: "#3b82f6" }, // Blue
  { rating: 5, count: 98_400, color: "#10b981" }, // Green
];

const totalCount = ratingsData.reduce((sum, item) => sum + item.count, 0);
const ratingsWithPercentage = ratingsData.map((item) => ({
  ...item,
  percentage: ((item.count / totalCount) * 100).toFixed(1),
}));

const averageRating = (
  ratingsData.reduce((sum, item) => sum + item.rating * item.count, 0)
  / totalCount
).toFixed(2);

const option = computed(() => ({
  title: {
    text: averageRating,
    subtext: "Avg Rating",
    top: "40%",
    textStyle: {
      fontSize: 32,
      fontWeight: "bold",
    },
    subtextStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      const name = params.name;
      const rating = parseInt(name.split(" ")[0]);
      const item = ratingsWithPercentage.find((r) => r.rating === rating);
      if (!item) return "";
      return `<strong>${item.rating} ⭐</strong><br/>Count: ${item.count.toLocaleString()}<br/>Percentage: ${item.percentage}%`;
    },
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: {
      color: "#1f2937",
    },
  },
  legend: {
    show: true,
    bottom: 0,
    left: "center",
    itemGap: 20,
    icon: "circle",
    textStyle: {
      fontSize: 12,
      color: "#6b7280",
    },
    formatter: (name: string) => {
      const rating = parseInt(name.split(" ")[0]);
      const item = ratingsWithPercentage.find((r) => r.rating === rating);
      return item ? `${item.rating} (${item.count.toLocaleString()})` : name;
    },
  },
  series: [
    {
      type: "pie",
      radius: ["60%", "80%"],
      center: ["50%", "45%"],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: true,
        position: "inside",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
        rotate: "tangential",
        align: "center",
        verticalAlign: "middle",
        formatter: (params: any) => {
          // Hide labels for small segments (less than 5%)
          return params.percent > 5 ? `${params.percent}%` : "";
        },
      },
      labelLayout: {
        hideOverlap: true,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: "bold",
        },
        scale: true,
        scaleSize: 10,
      },
      data: ratingsWithPercentage.map((item) => ({
        value: item.count,
        name: `${item.rating} ⭐`,
        itemStyle: {
          color: item.color,
        },
      })),
    },
  ],
} as unknown as EChartsOption));
</script>

<template>
  <VCard>
    <template #header>
      <div class="flex items-center gap-2">
        <VIcon
          icon="lucide:star"
        />
        <span>
          Rating Overview
        </span>
      </div>
    </template>
    <div class="chart-wrapper">
      <VChart
        :option="option"
        autoresize
        class="chart"
      />
    </div>
  </VCard>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
  flex-shrink: 0;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
