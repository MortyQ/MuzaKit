<script setup lang="ts">
import { ref } from "vue";

import VAccordion from "@/shared/ui/common/VAccordion.vue";
import type { AccordionItem } from "@/shared/ui/common/VAccordion.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import type { Column } from "@/widgets/table/types";

// Sample data
const toolbarData = ref([
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
]);

// Columns configuration
const columns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

// Search state
const searchQuery = ref("");

// Export loading states
const exportFormats = ref([
  { label: "Export as CSV", value: "csv", icon: "mdi:file-delimited", loader: false },
  { label: "Export as Excel", value: "excel", icon: "mdi:file-excel", loader: false },
  { label: "Export as PDF", value: "pdf", icon: "mdi:file-pdf-box", loader: false },
]);

// Loading state
const isRefreshing = ref(false);

// Handlers
const handleRefresh = async () => {
  console.log("Custom refresh with additional logic");
  isRefreshing.value = true;

  // Simulate custom refresh logic
  await new Promise((resolve) => setTimeout(resolve, 1000));

  isRefreshing.value = false;
  alert("Data refreshed with custom logic!");
};

const handleResetSort = () => {
  console.log("Custom reset sort clicked");
  alert("Sort reset with custom logic!");
};

const handleExport = (format: string, selectedOnly?: boolean) => {
  console.log(`Export clicked: ${format}, selectedOnly: ${selectedOnly}`);

  // Find format and set loading
  const exportFormat = exportFormats.value.find((f) => f.value === format);
  if (exportFormat) {
    exportFormat.loader = true;

    // Simulate export
    setTimeout(() => {
      exportFormat.loader = false;
      alert(`Exported as ${format.toUpperCase()}`);
    }, 2000);
  }
};

// Accordion items for toolbar features
const toolbarItems: AccordionItem[] = [
  {
    id: "auto-refresh",
    title: "Automatic Refresh & Reset",
    subtitle: "Built-in behavior for refresh and sort reset - no event listeners needed",
    icon: "lucide:refresh-cw",
  },
  {
    id: "custom-handlers",
    title: "Custom Event Handlers",
    subtitle: "Full control with manual event listeners using 'custom' mode",
    icon: "lucide:settings",
  },
  {
    id: "multi-export",
    title: "Multi-Format Export",
    subtitle: "Multiple export options with loading states",
    icon: "lucide:download",
  },
  {
    id: "minimal",
    title: "Minimal Toolbar",
    subtitle: "Simple toolbar with just title and refresh button",
    icon: "lucide:minimize-2",
  },
  {
    id: "code-example",
    title: "Code Example",
    subtitle: "Complete implementation example with all features",
    icon: "lucide:code-2",
  },
];

const openToolbarSections = ref<(string | number)[]>(["auto-refresh"]);

