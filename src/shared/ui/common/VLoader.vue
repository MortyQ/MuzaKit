<script setup lang="ts">
import { computed } from "vue";

type LoaderVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "white";

interface Props {
  size?: "small" | "medium" | "large"
  message?: string
  fullscreen?: boolean
  variant?: LoaderVariant
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  message: "",
  fullscreen: false,
  variant: "primary",
});

const sizeClass = computed(() => `loader-${props.size}`);
const variantClass = computed(() => `loader-${props.variant}`);
const containerClass = computed(() => ({
  "loader-fullscreen": props.fullscreen,
}));
</script>

<template>
  <div
    role="status"
    class="loader-container"
    :class="containerClass"
  >
    <div
      class="loader"
      :class="[sizeClass, variantClass]"
    >
      <div class="loader-circle" />
      <div class="loader-circle" />
      <div class="loader-circle" />
    </div>
    <span
      v-if="message"
      class="loader-message"
    >{{ message }}</span>
    <span class="sr-only">Loading...</span>
  </div>
</template>
