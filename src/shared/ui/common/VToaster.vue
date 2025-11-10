<script setup lang="ts">
import { computed } from "vue";
import { Toaster } from "vue-sonner";

import { useThemeStore } from "@/features/theme/composables/useTheme";

const themeStore = useThemeStore();

const toasterTheme = computed(() => themeStore.currentTheme);
</script>

<template>
  <Toaster
    :theme="toasterTheme"
    position="top-right"
    :toast-options="{
      unstyled: true,
      classes: {
        toast: 'toast-custom',
        title: 'toast-title',
        description: 'toast-description',
        actionButton: 'toast-action',
        cancelButton: 'toast-cancel',
        closeButton: 'toast-close',
        error: 'toast-error',
        success: 'toast-success',
        warning: 'toast-warning',
        info: 'toast-info',
      },
    }"
    :duration="4000"
    close-button
  />
</template>
