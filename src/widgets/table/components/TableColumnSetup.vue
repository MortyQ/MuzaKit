<script lang="ts" setup>
import { ref, computed, watch } from "vue";

import type { Column } from "../types";
import tableStorage from "../utils/storage";

import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

interface ColumnSetupItem {
  key: string
  label: string
  visible: boolean
  order: number
  fixed?: "left" | "right"
}

interface ColumnSetupConfig {
  enabled?: boolean
  key?: string
  type?: "indexedDB" | "localStorage" | "sessionStorage"
  allowReorder?: boolean
  initialVisible?: string[]
}

interface Props {
  columns: Column[]
  config?: ColumnSetupConfig
}

interface Emits {

  (e: "update:visible-columns", columns: Column[]): void

  (e: "close"): void
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
});

const emit = defineEmits<Emits>();

// Load saved state from storage (async)
const loadFromStorage = async (): Promise<{
  visible: string[]
  order: string[]
  fixed?: Record<string, "left" | "right">
} | null> => {
  if (!props.config?.key) return null;

  try {
    // Set storage type if specified, otherwise use default (indexedDB)
    if (props.config.type) {
      tableStorage.setStorageType(props.config.type);
    }

    const saved = await tableStorage.getTableConfig<{
      visible: string[]
      order: string[]
      fixed?: Record<string, "left" | "right">
    }>(props.config.key);

    return saved;
  }
  catch (error) {
    console.error("Failed to load column setup from storage:", error);
    return null;
  }
};

// Save state to storage (async)
const saveToStorage = async (setupItems: ColumnSetupItem[]) => {
  if (!props.config?.key) return;

  try {
    // Build fixed map (only save columns that are fixed)
    const fixed: Record<string, "left" | "right"> = {};
    setupItems.forEach((item) => {
      if (item.fixed) {
        fixed[item.key] = item.fixed;
      }
    });

    const state = {
      visible: setupItems.filter((item) => item.visible).map((item) => item.key),
      order: setupItems.map((item) => item.key),
      fixed: Object.keys(fixed).length > 0 ? fixed : undefined, // Only save if there are fixed columns
    };

    await tableStorage.setTableConfig(props.config.key, state);
  }
  catch (error) {
    console.error("Failed to save column setup to storage:", error);
  }
};

// Flatten columns to handle grouped headers
const flattenColumns = (columns: Column[]): Column[] => {
  return columns.reduce((acc, col) => {
    if (col.children && col.children.length > 0) {
      return [...acc, ...flattenColumns(col.children)];
    }
    return [...acc, col];
  }, [] as Column[]);
};

// Create setup items from columns
const createSetupItems = (savedState?: {
  visible: string[]
  order: string[]
  fixed?: Record<string, "left" | "right">
} | null): ColumnSetupItem[] => {
  const flatCols = flattenColumns(props.columns);

  // If we have saved state, use it
  if (savedState) {
    const { visible, order, fixed: savedFixed } = savedState;

    // Create a map for quick lookup
    const colMap = new Map(flatCols.map((col) => [col.key, col]));

    // Build items based on saved order
    const setupItems: ColumnSetupItem[] = [];

    // First, add columns in saved order
    order.forEach((key, index) => {
      const col = colMap.get(key);
      if (col) {
        setupItems.push({
          key: col.key,
          label: col.label,
          visible: visible.includes(key),
          order: index,
          fixed: savedFixed?.[key] || col.fixed, // Use saved fixed state, fallback to column's fixed
        });
        colMap.delete(key);
      }
    });

    // Then add any new columns that weren't in saved state
    colMap.forEach((col) => {
      setupItems.push({
        key: col.key,
        label: col.label,
        visible: true,
        order: setupItems.length,
        fixed: col.fixed,
      });
    });

    return setupItems;
  }

  // No saved state, use initial config or show all columns by default
  const initialVisible = props.config?.initialVisible;

  return flatCols.map((col, index) => ({
    key: col.key,
    label: col.label,
    // If initialVisible is provided, check if column is in the list
    // If not provided, all columns are visible by default
    visible: initialVisible ? initialVisible.includes(col.key) : true,
    order: index,
    fixed: col.fixed,
  }));
};

// Internal state
const items = ref<ColumnSetupItem[]>(createSetupItems());

// Track if changes were made
const hasChanges = ref(false);

