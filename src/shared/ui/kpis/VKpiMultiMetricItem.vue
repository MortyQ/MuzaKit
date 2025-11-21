<script setup lang="ts">
import type { VKpiMultiMetric } from "./types/VKpiMultiMetric.types";

import VIcon from "@/shared/ui/common/VIcon.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";
import { formatKpiValue } from "@/shared/utils/kpi";

interface Props {
  /** Metric data */
  metric: VKpiMultiMetric
  /** Enable glassmorphism effect */
  glassmorphism?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  glassmorphism: false,
});

// Format metric value
const formattedValue = () => {
  const numValue = typeof props.metric.value === "string"
    ? parseFloat(props.metric.value.replace(/,/g, ""))
    : props.metric.value;

  return formatKpiValue(numValue, {
    unit: props.metric.format?.unit || "number",
    decimals: props.metric.format?.decimals ?? false,
    multiply: props.metric.format?.multiply ?? 1,
  });
};

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
    }"
  >
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
        :text="`${formattedValue()}${metric.format?.unit === 'percentage' ? '%' : ''}`"
        placement="top"
        wrapper-class="block w-full"
        :delay="150"
      >
        <div class="kpi-multi-value">
          {{ formattedValue() }}
          <span v-if="metric.format?.unit === 'percentage'">%</span>
        </div>
      </VTooltip>
    </div>
  </div>
</template>

<style scoped>
.kpi-multi-metric {
  @apply flex items-center gap-4;
  @apply p-4 rounded-xl;
  @apply border border-cardBorder;
  @apply transition-all duration-300;
  @apply hover:shadow-md;
  @apply hover:border-primary-300 dark:hover:border-primary-600;
  @apply cursor-pointer;
}

.kpi-multi-icon {
  @apply flex items-center justify-center;
  @apply w-14 h-14 rounded-xl;
  @apply flex-shrink-0;
  @apply transition-all duration-300;
}

.kpi-multi-metric:hover .kpi-multi-icon {
  @apply scale-110 rotate-6;
}

.kpi-multi-content {
  @apply flex flex-col gap-1;
  @apply min-w-0 flex-1;
}

.kpi-multi-label {
  @apply text-sm font-medium text-secondaryText;
  @apply truncate;
}

.kpi-multi-value {
  @apply text-2xl font-semibold text-mainText;
  @apply transition-all duration-200;
  @apply truncate;
  @apply tabular-nums;
}

.kpi-multi-metric:hover .kpi-multi-value {
  @apply scale-105;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .kpi-multi-metric {
    @apply p-3 gap-3;
  }

  .kpi-multi-icon {
    @apply w-12 h-12;
  }

  .kpi-multi-value {
    @apply text-xl;
  }
}
</style>

