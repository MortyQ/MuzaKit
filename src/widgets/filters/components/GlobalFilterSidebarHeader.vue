<script setup lang="ts">
import VIcon from "@/shared/ui/common/VIcon.vue";
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Icon with gradient background -->
    <div
      class="flex items-center justify-center w-10 h-10
             rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm text-white"
    >
      <VIcon
        icon="lucide:sliders-horizontal"
        size="20"
      />
    </div>

    <!-- Title and description -->
    <div class="flex flex-col">
      <h2 class="text-lg font-semibold text-mainText">
        Global Filters
      </h2>
      <p class="text-xs text-secondaryText">
        Customize your dashboard view
      </p>
    </div>
  </div>
</template>
