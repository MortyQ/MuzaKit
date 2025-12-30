<script lang="ts" setup>
import { useGlobalFiltersStore } from "@/shared/stores";
import VButton from "@/shared/ui/common/VButton.vue";
import VDrawer from "@/shared/ui/common/VDrawer.vue";
import BrandsFilter from "@/widgets/filters/components/BrandsFilter.vue";
import ChannelsFilter from "@/widgets/filters/components/ChannelsFilter.vue";
import GlobalFilterSidebarHeader from "@/widgets/filters/components/GlobalFilterSidebarHeader.vue";
import ProductFilter from "@/widgets/filters/components/ProductFilter.vue";

const filtersStore = useGlobalFiltersStore();
const { isFilterVisible } = filtersStore;
</script>

<template>
  <VDrawer
    id="global-filter"
    keep-alive
  >
    <template #header>
      <GlobalFilterSidebarHeader />
    </template>

    <!-- Content -->
    <div class="flex flex-col gap-4 w-full">
      <BrandsFilter v-if="isFilterVisible('brands')" />
      <ChannelsFilter v-if="isFilterVisible('channels')" />
      <ProductFilter v-if="isFilterVisible('products')" />

      <VButton
        class="w-full"
        icon="lucide:rotate-ccw"
        text="Reset to Default"
        variant="negative"
        @click="filtersStore.resetAllFilters"
      />
    </div>
  </VDrawer>
</template>
