<script lang="ts" setup>
import { useRoute } from "vue-router";

import { useModal } from "@/shared/composables";
import { useGlobalFiltersStore } from "@/shared/stores";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
// import ComparisonDatePicker from "@/widgets/filters/components/ComparisonDatePicker.vue";
import GranularityFilter from "@/widgets/filters/components/GranularityFilter.vue";
import MainDatePicker from "@/widgets/filters/components/MainDatePicker.vue";

const { open } = useModal("global-filter");
const { isFilterVisible } = useGlobalFiltersStore();

const route = useRoute();

</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-3 w-full">
    <h1 class="text-3xl font-bold text-mainText whitespace-nowrap">
      {{ route.meta.title || "" }}
    </h1>
    <div class="flex flex-wrap items-center gap-3 flex-1 justify-end min-w-0">
      <div
        id="default-header-filters"
        class="contents"
      />
      <v-card class="w-fit z-50 flex-shrink-0">
        <div class="flex flex-wrap items-center gap-3">
          <MainDatePicker
            v-if="isFilterVisible('dateRange')"
            class="flex-shrink-0"
          />
          <!--          <ComparisonDatePicker-->
          <!--            v-if="isFilterVisible('comparison')"-->
          <!--            class="flex-shrink-0"-->
          <!--          />-->
          <GranularityFilter
            v-if="isFilterVisible('granularity')"
            class="flex-shrink-0"
          />
          <VButton
            aria-label="Global Filters"
            class="flex-shrink-0"
            icon="lucide:sliders-horizontal"
            @click="open"
          />
        </div>
      </v-card>
    </div>
  </div>
</template>
