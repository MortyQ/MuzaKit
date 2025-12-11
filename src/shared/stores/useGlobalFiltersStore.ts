import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useGlobalFiltersStore = defineStore("globalFilters", () => {
  // ==================== State ====================
  /**
   * Main date range (Last 90 Days by default)
   * Used for primary data queries
   */
  const mainDateRange = ref<[Date, Date]>(getDefaultMainRange());

  /**
   * Comparison date range (180-91 days ago by default)
   * Used when comparison mode is enabled
   */
  const comparisonDateRange = ref<[Date, Date]>(getDefaultComparisonRange());

  /**
   * Toggle for comparison mode
   * When true, UI shows comparison data/charts
   *
   * @future Will control visibility of comparison picker and comparison data in charts/tables
   * Currently both pickers are always visible (toggle UI not implemented yet)
   */
  const isComparisonEnabled = ref<boolean>(false);

  // ==================== Getters ====================

  /**
   * Format main date range for API calls
   * Returns: ["YYYY-MM-DD", "YYYY-MM-DD"]
   */
  const formattedMainRange = computed<[string, string]>(() => {
    return [formatDateToISO(mainDateRange.value[0]), formatDateToISO(mainDateRange.value[1])];
  });

  /**
   * Format comparison date range for API calls
   * Returns: ["YYYY-MM-DD", "YYYY-MM-DD"]
   */
  const formattedComparisonRange = computed<[string, string]>(() => {
    const start = formatDateToISO(comparisonDateRange.value[0]);
    const end = formatDateToISO(comparisonDateRange.value[1]);
    return [start, end];
  });

  /**
   * Get formatted date range as display string
   * Example: "Dec 11, 2024 - Mar 11, 2025"
   */
  const mainRangeDisplay = computed<string>(() => {
    return formatDateRangeDisplay(mainDateRange.value);
  });

  /**
   * Get formatted comparison date range as display string
   */
  const comparisonRangeDisplay = computed<string>(() => {
    return formatDateRangeDisplay(comparisonDateRange.value);
  });

  // ==================== Actions ====================

  /**
   * Update main date range
   * @param range - Tuple of [startDate, endDate]
   */
  function setMainDateRange(range: [Date, Date] | Date[]) {
    if (range.length === 2) {
      mainDateRange.value = [range[0], range[1]];
    }
  }

  /**
   * Update comparison date range
   * @param range - Tuple of [startDate, endDate]
   */
  function setComparisonDateRange(range: [Date, Date] | Date[]) {
    if (range.length === 2) {
      comparisonDateRange.value = [range[0], range[1]];
    }
  }

  /**
   * Toggle comparison mode on/off
   */
  function toggleComparison() {
    isComparisonEnabled.value = !isComparisonEnabled.value;
  }

  /**
   * Enable comparison mode
   */
  function enableComparison() {
    isComparisonEnabled.value = true;
  }

  /**
   * Disable comparison mode
   */
  function disableComparison() {
    isComparisonEnabled.value = false;
  }

  /**
   * Reset all filters to default values
   * Main: Last 90 Days
   * Comparison: 180-91 days ago
   * Comparison mode: Disabled
   */
  function resetToDefaults() {
    mainDateRange.value = getDefaultMainRange();
    comparisonDateRange.value = getDefaultComparisonRange();
    isComparisonEnabled.value = false;
  }

  // ==================== Helper Functions ====================

  /**
   * Get default main date range (Last 90 Days)
   * Matches logic from useDatePresets composable
   */
  function getDefaultMainRange(): [Date, Date] {
    const today = DateTime.utc().startOf("day");
    const startDate = today.minus({ days: 90 });
    return [startDate.toJSDate(), today.toJSDate()];
  }

  /**
   * Get default comparison date range (180-91 days ago)
   * Matches logic from useDatePresets composable
   */
  function getDefaultComparisonRange(): [Date, Date] {
    const today = DateTime.utc().startOf("day");
    const startDate = today.minus({ days: 180 });
    const endDate = today.minus({ days: 91 });
    return [startDate.toJSDate(), endDate.toJSDate()];
  }

  /**
   * Format Date to ISO string (YYYY-MM-DD)
   * UTC-safe for API calls
   */
  function formatDateToISO(date: Date): string {
    return DateTime.fromJSDate(date, { zone: "utc" }).toISODate() || "";
  }

  /**
   * Format date range for display
   * Example: "Dec 11, 2024 - Mar 11, 2025"
   */
  function formatDateRangeDisplay(range: [Date, Date]): string {
    const start = DateTime.fromJSDate(range[0], { zone: "utc" });
    const end = DateTime.fromJSDate(range[1], { zone: "utc" });
    return `${start.toFormat("MMM dd, yyyy")} - ${end.toFormat("MMM dd, yyyy")}`;
  }

  // ==================== Store API ====================

  return {
    // State
    mainDateRange,
    comparisonDateRange,
    isComparisonEnabled,

    // Getters
    formattedMainRange,
    formattedComparisonRange,
    mainRangeDisplay,
    comparisonRangeDisplay,

    // Actions
    setMainDateRange,
    setComparisonDateRange,
    toggleComparison,
    enableComparison,
    disableComparison,
    resetToDefaults,
  };
});

