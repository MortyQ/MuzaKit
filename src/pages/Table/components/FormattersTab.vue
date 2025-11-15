<script setup lang="ts">
import { ref } from "vue";

import VAccordion from "@/shared/ui/common/VAccordion.vue";
import type { AccordionItem } from "@/shared/ui/common/VAccordion.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import { formatCurrency } from "@/shared/utils";
import Table from "@/widgets/table/Table.vue";
import type { Column } from "@/widgets/table/types";

// Sample data for formatters demo
const formatterData = ref([
  {
    id: 1,
    name: "John Doe",
    salary: -75000,
    bonus: 0.15,
    score: 4.756,
    views: 1234567,
    file_size: 1048576,
    hired: new Date("2022-03-15"),
    active: true,
    discount: 25,
    revenue: -150000,
    cost: 120000,
  },
  {
    id: 2,
    name: "Jane Smith",
    salary: 95000,
    bonus: 0.22,
    score: 4.923,
    views: 8765432,
    file_size: 524288,
    hired: new Date("2021-07-22"),
    active: true,
    discount: 15,
    revenue: 200000,
    cost: 140000,
  },
  {
    id: 3,
    name: "Mike Johnson",
    salary: 62000,
    bonus: 0.08,
    score: 3.845,
    views: 456789,
    file_size: 2097152,
    hired: new Date("2023-01-10"),
    active: false,
    discount: 30,
    revenue: 100000,
    cost: 85000,
  },
  {
    id: 4,
    name: "Sarah Williams",
    salary: 110000,
    bonus: 0.25,
    score: 4.967,
    views: 12345678,
    file_size: 10485760,
    hired: new Date("2020-05-05"),
    active: true,
    discount: 10,
    revenue: 300000,
    cost: 180000,
  },
  {
    id: 5,
    name: "Tom Brown",
    salary: 58000,
    bonus: 0.05,
    score: 3.521,
    views: 234567,
    file_size: 131072,
    hired: new Date("2023-09-18"),
    active: true,
    discount: 20,
    revenue: 80000,
    cost: 70000,
  },
]);

// Currency formatter
const currencyColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "salary",
    label: "Salary (USD)",
    align: "right",
    format: { currency: true },
  },
  {
    key: "revenue",
    label: "Revenue (EUR)",
    align: "right",
    format: { currency: { code: "EUR", decimals: 0 } },
  },
];

// Percentage formatter
const percentageColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "bonus",
    label: "Bonus (Multiplier)",
    align: "right",
    format: { percentage: { decimals: 1, multiplier: true } },
  },
  {
    key: "discount",
    label: "Discount",
    align: "right",
    format: { percentage: { decimals: 0 } },
  },
];

// Number formatter
const numberColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "views",
    label: "Views (Compact)",
    align: "right",
    format: { number: "compact" },
  },
  {
    key: "score",
    label: "Score (Decimal)",
    align: "center",
    format: { number: { type: "decimal", decimals: 2 } },
  },
];

// Date & Boolean formatter
const mixedColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "hired",
    label: "Hired Date",
    format: { date: "long" },
  },
  {
    key: "active",
    label: "Status",
    align: "center",
    format: { boolean: { trueText: "✓ Active", falseText: "✗ Inactive" } },
  },
];

// File size formatter
const fileSizeColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "file_size",
    label: "File Size",
    align: "right",
    format: { fileSize: true },
  },
];

// Custom formatter
const customColumns: Column[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name", width: "180px" },
  {
    key: "salary",
    label: "Salary",
    align: "right",
    format: { currency: "USD" },
  },
  {
    key: "profit_margin",
    label: "Profit Margin",
    align: "right",
    format: {
      formatter: (_value, row) => {
        if (!row) return "N/A";
        const revenue = Number(row.revenue);
        const cost = Number(row.cost);
        const margin = ((revenue - cost) / revenue) * 100;
        return `${margin.toFixed(1)}%`;
      },
    },
  },
  {
    key: "total_comp",
    label: "Total Compensation",
    align: "right",
    format: {
      formatter: (_value, row) => {
        if (!row) return "N/A";
        const salary = Number(row.salary);
        const bonus = Number(row.bonus);
        const total = salary + (salary * bonus);
        return formatCurrency(total);
      },
    },
  },
];

// All formatters combined
const allFormattersColumns: Column[] = [
  { key: "id", label: "ID", width: "60px" },
  { key: "name", label: "Name", width: "140px" },
  {
    key: "salary",
    label: "Salary",
    align: "right",
    width: "110px",
    format: { currency: { code: "USD", decimals: 0 } },
  },
  {
    key: "bonus",
    label: "Bonus",
    align: "right",
    width: "90px",
    format: { percentage: { decimals: 0, multiplier: true } },
  },
  {
    key: "views",
    label: "Views",
    align: "right",
    width: "90px",
    format: { number: "compact" },
  },
  {
    key: "hired",
    label: "Hired",
    width: "110px",
    format: { date: "short" },
  },
  {
    key: "active",
    label: "Active",
    align: "center",
    width: "80px",
    format: { boolean: {} },
  },
];