// Original state for comparison
const originalItems = ref<ColumnSetupItem[]>(JSON.parse(JSON.stringify(createSetupItems())));

// Load from storage asynchronously
loadFromStorage().then((savedState) => {
  if (savedState) {
    const loaded = createSetupItems(savedState);
    items.value = loaded;
    originalItems.value = JSON.parse(JSON.stringify(loaded));
  }
});

// Check if there are unsaved changes
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(items.value) !== JSON.stringify(originalItems.value);
});

// Emit visible columns to parent
const emitVisibleColumns = () => {
  const flatCols = flattenColumns(props.columns);
  const visibleItems = items.value.filter((item) => item.visible).sort((a, b) => a.order - b.order);

  const visibleCols = visibleItems
    .map((item) => {
      const col = flatCols.find((c) => c.key === item.key);
      if (!col) return null;

      // Apply fixed state from item to column
      return {
        ...col,
        fixed: item.fixed,
      };
    })
    .filter(Boolean) as Column[];

  emit("update:visible-columns", visibleCols);
};

// Watch for changes to track modifications (but don't emit)
watch(
  items,
  () => {
    hasChanges.value = true;
  },
  { deep: true },
);

// Apply changes handler
const handleApply = () => {
  saveToStorage(items.value);
  emitVisibleColumns();
  originalItems.value = JSON.parse(JSON.stringify(items.value));
  hasChanges.value = false;
  emit("close");
};

// Check if all visible or all hidden
const allVisible = computed(() => items.value.every((item) => item.visible));
const allHidden = computed(() => items.value.every((item) => !item.visible));
const someVisible = computed(() => !allVisible.value && !allHidden.value);

// Drag state
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
const listRef = ref<HTMLElement | null>(null);
const autoScrollInterval = ref<number | null>(null);

// Auto-scroll when dragging near edges
const handleAutoScroll = (event: DragEvent) => {
  if (!listRef.value) return;

  const listRect = listRef.value.getBoundingClientRect();
  const mouseY = event.clientY;
  const scrollThreshold = 50; // pixels from edge to trigger scroll
  const scrollSpeed = 10; // pixels per interval

  // Check if near top edge
  if (mouseY < listRect.top + scrollThreshold && mouseY > listRect.top) {
    if (!autoScrollInterval.value) {
      autoScrollInterval.value = window.setInterval(() => {
        if (listRef.value && listRef.value.scrollTop > 0) {
          listRef.value.scrollTop -= scrollSpeed;
        }
      }, 16); // ~60fps
    }
  }
  // Check if near bottom edge
  else if (mouseY > listRect.bottom - scrollThreshold && mouseY < listRect.bottom) {
    if (!autoScrollInterval.value) {
      autoScrollInterval.value = window.setInterval(() => {
        if (listRef.value) {
          const maxScroll = listRef.value.scrollHeight - listRef.value.clientHeight;
          if (listRef.value.scrollTop < maxScroll) {
            listRef.value.scrollTop += scrollSpeed;
          }
        }
      }, 16);
    }
  }
  // Stop auto-scroll if not near edges
  else {
    stopAutoScroll();
  }
};

const stopAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
    autoScrollInterval.value = null;
  }
};

// Drag handlers
const handleDragStart = (index: number, event: DragEvent) => {
  if (props.config?.allowReorder === false) return;

  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", "");
  }
};

const handleDragOver = (index: number, event: DragEvent) => {
  if (props.config?.allowReorder === false) return;

  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  dragOverIndex.value = index;

  // Trigger auto-scroll if near edges
  handleAutoScroll(event);
};

const handleDragLeave = () => {
  dragOverIndex.value = null;
};

const handleDrop = (toIndex: number, event: DragEvent) => {
  if (props.config?.allowReorder === false) return;

  event.preventDefault();
  stopAutoScroll(); // Stop auto-scroll on drop

  if (draggedIndex.value === null || draggedIndex.value === toIndex) {
    draggedIndex.value = null;
    dragOverIndex.value = null;
    return;
  }

  // Reorder
  const newItems = [...items.value];
  const [movedItem] = newItems.splice(draggedIndex.value, 1);
  newItems.splice(toIndex, 0, movedItem);

  // Update order values
  newItems.forEach((item, index) => {
    item.order = index;
  });

  items.value = newItems;

  // Validate fixed columns after reorder
  validateFixedColumns();

  draggedIndex.value = null;
  dragOverIndex.value = null;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
  dragOverIndex.value = null;
  stopAutoScroll();
};

