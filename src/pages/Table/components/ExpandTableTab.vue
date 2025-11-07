<script setup lang="ts">
import { reactive, ref } from "vue";

import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";
import Table from "@/widgets/table/Table.vue";
import TableToolbar from "@/widgets/table/components/TableToolbar.vue";
import { Column, type RequestPayload } from "@/widgets/table/types";
import { mockDataExpandable, mockDataExpandableTotalRow } from "@/widgets/table/utils/mockData";

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: mockDataExpandable.length,
});

const serverData = ref([...mockDataExpandable]);
const serverLoading = ref(false);

const columnsExpandable: Column[] = [
  // All left fixed columns in a row
  { key: "name", label: "Name", sortable: true  },
  { key: "count", label: "Count"  },
  { key: "salary", label: "Salary", sortable: true },
  // Regular scrollable columns
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone", sortable: true },
  { key: "position", label: "Position" },
  { key: "status", label: "Status" },
  { key: "performance", label: "Rating", sortable: true },
  { key: "startDate", label: "Start Date" },
  { key: "projects", label: "Projects" },
  { key: "location", label: "Location" },
  { key: "manager", label: "Manager" },
  { key: "budget", label: "Budget" },
  { key: "revenue", label: "Revenue"  },
  // Right fixed at the end
  { key: "accountStatus", label: "Account Status", width: "200px", interactive: true },
];

const accountStatusList = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Block",
    value: "block",
  },
];

const handleServerRequest = async ({ sort, page }: RequestPayload) => {
  serverLoading.value = true;
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  pagination.page = page;
  // Simulate server-side sorting
  let sortedData = [...mockDataExpandable];

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

const expandAction = ({ callback }) => {
  callback();
};
</script>

<template>
  <div class="page-container">
    <Table
      :columns="columnsExpandable"
      :data="serverData"
      :total-row="mockDataExpandableTotalRow"
      expand-mode="controlled"
      :pagination="pagination"
      :loading="serverLoading"
      @expand-click="expandAction"
      @request="handleServerRequest"
    >
      <template #toolbar>
        <TableToolbar />
      </template>

      <template #cell-status="{depth, value}">
        TEXT  TEXT  TEXT  TEXT {{ value }}: {{ depth }}
      </template>
      <template #cell-accountStatus>
        <VMultiSelect
          :options="accountStatusList"
          label="label"
          placeholder="Account Status"
          :searchable="false"
        />
      </template>

      <!-- Total row slots with custom formatting -->
      <template #total-cell-name="{ value }">
        <span class="text-accent font-bold uppercase">
          {{ value }}
        </span>
      </template>
      <template #total-cell-salary="{ value }">
        <span class="text-positive font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
      <template #total-cell-budget="{ value }">
        <span class="text-info font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
      <template #total-cell-revenue="{ value }">
        <span class="text-positive font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
    </Table>
  </div>
</template>
