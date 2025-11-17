<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import type { Column } from "@/widgets/table/types";
import { mockDataVirtualScroll } from "@/widgets/table/utils/mockData";

const STORAGE_KEY = "columnSetupDemo_columns";

// All available columns
const allColumns = ref<Column[]>([
  { key: "id", label: "ID", width: "80px", align: "center" },
  { key: "name", label: "Name", width: "100px" },
  { key: "age", label: "Age", align: "center" },
  { key: "email", label: "Email", width: "100px" },
  { key: "phone", label: "Phone", width: "150px" },
  { key: "position", label: "Position", width: "150px" },
  { key: "status", label: "Status", width: "150px" },
  { key: "performance", label: "Rating" },
  { key: "startDate", label: "Start Date", width: "130px" },
  { key: "projects", label: "Projects", width: "100px" },
  { key: "location", label: "Location", width: "150px" },
  { key: "manager", label: "Manager", width: "180px" },
  { key: "budget", label: "Budget", width: "130px" },
  { key: "revenue", label: "Revenue", width: "130px" },
]);

// Sample data
const tableData = ref([
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8901",
    company: "Acme Corp",
    role: "Senior Developer",
    status: "Active",
    salary: "$120,000",
    department: "Engineering",
    location: "New York",
    joinDate: "2022-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234-567-8902",
    company: "Tech Solutions",
    role: "Product Manager",
    status: "Active",
    salary: "$135,000",
    department: "Product",
    location: "San Francisco",
    joinDate: "2021-06-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1 234-567-8903",
    company: "StartupXYZ",
    role: "Designer",
    status: "On Leave",
    salary: "$95,000",
    department: "Design",
    location: "Austin",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "+1 234-567-8904",
    company: "BigTech Inc",
    role: "Data Scientist",
    status: "Active",
    salary: "$145,000",
    department: "Analytics",
    location: "Seattle",
    joinDate: "2020-09-05",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "+1 234-567-8905",
    company: "Innovation Labs",
    role: "DevOps Engineer",
    status: "Active",
    salary: "$125,000",
    department: "Engineering",
    location: "Denver",
    joinDate: "2022-11-30",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    phone: "+1 234-567-8906",
    company: "Creative Agency",
    role: "Marketing Manager",
    status: "Active",
    salary: "$110,000",
    department: "Marketing",
    location: "Los Angeles",
    joinDate: "2021-04-12",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    phone: "+1 234-567-8907",
    company: "SecureTech",
    role: "Security Analyst",
    status: "Active",
    salary: "$105,000",
    department: "Security",
    location: "Boston",
    joinDate: "2023-01-25",
  },
  {
    id: 8,
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    phone: "+1 234-567-8908",
    company: "FinanceFirst",
    role: "Financial Analyst",
    status: "Active",
    salary: "$98,000",
    department: "Finance",
    location: "Chicago",
    joinDate: "2022-07-18",
  },
]);

