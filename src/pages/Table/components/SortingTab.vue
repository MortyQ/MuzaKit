<script setup lang="ts">
import { reactive, ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import type { Column, RequestPayload, SortItem } from "@/widgets/table/types";
import { mockDataUsers } from "@/widgets/table/utils/mockData";

// Server-side sorting example
const serverData = ref([...mockDataUsers]);
const serverSortState = ref<SortItem[]>([]);
const serverLoading = ref(false);

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: mockDataUsers.length,
});

// Example: Mix of fixed and flexible widths
// No width = flexible (fills space, NOT resizable)
// With width = fixed (resizable)
const serverColumns: Column[] = [
  { key: "id", label: "ID", width: "80px", sortable: true },
  { key: "name", label: "Name", width:"250px",  sortable: true },        // Flexible
  { key: "email", label: "Email",  width: "250px", sortable: true },      // Flexible
  { key: "age", label: "Age", width: "100px", sortable: true },
  { key: "position", label: "Position", sortable: true }, // Flexible
  { key: "status", label: "Status" },
];

// Simulate server request
const handleServerRequest = async ({ sort, page }: RequestPayload) => {
  serverLoading.value = true;
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  pagination.page = page;
  // Simulate server-side sorting
  let sortedData = [...mockDataUsers];

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


  serverData.value = sortedData;
  serverLoading.value = false;
};

// Frontend sorting example
const frontData = ref([...mockDataUsers]);
const frontSortState = ref<SortItem[]>([]);

// Example: All flexible columns - fill container width equally
const frontColumns: Column[] = [
  { key: "id", label: "ID", width: "80px", sortable: true },
  {
    key: "name",
    label: "Name",
    sortable: true,
    // Default behavior - no sortValue needed for simple string sorting
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
    // Custom sort rule - treat as number
    sortValue: (row: any) => Number(row.age) || 0,
  },
  {
    key: "position",
    label: "Position",
    sortable: true,
    // Custom sort rule - case-insensitive string comparison
    sortValue: (row: any) => String(row.position || "").toLowerCase(),
  },
];

// Single-sort example
const singleData = ref([...mockDataUsers]);
const singleSortState = ref<SortItem[]>([]);
const singleLoading = ref(false);

// Example: All columns flexible - each takes equal space
const singleColumns: Column[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "position", label: "Position", sortable: true },
];

const handleSingleRequest = async ({ sort }: RequestPayload) => {
  singleLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));

  let sorted = [...mockDataUsers];
  if (sort.length > 0) {
    const { column, order } = sort[0];
    sorted.sort((a, b) => {
      const comparison = String(a[column]).localeCompare(String(b[column]), undefined, {
        numeric: true,
      });
      return order === "asc" ? comparison : -comparison;
    });
  }

  singleData.value = sorted;
  singleLoading.value = false;
};
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:arrow-up-down"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Sorting Features
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Demonstrates both
          <strong>
            server-side and client-side sorting
          </strong>
          with multi-column and single-column modes.
          Click column headers to sort data in ascending, descending, or remove sorting.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:server"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Server-Side Sorting
              </h3>
              <p class="feature-description">
                API handles sorting logic
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:monitor"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Client-Side Sorting
              </h3>
              <p class="feature-description">
                Browser handles all sorting
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:layers"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multi-Column Sort
              </h3>
              <p class="feature-description">
                Sort by multiple columns
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:list"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Single-Column Mode
              </h3>
              <p class="feature-description">
                Only one column at a time
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
            Click column headers to cycle: <strong>None → Asc → Desc → None</strong>
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
        <pre><code>&lt;!-- Server-side sorting --&gt;
&lt;Table
  v-model:sort-state="sortState"
  :columns="columns"
  :data="data"
  :loading="loading"
  @request="handleRequest"
/&gt;</code></pre>
      </div>
      <div class="code-block">
        <pre><code>&lt;!-- Client-side sorting --&gt;
&lt;Table
  v-model:sort-state="sortState"
  :columns="columns"
  :data="data"
  :sort="{ type: 'front', multiple: true }"
/&gt;</code></pre>
      </div>
    </VCard>

    <!-- Server-side Multi-Sort -->
    <div class="section">
      <h2 class="section-title">
        Server-side Multi-Sort (default)
      </h2>
      <p class="section-description">
        Click on different columns to add multiple sorts.
        Click same column to cycle: none → asc → desc → none
      </p>

      <Table
        v-model:sort-state="serverSortState"
        :columns="serverColumns"
        :data="serverData"
        :loading="serverLoading"
        height="400px"
        :pagination="pagination"
        @request="handleServerRequest"
      />
    </div>
    <div class="section-info">
      <strong>Current sort:</strong>
      <code v-if="serverSortState.length > 0">{{ JSON.stringify(serverSortState) }}</code>
      <span
        v-else
        class="text-muted"
      >No sorting applied</span>
    </div>
    <!-- Frontend Multi-Sort -->

    <Table
      v-model:sort-state="frontSortState"
      :columns="frontColumns"
      :data="frontData"
      :sort="{ type: 'front', multiple: true }"
      height="400px"
    />
    <div class="section">
      <h2 class="section-title">
        Frontend Multi-Sort
      </h2>
      <p class="section-description">
        Sorting happens on client-side. All data is sorted in browser without API calls.
      </p>
      <div class="section-info">
        <strong>Current sort:</strong>
        <code v-if="frontSortState.length > 0">{{ JSON.stringify(frontSortState) }}</code>
        <span
          v-else
          class="text-muted"
        >No sorting applied</span>
      </div>
    </div>

    <!-- Single-Sort -->

    <Table
      v-model:sort-state="singleSortState"
      :columns="singleColumns"
      :data="singleData"
      :loading="singleLoading"
      :sort="{ type: 'server', multiple: false }"
      height="400px"
      @request="handleSingleRequest"
    />
    <div class="section">
      <h2 class="section-title">
        Single-Sort Mode
      </h2>
      <p class="section-description">
        Only one column can be sorted at a time. Clicking another column replaces the current sort.
      </p>
      <div class="section-info">
        <strong>Current sort:</strong>
        <code v-if="singleSortState.length > 0">{{ JSON.stringify(singleSortState) }}</code>
        <span
          v-else
          class="text-muted"
        >No sorting applied</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "./shared-info-card-styles.scss";
</style>
