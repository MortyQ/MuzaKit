<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { useGlobalFiltersSync } from "@/shared/composables/useGlobalFiltersSync";
import {
  type BrandFilterOption,
  type FilterOption,
  useGlobalFiltersStore,
} from "@/shared/stores/useGlobalFiltersStore";
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";

const filtersStore = useGlobalFiltersStore();
const { updateBrands } = useGlobalFiltersSync();

// Max tags to show before "+N More"
const MAX_VISIBLE_TAGS = 2;

// Debounce delay for tag removal (ms)
const DEBOUNCE_DELAY = 800;

// Local state for pending selection (before dropdown closes)
const localSelectedBrands = ref<BrandFilterOption[]>([]);
const isDropdownOpen = ref(false);

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// All option constant
const ALL_BRANDS_OPTION: BrandFilterOption = { label: "All", value: "all" };

// Initialize local state from store
const syncLocalFromStore = () => {
  localSelectedBrands.value = [...filtersStore.selectedBrands];
};

// Watch store changes (e.g., from URL navigation) and sync to local
watch(
  () => filtersStore.selectedBrands,
  () => {
    if (!isDropdownOpen.value) {
      syncLocalFromStore();
    }
  },
  { deep: true },
);

// Computed: groups info for checking if all brands in group selected
const groupsInfo = computed(() => {
  return filtersStore.brandGroups.map((group) => ({
    groupId: group.BRAND_GROUPS_ID,
    groupName: group.PARENT_BRAND_NAME || group.BRAND_GROUPS_SHORT_NAME,
    brandIds: group.BRANDS.map((b) => b.BRAND_ID),
  }));
});

// Build flat options list with standalone brands first, then group headers
const groupedOptions = computed(() => {
  const allOption: FilterOption = { label: "All", value: "all" };
  const flatOptions: FilterOption[] = [allOption];

  // Collect all brand IDs that are in groups
  const brandsInGroups = new Set<string>();
  for (const group of filtersStore.brandGroups) {
    for (const brand of group.BRANDS) {
      brandsInGroups.add(brand.BRAND_ID);
    }
  }

  // Add standalone brands first (not in any group)
  const standaloneBrands = filtersStore.brands.filter(
    (brand) => !brandsInGroups.has(brand.BK_BRAND_ID),
  );

  for (const brand of standaloneBrands) {
    flatOptions.push({
      label: brand.BRAND_NAME,
      value: brand.BK_BRAND_ID,
      shortName: brand.BRAND_SHORT_NAME,
      $isStandalone: true,
    });
  }

  // Add groups with their brands
  for (const group of filtersStore.brandGroups) {
    const groupName = group.PARENT_BRAND_NAME || group.BRAND_GROUPS_SHORT_NAME;

    // Add group header (selectable - will select all brands in group)
    flatOptions.push({
      label: `${groupName} group`,
      value: `group_${group.BRAND_GROUPS_ID}`,
      $isGroup: true,
      groupId: group.BRAND_GROUPS_ID,
    });

    // Add group's brands
    for (const brand of group.BRANDS) {
      flatOptions.push({
        label: brand.BRAND_NAME,
        value: brand.BRAND_ID,
        shortName: brand.BRAND_SHORT_NAME,
        groupId: group.BRAND_GROUPS_ID,
        groupName,
      });
    }
  }

  return flatOptions;
});