// Code example
const codeExample = `<Table
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    title: 'Employee Directory',
    actions: {
      columnSetup: {
        key: 'myTable_columns',
        // type: 'indexedDB' (default)
        allowReorder: true,
        initialVisible: ['id', 'name', 'email']
      }
    }
  }"
/>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="mdi:view-column"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Column Setup
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Give users full control over table columns with
          <strong>drag-and-drop reordering, visibility toggles</strong> and
          <strong>automatic persistence via IndexedDB</strong>.
          Settings are saved automatically and restored on page reload.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:move-horizontal"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Drag & Drop
              </h3>
              <p class="feature-description">
                Reorder columns with smooth animations
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:check-square"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Toggle Visibility
              </h3>
              <p class="feature-description">
                Show/hide columns with checkboxes
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:hard-drive"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Auto Persistence
              </h3>
              <p class="feature-description">
                IndexedDB (default) / localStorage / sessionStorage
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:refresh-cw"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Reset to Default
              </h3>
              <p class="feature-description">
                One-click restore default state
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
            Changes apply only when user clicks "Apply Changes" button!
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
  :columns="columns"
  :data="data"
  :toolbar="{
    enabled: true,
    actions: {
      columnSetup: {
        key: 'myTable_columns'
        // type: 'indexedDB' (default)
      }
    }
  }"
/&gt;</code></pre>
      </div>
    </VCard>

    <!-- Main Demo -->
    <VCard
      title="Interactive Demo"
      class="col-span-full"
    >
      <Table
        :columns="allColumns"
        :data="mockDataVirtualScroll"
        :toolbar="{
          enabled: true,
          title: 'Employee Directory',
          subtitle: 'Manage and customize your view',
          search: true,
          actions: {
            refresh: true,
            resetSort: true,
            columnSetup: STORAGE_KEY
          }
        }"
        height="600px"
      />
    </VCard>

    <!-- Additional Examples -->
    <div class="grid grid-cols-2 gap-5">
      <VCard
        class="col-span-full w-full lg:col-span-1"
        title="With Initial Visible Columns"
      >
        <p class="demo-description">
          You can specify which columns should be visible by default using
          <code>initialVisible</code> property.
        </p>

        <Table
          :columns="allColumns.slice(0, 6)"
          :data="tableData.slice(0, 4)"
          :toolbar="{
            enabled: true,
            title: 'Custom Initial State',
            actions: {
              columnSetup: {
                key: 'demo_initial_visible',
                initialVisible: ['id', 'name', 'email']
              }
            }
          }"
          height="300px"
        />
      </VCard>

      <VCard
        class="col-span-full w-full lg:col-span-1"
        title="Disable Reordering"
      >
        <p class="demo-description">
          Set <code>allowReorder: false</code> to disable drag-and-drop
          and only allow toggling visibility.
        </p>

        <Table
          :columns="allColumns.slice(0, 6)"
          :data="tableData.slice(0, 4)"
          :toolbar="{
            enabled: true,
            title: 'No Drag & Drop',
            actions: {
              columnSetup: {
                key: 'demo_no_reorder',
                allowReorder: false
              }
            }
          }"
          height="300px"
        />
      </VCard>

      <VCard
        class="col-span-full w-full lg:col-span-1"
        title="Session Storage"
      >
        <p class="demo-description">
          Use <code>type: 'sessionStorage'</code> to persist settings only
          for the current browser session.
        </p>

        <Table
          :columns="allColumns.slice(0, 6)"
          :data="tableData.slice(0, 4)"
          :toolbar="{
            enabled: true,
            title: 'Session-based Persistence',
            actions: {
              columnSetup: {
                key: 'demo_session',
                type: 'sessionStorage'
              }
            }
          }"
          height="300px"
        />
      </VCard>

      <VCard
        class="col-span-full w-full lg:col-span-1"
        title="Code Example"
      >
        <div class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>
      </VCard>
    </div>

    <!-- Tips Card -->
    <VCard title="💡 Usage Tips">
      <div class="tips-grid">
        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:move-horizontal"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Drag & Drop
            </h4>
            <p class="tip-description">
              Click and drag columns to reorder them.
              Changes apply when you click "Apply Changes".
            </p>
          </div>
        </div>

        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:check-square"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Toggle Visibility
            </h4>
            <p class="tip-description">
              Use checkboxes to show/hide columns.
              Toggle All checkbox controls all columns at once.
            </p>
          </div>
        </div>

        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:save"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Apply Changes
            </h4>
            <p class="tip-description">
              Click "Apply Changes" button to save and apply your settings.
              Settings are automatically saved to storage.
            </p>
          </div>
        </div>

        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:refresh-cw"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Reset to Default
            </h4>
            <p class="tip-description">
              Use the refresh button to restore default state.
              This clears storage and auto-applies changes.
            </p>
          </div>
        </div>

        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:hard-drive"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Automatic Persistence
            </h4>
            <p class="tip-description">
              Settings are saved to IndexedDB by default and restored on page reload.
              Use localStorage or sessionStorage for alternative storage options.
            </p>
          </div>
        </div>

        <div class="tip-item">
          <div class="tip-icon">
            <VIcon
              icon="lucide:pin"
              :size="20"
            />
          </div>
          <div class="tip-content">
            <h4 class="tip-title">
              Fixed Columns
            </h4>
            <p class="tip-description">
              Columns with fixed positioning show a pin indicator.
              They can still be toggled but maintain their fixed behavior.
            </p>
          </div>
        </div>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Component-specific styles
.demo-header {
  @apply mb-4 flex items-start justify-between gap-4;
}

.demo-description {
  @apply mb-4 text-secondaryText text-sm flex-1;
}

.clear-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-base-100;
  @apply text-sm font-medium text-mainText transition-all duration-200;
  @apply hover:bg-neutral-50 hover:border-neutral-400;
  @apply active:scale-95;

  white-space: nowrap;
}

.tips-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.tip-item {
  @apply flex gap-3 p-4 rounded-lg bg-base-200 border border-neutral-200;
}

.tip-icon {
  @apply flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center;
  @apply bg-primary-100 text-primary-600;
}

.tip-content {
  @apply flex-1;
}

.tip-title {
  @apply text-sm font-semibold text-mainText mb-1;
}

.tip-description {
  @apply text-xs text-secondaryText leading-relaxed;
}

pre {
  @apply bg-base-200 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed;
}

code {
  @apply text-mainText font-mono;
}
</style>

