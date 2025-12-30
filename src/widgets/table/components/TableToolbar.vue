<script setup lang="ts">
import { computed } from "vue";

import type { ToolbarConfig } from "../types/toolbar";

import VButton from "@/shared/ui/common/VButton.vue";
import VFloating from "@/shared/ui/common/VFloating.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VInput from "@/shared/ui/common/VInput.vue";
import VLoader from "@/shared/ui/common/VLoader.vue";

interface Props {
  config?: ToolbarConfig
  search?: string
}

interface Emits {

  (e: "update:search", value: string): void

  (e: "refresh"): void

  (e: "reset-sort"): void

  (e: "export", format: string, selectedOnly?: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  config: undefined,
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

// Export configuration from toolbar.actions.export
const exportConfig = computed(() => {
  const exportAction = props.config?.actions?.export;

  // Disabled
  if (!exportAction || !exportAction) {
    return null;
  }

  // Full object configuration
  if (typeof exportAction === "object") {
    return {
      mode: exportAction.mode,
      formats: exportAction.formats || [],
      selectedOnly: exportAction.selectedOnly ?? false,
      loading: exportAction.loading ?? false,
    };
  }

  // Shorthand: 'single' or 'multi' string
  return {
    mode: exportAction,
    formats: [],
    selectedOnly: false,
    loading: false,
  };
});

// Check if export is enabled
const isExportEnabled = computed(() => exportConfig.value !== null);

// Check if export is loading
const isExportLoading = computed(() => exportConfig.value?.loading || false);

// Get export formats
const exportFormats = computed(() => exportConfig.value?.formats || []);

// Check if any format is loading
const isAnyFormatLoading = computed(() => {
  return exportFormats.value.some((format) => format.loading);
});

// Export mode
const exportMode = computed(() => exportConfig.value?.mode);

// Handlers
const handleRefresh = () => {
  emit("refresh");
};

const handleResetSort = () => {
  emit("reset-sort");
};

const handleExport = (value: string | number) => {
  emit("export", String(value), exportConfig.value?.selectedOnly);
};

const handleSingleExport = () => {
  // Default format for single export
  emit("export", "csv", exportConfig.value?.selectedOnly);
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
          <VInput
            v-model="searchModel"
            type="search"
            debounce
            :placeholder="searchConfig.placeholder"
          />
        </div>
      </slot>
    </div>

    <!-- Right section - Actions -->
    <div class="toolbar-split-right">
      <slot name="actions" />
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
        v-if="isExportEnabled && exportMode === 'single'"
        variant="primary"
        icon="mdi:download"
        text="Export"
        :loading="isExportLoading"
        :disabled="isExportLoading"
        @click="handleSingleExport"
      />

      <!-- Multi Export dropdown -->
      <VFloating
        v-if="isExportEnabled && exportMode === 'multi'"
        :items="exportFormats"
        placement="bottom-right"
        @select="handleExport"
      >
        <template #trigger>
          <VButton
            variant="primary"
            icon="mdi:download"
            text="Export"
            :loading="isAnyFormatLoading"
          />
        </template>

        <template #icon="{ icon }">
          <VIcon
            :icon="icon"
            size="small"
          />
        </template>

        <template #item-loader="{ item }">
          <VLoader
            v-if="item.loading"
            variant="primary"
            size="small"
          />
        </template>
      </VFloating>

      <!-- Column Setup slot -->
      <slot
        v-if="config?.actions?.columnSetup"
        name="column-setup"
      />
    </div>
  </div>
</template>
