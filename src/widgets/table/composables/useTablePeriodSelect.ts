/**
 * Table Period Select Composable
 *
 * Provides period selection functionality for tables (Month/Week/Day filtering).
 * Encapsulates the logic for generating select options and handling selection changes.
 *
 * @example
 * ```ts
 * const {
 *   selectedPeriod,
 *   periodOptions,
 *   periodRequestParams,
 *   isGroupByDate,
 *   handlePeriodChange,
 * } = useTablePeriodSelect({ includeSummary: true });
 *
 * // In template
 * <VMultiSelect
 *   v-model="selectedPeriod"
 *   :options="periodOptions"
 *   @select="handlePeriodChange"
 * />
 *
 * // In API request
 * await execute({
 *   data: {
 *     ...filtersStore.tableRequestParams,
 *     ...periodRequestParams,
 *     isGroupByDate,
 *   },
 * });
 * ```
 */

import { DateTime } from "luxon";
import { ref, computed, watch, type Ref } from "vue";

import { useGlobalFiltersStore } from "@/shared/stores";

// ==================== Types ====================

export interface PeriodOption {
  label: string
  value: string

  [key: string]: unknown
}

export interface PeriodRequestParams {
  period?: {
    since: string
    until: string
  }
}

export interface UseTablePeriodSelectOptions {
  /**
     * Include "Summary" option in the list
     * @default false
     */
  includeSummary?: boolean

  /**
     * Callback when period changes (for triggering data refresh)
     */
  onPeriodChange?: (params: PeriodRequestParams, isGroupByDate: boolean) => void
}

// ==================== Composable ====================

export function useTablePeriodSelect(options: UseTablePeriodSelectOptions = {}) {
  const { includeSummary = false, onPeriodChange } = options;

  const filtersStore = useGlobalFiltersStore();

  // ==================== State ====================

  const selectedPeriod = ref<PeriodOption | null>(null);
  const isGroupByDate = ref(true);

  // ==================== Computed Options ====================

  /**
     * Generate period options based on current granularity and date range
     */
  const periodOptions = computed<PeriodOption[]>(() => {
    const granularity = filtersStore.currentGranularity;
    const options: PeriodOption[] = [];

    // Default "All" option
    const allLabel = granularity === "MONTH"
      ? "All Months"
      : granularity === "WEEK"
        ? "All Weeks"
        : "All Days";

    options.push({ label: allLabel, value: "all" });

    // Summary option (optional)
    if (includeSummary) {
      options.push({ label: "Summary", value: "summary" });
    }

    // Generate period-specific options
    if (granularity === "MONTH") {
      options.push(...generateMonthOptions());
    }
    else if (granularity === "WEEK") {
      options.push(...generateWeekOptions());
    }
    else if (granularity === "DAY") {
      options.push(...generateDayOptions());
    }

    return options;
  });

  /**
     * Default selected option (first in list)
     */
  const defaultPeriod = computed<PeriodOption>(() => periodOptions.value[0]);

  // ==================== Period Generators ====================

  function generateMonthOptions(): PeriodOption[] {
    const { since, until } = filtersStore.formattedPrimaryInterval;
    const startDate = DateTime.fromISO(since);
    const endDate = DateTime.fromISO(until);

    const months: PeriodOption[] = [];
    let current = startDate.startOf("month");

    while (current <= endDate) {
      months.push({
        label: current.toFormat("MMMM yyyy"),
        value: current.toISODate() as string,
      });
      current = current.plus({ months: 1 });
    }

    // Sort descending (newest first)
    return months.sort((a, b) =>
      DateTime.fromISO(b.value).toMillis() - DateTime.fromISO(a.value).toMillis(),
    );
  }

  function generateWeekOptions(): PeriodOption[] {
    const { since, until } = filtersStore.formattedPrimaryInterval;
    const startDate = DateTime.fromISO(since);
    const endDate = DateTime.fromISO(until);
    const today = DateTime.local().startOf("day");

    const weeks: PeriodOption[] = [];

    // Start from the first Sunday on or after startDate
    let current = startDate.startOf("week").plus({ days: 6 }); // Sunday

    while (current <= endDate && current < today) {
      weeks.push({
        label: current.toFormat("MM/dd/yyyy"),
        value: current.toISODate() as string,
      });
      current = current.plus({ weeks: 1 });
    }

    // Sort descending (newest first)
    return weeks.sort((a, b) =>
      DateTime.fromISO(b.value).toMillis() - DateTime.fromISO(a.value).toMillis(),
    );
  }

  function generateDayOptions(): PeriodOption[] {
    const { since, until } = filtersStore.formattedPrimaryInterval;
    const startDate = DateTime.fromISO(since);
    const endDate = DateTime.fromISO(until);
    const today = DateTime.local().startOf("day");

    const days: PeriodOption[] = [];
    let current = startDate;

    while (current <= endDate && current < today) {
      days.push({
        label: current.toFormat("MM/dd/yyyy"),
        value: current.toISODate() as string,
      });
      current = current.plus({ days: 1 });
    }

    // Sort descending (newest first)
    return days.sort((a, b) =>
      DateTime.fromISO(b.value).toMillis() - DateTime.fromISO(a.value).toMillis(),
    );
  }

  // ==================== Request Params ====================

  /**
     * Convert selected period to API request params
     */
  const periodRequestParams = computed<PeriodRequestParams>(() => {
    const value = selectedPeriod.value?.value;

    if (!value || value === "all" || value === "summary") {
      return {};
    }

    const granularity = filtersStore.currentGranularity;

    if (granularity === "MONTH") {
      const startDate = DateTime.fromISO(value);
      const endDate = startDate.endOf("month");
      return {
        period: {
          since: value,
          until: endDate.toISODate() as string,
        },
      };
    }

    if (granularity === "WEEK") {
      const startDate = DateTime.fromISO(value);
      return {
        period: {
          since: value,
          until: startDate.plus({ days: 6 }).toISODate() as string,
        },
      };
    }

    if (granularity === "DAY") {
      return {
        period: {
          since: value,
          until: value,
        },
      };
    }

    return {};
  });

  // ==================== Handlers ====================

  /**
     * Handle period selection change
     */
  const handlePeriodChange = (option: PeriodOption) => {
    selectedPeriod.value = option;

    // Update isGroupByDate based on selection
    isGroupByDate.value = option.value !== "summary";

    // Trigger callback if provided
    if (onPeriodChange) {
      onPeriodChange(periodRequestParams.value, isGroupByDate.value);
    }
  };

  /**
     * Reset to default period
     */
  const resetPeriod = () => {
    selectedPeriod.value = defaultPeriod.value;
    isGroupByDate.value = true;
  };

  // ==================== Watch for filter changes ====================

  // Reset period when granularity or date range changes
  watch(
    () => [filtersStore.currentGranularity, filtersStore.formattedPrimaryInterval],
    () => {
      resetPeriod();
    },
    { deep: true },
  );

  // Initialize with default
  if (!selectedPeriod.value) {
    selectedPeriod.value = defaultPeriod.value;
  }

  // ==================== Return ====================

  return {
    /** Currently selected period */
    selectedPeriod: selectedPeriod as Ref<PeriodOption>,
    /** Available period options for dropdown */
    periodOptions,
    /** Default period option */
    defaultPeriod,
    /** Request params to spread into API call */
    periodRequestParams,
    /** Whether to group by date (false when "Summary" is selected) */
    isGroupByDate,
    /** Handle period selection change */
    handlePeriodChange,
    /** Reset to default period */
    resetPeriod,
  };
}
