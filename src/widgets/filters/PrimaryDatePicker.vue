<script setup lang="ts">
import { ref } from "vue";

import { useDatePresets } from "./useDatePresets";

import { VDatepicker } from "@/shared/ui/date-picker";


// Use date presets composable
const { getDefaultDateRange, presetDates } = useDatePresets();

// Set default value to last 3 months (90 days)
const date = ref(getDefaultDateRange());
</script>

<template>
  <VDatepicker
    v-model="date"
    range
    size="md"
    :enable-time-picker="false"
    :time-config="{ enableTimePicker: false }"
    :input-attrs="{ alwaysClearable: false }"
    :preset-dates="presetDates"
    class="min-w-[230px]"
  >
    <template #clear-icon />
    <template #top-extra>
      <div class="flex flex-col gap-1">
        <span>
          Main Date Range
        </span>
        <span>
          Latest Available Date December 09, 2025
        </span>
      </div>
    </template>
  </VDatepicker>
</template>

<style scoped lang="scss">

</style>
