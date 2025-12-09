<script setup lang="ts">
import { reactive, ref } from "vue";

import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";
import Table from "@/widgets/table/Table.vue";
import { Column, type RequestPayload } from "@/widgets/table/types";
import { mockDataExpandable, mockDataExpandableTotalRow } from "@/widgets/table/utils/mockData";

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: mockDataExpandable.length,
});

const search = ref("");
const sort = ref([]);
const serverData = ref([...mockDataExpandable]);
const serverLoading = ref(false);

const loaders = reactive({
  exportLoader: false,
});

const columnsExpandable: Column[] = [
  { key: "name", label: "Name", width:"150px", sortable: true  },
  { key: "count", label: "Count",width:"100px" },
  { key: "salary", label: "Salary", format: { currency: true }, width:"150px",  sortable: true },
  { key: "email", label: "Email", width:"150px"  },
  { key: "phone", label: "Phone", width:"150px",  sortable: true },
  { key: "position", label: "Position",width:"150px"  },
  { key: "status", label: "Status",width:"150px"  },
  { key: "performance", label: "Rating", width:"150px",  sortable: true },
  { key: "accountStatus", label: "Account Status", width: "200px", interactive: true },
  { key: "startDate", label: "Start Date", format: { date: "long" }, width:"150px"  },
  { key: "projects", label: "Projects",width:"150px"  },
  { key: "location", label: "Location",width:"150px"  },
  { key: "manager", label: "Manager",width:"150px"  },
  { key: "budget", label: "Budget", format: { currency: true }, width:"150px"  },
  { key: "revenue", label: "Revenue", format: { currency: true }, width:"150px"   },
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

const exportFormats = ref([
  { label: "Export as CSV", value: "csv", icon: "mdi:file-delimited", loading: loaders.exportLoader },
  { label: "Export as Excel", value: "excel", icon: "mdi:file-excel", loading: loaders.exportLoader },
  { label: "Export as PDF", value: "pdf", icon: "mdi:file-pdf-box", loading: loaders.exportLoader },
]);

const handleServerRequest = async ({ sort, page }: RequestPayload) => {
  serverLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));

  pagination.page = page;
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

const exportFunc = (format: string) => {
  loaders.exportLoader = true;
  console.log("EXPORT", format);
};
</script>

<template>
  <Table
    v-model:sort-state="sort"
    v-model:search="search"
    :columns="columnsExpandable"
    :data="serverData"
    :total-row="mockDataExpandableTotalRow"
    :pagination="pagination"
    :loading="serverLoading"
    height="50vh"
    :row-height="73"
    :toolbar="{
      enabled: true,
      title: 'Dashboard Table',
      search: true,
      actions: {
        refresh: true,
        resetSort: true,
        export: 'multi',
        columnSetup: 'dashboard-table-column-setup',
      }
    }"
    :export-options="{
      formats: exportFormats,
      selectedOnly: false,
    }"
    @toolbar:export="exportFunc"
    @request="handleServerRequest"
  >
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
</template>

<style scoped lang="scss">

</style>
