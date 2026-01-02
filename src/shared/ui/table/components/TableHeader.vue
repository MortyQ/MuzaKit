<script lang="ts" setup>
import { computed, inject, type Slot } from "vue";

import type { Column, SortOrder } from "../types";

import VIcon from "@/shared/ui/common/VIcon.vue";
import VTooltip from "@/shared/ui/common/VTooltip.vue";

// Inject slots from Table.vue (avoid prop drilling)
const tableSlots = inject<{ headerCellCustomAction?: Slot }>("tableSlots", {});

interface Props {
  column: Column
  label: string
  align?: "left" | "center" | "right"
  columnKey: string
  resizable?: boolean // Whether column can be resized
  isSorted?: boolean
  sortOrder?: SortOrder | null
  sortIndex?: number // For multi-sort indicator (0, 1, 2...)
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
    :class="{
      'table-header-cell--left': align === 'left',
      'table-header-cell--center': align === 'center',
      'table-header-cell--right': align === 'right',
      'table-header-cell--sortable': column.sortable,
      'table-header-cell--clickable': column.onHeaderClick,
    }"
    class="table-header-cell"
  >
    <div class="table-header-content">
      <!-- Clickable label wrapper - only triggers onHeaderClick when clicking the label area -->
      <div
        :class="{ 'table-header-label-wrapper--clickable': column.onHeaderClick }"
        class="table-header-label-wrapper"
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

        <!-- Info Tooltip -->
        <VTooltip
          v-if="column.tooltip"
          :text="column.tooltip"
          placement="top"
          tooltip-class="bg-cardBg opacity-1 w-[300px]"
        >
          <VIcon
            :size="14"
            class="table-header-info-icon"
            icon="lucide:info"
          />
        </VTooltip>

        <!-- Click indicator - shows when onHeaderClick is provided -->
        <div
          v-if="column.onHeaderClick"
          :title="`Click to interact with ${label}`"
          class="table-header-click-indicator"
        >
          <VIcon
            :size="14"
            class="click-indicator-icon"
            icon="lucide:mouse-pointer-click"
          />
        </div>
      </div>

      <!-- Sort indicator - separate clickable area -->
      <div
        v-if="column.sortable"
        :aria-label="`Sort by ${label}`"
        :tabindex="0"
        class="table-header-sort"
        role="button"
        @click="handleSortClick"
        @keydown="handleSortKeyDown"
      >
        <VIcon
          :class="iconClass"
          :icon="sortIcon"
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

<style scoped>
.table-header-info-icon {
  color: #9ca3af;
  cursor: help;
  flex-shrink: 0;
  margin-left: 4px;
  transition: color 0.15s ease;
}

.table-header-info-icon:hover {
  color: #3b82f6;
}
</style>
