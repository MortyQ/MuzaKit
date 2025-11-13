export default `# Table Toolbar Usage

Toolbar provides a convenient way to add common table actions like search, refresh, export, and reset sort.

## Basic Usage

### Props-based Toolbar (Simple)

\`\`\`vue
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
\`\`\`

### Custom Toolbar (Slot-based)

\`\`\`vue
<Table :columns="columns" :data="data">
  <template #toolbar>
    <div class="custom-toolbar">
      <h2>Custom Toolbar</h2>
      <button @click="customAction">Custom Action</button>
    </div>
  </template>
</Table>
\`\`\`

## Configuration

### ToolbarConfig

\`\`\`typescript
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
\`\`\`

### ExportOptions (for multi export)

\`\`\`typescript
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
\`\`\`

## Examples

### 1. Simple Toolbar with Search and Refresh

\`\`\`vue
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
\`\`\`

### 2. Multi-format Export with Loading

\`\`\`vue
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
\`\`\`

### 3. Automatic Refresh & Reset Sort (Recommended)

\`\`\`vue
<template>
  <Table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :toolbar="{
      enabled: true,
      title: 'Auto-Reset Table',
      actions: {
        refresh: true,        // or 'default' - same behavior
        resetSort: true       // or 'default' - same behavior
      }
    }"
    @request="handleServerRequest"
  />
  <!-- 
    Refresh button automatically:
    - Emits @toolbar:refresh event
    - Clears sort state
    - Resets to page 1
    - Calls @request with clean state
    
    Reset Sort button automatically:
    - Emits @toolbar:reset-sort event
    - Clears sort state
    - Calls @request with current page and empty sort
    
    You can still listen to events, but built-in behavior will apply!
  -->
</template>
\`\`\`

### 4. Manual Control with Custom Mode (Advanced)

\`\`\`vue
<script setup>
import { ref } from 'vue';

const isRefreshing = ref(false);

const handleRefresh = async () => {
  isRefreshing.value = true;
  try {
    // Your custom refresh logic
    await fetchData();
    await clearCache();
    // Maybe show a toast notification
  } finally {
    isRefreshing.value = false;
  }
};

const handleResetSort = () => {
  // Your custom reset logic
  customSortState.value = [];
  // Maybe update URL params
  router.push({ query: { ...route.query, sort: undefined } });
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="isRefreshing"
    :toolbar="{
      enabled: true,
      title: 'Custom Control Table',
      actions: {
        refresh: 'custom',      // ONLY emits event, no built-in behavior
        resetSort: 'custom'     // ONLY emits event, no built-in behavior
      }
    }"
    @toolbar:refresh="handleRefresh"
    @toolbar:reset-sort="handleResetSort"
  />
  <!-- 
    With 'custom' mode:
    - Events are emitted
    - NO built-in behavior applied
    - You have full control
  -->
</template>
\`\`\`

### 5. Mixed Mode

\`\`\`vue
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
\`\`\`

### 6. Override Reset Sort Only

\`\`\`vue
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
\`\`\`

## Best Practices

1. **Use automatic mode by default** - Less code, consistent behavior
2. **Use custom mode only when needed** - Special refresh logic, additional actions
3. **Combine with loading state** - Disable controls during operations
4. **Provide clear titles** - Help users understand the table's purpose
5. **Use appropriate export formats** - Match your data type and user needs
`;

