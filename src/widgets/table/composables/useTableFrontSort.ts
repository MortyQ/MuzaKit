import { ref, type Ref } from "vue";

import type { SortOrder } from "../types";

export interface SortConfig {
  column: string | null
  order: SortOrder | null
}

export interface UseSortOptions<T> {
  defaultData: Ref<T[]>
  // eslint-disable-next-line no-unused-vars
  getValue?: (row: T, key: string) => unknown
}

/**
 * Composable for frontend table sorting
 * @param options Configuration options
 * @returns Sort utilities and reactive state
 */
export const useTableFrontSort = <T = Record<string, unknown>> (
  options: UseSortOptions<T>) => {
  const { defaultData, getValue } = options;

  const sortConfig = ref<SortConfig>({
    column: null,
    order: null,
  });

  /**
   * Get value from row by key with fallback
   */
  const getRowValue = (row: T, key: string): unknown => {
    if (getValue) {
      return getValue(row, key);
    }

    // Default implementation with nested key support
    const keys = key.split(".");
    let value: unknown = row;

    for (const k of keys) {
      if (value == null) return null;
      value = (value as Record<string, unknown>)[k];
    }

    return value;
  };

  /**
   * Compare two values for sorting
   */
  const compareValues = (a: unknown, b: unknown, order: SortOrder): number => {
    // Handle null/undefined
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    // Convert to numbers if possible
    const numA = typeof a === "string" ? parseFloat(a) : a;
    const numB = typeof b === "string" ? parseFloat(b) : b;

    // Compare numbers
    if (typeof numA === "number" && typeof numB === "number"
      && !Number.isNaN(numA) && !Number.isNaN(numB)) {
      return order === "asc" ? numA - numB : numB - numA;
    }

    // Compare strings
    const strA = String(a).toLowerCase();
    const strB = String(b).toLowerCase();

    if (order === "asc") {
      return strA.localeCompare(strB, undefined, { numeric: true });
    }
    else {
      return strB.localeCompare(strA, undefined, { numeric: true });
    }
  };

  /**
   * Sort data array (synchronous)
   */
  const sortData = (data: T[], column: string, order: SortOrder | null): T[] => {
    if (!order) {
      return [...defaultData.value];
    }

    return [...data].sort((a, b) => {
      const aValue = getRowValue(a, column);
      const bValue = getRowValue(b, column);
      return compareValues(aValue, bValue, order);
    });
  };

  /**
   * Handle sort - synchronous version for frontend
   * Returns sorted array immediately (no async/await needed)
   */
  const handleSort = (
    currentData: T[],
    column: string,
    order: SortOrder | null,
  ): T[] => {
    sortConfig.value = { column, order };

    return sortData(currentData, column, order);
  };

  /**
   * Reset to default order
   */
  const resetSort = (): T[] => {
    sortConfig.value = { column: null, order: null };
    return [...defaultData.value];
  };

  return {
    sortConfig,
    handleSort,
    resetSort,
    sortData,
  };
};

