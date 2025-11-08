# Table Toolbar Usage

Toolbar provides a convenient way to add common table actions like search, refresh, export, and reset sort.

## Basic Usage

### Props-based Toolbar (Simple)

```vue
<Table
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    title: 'Users Management',
    subtitle: 'Manage your team members',
    search: true,
    actions: {
      refresh: true,
      resetSort: true,
      export: 'single',
    },
  }"
  v-model:search="searchQuery"
  @toolbar:refresh="handleRefresh"
  @toolbar:reset-sort="handleResetSort"
  @toolbar:export="handleExport"
/>
```

### Custom Toolbar (Slot-based)

```vue
<Table :columns="columns" :data="data">
  <template #toolbar>
    <div class="custom-toolbar">
      <h2>Custom Toolbar</h2>
      <button @click="customAction">Custom Action</button>
    </div>
  </template>
</Table>
```

## Configuration

### ToolbarConfig

```typescript
interface ToolbarConfig {
  enabled?: boolean;        // Enable toolbar (default: false)
  title?: string;           // Table title
  subtitle?: string;        // Optional subtitle
  search?: boolean | {      // Search configuration
    placeholder?: string;
  };
  actions?: {
    refresh?: boolean;      // Show refresh button
    resetSort?: boolean;    // Show reset sort button
    export?: 'single' | 'multi';  // Export functionality
  };
}
```

### ExportOptions (for multi export)

```typescript
interface ExportOptions {
  formats?: ExportFormat[];  // Available export formats
  selectedOnly?: boolean;    // Export only selected rows
  loading?: boolean;         // Global loading state
}

interface ExportFormat {
  label: string;            // Display label
  value: string;            // Format value (csv, excel, pdf)
  icon?: string;            // Optional icon
  loader?: boolean;         // Loading state for this format
}
```

## Examples

### 1. Simple Toolbar with Search and Refresh

```vue
<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

const handleRefresh = () => {
  console.log('Refreshing data...');
  // Fetch fresh data
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :toolbar="{
      enabled: true,
      title: 'Users',
      search: { placeholder: 'Search users...' },
      actions: { refresh: true }
    }"
    v-model:search="searchQuery"
    @toolbar:refresh="handleRefresh"
  />
</template>
```

### 2. Multi-format Export with Loading

```vue
<script setup>
import { ref } from 'vue';

const exportFormats = ref([
  { label: 'CSV', value: 'csv', icon: 'mdi:file-delimited', loader: false },
  { label: 'Excel', value: 'excel', icon: 'mdi:file-excel', loader: false },
  { label: 'PDF', value: 'pdf', icon: 'mdi:file-pdf-box', loader: false },
]);

const handleExport = async (format, selectedOnly) => {
  const exportFormat = exportFormats.value.find(f => f.value === format);
  if (exportFormat) {
    exportFormat.loader = true;
    
    try {
      // Perform export
      await exportData(format, selectedOnly);
    } finally {
      exportFormat.loader = false;
    }
  }
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :toolbar="{
      enabled: true,
      title: 'Export Demo',
      actions: { export: 'multi' }
    }"
    :export-options="{ formats: exportFormats }"
    @toolbar:export="handleExport"
  />
</template>
```

### 3. Automatic Refresh & Reset Sort (Recommended)

```vue
<template>
  <Table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :toolbar="{
      enabled: true,
      title: 'Auto-Reset Table',
      actions: {
        refresh: true,
        resetSort: true
      }
    }"
    @request="handleServerRequest"
  />
  <!-- 
    Refresh button automatically:
    - Clears sort state
    - Resets to page 1
    - Calls @request with clean state
    
    Reset Sort button automatically:
    - Clears sort state
    - Calls @request with current page and empty sort
  -->
</template>
```

### 4. Manual Control (Advanced)

```vue
<script setup>
const handleCustomRefresh = () => {
  // Custom refresh logic
  console.log('Custom refresh with additional actions');
  fetchData({ page: 1, sort: [] });
  clearFilters();
  resetCache();
};

const handleCustomResetSort = () => {
  // Custom reset logic
  console.log('Custom reset sort');
  sortState.value = [];
  saveToLocalStorage();
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :toolbar="{
      enabled: true,
      title: 'Manual Control',
      actions: {
        refresh: true,
        resetSort: true
      }
    }"
    @toolbar:refresh="handleCustomRefresh"
    @toolbar:reset-sort="handleCustomResetSort"
  />
  <!-- When you add listeners, built-in behavior is disabled -->
</template>
```

### 5. Override Reset Sort Only

```vue
<template>
  <Table
    :columns="columns"
    :data="data"
    :toolbar="{
      enabled: true,
      title: 'Custom Reset',
      actions: { resetSort: true }
    }"
    @toolbar:reset-sort="customResetLogic"
  />
</template>
```

### 6. Hybrid Approach (Props + Slots)

```vue
<Table
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    title: 'Hybrid Example',
    search: true
  }"
>
  <!-- Override actions section with custom buttons -->
  <template #toolbar-actions>
    <VButton @click="customAction1">Custom 1</VButton>
    <VButton @click="customAction2">Custom 2</VButton>
  </template>
</Table>
```

## Available Slots

When using `toolbar.enabled`, you can override specific sections:

- `#toolbar-title` - Override title section
- `#toolbar-search` - Override search section
- `#toolbar-actions` - Override actions section

Or use `#toolbar` for complete custom toolbar.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:search` | `query: string` | Emitted when search value changes |
| `toolbar:refresh` | - | **Auto**: Resets sort + pagination to page 1. **Manual**: Emitted if listener exists |
| `toolbar:reset-sort` | - | **Auto**: Clears sort + emits `@request` with current page. **Manual**: Emitted if listener exists |
| `toolbar:export` | `format: string, selectedOnly?: boolean` | Emitted when export clicked |

### Built-in Behavior

**Refresh Button:**
- If you don't listen to `@toolbar:refresh`, the table automatically:
  - Clears sort state (`sortState = []`)
  - Resets pagination to page 1 (if pagination is enabled)
  - Emits `@request` event with clean state
- If you listen to `@toolbar:refresh`, you have full control

**Reset Sort Button:**
- If you don't listen to `@toolbar:reset-sort`, the table automatically:
  - Clears sort state (`sortState = []`)
  - Emits `@request` event with cleared sort and current page (if pagination is enabled)
- If you listen to `@toolbar:reset-sort`, you have full control

## Best Practices

1. **Use props for simple toolbars** - Faster and more declarative
2. **Use slots for complex customization** - When you need full control
3. **Handle loading states** - Show loading indicators during async operations
4. **Implement export logic in parent** - Table only emits events, parent handles the actual export
5. **Trust the built-in behavior** - For refresh and reset sort, let Table handle it automatically unless you need custom logic
6. **Don't listen to events you don't need** - If you're happy with auto-reset, don't add `@toolbar:refresh` listener

## Responsive Behavior

On mobile devices (< 768px):
- Toolbar stacks vertically (flex-col)
- Search takes full width
- Actions take full width

## Notes

- Search uses `VSearch` component internally
- Reset sort automatically clears sort state unless overridden
- Export doesn't include built-in logic - implement in parent component
- All toolbar actions are optional - only include what you need

