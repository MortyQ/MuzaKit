# Table Component - Full Documentation

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

```vue
<script setup lang="ts">
import Table from "@/widgets/table/Table.vue";
import type { Column } from "@/widgets/table/types";

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
```

---

## 📋 Props API

### Core Props

```typescript
interface TableProps {
  // Required
  columns: Column[]           // Column definitions
  data: ExpandableRow[]       // Table data

  // Optional
  loading?: boolean           // Show loading overlay (default: false)
  virtualized?: boolean       // Enable virtual scrolling (default: true)
  rowHeight?: number          // Row height in px (default: 50)
  height?: string | number    // Table height (CSS value or px)
  
  // Features
  totalRow?: Record<string, unknown>      // Summary row (sticky bottom)
  selectedRows?: ExpandableRow[]          // v-model:selected-rows
  multiSelect?: MultiSelectConfig         // Selection configuration
  expandMode?: "auto" | "controlled"      // Expansion behavior
  sort?: SortConfig                       // Sorting configuration
  sortState?: SortItem[]                  // v-model:sort-state
  pagination?: PaginationConfig           // Pagination configuration
  toolbar?: ToolbarConfig                 // Toolbar configuration
  exportOptions?: ExportOptions           // Export options
  search?: string                         // v-model:search
}
```

### Column Definition

```typescript
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
```

---

## 🎯 Column System (AG-Grid Style)

### Simple Rule

| Definition | Behavior | Resizable |
|------------|----------|-----------|
| `{ key: "name" }` | Flexible (flex: 1) | ❌ No |
| `{ key: "id", width: "80px" }` | Fixed 80px | ✅ Yes |

### Why This Way?

**Maximally simple API:**
- No `flex`, `minWidth` needed - everything works by default
- Want fixed width? Add `width`
- Want flexible? Don't specify anything!

### Examples

#### All Flexible (Default)

```vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];
</script>
```

**Result:** Columns fill table width equally, adjust on window resize, NOT resizable.

#### Mixed Mode (Recommended)

```vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px" },        // Fixed, resizable
  { key: "name", label: "Name" },                   // Flexible
  { key: "email", label: "Email" },                 // Flexible
  { key: "status", label: "Status", width: "120px" }, // Fixed, resizable
  { key: "actions", label: "Actions", width: "100px" }, // Fixed, resizable
];
</script>
```

**Result:**
- ID, Status, Actions: fixed width, resizable
- Name, Email: flexible, share remaining space
- Flexible columns auto-adjust when resizing fixed columns

#### All Fixed

```vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px" },
  { key: "name", label: "Name", width: "200px" },
  { key: "email", label: "Email", width: "250px" },
];
</script>
```

**Result:** All columns have fixed width, all resizable. Horizontal scroll if needed.

---

## 🔧 Advanced Features

### 1. Grouped Headers (Multi-level)

```vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px" },
  {
    key: "user-info",
    label: "User Information",
    children: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
    ],
  },
  {
    key: "stats",
    label: "Statistics",
    children: [
      { key: "orders", label: "Orders", width: "80px" },
      { key: "revenue", label: "Revenue", width: "100px" },
    ],
  },
];
</script>
```

**Features:**
- Multiple nesting levels
- Groups can have fixed or flexible columns
- Auto-calculates group widths
- Resizing respects group boundaries

### 2. Fixed (Sticky) Columns

```vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px", fixed: "left" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "actions", label: "Actions", width: "100px", fixed: "right" },
];
</script>
```

**Features:**
- Sticky positioning during horizontal scroll
- Works with grouped headers
- Multiple columns can be fixed
- Automatic shadow effects

### 3. Sorting

#### Server-Side Sorting (Default)

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { RequestPayload, SortConfig } from "@/widgets/table/types";

const sortState = ref([]);
const loading = ref(false);

const sortConfig: SortConfig = {
  type: "server",
  multiple: true, // Allow multi-column sorting
};

const handleRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  loading.value = true;
  // API call with sort parameters
  const response = await api.getUsers({ page, pageSize, sort });
  data.value = response.data;
  loading.value = false;
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    :sort="sortConfig"
    v-model:sort-state="sortState"
    @request="handleRequest"
  />
</template>
```

#### Client-Side Sorting

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { FrontSortPayload, SortConfig } from "@/widgets/table/types";

const data = ref([/* all data loaded */]);

const sortConfig: SortConfig = {
  type: "front",
  multiple: true,
};

const handleSort = ({ column, order, sortState }: FrontSortPayload) => {
  // Table sorts data automatically, but you can add custom logic
  console.log(`Sorted by ${column} ${order}`);
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :sort="sortConfig"
    @sort="handleSort"
  />
</template>
```

