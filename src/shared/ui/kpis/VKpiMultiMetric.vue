<script setup lang="ts">
import { computed } from "vue";

import VKpiMultiMetricHeader from "./VKpiMultiMetricHeader.vue";
import VKpiMultiMetricItem from "./VKpiMultiMetricItem.vue";
import type { VKpiMultiMetric, VKpiMultiMetricColumns } from "./types/VKpiMultiMetric.types";

interface Props {
  /** Title of the card */
  title: string
  /** Array of metrics to display */
  metrics: VKpiMultiMetric[]
  /** Header icon (lucide format) */
  icon?: string
  /** Number of columns in grid (2, 3, 4, 5) */
  columns?: VKpiMultiMetricColumns
  /** Enable glassmorphism effect (backdrop-blur) */
  glassmorphism?: boolean
  /** Optional custom class */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: "lucide:chart-column",
  columns: "auto",
  glassmorphism: false,
  class: "",
});


// Compute grid columns based on columns prop or metrics count
const gridCols = computed(() => {
  // If columns prop is specified, use it
  if (props.columns !== "auto") {
    const colMap = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    };
    return colMap[props.columns];
  }

  // Auto mode: compute based on metrics count
  const count = props.metrics.length;
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  if (count === 5) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
  if (count === 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count <= 8) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
});

// Glassmorphism classes (optional for performance)
const cardClasses = computed(() => ({
  "bg-cardBg/80 backdrop-blur-md": props.glassmorphism,
  "bg-cardBg": !props.glassmorphism,
}));
</script>

<template>
  <div
    class="kpi-multi-metric-card"
    :class="[cardClasses, props.class]"
  >
    <!-- Header -->
    <VKpiMultiMetricHeader
      :title="title"
      :icon="icon"
      :glassmorphism="glassmorphism"
    >
      <!-- Forward icon slot -->
      <template
        v-if="$slots.icon"
        #icon
      >
        <slot name="icon" />
      </template>
    </VKpiMultiMetricHeader>

    <!-- Metrics Grid -->
    <div
      class="kpi-multi-grid"
      :class="gridCols"
    >
      <VKpiMultiMetricItem
        v-for="(metric, index) in metrics"
        :key="`metric-${index}`"
        :metric="metric"
        :glassmorphism="glassmorphism"
      />
    </div>
  </div>
</template>

<style scoped>
.kpi-multi-metric-card {
  @apply relative rounded-xl overflow-hidden;
  /* Background applied via computed classes */
  @apply border border-cardBorder;
  @apply shadow-sm hover:shadow-md;
  @apply dark:shadow-md dark:hover:shadow-xl;
  @apply transition-all duration-300;
}

.kpi-multi-grid {
  @apply grid gap-4;
  @apply p-6;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .kpi-multi-grid {
    @apply gap-3 p-4;
  }
}
</style>

