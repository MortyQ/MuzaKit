<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
</script>

<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-mainText mb-3">
        Layout Components
      </h1>
      <p class="text-secondaryText">
        Structural components for building page layouts.
        Containers, grids, dividers, and spacing utilities.
      </p>
    </div>

    <VCard>
      <div class="flex flex-col items-center justify-center py-12 gap-4">
        <VIcon
          icon="lucide:layout"
          :size="64"
          class="text-secondaryText/40"
        />
        <h3 class="text-xl font-semibold text-mainText">
          Coming Soon
        </h3>
        <p class="text-secondaryText text-center max-w-md">
          Layout components documentation is under development.
          Check back later for containers, grids, and spacing utilities.
        </p>
      </div>
    </VCard>
  </div>
</template>