#### Custom Sort Value

```vue
<script setup lang="ts">
const columns: Column[] = [
  {
    key: "status",
    label: "Status",
    sortable: true,
    sortValue: (row) => {
      // Define custom sort order
      const order = { active: 1, pending: 2, inactive: 3 };
      return order[row.status] || 999;
    },
  },
];
</script>
```

### 4. Pagination (Server-Side)

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { RequestPayload, PaginationConfig } from "@/widgets/table/types";

const data = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

const pagination: PaginationConfig = {
  page: currentPage.value,
  pageSize: pageSize.value,
  total: totalItems.value,
  pageSizeOptions: [10, 25, 50, 100],
  showSizeChanger: true,
};

const handleRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  loading.value = true;
  
  const response = await api.getUsers({ page, pageSize, sort });
  
  data.value = response.data;
  currentPage.value = page;
  pageSize.value = pageSize;
  totalItems.value = response.total;
  loading.value = false;
};

// Initial load
handleRequest({ page: 1, pageSize: 10, sort: [] });
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    @request="handleRequest"
  />
</template>
```

**Features:**
- Smart page number display with ellipsis
- Customizable page size options
- Optional page size selector
- Auto-reset to page 1 on page size change
- Disabled controls during loading
- 1-based page numbers

### 5. Row Selection

#### Multi-Select with Checkboxes

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { MultiSelectConfig } from "@/widgets/table/types";

const selectedRows = ref([]);

const multiSelect: MultiSelectConfig = {
  mode: "multiple",
  keyField: "id",
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :multi-select="multiSelect"
    v-model:selected-rows="selectedRows"
  />
  
  <div>
    Selected: {{ selectedRows.length }} rows
  </div>
</template>
```

#### Single Select (Radio Mode)

```vue
<script setup lang="ts">
const multiSelect: MultiSelectConfig = {
  mode: "single",
  keyField: "id",
};
</script>
```

#### Selection Modes

- `"multiple"` - checkbox selection, multiple rows
- `"single"` - radio selection, one row only
- `"disabled"` - no selection, no checkboxes

### 6. Expandable Rows (Hierarchical Data)

#### Auto Expansion (Default)

```vue
<script setup lang="ts">
import type { ExpandableRow } from "@/widgets/table/types";

const data: ExpandableRow[] = [
  {
    id: 1,
    name: "Parent 1",
    children: [
      { id: 11, name: "Child 1.1" },
      { id: 12, name: "Child 1.2" },
    ],
  },
  { id: 2, name: "Parent 2" },
];
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    expand-mode="auto"
  />
</template>
```

#### Controlled Expansion

```vue
<script setup lang="ts">
const handleExpandClick = ({ row, callback, expanded }) => {
  if (!expanded) {
    // Lazy load children
    loadChildren(row.id).then((children) => {
      row.children = children;
      callback(); // Toggle expansion
    });
  } else {
    callback(); // Just collapse
  }
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    expand-mode="controlled"
    @expand-click="handleExpandClick"
  />
</template>
```

### 7. Toolbar

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { ToolbarConfig, ExportOptions } from "@/widgets/table/types";

const searchQuery = ref("");

const toolbar: ToolbarConfig = {
  enabled: true,
  title: "Users Management",
  subtitle: "Manage your team members",
  search: {
    placeholder: "Search users...",
  },
  actions: {
    refresh: true,
    resetSort: true,
    export: "multi", // or "single"
  },
};

const exportOptions: ExportOptions = {
  formats: [
    { label: "Export as CSV", value: "csv", icon: "mdi:file-delimited" },
    { label: "Export as Excel", value: "excel", icon: "mdi:file-excel" },
    { label: "Export as PDF", value: "pdf", icon: "mdi:file-pdf" },
  ],
  selectedOnly: true,
};

const handleRefresh = () => {
  console.log("Refreshing data...");
  // Fetch fresh data
};

const handleResetSort = () => {
  console.log("Resetting sort...");
};

