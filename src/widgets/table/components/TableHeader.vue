<script setup lang="ts">
import { computed, inject, type Slot } from "vue";

import type { Column, SortOrder } from "../types";

import VIcon from "@/shared/ui/common/VIcon.vue";

// Inject slots from Table.vue (avoid prop drilling)
const tableSlots = inject<{ headerCellCustomAction?: Slot }>("tableSlots", {});

interface Props {
  column: Column
  label: string
  align?: "left" | "center" | "right"
  columnKey: string
  resizable?: boolean  // Whether column can be resized
  isSorted?: boolean
  sortOrder?: SortOrder | null
  sortIndex?: number  // For multi-sort indicator (0, 1, 2...)
}

const props = withDefaults(defineProps<Props>(), {
  align: "left",
  resizable: true,
  isSorted: false,
  sortOrder: null,
  sortIndex: -1,
});

const emit = defineEmits<{
  "sort-click": []
  "resize-start": [columnKey: string, event: MouseEvent]
  "resize-dblclick": [columnKey: string]
}>();

const sortIcon = computed(() => {
  if (!props.isSorted || !props.sortOrder) return "lucide:arrow-up-down";
  return props.sortOrder === "asc" ? "lucide:arrow-up" : "lucide:arrow-down";
});

const iconClass = computed(() => {
  return props.isSorted ? "sort-icon sort-icon--active" : "sort-icon";
});

const handleSortClick = (event: MouseEvent) => {
  if (props.column.sortable) {
    event.stopPropagation();
    emit("sort-click");
  }
};

const handleHeaderLabelClick = (event: MouseEvent) => {
  // Call custom header click callback if provided
  // This is separate from sort click - only triggers when clicking the label area
  if (props.column.onHeaderClick) {
    event.stopPropagation(); // Prevent event bubbling
    props.column.onHeaderClick({
      column: props.column,
      columnKey: props.columnKey,
      event,
    });
  }
};

const handleResizeStart = (event: MouseEvent) => {
  emit("resize-start", props.columnKey, event);
};

const handleResizeDblClick = () => {
  emit("resize-dblclick", props.columnKey);
};

// Keyboard accessibility for sort icon
const handleSortKeyDown = (event: KeyboardEvent) => {
  if (props.column.sortable && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    emit("sort-click");
  }
};
</script>

<template>
  <div
    class="table-header-cell"
    :class="{
      'table-header-cell--left': align === 'left',
      'table-header-cell--center': align === 'center',
      'table-header-cell--right': align === 'right',
      'table-header-cell--sortable': column.sortable,
      'table-header-cell--clickable': column.onHeaderClick,
    }"
  >
    <div class="table-header-content">
      <!-- Clickable label wrapper - only triggers onHeaderClick when clicking the label area -->
      <div
        class="table-header-label-wrapper"
        :class="{ 'table-header-label-wrapper--clickable': column.onHeaderClick }"
        @click="handleHeaderLabelClick"
      >
        <!-- Slot for custom header content -->
        <slot
          :column="column"
          :is-sorted="isSorted"
          :sort-order="sortOrder"
        >
          <span class="table-header-label">{{ label }}</span>
        </slot>

        <!-- Click indicator - shows when onHeaderClick is provided -->
        <div
          v-if="column.onHeaderClick"
          class="table-header-click-indicator"
          :title="`Click to interact with ${label}`"
        >
          <VIcon
            icon="lucide:mouse-pointer-click"
            :size="14"
            class="click-indicator-icon"
          />
        </div>
      </div>

      <!-- Sort indicator - separate clickable area -->
      <div
        v-if="column.sortable"
        class="table-header-sort"
        role="button"
        :tabindex="0"
        :aria-label="`Sort by ${label}`"
        @click="handleSortClick"
        @keydown="handleSortKeyDown"
      >
        <VIcon
          :icon="sortIcon"
          :class="iconClass"
          :size="16"
        />
      </div>

      <!-- Custom action slot via inject (no prop drilling) -->
      <component
        :is="tableSlots.headerCellCustomAction"
        v-if="tableSlots.headerCellCustomAction"
        :column="column"
      />
    </div>

    <!-- Resize Handle (only for resizable columns) -->
    <div
      v-if="resizable"
      class="table-resize-handle"
      @mousedown.stop="handleResizeStart"
      @dblclick.stop="handleResizeDblClick"
    >
      <!-- Grip indicator -->
      <div class="table-resize-indicator">
        <div class="table-resize-line" />
        <div class="table-resize-line" />
      </div>

      <!-- Divider line -->
      <div class="table-resize-divider" />
    </div>
  </div>
</template>
