export default `# Table Component - Getting Started

## 📦 Overview

Enterprise-grade data table component with advanced features for modern web applications.

**Key Features:**
- ✅ **Virtual scrolling** - handle 10,000+ rows with smooth performance
- ✅ **Flexible & Fixed columns** - AG-Grid inspired column system
- ✅ **Grouped headers** - multi-level column grouping
- ✅ **Fixed columns** - sticky left/right columns
- ✅ **Server & Client sorting** - single or multiple column sorting
- ✅ **Server-side pagination** - built-in pagination controls
- ✅ **Row selection** - single, multi, or disabled selection modes
- ✅ **Expandable rows** - hierarchical data with auto/controlled expansion
- ✅ **Column resizing** - interactive width adjustment
- ✅ **Toolbar** - search, refresh, export, reset sort
- ✅ **Formatting** - currency, date, number, percentage, file size
- ✅ **Total row** - sticky summary row at bottom
- ✅ **TypeScript** - full type safety
- ✅ **Responsive** - works on all screen sizes

---

## 🚀 Quick Start

### Basic Table

\`\`\`vue
<script setup lang="ts">
import Table from "@/shared/ui/table/VTable.vue";
import type { Column } from "@/shared/ui/table/types";

const columns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

const data = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
  />
</template>
\`\`\`

---

## 📋 Core Props

### Required Props

\`\`\`typescript
interface TableProps {
  columns: Column[]           // Column definitions
  data: ExpandableRow[]       // Table data
}
\`\`\`

### Optional Props

\`\`\`typescript
interface TableProps {
  // Loading & Display
  loading?: boolean           // Show loading overlay (default: false)
  height?: string | number    // Table height (CSS value or px)
  
  // Performance
  virtualized?: boolean       // Enable virtual scrolling (default: true)
  rowHeight?: number          // Row height in px (default: 50)
  
  // Features
  totalRow?: Record<string, unknown>      // Summary row (sticky bottom)
  selectedRows?: ExpandableRow[]          // v-model:selected-rows
  multiSelect?: MultiSelectConfig         // Selection configuration
  expandMode?: "auto" | "controlled"      // Expansion behavior
  sort?: SortConfig                       // Sorting configuration
  sortState?: SortItem[]                  // v-model:sort-state
  pagination?: PaginationConfig           // Pagination configuration
  toolbar?: ToolbarConfig                 // Toolbar configuration (includes export)
  search?: string                         // v-model:search
}
\`\`\`

### Column Definition

\`\`\`typescript
interface Column {
  key: string                 // Data object key
  label: string               // Header text
  width?: string              // Fixed width (e.g., "150px") - makes resizable
  align?: "left" | "center" | "right"
  interactive?: boolean       // Contains interactive elements
  fixed?: "left" | "right"    // Sticky column position
  children?: Column[]         // Nested columns (grouped headers)
  sortable?: boolean          // Enable sorting
  sortValue?: (row, key) => unknown  // Custom sort value getter
  format?: ColumnFormatOptions       // Formatting options
}
\`\`\`

---

## 🎨 Custom Slots

### Cell Slots

Customize cell rendering by column key:

\`\`\`vue
<template>
  <Table :columns="columns" :data="data">
    <!-- Custom cell by column key -->
    <template #cell-status="{ value, row }">
      <span :class="statusClass(value)">
        {{ value }}
      </span>
    </template>

    <!-- Custom cell with actions -->
    <template #cell-actions="{ row }">
      <button @click="edit(row)">Edit</button>
      <button @click="delete(row)">Delete</button>
    </template>
  </Table>
</template>
\`\`\`

### Expandable Content

\`\`\`vue
<template>
  <Table :columns="columns" :data="data">
    <template #expanded-row="{ row }">
      <div class="expanded-content">
        <h3>Details for {{ row.name }}</h3>
        <p>{{ row.description }}</p>
      </div>
    </template>
  </Table>
</template>
\`\`\`

### Empty State

\`\`\`vue
<template>
  <Table :columns="columns" :data="data">
    <template #empty>
      <div class="empty-state">
        <p>No data found</p>
        <button @click="loadData">Load Data</button>
      </div>
    </template>
  </Table>
</template>
\`\`\`

---

## 📤 Events

\`\`\`typescript
interface TableEmits {
  // Row interaction
  "row-click": [row: Record<string, unknown>]
  
  // Selection
  "update:selected-rows": [selectedRows: ExpandableRow[]]
  
  // Expansion
  "expand-click": [{
    row: ExpandableRow,
    column: Column,
    callback: () => void,
    expanded: boolean
  }]
  
  // Sorting & Pagination
  "update:sort-state": [sortState: SortItem[]]
  "request": [payload: RequestPayload] // Server-side operations
  "sort": [payload: FrontSortPayload] // Client-side sort
  
  // Toolbar
  "update:search": [query: string]
  "toolbar:refresh": []
  "toolbar:reset-sort": []
  "toolbar:export": [format: string, selectedOnly?: boolean]
}
\`\`\`

---

## 💡 Best Practices

### Performance Optimization

\`\`\`typescript
// Enable virtualization for large datasets
<Table :virtualized="true" :row-height="50" :height="600" />

// Disable for small datasets (<100 rows)
<Table :virtualized="false" />
\`\`\`

### Column Width Strategy

\`\`\`typescript
// Fixed width for: ID, status, actions, narrow columns
// Flexible for: Name, email, description, wide text columns

const columns = [
  { key: "id", width: "60px" },           // Fixed, resizable
  { key: "name" },                        // Flexible
  { key: "email" },                       // Flexible
  { key: "status", width: "100px" },      // Fixed, resizable
  { key: "actions", width: "120px" },     // Fixed, resizable
];
\`\`\`

---

## 📝 TypeScript Types

\`\`\`typescript
// Import all types
import type {
  Column,
  ExpandableRow,
  RequestPayload,
  PaginationConfig,
  ToolbarConfig,
  MultiSelectConfig,
  SortConfig,
  SortItem,
  ColumnFormatOptions,
} from "@/widgets/table/types";
\`\`\`
`;
