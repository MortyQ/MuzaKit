<script setup lang="ts">
import { computed } from "vue";

import { useDatePresets } from "./useDatePresets";

import { useGlobalFiltersStore } from "@/shared/stores";
import VIcon from "@/shared/ui/common/VIcon.vue";
import { VDatepicker } from "@/shared/ui/date-picker";

// Use date presets composable
const { comparisonPresetDates } = useDatePresets();

// Use global filters store
const filtersStore = useGlobalFiltersStore();

// Create computed with getter/setter for v-model binding
const dateRange = computed({
  get: () => filtersStore.comparisonDateRange as [Date, Date],
  set: (value: [Date, Date] | Date[]) => {
    if (value.length === 2) {
      filtersStore.setComparisonDateRange([value[0], value[1]]);
    }
  },
});
</script>

<template>
  <VDatepicker
    v-model="dateRange"
    range
    size="md"
    :enable-time-picker="false"
    :time-config="{ enableTimePicker: false }"
    :input-attrs="{ alwaysClearable: false }"
    :preset-dates="comparisonPresetDates"
    width="230px"
    icon="lucide:git-compare"
  >
    <template #clear-icon />
    <template #top-extra>
      <div class="pb-3 mb-3 border-b border-cardBorder">
        <div class="flex items-center gap-2 text-base font-semibold text-mainText">
          <VIcon
            icon="lucide:git-compare"
            size="16"
          />
          <span>Comparison Date Range</span>
        </div>
        <div class="mt-1 text-xs font-medium text-secondaryText">
          Latest Available Date: December 09, 2025
        </div>
      </div>
    </template>
  </VDatepicker>
</template>
