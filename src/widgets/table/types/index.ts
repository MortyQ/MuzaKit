export interface Column {
  key: string           // Key from data object
  label: string         // Header text
  width?: string        // CSS value (1fr, 150px, auto)
  align?: "left" | "center" | "right"
  interactive?: boolean // Whether column contains interactive elements (select, dropdown, etc.)
  fixed?: "left" | "right" // Fix column (sticky) to left or right
  children?: Column[]   // Nested columns for grouped headers (AG-Grid style)
  sortable?: boolean    // Enable sorting for this column
}

export interface HeaderCell {
  key: string
  label: string
  column: Column
  colspan: number       // Number of leaf columns this cell spans
  rowspan: number       // Number of header levels this cell spans (for single columns)
  isGroup: boolean      // Is this a group header (has children)
  level: number         // Depth level in hierarchy (0 = top)
}

export interface ExpandableRow {
  id: string | number
  children?: ExpandableRow[]
  [key: string]: unknown
}

export interface FlattenedRow extends ExpandableRow {
  depth: number          // Nesting level (0 = root)
  parentId?: string | number
  hasChildren: boolean
  isExpanded: boolean
}

export interface VirtualTableOptions {
  estimateSize?: number
  overscan?: number
  measureElement?: boolean
}

export interface ResizeState {
  isResizing: boolean;
  columnKey: string | null;
  startX: number;
  startWidth: number;
}

// Sort types
export type SortOrder = "asc" | "desc";
export type SortType = "front" | "server";

export interface SortItem {
  column: string        // Column key
  order: SortOrder      // Sort direction
}

export interface SortConfig {
  type?: SortType       // Sort type: 'front' (client-side) or 'server' (default)
  multiple?: boolean    // Allow multiple column sorting (default: true)
}

export interface RequestPayload {
  page: number
  pageSize: number
  sort: SortItem[]      // Always array, even for single sort
}

export interface FrontSortPayload {
  column: string
  order: SortOrder
  sortState: SortItem[] // Full sort state for multi-sort
}

// Re-export selection types
export type { MultiSelectConfig, SelectionMode, CheckboxState } from "./selection";

