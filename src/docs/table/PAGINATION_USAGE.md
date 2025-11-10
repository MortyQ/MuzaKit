# Table Pagination Usage Guide

## Overview

The Table component supports **server-side pagination only**. Pagination is controlled by the parent component through the `pagination` prop and the `@request` event.

## Key Features

- ✅ Server-side pagination only (controlled)
- ✅ Automatic loading state (all controls disabled during loading)
- ✅ Smart page number display (with ellipsis for many pages)
- ✅ Customizable page size options
- ✅ Optional page size selector
- ✅ Integration with sorting via unified `@request` event
- ✅ 1-based page numbers (user-friendly)
- ✅ Auto-reset to page 1 when changing page size
- ✅ Prevention of multiple clicks during loading

## API

### Props

```typescript
pagination?: {
  page: number                  // Current page (1-based)
  pageSize: number              // Items per page
  total: number                 // Total items count (required)
  pageSizeOptions?: number[]    // Available page sizes (default: [10, 25, 50, 100])
  showSizeChanger?: boolean     // Show page size selector (default: true)
}
```

### Events

Pagination changes are emitted through the unified `@request` event:

```typescript
@request: (payload: RequestPayload) => void

interface RequestPayload {
  page: number          // New page number
  pageSize: number      // Current or new page size
  sort: SortItem[]      // Current sort state
}
```

## Basic Usage

### Simple Pagination

```vue
<script setup lang="ts">
import { ref } from "vue";
import Table from "@/widgets/table/Table.vue";
import type { RequestPayload } from "@/widgets/table/types";

const data = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const currentPageSize = ref(10);
const totalItems = ref(0);

const handleRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  loading.value = true;
  
  // API call
  const response = await api.getUsers({ page, pageSize, sort });
  
  data.value = response.data;
  currentPage.value = page;
  currentPageSize.value = pageSize;
  totalItems.value = response.total;
  loading.value = false;
};

// Initial load
handleRequest({ page: 1, pageSize: 10, sort: [] });
</script>

<template>
  <Table
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination="{
      page: currentPage,
      pageSize: currentPageSize,
      total: totalItems,
    }"
    @request="handleRequest"
  />
</template>
```

### Custom Page Sizes

```vue
<Table
  :pagination="{
    page: currentPage,
    pageSize: currentPageSize,
    total: totalItems,
    pageSizeOptions: [25, 50, 100, 200],
  }"
  @request="handleRequest"
/>
```

### Without Page Size Selector

```vue
<Table
  :pagination="{
    page: currentPage,
    pageSize: 15,
    total: totalItems,
    showSizeChanger: false,
  }"
  @request="handleRequest"
/>
```

### With Sorting

Pagination automatically integrates with sorting through the `@request` event:

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { RequestPayload, SortItem } from "@/widgets/table/types";

const sortState = ref<SortItem[]>([]);

const handleRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  loading.value = true;
  
  // Both pagination and sort are handled in one request
  const response = await api.getUsers({ 
    page, 
    pageSize, 
    sort // Current sort state
  });
  
  data.value = response.data;
  currentPage.value = page;
  currentPageSize.value = pageSize;
  sortState.value = sort;
  totalItems.value = response.total;
  loading.value = false;
};
</script>

<template>
  <Table
    v-model:sort-state="sortState"
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination="{
      page: currentPage,
      pageSize: currentPageSize,
      total: totalItems,
    }"
    @request="handleRequest"
  />
</template>
```

## Behavior

### Page Navigation

- **Previous/Next buttons**: Navigate to adjacent pages
- **Page numbers**: Click to jump directly to that page
- **Ellipsis**: Indicates hidden pages (non-clickable)
- All controls are **disabled** when `loading` is `true`

### Page Size Change

- Changing page size **automatically resets to page 1**
- Prevents confusion with potentially empty pages
- Triggers `@request` event with new pageSize and page=1

### Smart Page Display

The pagination shows a maximum of 7 buttons to keep the UI compact:

- **≤7 pages**: Shows all pages (1, 2, 3, 4, 5, 6, 7)
- **Near start**: 1, 2, 3, 4, ..., last
- **Middle**: 1, ..., current-1, current, current+1, ..., last
- **Near end**: 1, ..., last-3, last-2, last-1, last

### Loading State

When `loading` prop is `true`:

- ✅ All pagination buttons are disabled
- ✅ Page size selector is disabled
- ✅ Prevents multiple simultaneous requests
- ✅ Visual feedback through disabled state

## State Management

### Recommended Pattern

Keep pagination state in the parent component:

```vue
<script setup lang="ts">
const currentPage = ref(1);
const currentPageSize = ref(10);
const totalItems = ref(0);

const handleRequest = async ({ page, pageSize, sort }) => {
  // Update local state after successful request
  currentPage.value = page;
  currentPageSize.value = pageSize;
  // Update data and total...
};
</script>
```

### Why Parent State?

- ✅ Single source of truth
- ✅ Easy to sync with URL query params
- ✅ Simple to persist/restore state
- ✅ Better control over the request flow

## Integration with Sorting

Pagination works seamlessly with sorting:

```vue
<Table
  v-model:sort-state="sortState"
  :pagination="{ page, pageSize, total }"
  @request="handleRequest"
/>
```

When sorting changes, the `@request` event includes:
- **page**: Current page (unchanged)
- **pageSize**: Current page size (unchanged)
- **sort**: New sort state

When pagination changes, the `@request` event includes:
- **page**: New page
- **pageSize**: New or current page size
- **sort**: Current sort state (unchanged)

## Examples

See the "Pagination" tab in the Table examples page for live demonstrations:
- Default pagination (10 items per page)
- Custom page size options
- Without page size selector
- Integration with sorting

## Best Practices

1. **Always set loading state**: Prevents multiple simultaneous requests
2. **Handle errors gracefully**: Don't update state if request fails
3. **Update total on every request**: Total count may change
4. **Reset page when filters change**: Prevents empty results
5. **Use debouncing for search**: Avoid excessive pagination requests

## Common Patterns

### With Search/Filters

```vue
<script setup lang="ts">
const searchQuery = ref("");

const handleSearch = () => {
  // Reset to page 1 when searching
  handleRequest({ 
    page: 1, 
    pageSize: currentPageSize.value, 
    sort: sortState.value 
  });
};

const handleRequest = async ({ page, pageSize, sort }) => {
  const response = await api.getUsers({
    page,
    pageSize,
    sort,
    search: searchQuery.value, // Include search
  });
  // Update state...
};
</script>
```

### URL Sync

```vue
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Initialize from URL
const currentPage = ref(Number(route.query.page) || 1);
const currentPageSize = ref(Number(route.query.pageSize) || 10);

const handleRequest = async ({ page, pageSize, sort }) => {
  // Update URL
  router.push({
    query: { ...route.query, page, pageSize }
  });
  
  // Fetch data...
};
</script>
```

## Troubleshooting

### Pagination not showing

- Check if `pagination` prop is provided
- Ensure `total` is greater than 0
- Verify component is imported correctly

### Controls stay disabled

- Check if `loading` prop is properly set to `false` after request
- Ensure no errors are preventing state update

### Wrong page after size change

- This is expected behavior (auto-reset to page 1)
- Prevents showing empty pages

### Multiple requests firing

- Ensure `loading` state is set immediately when request starts
- Check for duplicate event handlers

