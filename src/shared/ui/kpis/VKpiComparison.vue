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
  comparison: KpiComparison;
  // eslint-disable-next-line vue/require-default-prop
  format?: KpiFormatOptions;
  reverse?: boolean;
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
</script>

<template>
  <div class="kpi-comparison">
    <!-- Period Label with Tooltip -->
    <VTooltip
      v-if="props.comparison.tooltip"
      :text="props.comparison.tooltip"
      placement="right"
    >
      <div class="kpi-comparison__label">
        <VIcon
          icon="lucide:circle-help"
          :size="16"
          class="text-neutral-400"
        />
        <span class="text-xs font-medium text-secondaryText">
          {{ props.comparison.name }}
        </span>
      </div>
    </VTooltip>

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
      class="kpi-comparison__percentage"
    >
      {{ props.comparison.percentage >= 0 ? "+" : "" }}{{ props.comparison.percentage.toFixed(0) }}%
    </span>

    <!-- Custom Content Slot -->
    <slot />
  </div>
</template>

<style scoped>
.kpi-comparison {
  @apply flex items-center text-sm;
  gap: 0.5rem; /* 8px horizontal gap */
  min-height: 1.5rem; /* 24px - tighter consistent height */
}

.kpi-comparison__label {
  @apply flex items-center gap-1 cursor-help;
  min-width: 3.5rem; /* 56px - consistent width for label */
}

.kpi-comparison__label-simple {
  @apply text-xs font-medium text-secondaryText;
  min-width: 3.5rem; /* 56px - same as label with icon */
}

.kpi-comparison__arrow {
  @apply flex-shrink-0;
  margin-left: 0.25rem; /* 4px extra spacing after label */
}

.kpi-comparison__value {
  @apply font-semibold;
  min-width: 5rem; /* 80px - consistent width for values */
  margin-left: 0.25rem; /* 4px extra spacing after arrow */
}

.kpi-comparison__percentage {
  @apply font-semibold;
  min-width: 3.5rem; /* 56px - consistent width for percentage */
}
</style>

