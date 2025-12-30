<script setup lang="ts">
import { computed } from "vue";

import type { KpiComparison, KpiFormatOptions } from "@/shared/types/kpi";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";
import {
  formatComparisonValue,
  getComparisonClasses,
  getComparisonColor,
  isComparisonPositive,
} from "@/shared/utils/kpi";

interface VKpiComparisonProps {
  comparison: KpiComparison
  // eslint-disable-next-line vue/require-default-prop
  format?: KpiFormatOptions
  reverse?: boolean
}

const props = withDefaults(defineProps<VKpiComparisonProps>(), {
  reverse: false,
});

const isPositive = computed(() => isComparisonPositive(props.comparison.difference));

const classes = computed(() =>
  getComparisonClasses(props.comparison.difference, props.reverse));

const iconColor = computed(() =>
  getComparisonColor(props.comparison.difference, props.reverse));

const formatOptions = computed(() => ({
  unit: props.format?.unit || "number",
  decimals: props.format?.decimals ?? false,
}));

const formattedDifference = computed(() =>
  formatComparisonValue(
    props.comparison.difference,
    formatOptions.value,
  ));

// Full tooltip text (shown on hover with short delay)
const fullComparisonText = computed(() => {
  const sign = props.comparison.percentage >= 0 ? "+" : "";
  const unit = formatOptions.value.unit === "percentage" ? "%" : "";
  const diff = `${formattedDifference.value}${unit}`;
  const percent = `${sign}${props.comparison.percentage.toFixed(2)}%`;
  return `${props.comparison.name}: ${diff} (${percent})`;
});
</script>

<template>
  <div class="kpi-comparison">
    <!-- Period Label with Info Icon -->
    <div
      v-if="props.comparison.tooltip"
      class="kpi-comparison__label"
    >
      <VTooltip
        :text="props.comparison.tooltip"
        placement="right"
        :delay="100"
      >
        <VIcon
          icon="lucide:circle-help"
          :size="16"
          class="text-neutral-400 cursor-help"
        />
      </VTooltip>
      <span class="text-xs font-medium text-secondaryText">
        {{ props.comparison.name }}
      </span>
    </div>

    <span
      v-else
      class="kpi-comparison__label-simple"
    >
      {{ props.comparison.name }}
    </span>

    <!-- Arrow Icon -->
    <VIcon
      :icon="isPositive ? 'lucide:arrow-up' : 'lucide:arrow-down'"
      :size="16"
      :color="iconColor"
      class="kpi-comparison__arrow"
    />

    <!-- Values wrapper with Tooltip -->
    <VTooltip
      :text="fullComparisonText"
      placement="top"
      wrapper-class="flex items-center justify-between min-w-0 flex-1"
      :delay="150"
    >
      <!-- Difference Value -->
      <span
        :class="classes.textColor"
        class="kpi-comparison__value"
      >
        {{ formattedDifference }}{{ formatOptions.unit === 'percentage' ? '%' : '' }}
      </span>

      <!-- Percentage Change -->
      <span
        :class="classes.textColor"
        class="kpi-comparison__percentage tabular-nums text-right"
        style="min-width: 60px"
      >
        {{ props.comparison.percentage >= 0 ? "+" : "" }}<!--
        -->{{ props.comparison.percentage.toFixed(0) }}%
      </span>
    </VTooltip>

    <!-- Custom Content Slot -->
    <slot />
  </div>
</template>