// Accordion items for formatters
const formatterItems: AccordionItem[] = [
  {
    id: "currency",
    title: "Currency Formatter",
    subtitle: "Format numbers as currency with symbols and custom decimal places",
    icon: "lucide:dollar-sign",
  },
  {
    id: "percentage",
    title: "Percentage Formatter",
    subtitle: "Display numbers as percentages with optional multiplication",
    icon: "lucide:percent",
  },
  {
    id: "number",
    title: "Number Formatter",
    subtitle: "Format numbers with compact notation or fixed decimals",
    icon: "lucide:hash",
  },
  {
    id: "date-boolean",
    title: "Date & Boolean Formatters",
    subtitle: "Format dates and booleans with custom labels",
    icon: "lucide:calendar",
  },
  {
    id: "filesize",
    title: "File Size Formatter",
    subtitle: "Convert bytes to human-readable file sizes",
    icon: "lucide:hard-drive",
  },
  {
    id: "custom",
    title: "Custom Formatter",
    subtitle: "Use custom functions with access to full row data",
    icon: "lucide:code-2",
  },
  {
    id: "combined",
    title: "All Formatters Combined",
    subtitle: "Multiple formatters working together in one table",
    icon: "lucide:layers",
  },
];

const openFormatters = ref<(string | number)[]>(["currency"]);
</script>

<template>
  <div class="formatters-tab">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:wand-2"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Data Formatters Overview
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          The table supports rich built-in value formatting:
          <strong>currency, percentage, number, date, boolean, file size</strong>
          plus fully <strong>custom formatters</strong> using a function.
          All are declarative via the column <code>format</code> option.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:dollar-sign"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Currency
              </h3>
              <p class="feature-description">
                Automatic symbol, negatives, precision
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:percent"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Percentage
              </h3>
              <p class="feature-description">
                Supports multiplier (0.15 → 15%)
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:hash"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Number
              </h3>
              <p class="feature-description">
                Compact & decimal modes (1.2M, 4.76)
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:calendar"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Date & Boolean
              </h3>
              <p class="feature-description">
                Readable dates & status labels
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:hard-drive"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                File Size
              </h3>
              <p class="feature-description">
                Bytes → KB / MB / GB auto
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:code-2"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Custom
              </h3>
              <p class="feature-description">
                Function(row) for any logic
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
            Combine multiple formatters in the same table.
            Each column decides its own representation.
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
    key: 'salary',
    label: 'Salary',
    format: { currency: true }
  },
  {
    key: 'bonus',
    label: 'Bonus',
    format: { percentage: { decimals: 1, multiplier: true } }
  },
  {
    key: 'views',
    label: 'Views',
    format: { number: 'compact' }
  }
]</code></pre>
      </div>
    </VCard>

    <!-- Formatters Accordion -->
    <VAccordion
      v-model="openFormatters"
      :items="formatterItems"
      variant="outlined"
      multiple
    >
      <!-- Currency Formatter -->
      <template #content-currency>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="currencyColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: { currency: true  } // -$75,000.00<br>
              format: { currency: { code: "EUR", decimals: 0 } } // €150000
            </code>
          </div>
        </div>
      </template>

      <!-- Percentage Formatter -->
      <template #content-percentage>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="percentageColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: { percentage: { decimals: 1, multiplier: true } } // 0.15 → 15.0%<br>
              format: { percentage: { decimals: 0 } } // 25 → 25%
            </code>
          </div>
        </div>
      </template>

      <!-- Number Formatter -->
      <template #content-number>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="numberColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: { number: "compact" } // 1234567 → 1.2M<br>
              format: { number: { type: "decimal", decimals: 2 } } // 4.756 → 4.76
            </code>
          </div>
        </div>
      </template>

      <!-- Date & Boolean Formatters -->
      <template #content-date-boolean>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="mixedColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: { date: "long" } // November 15, 2025<br>
              format: { boolean: { trueText: "✓ Active", falseText: "✗ Inactive" } }
            </code>
          </div>
        </div>
      </template>

      <!-- File Size Formatter -->
      <template #content-filesize>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="fileSizeColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: { fileSize: true } // 1048576 → 1.00 MB
            </code>
          </div>
        </div>
      </template>

      <!-- Custom Formatter -->
      <template #content-custom>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="customColumns"
            row-key="id"
          />
          <div class="code-example">
            <code>
              format: {<br>
              &nbsp;&nbsp;formatter: (_value, row) => {<br>
              &nbsp;&nbsp;&nbsp;&nbsp;const margin =<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;((row.revenue - row.cost)<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ row.revenue) * 100;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;return `${margin.toFixed(1)}%`;<br>
              &nbsp;&nbsp;}<br>
              }
            </code>
          </div>
        </div>
      </template>

      <!-- All Formatters Combined -->
      <template #content-combined>
        <div class="accordion-content">
          <Table
            :data="formatterData"
            :columns="allFormattersColumns"
            row-key="id"
          />
        </div>
      </template>
    </VAccordion>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

.formatters-tab {
  @apply flex flex-col gap-6;
}

.formatters-header h2 {
  @apply m-0 mb-2 text-2xl font-semibold text-mainText;
}

.formatters-header p {
  @apply m-0 text-sm text-secondaryText;
}

.demo-section {
  @apply p-6 flex flex-col gap-4;
}

.demo-section h3 {
  @apply m-0 text-lg font-semibold text-mainText;
}

.section-description {
  @apply m-0 text-sm text-secondaryText leading-relaxed;
}

.accordion-content {
  @apply flex flex-col gap-4 p-6;
}

.code-example {
  @apply mt-4 p-4 bg-base-200 rounded-lg;

  code {
    @apply text-xs font-mono text-secondaryText;
  }
}
</style>
