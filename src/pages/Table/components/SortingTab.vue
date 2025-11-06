<script setup lang="ts">
import { ref } from "vue";

import Table from "@/widgets/table/Table.vue";
import type { Column, RequestPayload, SortItem } from "@/widgets/table/types";
import { mockDataUsers } from "@/widgets/table/utils/mockData";

// Server-side sorting example
const serverData = ref([...mockDataUsers]);
const serverSortState = ref<SortItem[]>([]);
const serverLoading = ref(false);

const serverColumns: Column[] = [
  { key: "id", label: "ID", width: "80px", sortable: true },
  { key: "name", label: "Name", width: "2fr", sortable: true },
  { key: "email", label: "Email", width: "2fr", sortable: true },
  { key: "age", label: "Age", width: "100px", sortable: true },
  { key: "position", label: "Position", width: "150px", sortable: true },
  { key: "status", label: "Status", width: "120px" },
];

// Simulate server request
const handleServerRequest = async ({ page, pageSize, sort }: RequestPayload) => {
  serverLoading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  console.log("Server request:", { page, pageSize, sort });
};

// Frontend sorting example
const frontData = ref([...mockDataUsers]);
const frontSortState = ref<SortItem[]>([]);

const frontColumns: Column[] = [
  { key: "id", label: "ID", width: "80px", sortable: true },
  { key: "name", label: "Name", width: "2fr", sortable: true },
  { key: "age", label: "Age", width: "100px", sortable: true },
  { key: "position", label: "Position", width: "150px", sortable: true },
];

const handleFrontSort = ({ column, order, sortState }: any) => {
  console.log("Frontend sort:", { column, order, sortState });

  // Apply sorting locally (synchronous - no loader needed)
  let sorted = [...mockDataUsers];

  if (sortState.length > 0) {
    sorted.sort((a, b) => {
      for (const sortItem of sortState) {
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

  frontData.value = sorted;
};

// Single-sort example
const singleData = ref([...mockDataUsers]);
const singleSortState = ref<SortItem[]>([]);
const singleLoading = ref(false);

const singleColumns: Column[] = [
  { key: "name", label: "Name", width: "2fr", sortable: true },
  { key: "email", label: "Email", width: "2fr", sortable: true },
  { key: "position", label: "Position", width: "150px", sortable: true },
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
    <!-- Server-side Multi-Sort -->
    <div class="section">
      <h2 class="section-title">
        Server-side Multi-Sort (default)
      </h2>
      <p class="section-description">
        Click on different columns to add multiple sorts.
        Click same column to cycle: none → asc → desc → none
      </p>
      <div class="section-info">
        <strong>Current sort:</strong>
        <code v-if="serverSortState.length > 0">{{ JSON.stringify(serverSortState) }}</code>
        <span
          v-else
          class="text-muted"
        >No sorting applied</span>
      </div>
      <Table
        v-model:sort-state="serverSortState"
        :columns="serverColumns"
        :data="serverData"
        :loading="serverLoading"
        :page="1"
        :page-size="10"
        height="400px"
        @request="handleServerRequest"
      />
    </div>

    <!-- Frontend Multi-Sort -->
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
      <Table
        v-model:sort-state="frontSortState"
        :columns="frontColumns"
        :data="frontData"
        :sort="{ type: 'front', multiple: true }"
        height="400px"
        @sort="handleFrontSort"
      />
    </div>

    <!-- Single-Sort -->
    <div class="section">
      <h2 class="section-title">
        Single-Sort Mode
      </h2>
      <p class="section-description">
        Only one column can be sorted at a time. Clicking another column replaces the current sort.
      </p>
      <div class="section-info">
        <strong>Current sort:</strong>
        <code v-if="singleSortState.length > 0">{{ JSON.stringify(singleSortState[0]) }}</code>
        <span
          v-else
          class="text-muted"
        >No sorting applied</span>
      </div>
      <Table
        v-model:sort-state="singleSortState"
        :columns="singleColumns"
        :data="singleData"
        :loading="singleLoading"
        :sort="{ type: 'server', multiple: false }"
        height="400px"
        @request="handleSingleRequest"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  font-size: 14px;

  code {
    padding: 4px 8px;
    background-color: var(--bg-tertiary);
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: var(--color-primary);
  }

  .text-muted {
    color: var(--text-tertiary);
    font-style: italic;
  }
}
</style>