// Toggle handlers
const handleToggle = (key: string) => {
  const item = items.value.find((item) => item.key === key);
  if (item) {
    item.visible = !item.visible;
  }
};

const handleToggleAll = () => {
  const newValue = !allVisible.value;
  items.value.forEach((item) => {
    item.visible = newValue;
  });
};

// Fixed column handlers
const canBeFixed = (index: number): boolean => {
  // Only first 2 positions can be fixed
  return index === 0 || index === 1;
};

const isFixedLeft = (item: ColumnSetupItem): boolean => {
  return item.fixed === "left";
};

const toggleFixed = (index: number) => {
  if (!canBeFixed(index)) return;

  const item = items.value[index];
  if (!item) return;

  // Toggle fixed state
  if (item.fixed === "left") {
    item.fixed = undefined;
  }
  else {
    item.fixed = "left";
  }
};

// Validate fixed columns after reorder
const validateFixedColumns = () => {
  items.value.forEach((item, index) => {
    // If column is fixed but not in first 2 positions, remove fixed
    if (item.fixed === "left" && !canBeFixed(index)) {
      item.fixed = undefined;
    }
  });
};

const handleReset = async () => {
  // Clear storage on reset
  if (props.config?.key) {
    try {
      await tableStorage.deleteTableConfig(props.config.key);
    }
    catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }
  items.value = createSetupItems();

  // Auto-apply reset changes
  emitVisibleColumns();
  originalItems.value = JSON.parse(JSON.stringify(items.value));
  hasChanges.value = false;

  // Close popover after reset
  emit("close");
};
</script>

<template>
  <div class="column-setup">
    <!-- Header with actions -->
    <div class="column-setup-header">
      <div class="column-setup-title">
        <VIcon
          icon="lucide:table-2"
          size="small"
        />
        <span>Column Settings</span>
      </div>
      <VButton
        icon="mdi:refresh"
        size="small"
        variant="default"
        @click="handleReset"
      />
    </div>

    <!-- Toggle all checkbox -->
    <div class="column-setup-toggle-all">
      <VCheckbox
        :indeterminate="someVisible"
        :model-value="allVisible"
        label="Toggle All"
        @update:model-value="handleToggleAll"
      />
    </div>

    <!-- Column list with drag-and-drop -->
    <div
      ref="listRef"
      class="column-setup-list"
    >
      <div
        v-for="(item, index) in items"
        :key="item.key"
        :class="{
          'column-setup-item--dragging': draggedIndex === index,
          'column-setup-item--drag-over': dragOverIndex === index,
          'column-setup-item--fixed': item.fixed,
          'column-setup-item--no-reorder': config?.allowReorder === false,
        }"
        :draggable="config?.allowReorder !== false"
        class="column-setup-item"
        @dragend="handleDragEnd"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver(index, $event)"
        @dragstart="handleDragStart(index, $event)"
        @drop="handleDrop(index, $event)"
      >
        <!-- Drag handle -->
        <div
          v-if="config?.allowReorder !== false"
          class="column-setup-item-drag"
        >
          <VIcon
            icon="mdi:drag-vertical"
            size="small"
          />
        </div>

        <!-- Checkbox -->
        <div class="column-setup-item-checkbox">
          <VCheckbox
            :model-value="item.visible"
            @update:model-value="handleToggle(item.key)"
          />
        </div>

        <!-- Label -->
        <div class="column-setup-item-label">
          {{ item.label }}
        </div>

        <!-- Fixed toggle button (only for first 2 positions) -->
        <button
          v-if="canBeFixed(index)"
          :class="{ 'column-setup-item-fixed-btn--active': isFixedLeft(item) }"
          :title="isFixedLeft(item) ? 'Unpin column' : 'Pin column to left'"
          class="column-setup-item-fixed-btn"
          @click.stop="toggleFixed(index)"
        >
          <VIcon
            :icon="isFixedLeft(item) ? 'mdi:pin' : 'mdi:pin-outline'"
            :size="16"
          />
        </button>

        <!-- Fixed indicator badge (when fixed but position > 1) -->
        <div
          v-if="item.fixed && !canBeFixed(index)"
          class="column-setup-item-badge column-setup-item-badge--warning"
          title="Fixed will be removed - move to top 2 positions"
        >
          <VIcon
            icon="mdi:alert"
            size="small"
          />
        </div>
      </div>
    </div>

    <!-- Footer with hint and apply button -->
    <div class="column-setup-footer">
      <span
        v-if="config?.allowReorder !== false"
        class="column-setup-hint"
      >
        <VIcon
          icon="mdi:information-outline"
          size="small"
        />
        Drag to reorder • Pin first 2 columns
      </span>

      <VButton
        :disabled="!hasUnsavedChanges"
        size="small"
        text="Apply Changes"
        variant="primary"
        @click="handleApply"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.column-setup {
  width: 100%;
  max-width: 360px;
  max-height: min(500px, 70vh);
  display: flex;
  flex-direction: column;
  background: var(--color-base-100, #ffffff);
  border: 1px solid var(--color-card-border, #e2e8f0);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
  @apply bg-base-100;

  @media (max-width: 400px) {
    max-width: 100%;
    max-height: 60vh;
    border-radius: 8px;
  }
}

.column-setup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-neutral-200, #e2e8f0);
  background: var(--color-base-200, #f8fafc);
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;

  @media (max-width: 400px) {
    padding: 10px 12px;
    border-radius: 8px 8px 0 0;
  }
}

.column-setup-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;

  @media (max-width: 400px) {
    font-size: 13px;
    gap: 6px;
  }
}

.column-setup-toggle-all {
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-neutral-200);
  background: var(--color-base-100);
  flex-shrink: 0;

  @media (max-width: 400px) {
    padding: 8px 12px;
  }
}

