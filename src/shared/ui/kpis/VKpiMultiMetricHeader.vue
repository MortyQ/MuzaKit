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
