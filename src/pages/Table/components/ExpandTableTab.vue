<script setup lang="ts">
import { reactive, ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
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
  // All left fixed columns in a row
  { key: "name", label: "Name", width:"150px", sortable: true  },
  { key: "count", label: "Count",width:"100px" },
  { key: "salary", label: "Salary", width:"150px",  sortable: true },
  // Regular scrollable columns
  { key: "email", label: "Email", width:"150px"  },
  { key: "phone", label: "Phone", width:"150px",  sortable: true },
  { key: "position", label: "Position",width:"150px"  },
  { key: "status", label: "Status",width:"150px"  },
  { key: "performance", label: "Rating", width:"150px",  sortable: true },
  { key: "accountStatus", label: "Account Status", width: "200px", interactive: true },
  { key: "startDate", label: "Start Date",width:"150px"  },
  { key: "projects", label: "Projects",width:"150px"  },
  { key: "location", label: "Location",width:"150px"  },
  { key: "manager", label: "Manager",width:"150px"  },
  { key: "budget", label: "Budget",width:"150px"  },
  { key: "revenue", label: "Revenue",width:"150px"   },
  // Right fixed at the end
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
  { label: "Export as CSV", value: "csv", icon: "mdi:file-delimited", loader: loaders.exportLoader },
  { label: "Export as Excel", value: "excel", icon: "mdi:file-excel", loader: loaders.exportLoader },
  { label: "Export as PDF", value: "pdf", icon: "mdi:file-pdf-box", loader: loaders.exportLoader },
]);
// Handlers

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

const exportFunc = (format: string) => {
  loaders.exportLoader = true;
  console.log("EXPORT", format);
};
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:chevrons-down-up"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Expandable Rows
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Display <strong>hierarchical data</strong> with expandable parent-child rows.
          Supports controlled and auto expansion modes with custom content.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:folder-tree"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Hierarchical Data
              </h3>
              <p class="feature-description">
                Parent-child relationships
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:hand"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Controlled Mode
              </h3>
              <p class="feature-description">
                Manual expansion control
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:zap"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Auto Mode
              </h3>
              <p class="feature-description">
                Automatic expansion on click
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:code"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Custom Content
              </h3>
              <p class="feature-description">
                Slots for expanded rows
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
            Click on expand icons to reveal child rows and nested data!
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
          :columns="columns"
          :data="data"
          expand-mode="controlled"
          @expand-click="handleExpand"
        />
</code></pre>
      </div>
    </VCard>

    <Table
      v-model:sort-state="sort"
      v-model:search="search"
      :columns="columnsExpandable"
      :data="serverData"
      :total-row="mockDataExpandableTotalRow"
      expand-mode="controlled"
      :pagination="pagination"
      :loading="serverLoading"
      :toolbar="{
        enabled: true,
        title: 'Expandable Table',
        search: true,
        actions: {
          refresh: true,
          resetSort: true,
          export: 'multi',
        }
      }"
      :export-options="{
        formats: exportFormats,
        selectedOnly: false,
      }"
      @toolbar:export="exportFunc"
      @expand-click="expandAction"
      @request="handleServerRequest"
    >
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

<style scoped lang="scss">
@use "./shared-info-card-styles.scss";
</style>
