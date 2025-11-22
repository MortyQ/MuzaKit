<script setup lang="ts">
import { computed } from "vue";

import type { VKpiMultiMetric } from "./types/VKpiMultiMetric.types";

import { useAnimatedValue } from "@/shared/composables";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";
import { formatKpiValue } from "@/shared/utils/kpi";

interface Props {
  /** Metric data */
  metric: VKpiMultiMetric
  /** Enable glassmorphism effect */
  glassmorphism?: boolean
  /** Loading state */
  loader?: boolean
  /** Animate value changes (default: true) */
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  glassmorphism: false,
  loader: false,
  animate: true,
});

// Extract format options with defaults
const formatOptions = computed(() => ({
  unit: props.metric.format?.unit || "number",
  decimals: props.metric.format?.decimals ?? false,
  multiply: props.metric.format?.multiply ?? 1,
}));

// Use animated value composable
const { animatedValue } = useAnimatedValue(
  () => props.metric.value,
  {
    animate: props.animate,
    multiply: formatOptions.value.multiply,
  },
);

// Format animated value
const formattedValue = computed(() => {
  return formatKpiValue(animatedValue.value, {
    ...formatOptions.value,
    multiply: 1, // Already multiplied in animatedValue
  });
});

// Get icon color classes consistent with VKpiCard
const iconColorClass = () => {
  const colorMap = {
    primary: "bg-primary-400 dark:bg-primary-500",
    success: "bg-success-400 dark:bg-success-500",
    warning: "bg-warning-400 dark:bg-warning-500",
    error: "bg-error-400 dark:bg-error-500",
    info: "bg-info-400 dark:bg-info-500",
    neutral: "bg-neutral-400 dark:bg-neutral-500",
  };

  return colorMap[props.metric.iconColor as keyof typeof colorMap] || colorMap.primary;
};
</script>

<template>
  <div
    class="kpi-multi-metric"
    :class="{
      'bg-cardBg/50 backdrop-blur-sm': glassmorphism,
      'bg-cardBg': !glassmorphism,
      'kpi-multi-metric--loading': loader,
    }"
  >
    <!-- Loading State Overlay -->
    <div
      v-if="loader"
      class="kpi-multi-metric__loading"
    />

    <!-- Icon -->
    <div
      v-if="metric.icon"
      class="kpi-multi-icon"
      :class="iconColorClass()"
    >
      <VIcon
        :icon="metric.icon"
        :size="28"
        color="white"
      />
    </div>

    <!-- Content -->
    <div class="kpi-multi-content">
      <div class="kpi-multi-label">
        {{ metric.label }}
      </div>
      <VTooltip
        :text="`${formattedValue}${formatOptions.unit === 'percentage' ? '%' : ''}`"
        placement="top"
        wrapper-class="block w-full"
        :delay="150"
      >
        <div class="kpi-multi-value">
          {{ formattedValue }}
          <span v-if="formatOptions.unit === 'percentage'">%</span>
        </div>
      </VTooltip>
    </div>
  </div>
</template>
