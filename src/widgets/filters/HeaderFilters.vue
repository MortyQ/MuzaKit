<script setup lang="ts">
import { useModal } from "@/shared/composables";
import VButton from "@/shared/ui/common/VButton.vue";
import ComparisonDatePicker from "@/widgets/filters/ComparisonDatePicker.vue";
import GlobalFilterSidebar from "@/widgets/filters/GlobalFilterSidebar.vue";
import MainDatePicker from "@/widgets/filters/MainDatePicker.vue";

const { open } = useModal("global-filter");
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <div
      id="default-header-filters"
      class="contents"
    />
    <MainDatePicker class="flex-shrink-0" />
    <ComparisonDatePicker class="flex-shrink-0" />
    <VButton
      icon="lucide:sliders-horizontal"
      aria-label="Global Filters"
      class="flex-shrink-0"
      @click="open"
    />
    <GlobalFilterSidebar />
  </div>
</template>
