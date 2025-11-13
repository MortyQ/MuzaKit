<script setup lang="ts">
import type { Column, HeaderCell } from "../types";
import TableHeader from "./TableHeader.vue";
import TableHeaderGroup from "./TableHeaderGroup.vue";

interface Props {
  columns: HeaderCell[][]  // Multi-level header structure
  // eslint-disable-next-line no-unused-vars
  getColumnClasses: (_column: Column) => string[]
  // eslint-disable-next-line no-unused-vars
  getFixedStyles: (_column: Column) => Record<string, string>
  // eslint-disable-next-line no-unused-vars
  getGroupWidth: (_column: Column) => number
  // eslint-disable-next-line no-unused-vars
  getGroupFixedStyles: (_column: Column) => Record<string, string>
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
  <!-- Grouped headers - multi-level support -->
  <div
    v-for="(level, levelIndex) in columns"
    :key="`header-level-${levelIndex}`"
    class="table-header-row"
    :class="`table-header-row-level-${levelIndex}`"
  >
    <!-- Checkbox column header (slot) - only in first level -->
    <slot
      v-if="levelIndex === 0"
      name="checkbox-header"
    />

    <!-- Render cells in this level -->
    <template
      v-for="cell in level"
      :key="cell.key"
    >
      <!-- Group header (has children) - no sorting -->
      <TableHeaderGroup
        v-if="cell.isGroup"
        :cell="cell"
        :group-width="getGroupWidth(cell.column)"
        :class="getColumnClasses(cell.column)"
        :style="{
          gridColumn: `span ${cell.colspan}`,
          gridRow: cell.rowspan > 1 ? `span ${cell.rowspan}` : undefined,
          ...getGroupFixedStyles(cell.column),
        }"
      />

      <!-- Leaf header (no children) - with sorting and resize -->
      <TableHeader
        v-else
        :column="cell.column"
        :label="cell.label"
        :align="cell.column.align"
        :column-key="cell.column.key"
        :resizable="props.isColumnResizable(cell.column)"
        :is-sorted="getSortState(cell.column.key).isSorted"
        :sort-order="getSortState(cell.column.key).order"
        :sort-index="getSortState(cell.column.key).index"
        :class="[
          getColumnClasses(cell.column),
          {
            'table-header-cell--grouped': levelIndex > 0,
            'table-header-cell--rowspan': cell.rowspan > 1
          }
        ]"
        :style="{
          gridRow: cell.rowspan > 1 ? `span ${cell.rowspan}` : undefined,
          ...getFixedStyles(cell.column),
        }"
        @sort-click="handleSortClick(cell.column)"
        @resize-start="handleResizeStart"
        @resize-dblclick="handleResizeDblClick"
      >
        <!--        <template #default="slotProps">-->
        <!--          <slot-->
        <!--            :name="`header-${cell.column.key}`"-->
        <!--            v-bind="slotProps"-->
        <!--          />-->
        <!--        </template>-->
      </TableHeader>
    </template>
  </div>
</template>