.column-setup-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: var(--color-base-200);
  min-height: 0;

  @media (max-width: 400px) {
    padding: 6px;
  }

  /* Modern scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-neutral-300);
    border-radius: 10px;
    border: 1px solid transparent;
    background-clip: padding-box;

    &:hover {
      background: var(--color-neutral-400);
      background-clip: padding-box;
    }
  }
}

.column-setup-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: var(--radius-lg);
  cursor: move;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  background: var(--color-base-100);

  @media (max-width: 400px) {
    padding: 6px 8px;
    gap: 6px;
    margin-bottom: 3px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: var(--color-neutral-50);
    border-color: var(--color-neutral-200);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  &--dragging {
    opacity: 0.6;
    cursor: grabbing;
    transform: scale(1.02);
    box-shadow: 0 4px 8px -2px rgb(0 0 0 / 0.1);
  }

  &--drag-over {
    border-color: var(--color-primary-500);
    background: var(--color-primary-50);
    box-shadow: 0 0 0 2px var(--color-primary-500);
  }

  &--fixed {
    .column-setup-item-label {
      opacity: 0.7;
      font-style: italic;
    }
  }

  &--no-reorder {
    cursor: default;

    &:hover {
      transform: none;
    }
  }
}

.column-setup-item-drag {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  cursor: grab;
  opacity: 0.5;
  transition: opacity 0.15s ease;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }
}

.column-setup-item-checkbox {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.column-setup-item-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  user-select: none;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;

  @media (max-width: 400px) {
    font-size: 12px;
  }
}

.column-setup-item-fixed-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  background: var(--color-base-100);
  color: var(--color-neutral-500);
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--color-neutral-50);
    border-color: var(--color-neutral-300);
    color: var(--color-primary-500);
  }

  &--active {
    background: var(--color-primary-50);
    border-color: var(--color-primary-500);
    color: var(--color-primary-600);

    &:hover {
      background: var(--color-primary-100);
    }
  }
}

.column-setup-item-badge {
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;

  &--warning {
    background: var(--color-warning-100);
    color: var(--color-warning-700);
  }
}

.column-setup-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-neutral-200, #e2e8f0);
  background: var(--color-base-200, #f8fafc);
  border-radius: 0 0 12px 12px;
  flex-shrink: 0;

  @media (max-width: 400px) {
    padding: 10px 12px;
    flex-direction: column;
    gap: 10px;
    border-radius: 0 0 8px 8px;
  }
}

.column-setup-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  flex: 1;
  letter-spacing: -0.01em;

  @media (max-width: 400px) {
    font-size: 10px;
    text-align: center;
    justify-content: center;
  }
}

/* Animation for list items - simplified for better performance */
.column-setup-item {
  animation: fadeIn 0.2s ease backwards;

  @for $i from 1 through 15 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.02}s;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
