<script setup lang="ts">
import TableDocumentationColumns from "@/pages/Table/components/documentation/TableDocumentationColumns.vue";
import TableDocumentationDefault from "@/pages/Table/components/documentation/TableDocumentationDefault.vue";
import TableDocumentationPagination from "@/pages/Table/components/documentation/TableDocumentationPagination.vue";
import TableDocumentationRowStyling from "@/pages/Table/components/documentation/TableDocumentationRowStyling.vue";
import TableDocumentationToolbar from "@/pages/Table/components/documentation/TableDocumentationToolbar.vue";
import VTabs from "@/shared/ui/common/VTabs.vue";

const tabs = [
  {
    id: "getting-started",
    label: "Getting Started",
    component: TableDocumentationDefault,
  },
  {
    id: "columns",
    label: "Columns",
    component: TableDocumentationColumns,
  },
  {
    id: "pagination",
    label: "Pagination",
    component: TableDocumentationPagination,
  },
  {
    id: "toolbar",
    label: "Toolbar",
    component: TableDocumentationToolbar,
  },
  {
    id: "styled",
    label: "Styled Rows & Cells",
    component: TableDocumentationRowStyling,
  },
];
</script>

<template>
  <div class="page-container">
    <VTabs :tabs="tabs">
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
