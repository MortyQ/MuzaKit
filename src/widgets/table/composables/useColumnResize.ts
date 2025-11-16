import { ref, computed, type Ref } from "vue";

import type { Column, ResizeState } from "../types";

const MIN_COLUMN_WIDTH = 85; // minimum column width in px
const DEFAULT_MIN_WIDTH = 100; // default min width for flex columns
const DEFAULT_COLUMN_WIDTH = 150; // default width for columns without flex or width

export function useColumnResize(columns: Ref<Column[]>) {
  // Store ONLY manually resized column widths (in px)
  // Only applies to columns with width (not flex)
  const resizedWidths = ref<Map<string, number>>(new Map());

  // Resizing state
  const resizeState = ref<ResizeState>({
    isResizing: false,
    columnKey: null,
    startX: 0,
    startWidth: 0,
  });

  // Check if column is resizable
  // Simple rule: width = resizable, no width = not resizable
  const isColumnResizable = (column: Column): boolean => {
    return !!column.width;
  };

  // Get column style for grid-template-columns
  const getColumnStyle = (column: Column): string => {
    // Priority 1: User manually resized this column
    const resizedWidth = resizedWidths.value.get(column.key);
    if (resizedWidth !== undefined) {
      return `${resizedWidth}px`;
    }

    // Priority 2: Column has explicit width - fixed and resizable
    if (column.width) {
      return column.width;
    }

    // Priority 3: Default - flexible column (flex: 1)
    return `minmax(${DEFAULT_MIN_WIDTH}px, 1fr)`;
  };

  // Grid template columns
  const gridTemplateColumns = computed(() => {
    return columns.value
      .map((col) => getColumnStyle(col))
      .join(" ");
  });

  // Grid template columns with checkbox column prepended
  const getGridTemplateWithCheckbox = (checkboxWidth = 50) => {
    return `${checkboxWidth}px ${gridTemplateColumns.value}`;
  };

  // Start resize
  const startResize = (columnKey: string, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Find the column
    const column = columns.value.find((col) => col.key === columnKey);
    if (!column || !isColumnResizable(column)) {
      return; // Don't resize flex or non-resizable columns
    }

    // Get current width
    let currentWidth: number;

    const existingResizedWidth = resizedWidths.value.get(columnKey);
    if (existingResizedWidth !== undefined) {
      // Column was already resized - use stored value
      currentWidth = existingResizedWidth;
    } else {
      // First time resizing - get from DOM or parse from width
      if (column.width?.endsWith("px")) {
        currentWidth = parseInt(column.width, 10);
      } else {
        // Get actual width from DOM
        const headerCell = (event.target as HTMLElement).closest('[role="columnheader"]');
        currentWidth = headerCell
          ? (headerCell as HTMLElement).offsetWidth
          : DEFAULT_COLUMN_WIDTH;
      }
    }

    resizeState.value = {
      isResizing: true,
      columnKey,
      startX: event.clientX,
      startWidth: currentWidth,
    };

    // Add global listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // Resize process (mousemove)
  const handleMouseMove = (event: MouseEvent) => {
    if (!resizeState.value.isResizing || !resizeState.value.columnKey) {
      return;
    }

    const deltaX = event.clientX - resizeState.value.startX;
    const newWidth = Math.max(
      MIN_COLUMN_WIDTH,
      resizeState.value.startWidth + deltaX,
    );

    // ⚡ IMPORTANT: Create a NEW Map instead of mutating the existing one
    // Otherwise Vue won't detect changes (Map mutations are not tracked)
    const newMap = new Map(resizedWidths.value);
    newMap.set(resizeState.value.columnKey, newWidth);
    resizedWidths.value = newMap;
  };

  // End resize (mouseup)
  const stopResize = () => {
    resizeState.value = {
      isResizing: false,
      columnKey: null,
      startX: 0,
      startWidth: 0,
    };

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // Double-click to reset column to its original width
  const autoFitColumn = (columnKey: string) => {
    // Remove from resized widths - column returns to original definition
    // ⚡ IMPORTANT: Create a NEW Map instead of mutation
    const newMap = new Map(resizedWidths.value);
    newMap.delete(columnKey);
    resizedWidths.value = newMap;
  };

  // Reset all widths - remove all manual resizes
  const resetWidths = () => {
    // ⚡ IMPORTANT: Create a NEW empty Map instead of mutation
    resizedWidths.value = new Map();
  };

  // Get current column width (for API/external use)
  const getColumnWidth = (columnKey: string): number | string => {
    const resizedWidth = resizedWidths.value.get(columnKey);
    if (resizedWidth !== undefined) {
      return resizedWidth;
    }

    const column = columns.value.find((col) => col.key === columnKey);
    if (!column) return `minmax(${DEFAULT_MIN_WIDTH}px, 1fr)`;

    return column.width || `minmax(${DEFAULT_MIN_WIDTH}px, 1fr)`;
  };

  return {
    gridTemplateColumns,
    getGridTemplateWithCheckbox,
    resizedWidths,
    isResizing: computed(() => resizeState.value.isResizing),
    isColumnResizable,
    startResize,
    autoFitColumn,
    getColumnWidth,
    resetWidths,
  };
}

