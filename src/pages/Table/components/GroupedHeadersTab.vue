<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import TableToolbar from "@/widgets/table/components/TableToolbar.vue";
import type { Column } from "@/widgets/table/types";
import { mockDataExpandable, mockDataUsersTotalRow } from "@/widgets/table/utils/mockData";
import Table from "@/widgets/table/VTable.vue";

// Columns with grouped headers (AG-Grid style)
const columnsGrouped: Column[] = [
  // Group 1: Personal Information
  {
    key: "personal",
    label: "Personal Information",
    align: "center",
    children: [
      { key: "id", label: "ID", width: "80px", align: "center", fixed: "left" },
      { key: "name", label: "Full Name", width: "200px", fixed: "left" },
      { key: "age", label: "Age", width: "100px", align: "left", fixed: "left" },
    ],
  },
  { key: "startDate", label: "Start Date", width: "130px" },

  // Group 2: Contact Details
  {
    key: "contact",
    label: "Contact Details",
    align: "center",
    children: [
      { key: "email", label: "Email Address", width: "250px" },
      { key: "phone", label: "Phone Number", width: "150px" },
    ],
  },

  // Group 3: Work Information
  {
    key: "work",
    label: "Work Information",
    align: "center",
    children: [
      { key: "position", label: "Position", width: "150px" },
      { key: "status", label: "Status", width: "120px" },
      { key: "manager", label: "Manager", width: "180px" },
    ],
  },

  // Group 4: Performance Metrics
  {
    key: "performance",
    label: "Performance Metrics",
    align: "center",
    children: [
      { key: "performance", label: "Rating", width: "100px", align: "center" },
      { key: "projects", label: "Projects", width: "100px", align: "center" },
    ],
  },

  // Single columns without group
  { key: "location", label: "Location", width: "150px" },
];
</script>

<template>
  <div class="page-container flex flex-col gap-6">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:group"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Grouped Headers
        </h2>
      </div>
      <div class="info-content">
        <p class="info-description">
          Use <strong>column groups</strong> to visually organize related columns.
          Each parent can define label, alignment and contain child column definitions.
          Supports mixing grouped and single columns and works with fixed (pinned) columns.
        </p>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:layout-grid"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Nested Groups
              </h3>
              <p class="feature-description">
                Combine groups and standalone columns
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:align-center"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Alignment
              </h3>
              <p class="feature-description">
                Set group header alignment
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:pin"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Pinned Support
              </h3>
              <p class="feature-description">
                Works with left/right fixed columns
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:columns"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Mixed Layout
              </h3>
              <p class="feature-description">
                Groups plus normal columns
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
            Define a parent column with
            <code>children: Column[]</code>
            to create a grouped header row.
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
        <pre><code>const columns = [
  {
    key: 'personal',
    label: 'Personal Info',
    children: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' }
    ]
  },
  {
    key: 'contact',
    label: 'Contact',
    children: [
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' }
    ]
  }
]</code></pre>
      </div>
    </VCard>

    <Table
      :columns="columnsGrouped"
      :data="mockDataExpandable"
      :total-row="mockDataUsersTotalRow"
      height="60vh"
    >
      <template #toolbar>
        <TableToolbar />
      </template>
      <!-- Custom cell rendering examples -->
      <template #cell-status="{ value }">
        <span
          class="px-2 py-1 rounded text-xs font-semibold"
          :class="{
            'bg-green-500/20 text-green-600': value === 'Active',
            'bg-yellow-500/20 text-yellow-600': value === 'Away',
            'bg-red-500/20 text-red-600': value === 'Inactive',
          }"
        >
          {{ value }}
        </span>
      </template>

      <!-- Total row slots -->
      <template #total-cell-name="{ value }">
        <span class="text-accent font-bold uppercase">
          {{ value }}
        </span>
      </template>
      <template #total-cell-performance="{ value }">
        <span class="text-warning font-bold">
          ⭐ {{ value }}
        </span>
      </template>
      <template #total-cell-projects="{ value }">
        <span class="text-info font-bold">
          {{ value }} total
        </span>
      </template>
    </Table>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>
