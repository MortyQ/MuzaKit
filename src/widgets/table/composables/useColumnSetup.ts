import { computed, ref, watch } from "vue";

import type { Column } from "../types";

export interface ColumnSetupItem {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  fixed?: "left" | "right";
  children?: ColumnSetupItem[]; // Support for grouped columns
}

export interface ColumnSetupConfig {
  columns: Column[];
  initialVisible?: string[]; // Keys of initially visible columns
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (visibleColumns: Column[]) => void; // eslint-disable-line no-unused-vars
  storage?: {
    key: string;
    type?: "localStorage" | "sessionStorage";
  };
}

/**
 * Composable for managing column visibility and order
 * Supports drag-and-drop reordering and toggling visibility
 */
export function useColumnSetup(config: ColumnSetupConfig) {
  // Get storage instance
  const getStorage = () => {
    if (!config.storage) return null;
    return config.storage.type === "sessionStorage" ? sessionStorage : localStorage;
  };

  // Load saved state from storage
  const loadFromStorage = (): { visible: string[]; order: string[] } | null => {
    if (!config.storage) return null;

    const storage = getStorage();
    if (!storage) return null;

    try {
      const saved = storage.getItem(config.storage.key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load column setup from storage:", error);
    }
    return null;
  };

  // Save state to storage
  const saveToStorage = (items: ColumnSetupItem[]) => {
    if (!config.storage) return;

    const storage = getStorage();
    if (!storage) return;

    try {
      const state = {
        visible: items.filter((item) => item.visible).map((item) => item.key),
        order: items.map((item) => item.key),
      };
      storage.setItem(config.storage.key, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save column setup to storage:", error);
    }
  };

  // Flatten columns to handle grouped headers
  const flattenColumns = (columns: Column[]): Column[] => {
    return columns.reduce((acc, col) => {
      if (col.children && col.children.length > 0) {
        return [...acc, ...flattenColumns(col.children)];
      }
      return [...acc, col];
    }, [] as Column[]);
  };

  // Create setup items from columns
  const createSetupItems = (columns: Column[]): ColumnSetupItem[] => {
    const flatCols = flattenColumns(columns);
    const savedState = loadFromStorage();

    // If we have saved state, use it
    if (savedState) {
      const { visible, order } = savedState;

      // Create a map for quick lookup
      const colMap = new Map(flatCols.map((col) => [col.key, col]));

      // Build items based on saved order
      const items: ColumnSetupItem[] = [];

      // First, add columns in saved order
      order.forEach((key, index) => {
        const col = colMap.get(key);
        if (col) {
          items.push({
            key: col.key,
            label: col.label,
            visible: visible.includes(key),
            order: index,
            fixed: col.fixed,
          });
          colMap.delete(key);
        }
      });

      // Then add any new columns that weren't in saved state
      colMap.forEach((col) => {
        items.push({
          key: col.key,
          label: col.label,
          visible: true,
          order: items.length,
          fixed: col.fixed,
        });
      });

      return items;
    }

    // No saved state, use initial config
    return flatCols.map((col, index) => ({
      key: col.key,
      label: col.label,
      visible: config.initialVisible
        ? config.initialVisible.includes(col.key)
        : true, // By default all visible
      order: index,
      fixed: col.fixed,
    }));
  };

  // Internal state for setup items
  const setupItems = ref<ColumnSetupItem[]>(createSetupItems(config.columns));

  // Computed visible columns based on setup
  const visibleColumns = computed(() => {
    const visibleItems = setupItems.value
      .filter((item) => item.visible)
      .sort((a, b) => a.order - b.order);

    // Map back to original columns structure
    const flatCols = flattenColumns(config.columns);
    return visibleItems
      .map((item) => flatCols.find((col) => col.key === item.key))
      .filter(Boolean) as Column[];
  });

  // Get setup item by key
  const getSetupItem = (key: string): ColumnSetupItem | undefined => {
    return setupItems.value.find((item) => item.key === key);
  };

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    const item = setupItems.value.find((item) => item.key === key);
    if (item) {
      item.visible = !item.visible;
      saveToStorage(setupItems.value);
    }
  };

  // Set column visibility
  const setColumnVisibility = (key: string, visible: boolean) => {
    const item = setupItems.value.find((item) => item.key === key);
    if (item) {
      item.visible = visible;
      saveToStorage(setupItems.value);
    }
  };

  // Reorder columns (for drag-and-drop)
  const reorderColumns = (fromIndex: number, toIndex: number) => {
    const items = [...setupItems.value];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // Update order values
    items.forEach((item, index) => {
      item.order = index;
    });

    setupItems.value = items;
    saveToStorage(setupItems.value);
  };

  // Reset to default state
  const reset = () => {
    // Clear storage on reset
    if (config.storage) {
      const storage = getStorage();
      if (storage) {
        storage.removeItem(config.storage.key);
      }
    }
    setupItems.value = createSetupItems(config.columns);
  };

  // Show all columns
  const showAll = () => {
    setupItems.value.forEach((item) => {
      item.visible = true;
    });
    saveToStorage(setupItems.value);
  };

  // Hide all columns
  const hideAll = () => {
    setupItems.value.forEach((item) => {
      item.visible = false;
    });
    saveToStorage(setupItems.value);
  };

  // Watch for changes and notify parent
  watch(
    () => visibleColumns.value,
    (newColumns) => {
      if (config.onUpdate) {
        config.onUpdate(newColumns);
      }
    },
    { deep: true },
  );

  return {
    setupItems,
    visibleColumns,
    getSetupItem,
    toggleColumn,
    setColumnVisibility,
    reorderColumns,
    reset,
    showAll,
    hideAll,
  };
}

