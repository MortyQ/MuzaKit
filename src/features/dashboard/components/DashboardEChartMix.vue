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
const revenueData = [8_500_000, 12_300_000, 9_800_000, 14_200_000, 11_500_000, 15_800_000,
  17_200_000, 13_900_000, 18_500_000, 19_800_000, 16_400_000, 20_200_000];
const lostRevenueData = [2_100_000, 1_850_000, 2_400_000, 1_600_000, 2_200_000, 1_700_000,
  1_500_000, 1_900_000, 1_400_000, 1_300_000, 1_650_000, 1_100_000];
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
    formatter: (params: any) => {
      let result = `<strong>${params[0].axisValue}</strong><br/>`;
      params.forEach((param: any) => {
        const value = param.seriesName === "Buy Box"
          ? `${param.value}%`
          : `$${(param.value / 1_000_000).toFixed(2)}M`;
        result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
      });
      return result;
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
        formatter: (value: number) => `$${(value / 1_000_000).toFixed(1)}M`,
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
