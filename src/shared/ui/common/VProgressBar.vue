<script lang="ts" setup>
/**
 * VProgressBar Component
 *
 * Modern progress bar with step text and percentage display.
 * Supports completion state with green color.
 *
 * @example
 * ```vue
 * <VProgressBar :percentage="75" step="Downloading..." />
 * ```
 */
import { computed } from "vue";

import VIcon from "./VIcon.vue";

const props = withDefaults(defineProps<{
  /** Progress percentage (0-100) */
  percentage: number
  /** Current step/status text */
  step?: string | null
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Whether to show percentage text */
  showPercentage?: boolean
}>(), {
  step: null,
  size: "md",
  showPercentage: true,
});

const clampedPercentage = computed(() => {
  return Math.max(0, Math.min(100, props.percentage));
});

const isCompleted = computed(() => clampedPercentage.value >= 100);

const barHeight = computed(() => {
  const heights = { sm: "4px", md: "6px", lg: "8px" };
  return heights[props.size];
});
</script>

<template>
  <div class="v-progress-bar">
    <!-- Header with step and percentage -->
    <div
      v-if="step || showPercentage"
      class="v-progress-bar__header"
    >
      <span
        v-if="step"
        class="v-progress-bar__step"
      >
        {{ step }}
      </span>
      <span v-else />

      <div
        v-if="showPercentage"
        class="v-progress-bar__percentage"
      >
        <span :class="{ 'text-success': isCompleted }">
          {{ Math.round(clampedPercentage) }}%
        </span>
        <VIcon
          v-if="isCompleted"
          :size="14"
          class="text-success ml-1"
          icon="lucide:check-circle"
        />
      </div>
    </div>

    <!-- Progress bar track -->
    <div
      :style="{ height: barHeight }"
      class="v-progress-bar__track"
    >
      <div
        :class="{ 'v-progress-bar__fill--completed': isCompleted }"
        :style="{ width: `${clampedPercentage}%` }"
        class="v-progress-bar__fill"
      >
        <div
          v-if="!isCompleted"
          class="v-progress-bar__shine"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-progress-bar {
  @apply w-full min-w-[200px] py-1.5 rounded-lg;
  @apply bg-cardBg border border-cardBorder;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.v-progress-bar__header {
  @apply flex items-center justify-between mb-1.5 px-4;
}

.v-progress-bar__step {
  @apply text-sm text-mainText font-medium truncate mr-2;
}

.v-progress-bar__percentage {
  @apply flex items-center text-sm font-semibold text-primary;
}

.v-progress-bar__track {
  @apply relative w-full overflow-hidden rounded-b-full bg-cardBorder/50;
  height: 6px;
  flex-shrink: 0;
}

.v-progress-bar__fill {
  @apply rounded-b-full relative;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
  background-size: 200% 100%;
  height: 100%;
  animation: gradient-flow 2s ease infinite;
  transition: width 0.3s ease-out;
  min-width: 2px;
}

.v-progress-bar__fill--completed {
  background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
  animation: none;
}

.v-progress-bar__shine {
  @apply absolute top-0 left-0 w-full h-full rounded-b-full;
  background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
  );
  animation: shine 1.5s ease-in-out infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
