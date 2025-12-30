<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { useGlobalFiltersSync } from "@/shared/composables/useGlobalFiltersSync";
import { useGlobalFiltersStore, type FilterOption } from "@/shared/stores/useGlobalFiltersStore";
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";

const filtersStore = useGlobalFiltersStore();
const { updateChannels } = useGlobalFiltersSync();

// Max tags to show before "+N More"
const MAX_VISIBLE_TAGS = 2;

// Debounce delay for tag removal (ms)
const DEBOUNCE_DELAY = 800;

// Local state for pending selection (before dropdown closes)
const localSelectedChannels = ref<FilterOption[]>([]);
const isDropdownOpen = ref(false);

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// All option constant
const ALL_CHANNELS_OPTION: FilterOption = { label: "All", value: "all" };

// Initialize local state from store
const syncLocalFromStore = () => {
  localSelectedChannels.value = [...filtersStore.selectedChannels];
};

// Watch store changes (e.g., from URL navigation) and sync to local
watch(
  () => filtersStore.selectedChannels,
  () => {
    if (!isDropdownOpen.value) {
      syncLocalFromStore();
    }
  },
  { deep: true },
);

// Build options for multiselect
const options = computed<FilterOption[]>(() => {
  const allOption: FilterOption = { label: "All", value: "all" };

  const channelOptions: FilterOption[] = filtersStore.channels.map((channel) => ({
    label: channel.NAME,
    value: channel.DIM_CHANNEL_PK,
    platform: channel.PLATFORM,
    locale: channel.LOCALE,
  }));

  return [allOption, ...channelOptions];
});

// Display tags - based on local state
const displayTags = computed(() => {
  return localSelectedChannels.value.map((c) => ({
    label: c.label,
    value: c.value,
  }));
});

// Visible tags (limited)
const visibleTags = computed(() => {
  return displayTags.value.slice(0, MAX_VISIBLE_TAGS);
});

// Remaining count
const remainingCount = computed(() => {
  return Math.max(0, displayTags.value.length - MAX_VISIBLE_TAGS);
});

// Helper to apply "All" logic to local state
const applyAllLogic = (options: FilterOption[]): FilterOption[] => {
  const hasAll = options.some((o) => o.value === "all");
  const previousHadAll = localSelectedChannels.value.some((o) => o.value === "all");

  if (hasAll && !previousHadAll) {
    return [ALL_CHANNELS_OPTION];
  }
  else if (hasAll && options.length > 1) {
    return options.filter((o) => o.value !== "all");
  }
  else if (options.length === 0) {
    return [ALL_CHANNELS_OPTION];
  }
  return options;
};

// Check if selection changed
const hasSelectionChanged = (): boolean => {
  const storeValues = filtersStore.selectedChannels.map((c) => c.value).sort();
  const localValues = localSelectedChannels.value.map((c) => c.value).sort();

  if (storeValues.length !== localValues.length) return true;

  return storeValues.some((val, idx) => val !== localValues[idx]);
};

// Handle dropdown open
const handleOpen = () => {
  isDropdownOpen.value = true;
  syncLocalFromStore();
};

// Handle dropdown close - save to store and URL only if changed
const handleClose = () => {
  isDropdownOpen.value = false;

  // Only update if selection actually changed
  if (!hasSelectionChanged()) return;

  // Apply changes to store
  filtersStore.setSelectedChannels(localSelectedChannels.value);

  // Update URL
  updateChannels();
};

// Handle selection (updates local state only)
const handleSelect = (option: FilterOption) => {
  if (option.value === "all") {
    // User selected "All" - reset to only All
    localSelectedChannels.value = [ALL_CHANNELS_OPTION];
  }
  else {
    // Regular channel selection
    const currentNonAll = localSelectedChannels.value.filter((v) => v.value !== "all");
    localSelectedChannels.value = [...currentNonAll, option];
  }
};

// Handle removal (updates local state only)
const handleRemove = (option: FilterOption) => {
  const newValue = localSelectedChannels.value.filter(
    (v) => v.value !== option.value,
  );
  localSelectedChannels.value = applyAllLogic(newValue);
};

// Debounced save to store and URL
const debouncedSave = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    filtersStore.setSelectedChannels(localSelectedChannels.value);
    updateChannels();
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
};

// Handle tag removal - uses debounce for multiple quick removals
const handleTagRemove = (tag: { label: string, value: string | number }) => {
  const newValue = localSelectedChannels.value.filter(
    (v) => v.value !== tag.value,
  );
  localSelectedChannels.value = applyAllLogic(newValue);

  // Use debounced save for tag removal
  debouncedSave();
};

// Sync local state on mount
onMounted(() => {
  syncLocalFromStore();
});

// Cleanup debounce timer on unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <div class="channels-filter">
    <label class="block mb-2 text-sm font-medium text-mainText">
      Channels
    </label>
    <VMultiSelect
      :close-on-select="false"
      :loading="filtersStore.isChannelLoading"
      :model-value="localSelectedChannels"
      :options="options"
      label="label"
      multiple
      placeholder="Select channels..."
      track-by="value"
      @close="handleClose"
      @open="handleOpen"
      @remove="handleRemove"
      @select="handleSelect"
    >
      <!-- Custom selection display -->
      <template #selection>
        <div class="flex flex-wrap items-center w-full min-h-[26px] gap-1.5">
          <span
            v-for="(tag, index) in visibleTags"
            :key="index"
            class="
              inline-flex items-center gap-1 py-1 px-2.5 rounded-md
              bg-base-200 text-mainText text-sm font-medium
              border border-cardBorder transition-colors
            "
          >
            <span class="leading-none whitespace-nowrap">{{ tag.label }}</span>
            <button
              class="
                flex items-center justify-center w-4 h-4 rounded
                text-secondaryText hover:text-error hover:bg-lightError
                transition-colors
              "
              type="button"
              @click.prevent.stop="handleTagRemove(tag)"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </button>
          </span>
          <span
            v-if="remainingCount > 0"
            class="inline-flex items-center py-1 px-2 text-primary text-sm font-medium"
          >
            +{{ remainingCount }} More
          </span>
        </div>
      </template>

      <!-- Custom option slot with platform info -->
      <template #option="{ option }">
        <div class="flex items-center justify-between w-full text-mainText">
          <span>{{ option.label }}</span>
          <span
            v-if="option.platform && option.value !== 'all'"
            class="text-xs text-secondaryText ml-2"
          >
            {{ option.platform }}
          </span>
        </div>
      </template>
    </VMultiSelect>
  </div>
</template>
