<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import type { Column } from "@/shared/ui/table/types";
import { mockDataVirtualScroll } from "@/shared/ui/table/utils/mockData";
import Table from "@/shared/ui/table/VTable.vue";

const columnsRegular: Column[] = [
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
];
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:zap"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Virtual Scroll Performance Demo
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          This table demonstrates high-performance rendering with <strong>10,000 rows</strong>
          using virtual scrolling technology.
          Only visible rows are rendered in the DOM,
          ensuring smooth scrolling and instant interactions.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:database"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                10,000 Rows
              </h3>
              <p class="feature-description">
                Large dataset handled effortlessly
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:gauge"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Virtual Scrolling
              </h3>
              <p class="feature-description">
                Only ~20-30 DOM nodes at any time
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
                Column Resize
              </h3>
              <p class="feature-description">
                Smooth resizing with zero lag
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:rocket"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                60 FPS Scrolling
              </h3>
              <p class="feature-description">
                Buttery smooth performance
              </p>
            </div>
          </div>
        </div>

        <div class="tech-specs">
          <div class="spec-item">
            <span class="spec-label">Render Strategy:</span>
            <span class="spec-value">Virtual Scrolling (@tanstack/vue-virtual)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">DOM Nodes:</span>
            <span class="spec-value">~25 (vs 10,000 without virtualization)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Memory Usage:</span>
            <span class="spec-value">~5MB (vs ~100MB+ without virtualization)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Initial Render:</span>
            <span class="spec-value">&lt;50ms</span>
          </div>
        </div>

        <div class="info-note">
          <VIcon
            icon="lucide:info"
            :size="16"
          />
          <span>
            Try scrolling, resizing columns, and interacting with the table -
            notice how responsive it remains even with 10k rows!
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
        <pre><code>
&lt;Table
      :columns="columnsRegular"
      :data="mockDataVirtualScroll"
      :toolbar="{
        enabled: true,
        title: 'Large Dataset Table (10,000 Rows)'
      }"
/&gt;
        </code></pre>
      </div>
    </VCard>

    <!-- Table -->
    <Table
      :columns="columnsRegular"
      :data="mockDataVirtualScroll"
      :toolbar="{
        enabled: true,
        title: 'Large Dataset Table (10,000 Rows)'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

/* Component-specific styles */
.tech-specs {
  @apply flex flex-col gap-2 p-4 bg-cardBg border border-cardBorder rounded-lg;
}

.spec-item {
  @apply flex justify-between items-center text-[13px] py-1;
}

.spec-label {
  @apply text-secondaryText font-medium;
}

.spec-value {
  @apply text-mainText font-mono text-xs bg-base-200 px-2 py-1 rounded;
}

/* Responsive overrides */
@media (max-width: 768px) {

  .spec-item {
    @apply flex-col items-start gap-1;
  }
}
</style>