const handleExport = (format: string, selectedOnly?: boolean) => {
  console.log(`Exporting as ${format}, selected only: ${selectedOnly}`);
  // Export logic
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :toolbar="toolbar"
    :export-options="exportOptions"
    v-model:search="searchQuery"
    @toolbar:refresh="handleRefresh"
    @toolbar:reset-sort="handleResetSort"
    @toolbar:export="handleExport"
  />
</template>
```

**Custom Toolbar (Slot)**

```vue
<template>
  <Table :columns="columns" :data="data">
    <template #toolbar>
      <div class="custom-toolbar">
        <h2>Custom Toolbar</h2>
        <button @click="customAction">Custom Action</button>
      </div>
    </template>
  </Table>
</template>
```

### 8. Data Formatting

```vue
<script setup lang="ts">
const columns: Column[] = [
  {
    key: "price",
    label: "Price",
    format: {
      currency: { code: "USD", decimals: 2 },
    },
  },
  {
    key: "discount",
    label: "Discount",
    format: {
      percentage: { decimals: 1 },
    },
  },
  {
    key: "date",
    label: "Date",
    format: {
      date: { format: "short", locale: "en-US" },
    },
  },
  {
    key: "fileSize",
    label: "Size",
    format: {
      fileSize: { decimals: 2 },
    },
  },
  {
    key: "active",
    label: "Status",
    format: {
      boolean: {
        trueText: "Active",
        falseText: "Inactive",
        colored: true,
      },
    },
  },
  {
    key: "fullName",
    label: "Full Name",
    format: {
      formatter: (value, row) => `${row.firstName} ${row.lastName}`,
    },
  },
];
</script>
```

**Supported Formats:**
- `currency` - USD, EUR, GBP, UAH, etc.
- `percentage` - with decimals and multiplier options
- `number` - default, compact, percent, decimal
- `date` - short, long, time, datetime
- `boolean` - custom text and colors
- `fileSize` - bytes, KB, MB, GB, TB
- `formatter` - custom function

### 9. Total Row (Summary)

```vue
<script setup lang="ts">
import { computed } from "vue";

const data = ref([/* data */]);

const totalRow = computed(() => ({
  name: "Total",
  orders: data.value.reduce((sum, row) => sum + row.orders, 0),
  revenue: data.value.reduce((sum, row) => sum + row.revenue, 0),
}));
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :total-row="totalRow"
  />
</template>
```

**Features:**
- Sticky at bottom during scroll
- Automatically formatted like data rows
- Full styling support

### 10. Virtual Scrolling

```vue
<template>
  <Table
    :columns="columns"
    :data="largeDataset"
    :virtualized="true"
    :row-height="50"
    :height="600"
  />
</template>
```

**Features:**
- Handles 10,000+ rows smoothly
- Only renders visible rows
- Automatic height estimation
- Configurable overscan

**Performance:**
- Default: enabled (`virtualized: true`)
- Disable for small datasets (<100 rows)

---

## 🎨 Custom Slots

### Cell Slots

```vue
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
```

### Expandable Content

```vue
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
```

### Empty State

```vue
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
```

---

## 📤 Events

```typescript
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
```

---

## 🎭 Complete Example

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "@/widgets/table/Table.vue";
import type {
  Column,
  ExpandableRow,
  RequestPayload,
  PaginationConfig,
  ToolbarConfig,
  MultiSelectConfig,
  SortConfig,
} from "@/widgets/table/types";

// Data & Loading
const data = ref<ExpandableRow[]>([]);
const loading = ref(false);
const selectedRows = ref([]);
const searchQuery = ref("");
const sortState = ref([]);

// Pagination
const currentPage = ref(1);
const pageSize = ref(25);
const totalItems = ref(0);

const pagination: PaginationConfig = {
  page: currentPage.value,
  pageSize: pageSize.value,
  total: totalItems.value,
  pageSizeOptions: [10, 25, 50, 100],
};

// Columns
const columns: Column[] = [
  { key: "id", label: "ID", width: "80px", fixed: "left" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "price",
    label: "Price",
    width: "120px",
    sortable: true,
    format: { currency: "USD" },
  },
  {
    key: "date",
    label: "Created",
    width: "150px",
    sortable: true,
    format: { date: "short" },
  },
  {
    key: "status",
    label: "Status",
    width: "100px",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    width: "120px",
    fixed: "right",
    interactive: true,
  },
];

// Multi-select
const multiSelect: MultiSelectConfig = {
  mode: "multiple",
  keyField: "id",
};

// Sort
const sortConfig: SortConfig = {
  type: "server",
  multiple: true,
};

// Toolbar
const toolbar: ToolbarConfig = {
  enabled: true,
  title: "User Management",
  subtitle: "Manage all users in your organization",
  search: { placeholder: "Search users..." },
  actions: {
    refresh: true,
    resetSort: true,
    export: "multi",
  },
};

// Handlers
const handleRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  loading.value = true;
  try {
    const response = await api.getUsers({ page, pageSize, sort });
    data.value = response.data;
    currentPage.value = page;
    totalItems.value = response.total;
  } finally {
    loading.value = false;
  }
};

const handleRowClick = (row: Record<string, unknown>) => {
  console.log("Row clicked:", row);
};

const handleExport = (format: string, selectedOnly?: boolean) => {
  console.log(`Exporting as ${format}`, { selectedOnly });
};

// Initial load
handleRequest({ page: 1, pageSize: 25, sort: [] });
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    :virtualized="true"
    :height="600"
    :pagination="pagination"
    :multi-select="multiSelect"
    :sort="sortConfig"
    :toolbar="toolbar"
    v-model:selected-rows="selectedRows"
    v-model:sort-state="sortState"
    v-model:search="searchQuery"
    @request="handleRequest"
    @row-click="handleRowClick"
    @toolbar:export="handleExport"
  >
    <!-- Custom action buttons -->
    <template #cell-actions="{ row }">
      <button @click="edit(row)">Edit</button>
      <button @click="delete(row)">Delete</button>
    </template>

    <!-- Custom status badge -->
    <template #cell-status="{ value }">
      <span
        :class="{
          'badge badge-success': value === 'active',
          'badge badge-error': value === 'inactive',
        }"
      >
        {{ value }}
      </span>
    </template>
  </Table>
</template>
```

---

## 💡 Best Practices

### 1. Column Width Strategy

**Recommended approach:**
```typescript
// Fixed width for: ID, status, actions, narrow columns
// Flexible for: Name, email, description, wide text columns

const columns = [
  { key: "id", width: "60px" },           // Fixed
  { key: "name" },                        // Flexible
  { key: "email" },                       // Flexible
  { key: "status", width: "100px" },      // Fixed
  { key: "actions", width: "120px" },     // Fixed
];
```

### 2. Performance Optimization

```typescript
// Enable virtualization for large datasets
<Table :virtualized="true" :row-height="50" />

// Disable for small datasets (<100 rows)
<Table :virtualized="false" />

// Set appropriate height
<Table :height="600" /> // Fixed height for virtual scroll
```

### 3. Sorting Strategy

**Use server-side for:**
- Large datasets (>1000 rows)
- Paginated data
- Complex sort logic

**Use client-side for:**
- Small datasets (<100 rows)
- All data loaded at once
- Simple sort requirements

### 4. Selection Best Practices

```typescript
// Always provide unique key field
multiSelect: {
  mode: "multiple",
  keyField: "id", // Must be unique!
}

// Use v-model for reactive selection
v-model:selected-rows="selectedRows"
```

### 5. Custom Formatting

```typescript
// Prefer built-in formatters when possible
format: { currency: "USD" }

// Use custom formatter for complex logic
format: {
  formatter: (value, row) => {
    // Custom logic
    return complexCalculation(value, row);
  }
}
```

---

## 🐛 Troubleshooting

### Issue: Columns not resizing
**Solution:** Add `width` property to make column resizable
```typescript
{ key: "name", width: "150px" } // Now resizable
```

### Issue: Virtual scroll not working
**Solution:** Set explicit `height` prop
```typescript
<Table :height="600" :virtualized="true" />
```

### Issue: Sorting not working
**Solution:** Check `sortable: true` on columns and handle `@request` event
```typescript
{ key: "name", sortable: true }
// And
@request="handleRequest"
```

### Issue: Pagination not updating
**Solution:** Update pagination config after data load
```typescript
pagination.value = {
  page: currentPage.value,
  pageSize: pageSize.value,
  total: totalItems.value,
};
```

### Issue: Selection not reactive
**Solution:** Use v-model binding
```typescript
v-model:selected-rows="selectedRows"
```

---

## 🔗 Related Documentation

- [Flexible Columns Guide](./FLEX_COLUMNS.md)
- [Pagination Usage](./PAGINATION_USAGE.md)
- [Toolbar Usage](./TOOLBAR_USAGE.md)
- [Row Styling Guide](./ROW_STYLING.md)

---

## 📝 TypeScript Types Reference

```typescript
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
```

---

**Last Updated:** November 2025  
**Version:** 1.0.0

