import { computed, ref, type Ref, watch } from "vue";

import type {
  Column,
  FrontSortPayload,
  RequestPayload,
  SortConfig,
  SortItem,
  SortOrder,
} from "../types";

interface UseTableSortOptions<T = Record<string, unknown>> {
  sort?: SortConfig
  sortState?: Ref<SortItem[]>
  columns: Ref<Column[]>
  page?: Ref<number>
  pageSize?: Ref<number>
  // For frontend sorting
  data?: Ref<T[]>
  // Custom value getter for frontend sorting
  // eslint-disable-next-line no-unused-vars
  getValue?: (row: T, key: string) => unknown
  // Callbacks
  // eslint-disable-next-line no-unused-vars
  onRequest?: (payload: RequestPayload) => void
  // eslint-disable-next-line no-unused-vars
  onSort?: (payload: FrontSortPayload) => void
  // eslint-disable-next-line no-unused-vars
  onUpdateSortState?: (sortState: SortItem[]) => void
}

export const useTableSort = <T = Record<string, unknown>>(options: UseTableSortOptions<T>) => {
  const {
    sort = {},
    sortState: propSortState,
    page,
    pageSize,
    data,
    getValue,
    onRequest,
    onSort,
    onUpdateSortState,
  } = options;

  // Default sort config - multi-sort by default
  const sortConfig = computed<Required<SortConfig>>(() => ({
    type: sort.type || "server",
    multiple: sort.multiple !== undefined ? sort.multiple : true,
  }));

  // Internal sort state (controlled via v-model:sort-state)
  const internalSortState = ref<SortItem[]>(propSortState?.value || []);

  // Store original data order for reset (only for frontend sorting)
  const originalDataOrder = ref<T[]>([]);

  // Track if original order has been saved
  const originalOrderSaved = ref(false);

  // Save original data order on first load
  if (data && sortConfig.value.type === "front") {
    watch(
      data,
      (newData) => {
        // Save original order only once, on first data load
        if (!originalOrderSaved.value && newData.length > 0) {
          originalDataOrder.value = [...newData];
          originalOrderSaved.value = true;
        }
      },
      { immediate: true },
    );
  }

  // Sync with prop if controlled
  if (propSortState) {
    watch(propSortState, (val) => {
      internalSortState.value = val || [];
    });
  }

  // ========================================
  // FRONTEND SORTING LOGIC
  // ========================================

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
    if (
      typeof numA === "number" &&
      typeof numB === "number" &&
      !Number.isNaN(numA) &&
      !Number.isNaN(numB)
    ) {
      return order === "asc" ? numA - numB : numB - numA;
    }

    // Compare strings
    const strA = String(a).toLowerCase();
    const strB = String(b).toLowerCase();

    if (order === "asc") {
      return strA.localeCompare(strB, undefined, { numeric: true });
    } else {
      return strB.localeCompare(strA, undefined, { numeric: true });
    }
  };

  /**
   * Sort data array by multiple columns (multi-sort support)
   */
  const sortDataByMultiple = (dataToSort: T[], sortItems: SortItem[]): T[] => {
    // If no sorting applied, return original order
    if (sortItems.length === 0) {
      if (originalOrderSaved.value && originalDataOrder.value.length > 0) {
        return [...originalDataOrder.value] as T[];
      }
      return [...dataToSort];
    }

    return [...dataToSort].sort((a, b) => {
      // Compare by each sort column in order
      for (const sortItem of sortItems) {
        const aValue = getRowValue(a, sortItem.column);
        const bValue = getRowValue(b, sortItem.column);
        const comparison = compareValues(aValue, bValue, sortItem.order);

        // If values are different, return comparison result
        if (comparison !== 0) {
          return comparison;
        }
        // If equal, continue to next sort column
      }

      return 0; // All sort columns are equal
    });
  };

  /**
   * Sorted data (reactive) - only for frontend sorting
   */
  const sortedData = computed<T[]>(() => {
    if (sortConfig.value.type !== "front" || !data) {
      return data?.value || [];
    }

    // Apply multi-sort
    return sortDataByMultiple(data.value, internalSortState.value);
  });

  // ========================================
  // SORT STATE MANAGEMENT
  // ========================================

  /**
   * Get sort state for specific column
   */
  const getSortState = (columnKey: string) => {
    const sortItem = internalSortState.value.find((item) => item.column === columnKey);
    return {
      isSorted: !!sortItem,
      order: sortItem?.order || null,
      index: sortItem ? internalSortState.value.indexOf(sortItem) : -1, // For multi-sort indicator
    };
  };

  /**
   * Toggle sort order: none -> asc -> desc -> none
   */
  const getNextSortOrder = (currentOrder: SortOrder | null): SortOrder | null => {
    if (!currentOrder) return "asc";
    if (currentOrder === "asc") return "desc";
    return null; // Reset to none
  };

  /**
   * Handle sort click on column header
   * Multi-sort is default behavior - no Shift key needed
   */
  const handleSortClick = (column: Column) => {
    if (!column.sortable) return;

    const columnKey = column.key;
    const currentSort = getSortState(columnKey);
    const nextOrder = getNextSortOrder(currentSort.order);

    let newSortState: SortItem[];

    if (sortConfig.value.multiple) {
      // Multi-sort mode (default)
      if (nextOrder === null) {
        // Remove from sort (triple-click reset)
        newSortState = internalSortState.value.filter((item) => item.column !== columnKey);
      } else if (currentSort.isSorted) {
        // Update existing sort order (asc -> desc or desc -> none)
        newSortState = internalSortState.value.map((item) =>
          item.column === columnKey ? { column: columnKey, order: nextOrder } : item,
        );
      } else {
        // Add new sort column
        newSortState = [...internalSortState.value, { column: columnKey, order: nextOrder }];
      }
    } else {
      // Single sort mode
      if (nextOrder === null) {
        newSortState = [];
      } else {
        newSortState = [{ column: columnKey, order: nextOrder }];
      }
    }

    // Update internal state
    internalSortState.value = newSortState;

    // Emit update
    onUpdateSortState?.(newSortState);

    // Route to appropriate handler based on sort type
    if (sortConfig.value.type === "front") {
      // Frontend sort - emit @sort event
      if (newSortState.length > 0) {
        // Emit for the most recently changed column
        const changedSort = newSortState.find((item) => item.column === columnKey);
        if (changedSort) {
          onSort?.({
            column: columnKey,
            order: changedSort.order,
            sortState: newSortState,
          });
        }
      }
    } else {
      // Server sort - emit @request event
      onRequest?.({
        page: page?.value || 1,
        pageSize: pageSize?.value || 10,
        sort: newSortState,
      });
    }
  };

  /**
   * Check if any column is sorted
   */
  const hasSortedColumns = computed(() => internalSortState.value.length > 0);

  /**
   * Reset all sorting
   */
  const resetSort = () => {
    internalSortState.value = [];
    onUpdateSortState?.([]);

    // Trigger request with empty sort
    if (sortConfig.value.type === "server") {
      onRequest?.({
        page: page?.value || 1,
        pageSize: pageSize?.value || 10,
        sort: [],
      });
    }
  };

  return {
    sortState: internalSortState,
    sortConfig,
    getSortState,
    handleSortClick,
    hasSortedColumns,
    resetSort,
    // Frontend sorting
    sortedData, // Reactive sorted data for frontend sorting
  };
};
