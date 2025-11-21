<script setup lang="ts">
import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  /** Title of the card */
  title: string
  /** Icon name (lucide format) */
  icon?: string
  /** Enable glassmorphism effect */
  glassmorphism?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: "lucide:chart-column",
  glassmorphism: false,
});
</script>

<template>
  <div
    class="kpi-multi-header"
    :class="{
      'bg-cardBg/60 backdrop-blur-sm': glassmorphism,
      'bg-cardBg': !glassmorphism,
    }"
  >
    <h3 class="kpi-multi-title">
      <!-- Custom icon slot or default icon -->
      <span class="kpi-multi-title-icon">
        <slot name="icon">
          <VIcon
            :icon="icon"
            :size="20"
            class="text-primary-500"
          />
        </slot>
      </span>
      {{ title }}
    </h3>
  </div>
</template>

<style scoped>
.kpi-multi-header {
  @apply px-6 py-4;
  @apply border-b border-cardBorder;
}

.kpi-multi-title {
  @apply text-base font-semibold text-mainText;
  @apply m-0;
  @apply flex items-center gap-2;
}

.kpi-multi-title-icon {
  @apply text-lg;
  @apply transition-transform duration-300;
}

/* Animation when parent card is hovered - will be triggered from parent */
.kpi-multi-header:hover .kpi-multi-title-icon,
:deep(.kpi-multi-metric-card):hover .kpi-multi-title-icon {
  @apply scale-110 rotate-3;
}
</style>