// Code example
const codeExample = `<Table
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    title: 'Users Management',
    subtitle: 'Manage your team members',
    search: true,
    actions: {
      // Refresh modes:
      // - true/'default': Built-in behavior (resets sort & pagination)
      // - 'custom': Only emits event, no built-in behavior
      refresh: true, // or 'custom'

      // Reset sort modes:
      // - true/'default': Built-in behavior (clears sort state)
      // - 'custom': Only emits event, no built-in behavior
      resetSort: true, // or 'custom'

      export: 'single', // or 'multi'
    },
  }"
  :export-options="{
    formats: [
      { label: 'CSV', value: 'csv', icon: 'mdi:file-delimited' },
      { label: 'Excel', value: 'excel', icon: 'mdi:file-excel' },
    ],
  }"
  v-model:search="searchQuery"
  @toolbar:refresh="handleRefresh"
  @toolbar:reset-sort="handleResetSort"
  @toolbar:export="handleExport"
/>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:wrench"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Toolbar Features
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Add powerful toolbar controls to your tables with
          <strong>search, refresh, export</strong> and more.
          Choose between automatic behavior or custom handlers for full control.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:search"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Search Integration
              </h3>
              <p class="feature-description">
                Built-in search with v-model
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:refresh-cw"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Refresh & Reset
              </h3>
              <p class="feature-description">
                Auto or custom behavior
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:download"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Export Options
              </h3>
              <p class="feature-description">
                Single or multi-format export
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:sliders"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Flexible Config
              </h3>
              <p class="feature-description">
                Title, subtitle, custom actions
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
            Use automatic mode for quick setup or custom handlers for advanced control!
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
        <pre><code>&lt;Table
  v-model:search="searchQuery"
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    title: 'Users Management',
    search: true,
    actions: {
      refresh: true,
      resetSort: true,
      export: 'single'
    }
  }"
  @toolbar:export="handleExport"
/&gt;</code></pre>
      </div>
    </VCard>

    <!-- Toolbar Features Accordion -->
    <VAccordion
      v-model="openToolbarSections"
      :items="toolbarItems"
      variant="outlined"
      multiple
    >
      <!-- Automatic Refresh & Reset -->
      <template #content-auto-refresh>
        <div class="accordion-content">
          <p class="section-description">
            Toolbar with automatic behavior: refresh resets sort & pagination,
            reset sort only clears sort. No event listeners needed!
          </p>
          <Table
            v-model:search="searchQuery"
            :columns="columns"
            :data="toolbarData"
            :toolbar="{
              enabled: true,
              title: 'Users Management',
              subtitle: 'Automatic reset behavior',
              search: true,
              actions: {
                refresh: true,
                resetSort: true,
                export: 'single',
              },
            }"
            @toolbar:export="handleExport"
          />
        </div>
      </template>

      <!-- Custom Event Handlers -->
      <template #content-custom-handlers>
        <div class="accordion-content">
          <p class="section-description">
            Toolbar with custom event handlers -
            you have full control over refresh and reset behavior.
            Use 'custom' mode to disable built-in behavior.
          </p>
          <Table
            v-model:search="searchQuery"
            :columns="columns"
            :data="toolbarData"
            :toolbar="{
              enabled: true,
              title: 'Custom Handlers',
              subtitle: 'With manual event listeners',
              search: true,
              actions: {
                refresh: 'custom',
                resetSort: 'custom',
                export: 'single',
              },
            }"
            :loading="isRefreshing"
            @toolbar:refresh="handleRefresh"
            @toolbar:reset-sort="handleResetSort"
            @toolbar:export="handleExport"
          />
        </div>
      </template>

      <!-- Multi-Format Export -->
      <template #content-multi-export>
        <div class="accordion-content">
          <p class="section-description">
            Toolbar with multiple export options and loading states
          </p>
          <Table
            v-model:search="searchQuery"
            :columns="columns"
            :data="toolbarData"
            :toolbar="{
              enabled: true,
              title: 'Export Demo',
              subtitle: 'Choose your export format',
              search: { placeholder: 'Search users...' },
              actions: {
                refresh: true,
                export: 'multi',
              },
            }"
            :export-options="{
              formats: exportFormats,
              selectedOnly: false,
            }"
            @toolbar:refresh="handleRefresh"
            @toolbar:export="handleExport"
          />
        </div>
      </template>

      <!-- Minimal Toolbar -->
      <template #content-minimal>
        <div class="accordion-content">
          <p class="section-description">
            Minimal toolbar with just title and refresh
          </p>
          <Table
            :columns="columns"
            :data="toolbarData"
            :toolbar="{
              enabled: true,
              title: 'Minimal Example',
              actions: {
                refresh: true,
              },
            }"
            @toolbar:refresh="handleRefresh"
          />
        </div>
      </template>

      <!-- Code Example -->
      <template #content-code-example>
        <div class="accordion-content">
          <div class="code-block">
            <pre><code>{{ codeExample }}</code></pre>
          </div>
        </div>
      </template>
    </VAccordion>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Component-specific styles
.page-container {
  @apply flex flex-col;
}

.section-description {
  @apply m-0 mb-4 text-sm text-secondaryText leading-relaxed;
}

.accordion-content {
  @apply flex flex-col gap-4 p-6;
}

.code-block {
  @apply mt-4 p-4 bg-base-200 rounded-lg;

  pre {
    @apply overflow-x-auto text-sm leading-relaxed;
  }

  code {
    @apply text-mainText font-mono text-xs;
  }
}
</style>
