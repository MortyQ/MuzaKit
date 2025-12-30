<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue";

import { useGlobalFiltersSync } from "@/shared/composables/useGlobalFiltersSync";
import { useGlobalFiltersStore } from "@/shared/stores/useGlobalFiltersStore";
import VInput from "@/shared/ui/common/VInput.vue";

const filtersStore = useGlobalFiltersStore();
const { updateProducts } = useGlobalFiltersSync();

const bulkProductSearch = ref("");

const bulkPlaceholder = `Enter ASINs or SKUs separated by a comma, a semicolon, or a new line
e.g. ASIN-001, ASIN-002; SKU-003
ASIN-004`;

// Debounce timer
const DEBOUNCE_DELAY = 500;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Track if user is typing (to prevent triggering search on store sync)
let isUserTyping = false;

// Handle search with debounce
const handleSearch = () => {
  isUserTyping = true;

  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const value = bulkProductSearch.value.trim();

    if (value) {
      await filtersStore.searchProducts(value);
    }
    else {
      filtersStore.clearProductSearch();
    }

    await updateProducts();
    debounceTimer = null;
    isUserTyping = false;
  }, DEBOUNCE_DELAY);
};

// Sync local value from store when store changes (e.g., from URL init)
watch(
  () => [...filtersStore.productSearch],
  (newProducts) => {
    // Only sync if user is not typing
    if (!isUserTyping && newProducts.length > 0) {
      bulkProductSearch.value = newProducts.join(", ");
    }
    else if (!isUserTyping && newProducts.length === 0) {
      bulkProductSearch.value = "";
    }
  },
  { immediate: true, deep: true },
);

// Cleanup debounce timer
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <VInput
    v-model="bulkProductSearch"
    :helper-text="filtersStore.searchProductResult.length > 0
      ? `${filtersStore.searchProductResult.length} product(s) found`
      : undefined"
    :loading="filtersStore.isSearchProductLoading"
    :placeholder="bulkPlaceholder"
    icon="lucide:package-search"
    name="Products"
    textarea
    @update:model-value="handleSearch"
  />
</template>
