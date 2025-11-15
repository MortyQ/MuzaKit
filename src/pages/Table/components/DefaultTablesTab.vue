<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import type { Column } from "@/widgets/table/types";
import { mockDataUsers, mockDataUsersTotalRow } from "@/widgets/table/utils/mockData";

const columnsRegular: Column[] = [
  { key: "id", label: "ID", width: "80px", align: "center" },
  { key: "name", label: "Name",width: "100px" },
  { key: "age", label: "Age",  align: "center" },
  { key: "email", label: "Email", width: "100px" },
  { key: "phone", label: "Phone", width: "150px" },
  { key: "position", label: "Position", width: "150px" },
  { key: "status", label: "Status", width: "150px" },
  { key: "performance", label: "Rating" },
  { key: "startDate", label: "Start Date", format: { date: "long" }, width: "130px" },
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
          icon="lucide:table-2"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Basic Table Usage
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          This demonstrates the <strong>basic table setup</strong> with essential features.
          Simple, clean, and ready to use with minimal configuration.
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
                Column Configuration
              </h3>
              <p class="feature-description">
                Mix of fixed and flexible widths
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:calculator"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Total Row
              </h3>
              <p class="feature-description">
                Sticky summary row at the bottom
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:text-cursor-input"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Toolbar Support
              </h3>
              <p class="feature-description">
                Optional title and actions
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:maximize"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Custom Height
              </h3>
              <p class="feature-description">
                Set table height as needed
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
            Perfect starting point for most use cases. Just pass columns and data!
          </span>
        </div>
      </div>
    </VCard>

    <Table
      :toolbar="{
        enabled: true,
        title: 'Default Table',
        actions: {
          columnSetup: true,
        }
      }"
      :columns="columnsRegular"
      :data="mockDataUsers"
      :total-row="mockDataUsersTotalRow"
      height="40vh"
    />

    <Table
      :columns="columnsRegular"
      :data="mockDataUsers"
      :total-row="mockDataUsersTotalRow"
      height="30vh"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>


