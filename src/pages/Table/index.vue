<script setup lang="ts">
import ColumnSetupTab from "@/pages/Table/components/ColumnSetupTab.vue";
import DefaultTablesTab from "@/pages/Table/components/DefaultTablesTab.vue";
import ExpandTableTab from "@/pages/Table/components/ExpandTableTab.vue";
import FixedColumnsTestTab from "@/pages/Table/components/FixedColumnsTestTab.vue";
import FormattersTab from "@/pages/Table/components/FormattersTab.vue";
import GroupedHeadersTab from "@/pages/Table/components/GroupedHeadersTab.vue";
import LargeFlatDataTable from "@/pages/Table/components/LargeFlatDataTable.vue";
import PaginationTab from "@/pages/Table/components/PaginationTab.vue";
import SelectionTab from "@/pages/Table/components/SelectionTab.vue";
import SortingTab from "@/pages/Table/components/SortingTab.vue";
import ToolbarTab from "@/pages/Table/components/ToolbarTab.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  { id: "expand", label: "Expand Table", component: ExpandTableTab },
  { id: "default", label: "Simple Tables", component: DefaultTablesTab },
  { id: "large-flat-data", label: "Large Data Table", component: LargeFlatDataTable },
  { id: "toolbar", label: "Toolbar", component: ToolbarTab },
  { id: "column-setup", label: "Column Setup", component: ColumnSetupTab },
  { id: "sorting", label: "Sorting", component: SortingTab },
  { id: "pagination", label: "Pagination", component: PaginationTab },
  { id: "formatters", label: "Formatters", component: FormattersTab },
  { id: "fixed", label: "Fixed Columns", component: FixedColumnsTestTab },
  { id: "grouped", label: "Grouped Headers", component: GroupedHeadersTab },
  { id: "selection", label: "Multi-Select", component: SelectionTab },
];
</script>

<template>
  <div class="page-container">
    <VTabs
      :tabs="tabs"
    >
      <template
        v-for="tab in tabs"
        :key="tab.id"
        #[tab.id]
      >
        <component
          :is="tab.component"
          v-if="tab.component"
        />
      </template>
    </VTabs>
  </div>
</template>
