<script setup lang="ts">

import { useModal } from "@/shared/composables";
import VButton from "@/shared/ui/common/VButton.vue";
import GlobalFilterFeature from "@/widgets/filters/GlobalFilterFeature.vue";
import PrimaryDatePicker from "@/widgets/filters/PrimaryDatePicker.vue";

const { open } = useModal("global-filter");

</script>

<template>
  <div class="flex items-center gap-3 flex-shrink-0">
    <div
      id="default-header-filters"
      class="contents"
    />
    <PrimaryDatePicker />
    <VButton
      icon="lucide:sliders-horizontal"
      aria-label="Global Filters"
      class="min-w-[40px]"
      @click="open"
    />
    <GlobalFilterFeature />
  </div>
</template>

<style scoped lang="scss">

</style>
