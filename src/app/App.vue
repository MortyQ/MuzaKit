<script lang="ts" setup>
import MasterLayout from "@/app/layouts/MasterLayout.vue";
import VToaster from "@/shared/ui/common/VToaster.vue";

// Auth initialization is handled by router guard (authGuard)
// No need to initialize here - guard ensures it's done before any navigation
</script>

<template>
  <MasterLayout />
  <VToaster />
</template>

