<script setup lang="ts">
import { ref } from "vue";

import Table from "@/widgets/table/Table.vue";
import type { Column, RequestPayload, SortItem } from "@/widgets/table/types";

// Generate large dataset for realistic pagination
const generateLargeDataset = (count: number) => {
  const positions = ["Developer", "Designer", "Manager", "Analyst", "Engineer"];
  const statuses = ["Active", "Inactive", "Pending"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 50),
    position: positions[i % positions.length],
    status: statuses[i % statuses.length],
  }));
};

const fullDataset = generateLargeDataset(243); // 243 items for interesting pagination

// Server-side pagination state
const serverData = ref<any[]>([]);
const serverLoading = ref(false);
const currentPage = ref(1);
const currentPageSize = ref(10);
const totalItems = ref(fullDataset.length);
const sortState = ref<SortItem[]>([]);

const columns: Column[] = [
  { key: "id", label: "ID", width: "80px", sortable: true },
  { key: "name", label: "Name", width: "150px", sortable: true },
  { key: "email", label: "Email", width: "150px", sortable: true },
  { key: "age", label: "Age", width: "100px", sortable: true },
  { key: "position", label: "Position", sortable: true },
  { key: "status", label: "Status" },
];

// Simulate server request with pagination and sorting
const handleServerRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  serverLoading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Apply sorting
  let sortedData = [...fullDataset];
  if (sort.length > 0) {
    sortedData.sort((a, b) => {
      for (const sortItem of sort) {
        const aValue = a[sortItem.column];
        const bValue = b[sortItem.column];

        if (aValue === bValue) continue;

        const comparison = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
        });

        return sortItem.order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  // Apply pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Update state
  serverData.value = sortedData.slice(start, end);
  currentPage.value = page;
  currentPageSize.value = pageSize;
  sortState.value = sort;
  serverLoading.value = false;
};

// Initial load
handleServerRequest({ page: 1, pageSize: 10, sort: [] });

// Different page size example
const serverData2 = ref<any[]>([]);
const serverLoading2 = ref(false);
const currentPage2 = ref(1);
const currentPageSize2 = ref(25);
const sortState2 = ref<SortItem[]>([]);

const handleServerRequest2 = async ({ page, pageSize, sort }: RequestPayload) => {
  serverLoading2.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));

  let sortedData = [...fullDataset];
  if (sort.length > 0) {
    sortedData.sort((a, b) => {
      for (const sortItem of sort) {
        const aValue = a[sortItem.column];
        const bValue = b[sortItem.column];
        if (aValue === bValue) continue;
        const comparison = String(aValue).localeCompare(String(bValue),
          undefined, { numeric: true });
        return sortItem.order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  serverData2.value = sortedData.slice(start, end);
  currentPage2.value = page;
  currentPageSize2.value = pageSize;
  sortState2.value = sort;
  serverLoading2.value = false;
};

handleServerRequest2({ page: 1, pageSize: 25, sort: [] });

// Without size changer example
const serverData3 = ref<any[]>([]);
const serverLoading3 = ref(false);
const currentPage3 = ref(1);
const currentPageSize3 = ref(15);
const sortState3 = ref<SortItem[]>([]);

const handleServerRequest3 = async ({ page, pageSize, sort }: RequestPayload) => {
  serverLoading3.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));

  let sortedData = [...fullDataset];
  if (sort.length > 0) {
    sortedData.sort((a, b) => {
      for (const sortItem of sort) {
        const aValue = a[sortItem.column];
        const bValue = b[sortItem.column];
        if (aValue === bValue) continue;
        const comparison = String(aValue).localeCompare(String(bValue),
          undefined, { numeric: true });
        return sortItem.order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  serverData3.value = sortedData.slice(start, end);
  currentPage3.value = page;
  currentPageSize3.value = pageSize;
  sortState3.value = sort;
  serverLoading3.value = false;
};

handleServerRequest3({ page: 1, pageSize: 15, sort: [] });
</script>

<template>
  <div class="page-container gap-5">
    <!-- Default Pagination -->
    <div class="section">
      <h2 class="section-title">
        Server-side Pagination (Default)
      </h2>
      <p class="section-description">
        Standard pagination with 10 items per page. All controls are disabled during loading.
        Total: {{ totalItems }} items.
      </p>

      <Table
        v-model:sort-state="sortState"
        :columns="columns"
        :data="serverData"
        :loading="serverLoading"
        :pagination="{
          page: currentPage,
          pageSize: currentPageSize,
          total: totalItems,
        }"
        height="500px"
        @request="handleServerRequest"
      />
    </div>

    <div class="section-info">
      <strong>Current state:</strong>
      <code>
        Page: {{ currentPage }}, Size: {{ currentPageSize }},
        Sort: {{ sortState.length > 0 ? JSON.stringify(sortState) : 'none' }}
      </code>
    </div>

    <!-- Custom Page Sizes -->
    <div class="section">
      <h2 class="section-title">
        Custom Page Size Options
      </h2>
      <p class="section-description">
        Pagination starting with 25 items per page. Custom page size options: [25, 50, 100, 200].
      </p>

      <Table
        v-model:sort-state="sortState2"
        :columns="columns"
        :data="serverData2"
        :loading="serverLoading2"
        :pagination="{
          page: currentPage2,
          pageSize: currentPageSize2,
          total: totalItems,
          pageSizeOptions: [25, 50, 100, 200],
        }"
        height="500px"
        @request="handleServerRequest2"
      />
    </div>

    <!-- Without Size Changer -->
    <div class="section">
      <h2 class="section-title">
        Without Page Size Selector
      </h2>
      <p class="section-description">
        Fixed page size (15 items). Size selector is hidden.
      </p>

      <Table
        v-model:sort-state="sortState3"
        :columns="columns"
        :data="serverData3"
        :loading="serverLoading3"
        :pagination="{
          page: currentPage3,
          pageSize: currentPageSize3,
          total: totalItems,
          showSizeChanger: false,
        }"
        height="500px"
        @request="handleServerRequest3"
      />
    </div>

    <!-- Info Section -->
    <div class="section">
      <h2 class="section-title">
        Features
      </h2>
      <ul class="feature-list">
        <li>✅ Server-side pagination only (controlled by parent)</li>
        <li>✅ Disabled state during loading (prevents multiple clicks)</li>
        <li>✅ Smart page number display (shows ellipsis for many pages)</li>
        <li>✅ Integrates with sorting via @request event</li>
        <li>✅ Customizable page size options</li>
        <li>✅ Optional page size selector</li>
        <li>✅ 1-based page numbers (user-friendly)</li>
        <li>✅ Auto-reset to page 1 when changing page size</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: theme('colors.mainText');
  margin: 0;
}

.section-description {
  color: theme('colors.secondaryText');
  margin: 0;
}

.section-info {
  padding: 1rem;
  background: theme('colors.cardBg');
  border: 1px solid theme('colors.cardBorder');
  border-radius: 8px;
  font-size: 0.9rem;
}

.section-info code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: color-mix(in srgb, theme('colors.cardBorder') 20%, transparent 80%);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: theme('colors.mainText');
}


.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-list li {
  color: theme('colors.mainText');
  padding: 0.5rem;
  background: theme('colors.cardBg');
  border: 1px solid theme('colors.cardBorder');
  border-radius: 4px;
}

.gap-5 {
  gap: 2.5rem;
}
</style>

