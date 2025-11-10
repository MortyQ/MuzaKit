<script setup lang="ts">
import { computed } from "vue";

import type { Column, SortOrder } from "../types";

import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  column: Column
  label: string
  align?: "left" | "center" | "right"
  columnKey: string
  isSorted?: boolean
  sortOrder?: SortOrder | null
  sortIndex?: number  // For multi-sort indicator (0, 1, 2...)
}

const props = withDefaults(defineProps<Props>(), {
  align: "left",
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
    }"
  >
    <div class="table-header-content">
      <!-- Slot for custom header content -->
      <slot
        :column="column"
        :is-sorted="isSorted"
        :sort-order="sortOrder"
      >
        <span class="table-header-label">{{ label }}</span>
      </slot>

      <!-- Sort indicator - clickable only this part -->
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
    </div>

    <!-- Resize Handle -->
    <div
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
