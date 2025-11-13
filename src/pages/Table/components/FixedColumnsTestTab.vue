<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import TableToolbar from "@/widgets/table/components/TableToolbar.vue";
import { Column } from "@/widgets/table/types";
import { mockDataUsers, mockDataUsersTotalRow } from "@/widgets/table/utils/mockData";

const columnsGood: Column[] = [
  { key: "id", label: "ID", width: "80px", align: "center", fixed: "left" },
  { key: "name", label: "Name", width: "200px", fixed: "left" },
  { key: "age", label: "Age", width: "100px", align: "center" },
  { key: "email", label: "Email", width: "250px" },
  { key: "phone", label: "Phone", width: "150px" },
  { key: "position", label: "Position", width: "150px" },
  { key: "status", label: "Status", width: "150px" },
  { key: "performance", label: "Rating", width: "100px" },
  { key: "startDate", label: "Start Date", width: "130px" },
  { key: "projects", label: "Projects", width: "100px" },
  { key: "location", label: "Location", width: "150px" },
  { key: "manager", label: "Manager", width: "180px" },
  { key: "budget", label: "Budget", width: "130px" },
  { key: "revenue", label: "Revenue", width: "130px" },
  { key: "salary", label: "Salary", width: "120px", fixed: "right" },
];

const columnsBad: Column[] = [
  { key: "id", label: "ID", width: "80px", align: "center", fixed: "left" },
  { key: "age", label: "Age", width: "100px", align: "center" }, // Normal between fixed
  { key: "name", label: "Name", width: "200px" }, // Another fixed after normal
  { key: "email", label: "Email", width: "250px",  fixed: "left" },
  { key: "phone", label: "Phone", width: "150px" },
  { key: "position", label: "Position", width: "150px" },
  { key: "status", label: "Status", width: "150px" },
  { key: "performance", label: "Rating", width: "100px" },
  { key: "startDate", label: "Start Date", width: "230px" },
  { key: "projects", label: "Projects", width: "180px" },
  { key: "location", label: "Location", width: "150px" },
  { key: "manager", label: "Manager", width: "180px" },
  { key: "budget", label: "Budget", width: "130px" },
  { key: "salary", label: "Salary", width: "120px", fixed: "right" },
];
</script>

<template>
  <div class="page-container flex flex-col gap-8">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:pin"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Fixed Columns
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Pin columns to <strong>left or right side</strong> while scrolling.
          Perfect for keeping important data always visible.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:align-left"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Left Fixed
              </h3>
              <p class="feature-description">
                Pin columns to left side
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:align-right"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Right Fixed
              </h3>
              <p class="feature-description">
                Pin columns to right side
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:move-horizontal"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Smooth Scrolling
              </h3>
              <p class="feature-description">
                Natural horizontal scroll
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:layers"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Z-Index Control
              </h3>
              <p class="feature-description">
                Proper layering on scroll
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
            Best practice: group all left-fixed columns together,
            then scrollable, then right-fixed!
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
  // Left fixed
  { key: 'id', label: 'ID', fixed: 'left' },
  { key: 'name', label: 'Name', fixed: 'left' },
  // Scrollable
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  // Right fixed
  { key: 'actions', label: 'Actions', fixed: 'right' }
]</code></pre>
      </div>
    </VCard>

    <!-- Good practice: fixed in a row -->
    <div>
      <h2 class="text-xl font-bold mb-4 text-mainText">
        ✅ Good Practice: Fixed columns in a row
      </h2>
      <p class="text-secondaryText mb-4">
        ID and Name are fixed on the left, Salary is fixed on the right.
        All fixed columns are in a row in the array.
      </p>
      <Table
        :columns="columnsGood"
        :data="mockDataUsers"
        :total-row="mockDataUsersTotalRow"
        height="40vh"
      />
    </div>

    <!-- Bad practice: fixed NOT in a row -->
    <div>
      <h2 class="text-xl font-bold mb-4 text-mainText">
        ⚠️ Not Recommended: Fixed columns scattered
      </h2>
      <p class="text-secondaryText mb-4">
        Fixed columns are not grouped together, which can cause layout issues.
      </p>
      <Table
        :columns="columnsBad"
        :data="mockDataUsers"
        :total-row="mockDataUsersTotalRow"
        height="40vh"
      >
        <template #toolbar>
          <TableToolbar />
        </template>
      </Table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>

