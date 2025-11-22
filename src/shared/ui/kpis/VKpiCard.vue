<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import type { VKpiCardProps } from "@/shared/types/kpi";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";
import VKpiComparison from "@/shared/ui/kpis/VKpiComparison.vue";
import {
  animateValue,
  formatKpiValue,
  getKpiIconColorClass,
} from "@/shared/utils/kpi";

const props = withDefaults(defineProps<VKpiCardProps>(), {
  iconColor: "primary",
  comparisons: () => [],
  showAllComparisons: false,
  loading: false,
  reverse: false,
  size: "full",
  animate: true, // Default to true for smooth animations
  class: "",
});

// Animated value for smooth transitions
const animatedValue = ref(0);
const isInitialized = ref(false);

// Extract format options with defaults
const formatOptions = computed(() => ({
  unit: props.format?.unit || "number",
  decimals: props.format?.decimals ?? false,
  multiply: props.format?.multiply ?? 1,
  formatter: props.format?.formatter,
}));

// Initialize animated value
const initValue = () => {
  const numValue = typeof props.value === "string"
    ? parseFloat(props.value.replace(/,/g, ""))
    : Number(props.value);

  return isNaN(numValue) ? 0 : numValue * formatOptions.value.multiply;
};

// Animate to initial value on mount
onMounted(() => {
  const targetValue = initValue();

  if (props.animate) {
    animateValue(0, targetValue, 1000, (val) => {
      animatedValue.value = val;
    });
  } else {
    animatedValue.value = targetValue;
  }

  isInitialized.value = true;
});

// Watch for value changes and animate
watch(
  () => props.value,
  () => {
    if (!isInitialized.value) return;

    const targetValue = initValue();

    if (!props.animate) {
      animatedValue.value = targetValue;
      return;
    }

    animateValue(animatedValue.value, targetValue, 1000, (val) => {
      animatedValue.value = val;
    });
  },
);

// Format animated value
const formattedValue = computed(() => {
  return formatKpiValue(animatedValue.value, {
    ...formatOptions.value,
    multiply: 1, // Already multiplied in animatedValue
  });
});

// Get icon color class
const iconColorClass = computed(() => getKpiIconColorClass(props.iconColor));

// Get primary comparison (PoP if available, otherwise first)
const primaryComparison = computed(() => {
  if (!props.comparisons || props.comparisons.length === 0) return null;

  const popComparison = props.comparisons.find((c) => c.name === "PoP");
  return popComparison || props.comparisons[0];
});

// Get additional comparisons (excluding primary)
const additionalComparisons = computed(() => {
  if (!props.comparisons || props.comparisons.length <= 1) return [];

  const primary = primaryComparison.value;
  return props.comparisons.filter((c) => c !== primary);
});

// Card size classes - control width like VCard
const sizeClasses = computed(() => {
  return `kpi-card--${props.size}`;
});
</script>

<template>
  <div
    :class="[sizeClasses, props.class]"
    class="kpi-card"
  >
    <!-- Loading State -->
    <div
      v-if="props.loading"
      class="kpi-card__loading"
    >
      <div class="flex items-center justify-center h-full">
        <VIcon
          icon="lucide:loader"
          :size="32"
          class="animate-spin text-primary"
        />
      </div>
    </div>

    <!-- Content -->
    <div
      v-else
      class="flex flex-col h-full"
    >
      <!-- Header with Icon and Title -->
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div
          :class="iconColorClass"
          class="kpi-icon-wrapper flex-shrink-0 rounded-xl flex items-center
                 justify-center w-14 h-14 transition-all duration-300"
        >
          <VIcon
            :icon="props.icon"
            :size="28"
            color="white"
          />
        </div>

        <!-- Title and Value -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-medium text-secondaryText truncate">
              {{ props.title }}
            </h3>

            <!-- Info Tooltip -->
            <VTooltip
              v-if="props.tooltip"
              :text="props.tooltip"
              placement="left"
            >
              <VIcon
                icon="lucide:circle-help"
                :size="18"
                class="text-neutral-400 hover:text-primary-500 cursor-pointer
                       transition-colors flex-shrink-0"
              />
            </VTooltip>
          </div>

          <!-- Main Value -->
          <div class="mt-1">
            <VTooltip
              :text="`${formattedValue}${formatOptions.unit === 'percentage' ? '%' : ''}`"
              placement="top"
              wrapper-class="block w-full"
              :delay="150"
            >
              <p class="text-2xl font-semibold text-mainText truncate">
                {{ formattedValue }}
                <span v-if="formatOptions.unit === 'percentage'">%</span>
              </p>
            </VTooltip>
          </div>
        </div>
      </div>

      <!-- Primary Comparison (PoP) -->
      <div
        v-if="primaryComparison"
        class="mt-3"
      >
        <VKpiComparison
          :comparison="primaryComparison"
          :format="props.format"
          :reverse="props.reverse"
        />
      </div>

      <!-- Additional Comparisons -->
      <div
        v-if="additionalComparisons.length > 0"
        class="additional-comparisons"
        :class="{ 'is-expanded': props.showAllComparisons }"
      >
        <div class="additional-comparisons__inner">
          <VKpiComparison
            v-for="comparison in additionalComparisons"
            :key="comparison.name"
            :comparison="comparison"
            :format="props.format"
            :reverse="props.reverse"
          />
        </div>
      </div>
    </div>
  </div>
</template>