// Computed: display tags with group logic
// If all brands of a group are selected, show "Group Name group" instead
const displayTags = computed(() => {
  const selected = localSelectedBrands.value;

  // If "All" is selected, just show All
  if (selected.some((s) => s.value === "all")) {
    return [{ label: "All", value: "all", isGroup: false }];
  }

  const selectedIds = selected.map((s) => String(s.value));
  const result: Array<{ label: string, value: string | number, isGroup: boolean }> = [];
  const usedBrandIds = new Set<string>();

  // Check each group - if all brands selected, show group tag
  for (const group of groupsInfo.value) {
    const allGroupSelected = group.brandIds.every((id) => selectedIds.includes(id));

    if (allGroupSelected && group.brandIds.length > 0) {
      result.push({
        label: `${group.groupName} group`,
        value: `group_${group.groupId}`,
        isGroup: true,
      });
      // Mark these brands as used
      group.brandIds.forEach((id) => usedBrandIds.add(id));
    }
  }

  // Add remaining brands that are not part of a fully selected group
  for (const s of selected) {
    const id = String(s.value);
    if (!usedBrandIds.has(id) && s.value !== "all") {
      result.push({
        label: s.label,
        value: s.value,
        isGroup: false,
      });
    }
  }

  return result;
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
const applyAllLogic = (options: BrandFilterOption[]): BrandFilterOption[] => {
  const hasAll = options.some((o) => o.value === "all");
  const previousHadAll = localSelectedBrands.value.some((o) => o.value === "all");

  if (hasAll && !previousHadAll) {
    return [ALL_BRANDS_OPTION];
  }
  else if (hasAll && options.length > 1) {
    return options.filter((o) => o.value !== "all");
  }
  else if (options.length === 0) {
    return [ALL_BRANDS_OPTION];
  }
  return options;
};

// Check if selection changed
const hasSelectionChanged = (): boolean => {
  const storeValues = filtersStore.selectedBrands.map((b) => b.value).sort();
  const localValues = localSelectedBrands.value.map((b) => b.value).sort();

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
  filtersStore.setSelectedBrands(localSelectedBrands.value);

  // Update URL
  updateBrands();
};

// Handle selection (updates local state only)
const handleSelect = (option: FilterOption) => {
  if (option.$isGroup) {
    // Select all brands from this group
    const groupId = option.groupId;
    const groupBrands = groupedOptions.value.filter(
      (o) => o.groupId === groupId && !o.$isGroup,
    );

    const currentNonAll = localSelectedBrands.value.filter((v) => v.value !== "all");

    // Check if all group brands already selected
    const allGroupSelected = groupBrands.every((b) =>
      currentNonAll.some((v) => v.value === b.value),
    );

    if (allGroupSelected) {
      // Deselect all from this group
      const newValues = currentNonAll.filter(
        (v) => !groupBrands.some((b) => b.value === v.value),
      );
      localSelectedBrands.value = applyAllLogic(newValues);
    }
    else {
      // Add all from this group
      const newBrands = groupBrands.filter(
        (b) => !currentNonAll.some((v) => v.value === b.value),
      );
      localSelectedBrands.value = applyAllLogic([...currentNonAll, ...newBrands]);
    }
  }
  else if (option.value === "all") {
    // User selected "All" - reset to only All
    localSelectedBrands.value = [ALL_BRANDS_OPTION];
  }
  else {
    // Regular brand selection
    const currentNonAll = localSelectedBrands.value.filter((v) => v.value !== "all");
    localSelectedBrands.value = [...currentNonAll, option];
  }
};

// Handle removal (updates local state only)
const handleRemove = (option: FilterOption) => {
  if (option.$isGroup) {
    // Remove all brands from this group
    const groupId = option.groupId;
    const groupBrandIds = groupsInfo.value
      .find((g) => g.groupId === groupId)
      ?.brandIds || [];

    const newValue = localSelectedBrands.value.filter(
      (v) => !groupBrandIds.includes(String(v.value)),
    );
    localSelectedBrands.value = applyAllLogic(newValue);
  }
  else {
    const newValue = localSelectedBrands.value.filter(
      (v) => v.value !== option.value,
    );
    localSelectedBrands.value = applyAllLogic(newValue);
  }
};

// Debounced save to store and URL
const debouncedSave = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    filtersStore.setSelectedBrands(localSelectedBrands.value);
    updateBrands();
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
};

// Handle tag removal (from display tags which may be groups)
// This happens outside dropdown, uses debounce for multiple quick removals
const handleTagRemove = (tag: { label: string, value: string | number, isGroup: boolean }) => {
  if (tag.isGroup) {
    // Remove all brands from this group
    const groupId = Number(String(tag.value).replace("group_", ""));
    const groupBrandIds = groupsInfo.value
      .find((g) => g.groupId === groupId)
      ?.brandIds || [];

    const newValue = localSelectedBrands.value.filter(
      (v) => !groupBrandIds.includes(String(v.value)),
    );
    localSelectedBrands.value = applyAllLogic(newValue);
  }
  else {
    const newValue = localSelectedBrands.value.filter(
      (v) => v.value !== tag.value,
    );
    localSelectedBrands.value = applyAllLogic(newValue);
  }

  // Use debounced save for tag removal
  debouncedSave();
};

// Custom label
const customLabel = (option: FilterOption): string => {
  return option.label;
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
  <div class="brands-filter">
    <label class="block mb-2 text-sm font-medium text-mainText">
      Brands
    </label>
    <VMultiSelect
      :close-on-select="false"
      :custom-label="customLabel"
      :loading="filtersStore.isBrandGroupLoading"
      :model-value="localSelectedBrands"
      :options="groupedOptions"
      label="label"
      multiple
      placeholder="Select brands..."
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

      <!-- Custom option slot for group headers -->
      <template #option="{ option }">
        <div
          v-if="option.$isGroup"
          class="font-semibold text-primary bg-base-300 -mx-3 px-3 py-2 rounded-md"
        >
          {{ option.label }}
        </div>
        <div
          v-else
          class="flex items-center justify-between w-full pl-3 text-mainText"
        >
          <span>{{ option.label }}</span>
          <span
            v-if="option.shortName"
            class="text-xs text-secondaryText ml-2"
          >
            {{ option.shortName }}
          </span>
        </div>
      </template>
    </VMultiSelect>
  </div>
</template>
