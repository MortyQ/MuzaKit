<script lang="ts" setup>
import { computed } from "vue";

import { useGlobalFiltersSync } from "@/shared/composables/useGlobalFiltersSync";
import { useGlobalFiltersStore } from "@/shared/stores/useGlobalFiltersStore";
import VSegmentedControl, { type SegmentOption } from "@/shared/ui/common/VSegmentedControl.vue";

const filtersStore = useGlobalFiltersStore();
const { updateGranularity } = useGlobalFiltersSync();

const options: SegmentOption[] = [
  { label: "Month", value: "MONTH", icon: "lucide:calendar" },
  { label: "Week", value: "WEEK", icon: "lucide:calendar-range" },
  { label: "Day", value: "DAY", icon: "lucide:calendar-days" },
];

const selectedGranularity = computed({
  get: () => filtersStore.granularity,
  set: (value: string | number) => {
    filtersStore.setGranularity(value as "MONTH" | "WEEK" | "DAY");
    updateGranularity();
  },
});
</script>

<template>
  <VSegmentedControl
    v-model="selectedGranularity"
    :options="options"
    size="md"
  />
</template>
