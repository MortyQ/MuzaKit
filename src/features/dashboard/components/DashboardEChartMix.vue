<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed } from "vue";
import VChart from "vue-echarts";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
]);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = [28000, 32000, 29000, 35000, 31000, 38000,
  42000, 39000, 45000, 48000, 44000, 52000];
const lostRevenueData = [5000, 4500, 6000, 4000, 5500, 4200, 3800, 4600, 3500, 3200, 4100, 2800];
const buyBoxData = [82, 85, 80, 88, 84, 90, 92, 88, 93, 94, 91, 95];

const option = computed(() => ({
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: {
      color: "#1f2937",
    },
  },
  legend: {
    top: 0,
    left: 0,
    textStyle: {
      fontSize: 12,
      color: "#6b7280",
    },
  },
  dataZoom: [
    {
      type: "slider",
      start: 0,
      end: 100,
      height: 30,
      bottom: 10,
      handleStyle: {
        color: "#3b82f6",
      },
      textStyle: {
        color: "#6b7280",
      },
    },
    {
      type: "inside",
      start: 0,
      end: 100,
    },
  ],
  xAxis: {
    type: "category",
    data: months,
    axisLabel: {
      color: "#6b7280",
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: "#e5e7eb",
      },
    },
  },
  yAxis: [
    {
      type: "value",
      name: "Revenue",
      position: "left",
      nameTextStyle: {
        color: "#6b7280",
        fontSize: 12,
      },
      axisLabel: {
        color: "#6b7280",
        fontSize: 12,
        formatter: "${value}",
      },
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
        },
      },
    },
    {
      type: "value",
      name: "Buy Box %",
      position: "right",
      min: 0,
      max: 100,
      nameTextStyle: {
        color: "#6b7280",
        fontSize: 12,
      },
      axisLabel: {
        color: "#6b7280",
        fontSize: 12,
        formatter: "{value}%",
      },
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      splitLine: {
        show: false,
      },
    },
  ],
  series: [
    {
      type: "bar",
      name: "Revenue",
      stack: "total",
      data: revenueData,
      itemStyle: {
        color: "#06b6d4",
        borderRadius: [0, 0, 5, 5],
      },
    },
    {
      type: "bar",
      name: "Lost Revenue",
      stack: "total",
      data: lostRevenueData,
      itemStyle: {
        color: "#3b82f6",
        borderRadius: [5, 5, 0, 0],
      },
    },
    {
      type: "line",
      name: "Buy Box",
      yAxisIndex: 1,
      smooth: true,
      data: buyBoxData,
      itemStyle: {
        color: "#f59e0b",
      },
      lineStyle: {
        width: 3,
        color: "#f59e0b",
      },
      symbolSize: 8,
    },
  ],
} as EChartsOption));
</script>

<template>
  <VCard>
    <template #header>
      <div class="flex items-center gap-2">
        <VIcon
          icon="lucide:trending-up"
        />
        <span>
          Revenue Mix
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
