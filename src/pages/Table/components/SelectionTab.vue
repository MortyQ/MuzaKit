<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import type { Column, ExpandableRow, MultiSelectConfig } from "@/shared/ui/table/types";
import { mockDataExpandable, mockDataExpandableTotalRow } from "@/shared/ui/table/utils/mockData";
import Table from "@/shared/ui/table/VTable.vue";

const columns: Column[] = [
  // All left fixed columns in a row
  { key: "name", label: "Name" },
  { key: "count", label: "Count" },
  { key: "salary", label: "Salary" },
  // Regular scrollable columns
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "position", label: "Position" },
  { key: "status", label: "Status" },
  { key: "performance", label: "Rating" },
  { key: "startDate", label: "Start Date" },
  { key: "projects", label: "Projects" },
  { key: "location", label: "Location" },
  { key: "manager", label: "Manager" },
  { key: "budget", label: "Budget" },
  { key: "revenue", label: "Revenue" },
  // Right fixed at the end
];

// Selected rows state
const selectedRows = ref<ExpandableRow[]>([]);

// Multi-select configurations
const independentConfig = ref<MultiSelectConfig>({
  enabled: true,
  selectionMode: "independent",
});

const dependentConfig = ref<MultiSelectConfig>({
  enabled: true,
  selectionMode: "dependent",
  selectChildren: true,
  selectParent: true,
});

// Current config
const currentMode = ref<"independent" | "dependent">("independent");
const currentConfig = ref(independentConfig.value);
const showHeaderCheckbox = ref(true);

const switchMode = (mode: "independent" | "dependent") => {
  currentMode.value = mode;
  const baseConfig = mode === "independent" ? independentConfig.value : dependentConfig.value;
  currentConfig.value = {
    ...baseConfig,
    showHeaderCheckbox: showHeaderCheckbox.value,
  };
  selectedRows.value = []; // Clear selection on mode change
};

const toggleHeaderCheckbox = () => {
  currentConfig.value = {
    ...currentConfig.value,
    showHeaderCheckbox: showHeaderCheckbox.value,
  };
};
</script>

<template>
  <div class="selection-demo">
    <!-- Info Card -->
    <VCard class="mb-6">
      <div class="info-header">
        <VIcon
          icon="lucide:check-square"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Row Selection
        </h2>
      </div>
      <div class="info-content">
        <p class="info-description">
          Two selection strategies: <strong>independent</strong>
          (rows act alone) and <strong>dependent</strong>
          (parent ↔ children linkage). Toggle header checkbox visibility
          and access current selection via <code>v-model:selected-rows</code>.
        </p>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:mouse-pointer-click"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multi-Select
              </h3>
              <p class="feature-description">
                Checkbox selection with binding
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:git-branch"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Dependent Mode
              </h3>
              <p class="feature-description">
                Parent auto selects children
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:split"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Independent Mode
              </h3>
              <p class="feature-description">
                Full manual control
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:list-checks"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Header Checkbox
              </h3>
              <p class="feature-description">
                Toggle select-all visibility
              </p>
            </div>
          </div>
        </div>
        <div class="info-note">
          <VIcon
            icon="lucide:info"
            :size="16"
          />
          <span>
            Switch modes to compare behaviors.
            Clearing selection on mode change prevents inconsistent state.
          </span>
        </div>
      </div>
    </VCard>

    <!-- Code Example -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📝 Quick Start
      </h3>
      <div class="code-block">
        <pre><code>&lt;!-- Independent Mode --&gt;
&lt;Table
  v-model:selected-rows="selectedRows"
  :columns="columns"
  :data="data"
  :multi-select="{
    enabled: true,
    selectionMode: 'independent'
  }"
/&gt;</code></pre>
      </div>
      <div class="code-block">
        <pre><code>&lt;!-- Dependent Mode (Parent-Child) --&gt;
&lt;Table
  v-model:selected-rows="selectedRows"
  :columns="columns"
  :data="data"
  :multi-select="{
    enabled: true,
    selectionMode: 'dependent',
    selectChildren: true,
    selectParent: true
  }"
/&gt;</code></pre>
      </div>
    </VCard>

    <div class="demo-header">
      <h2>Multi-Select Demo</h2>

      <div class="mode-switcher">
        <button
          :class="{ active: currentMode === 'independent' }"
          @click="switchMode('independent')"
        >
          Independent Mode
        </button>
        <button
          :class="{ active: currentMode === 'dependent' }"
          @click="switchMode('dependent')"
        >
          Dependent Mode (Parent-Child)
        </button>
      </div>

      <div class="header-checkbox-toggle">
        Configuration:
        <code class="pl-5">
          {{ currentConfig }}
        </code>
      </div>
      <div class="header-checkbox-toggle">
        <label>
          <VCheckbox
            v-model="showHeaderCheckbox"
            @change="toggleHeaderCheckbox"
          />
          Show Header Checkbox
        </label>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-2">
      <Table
        v-model:selected-rows="selectedRows"
        :columns="columns"
        :data="mockDataExpandable"
        :multi-select="currentConfig"
        :height="400"
        class="col-span-3"
        :total-row="mockDataExpandableTotalRow"
      />

      <div class=" col-span-2 flex flex-col gap-2">
        <div class="mode-description">
          <template v-if="currentMode === 'independent'">
            <strong>Independent Mode:</strong> Each row can be selected independently.
            Selecting a parent doesn't affect children.
          </template>
          <template v-else>
            <strong>Dependent Mode:</strong> Selecting a parent automatically selects all children.
            Selecting all children automatically selects the parent.
          </template>
        </div>

        <div class="info-panel">
          <h3>Selected Rows: {{ selectedRows.length }}</h3>
          <div
            v-if="selectedRows.length > 0"
            class="selected-list"
          >
            <div
              v-for="row in selectedRows"
              :key="row.id"
              class="selected-item"
            >
              {{ row.name }} (ID: {{ row.id }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Component-specific styles
.selection-demo {
  @apply flex flex-col gap-5;
}

.demo-header {
  @apply mb-5;
}

.demo-header h2 {
  @apply mb-4 text-2xl font-semibold;
}

.mode-switcher {
  @apply flex gap-3 mb-4;
}

.mode-switcher button {
  @apply px-4 py-2 border border-cardBorder rounded-lg bg-cardBg cursor-pointer
  transition-all duration-200;
}

.mode-switcher button:hover {
  @apply bg-base-200;
}

.mode-switcher button.active {
  @apply bg-primary text-white border-primary;
}

.header-checkbox-toggle {
  @apply flex items-center px-3 py-2 bg-base-200 border
  border-cardBorder rounded-lg mb-4;
}

.header-checkbox-toggle label {
  @apply flex items-center gap-2 cursor-pointer text-sm font-medium;
}

.info-panel {
  @apply bg-cardBg border border-cardBorder rounded-lg p-4 mb-4;
}

.info-panel h3 {
  @apply mb-3 text-base font-semibold;
}

.selected-list {
  @apply flex flex-col gap-2;
}

.selected-item {
  @apply px-3 py-2 bg-base-100 border border-cardBorder rounded text-sm;
}

.mode-description {
  @apply px-3 py-3 bg-info/10 border-l-4 border-info rounded text-sm leading-relaxed;
}
</style>
