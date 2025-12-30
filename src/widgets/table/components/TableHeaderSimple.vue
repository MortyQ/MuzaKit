<script setup lang="ts">
import type { Column } from "../types";

import TableHeader from "./TableHeader.vue";

interface Props {
  columns: Column[]
  // eslint-disable-next-line no-unused-vars
  getColumnClasses: (_column: Column) => string[]
  // eslint-disable-next-line no-unused-vars
  getFixedStyles: (_column: Column) => Record<string, string>
  // eslint-disable-next-line no-unused-vars
  getSortState: (_columnKey: string) => {
    isSorted: boolean
    order: "asc" | "desc" | null
    index: number
  }
  // eslint-disable-next-line no-unused-vars
  isColumnResizable: (_column: Column) => boolean
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "resize-start": [columnKey: string, event: MouseEvent]
  "resize-dblclick": [columnKey: string]
  "sort-click": [column: Column]
}>();

const handleResizeStart = (columnKey: string, event: MouseEvent) => {
  emit("resize-start", columnKey, event);
};

const handleResizeDblClick = (columnKey: string) => {
  emit("resize-dblclick", columnKey);
};

const handleSortClick = (column: Column) => {
  emit("sort-click", column);
};
</script>

<template>
  <!-- Simple header - single level (original implementation) -->
  <div class="table-header-row">
    <!-- Checkbox column header (slot) -->
    <slot name="checkbox-header" />
    <TableHeader
      v-for="column in columns"
      :key="column.key"
      :column="column"
      :label="column.label"
      :align="column.align"
      :column-key="column.key"
      :resizable="props.isColumnResizable(column)"
      :is-sorted="getSortState(column.key).isSorted"
      :sort-order="getSortState(column.key).order"
      :sort-index="getSortState(column.key).index"
      :class="getColumnClasses(column)"
      :style="getFixedStyles(column)"
      @sort-click="handleSortClick(column)"
      @resize-start="handleResizeStart"
      @resize-dblclick="handleResizeDblClick"
    />
  </div>
</template>
