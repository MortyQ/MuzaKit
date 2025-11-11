<script setup lang="ts">
import { computed } from "vue";

import type { ExportOptions, ToolbarConfig } from "../types/toolbar";

import VButton from "@/shared/ui/common/VButton.vue";
import VDropdown from "@/shared/ui/common/VDropdown.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VLoader from "@/shared/ui/common/VLoader.vue";
import VSearch from "@/shared/ui/common/VSearch.vue";


interface Props {
  config?: ToolbarConfig;
  exportOptions?: ExportOptions;
  search?: string;
}

interface Emits {
  // eslint-disable-next-line no-unused-vars
  (e: "update:search", value: string): void;
  // eslint-disable-next-line no-unused-vars
  (e: "refresh"): void;
  // eslint-disable-next-line no-unused-vars
  (e: "reset-sort"): void;
  // eslint-disable-next-line no-unused-vars
  (e: "export", format: string, selectedOnly?: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  config: undefined,
  exportOptions: undefined,
  search: "",
});

const emit = defineEmits<Emits>();

// Local search model for v-model
const searchModel = computed({
  get: () => props.search,
  set: (value: string) => emit("update:search", value),
});


// Search configuration
const searchConfig = computed(() => {
  if (!props.config?.search) return null;
  if (typeof props.config.search === "boolean") {
    return { placeholder: "Search..." };
  }
  return props.config.search;
});

// Check if export is loading
const isExportLoading = computed(() => props.exportOptions?.loading || false);

// Get export formats
const exportFormats = computed(() => props.exportOptions?.formats || []);

// Check if any format is loading
const isAnyFormatLoading = computed(() => {
  return exportFormats.value.some((format) => format.loader);
});

// Handlers
const handleRefresh = () => {
  emit("refresh");
};

const handleResetSort = () => {
  emit("reset-sort");
};

const handleExport = (value: string | number) => {
  emit("export", String(value), props.exportOptions?.selectedOnly);
};

const handleSingleExport = () => {
  // Default format for single export
  emit("export", "csv", props.exportOptions?.selectedOnly);
};
</script>

<template>
  <div class="toolbar toolbar--split">
    <!-- Left section -->
    <div class="toolbar-split-left">
      <!-- Title section -->
      <slot name="title">
        <div v-if="config?.title">
          <h3 class="toolbar-title">
            {{ config.title }}
          </h3>
          <p
            v-if="config.subtitle"
            class="toolbar-subtitle"
          >
            {{ config.subtitle }}
          </p>
        </div>
      </slot>

      <!-- Search section -->
      <slot name="search">
        <div
          v-if="searchConfig"
          class="toolbar-search-split"
        >
          <VSearch
            v-model="searchModel"
            :placeholder="searchConfig.placeholder"
          />
        </div>
      </slot>
    </div>

    <!-- Right section - Actions -->
    <div class="toolbar-split-right">
      <slot name="actions">
        <!-- Refresh button -->
        <VButton
          v-if="config?.actions?.refresh"
          variant="default"
          icon="mdi:refresh"
          @click="handleRefresh"
        />

        <!-- Reset sort button -->
        <VButton
          v-if="config?.actions?.resetSort"
          variant="default"
          icon="mdi:sort-variant-remove"
          text="Reset Sort"
          @click="handleResetSort"
        />

        <!-- Single Export button -->
        <VButton
          v-if="config?.actions?.export === 'single'"
          variant="primary"
          icon="mdi:download"
          text="Export"
          :loading="isExportLoading"
          :disabled="isExportLoading"
          @click="handleSingleExport"
        />

        <!-- Multi Export dropdown -->
        <VDropdown
          v-if="config?.actions?.export === 'multi'"
          :items="exportFormats"
          placement="bottom-right"
          @select="handleExport"
        >
          <template #trigger>
            <VButton
              variant="primary"
              icon="mdi:download"
              text="Export"
              :loader="isAnyFormatLoading"
            />
          </template>

          <template #item-icon="{ item }">
            <VIcon
              v-if="item.icon"
              :icon="item.icon"
              size="small"
            />
          </template>

          <template #item-loader="{ item }">
            <VLoader
              v-if="item.loader"
              variant="primary"
              size="small"
            />
          </template>
        </VDropdown>
      </slot>
    </div>
  </div>
</template>
