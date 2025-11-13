<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
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
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:book-open"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Server-Side Pagination
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Demonstrates <strong>server-side pagination</strong> with smart
          controls and seamless sorting integration.
          All pagination is controlled by the parent component with
          automatic loading states.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:list"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Smart Page Display
              </h3>
              <p class="feature-description">
                Ellipsis for large page counts
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:loader"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Loading States
              </h3>
              <p class="feature-description">
                Auto-disable during requests
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:settings"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Page Size Options
              </h3>
              <p class="feature-description">
                Customizable sizes [10, 25, 50...]
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:arrow-up-down"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Sorting Integration
              </h3>
              <p class="feature-description">
                Unified @request event
              </p>
            </div>
          </div>
        </div>

        <div class="info-note">
          <VIcon
            icon="lucide:info"
            :size="16"
          />
          <span>
            Total dataset: <strong>243 items</strong>.
            Try different page sizes and sorting combinations!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Code Example -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📝 Quick Start
      </h3>
      <div class="code-block">
        <pre><code>&lt;Table
  v-model:sort-state="sortState"
  :columns="columns"
  :data="data"
  :loading="loading"
  :pagination="{
    page: currentPage,
    pageSize: currentPageSize,
    total: totalItems
  }"
  @request="handleRequest"
/&gt;</code></pre>
      </div>
    </VCard>

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
  </div>
</template>

<style scoped lang="scss">
@use "./shared-info-card-styles.scss";
</style>

