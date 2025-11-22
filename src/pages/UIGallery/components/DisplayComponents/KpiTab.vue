<script setup lang="ts">
import { ref } from "vue";

import type { KpiComparison } from "@/shared/types/kpi";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VKpiCard from "@/shared/ui/kpis/VKpiCard.vue";
import VKpiComparison from "@/shared/ui/kpis/VKpiComparison.vue";
import VKpiMultiMetric from "@/shared/ui/kpis/VKpiMultiMetric.vue";

// Example data
const showAllComparisons = ref(false);

const revenueData = {
  title: "Revenue",
  value: 5865995,
  icon: "lucide:dollar-sign",
  iconColor: "green" as const,
  format: { unit: "dollar" as const },
  comparisons: [
    {
      name: "PoP" as const,
      difference: -5343924,
      percentage: -48,
      tooltip: "Period over Period comparison",
    },
    {
      name: "MoM" as const,
      difference: -2412950,
      percentage: -100,
      tooltip: "Month over Month comparison",
    },
    {
      name: "YoY" as const,
      difference: -23162177,
      percentage: -32,
      tooltip: "Year over Year comparison",
    },
  ] as KpiComparison[],
};

const conversionData = {
  title: "Conversion",
  value: 10.69,
  icon: "lucide:percent",
  iconColor: "green" as const,
  format: { unit: "percentage" as const, decimals: 2 },
  comparisons: [
    {
      name: "PoP" as const,
      difference: 0.01,
      percentage: 7,
      tooltip: "Period over Period comparison",
    },
  ] as KpiComparison[],
};

const sessionsData = {
  title: "Sessions",
  value: 1762947,
  icon: "lucide:activity",
  iconColor: "blue" as const,
  format: { unit: "number" as const },
  comparisons: [
    {
      name: "PoP" as const,
      difference: -879967,
      percentage: -33,
      tooltip: "Period over Period comparison",
    },
  ] as KpiComparison[],
};

const lostRevenueData = {
  title: "Lost Revenue",
  value: 7271355,
  icon: "lucide:trending-down",
  iconColor: "red" as const,
  format: { unit: "dollar" as const },
  comparisons: [
    {
      name: "PoP" as const,
      difference: 28003793,
      percentage: -79,
      tooltip: "Period over Period comparison",
    },
  ] as KpiComparison[],
  reverse: true,
};

// Multi-Metric KPI Data
const categoryElectronics = {
  title: "Electronics",
  icon: "lucide:laptop",
  metrics: [
    { label: "Products", value: 342, icon: "lucide:package", iconColor: "info" as const },
    { label: "Revenue", value: 1245678, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    { label: "Rating", value: 4.6, icon: "lucide:star", iconColor: "warning" as const, format: { decimals: 1 } },
  ],
};

const categoryHomeGarden = {
  title: "Home & Garden",
  icon: "lucide:home",
  metrics: [
    { label: "Products", value: 567, icon: "lucide:package", iconColor: "info" as const },
    { label: "Revenue", value: 892456, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    { label: "Rating", value: 4.4, icon: "lucide:star", iconColor: "warning" as const, format: { decimals: 1 } },
  ],
};

const categoryFashion = {
  title: "Fashion",
  icon: "lucide:shirt",
  metrics: [
    { label: "Products", value: 891, icon: "lucide:package", iconColor: "info" as const },
    { label: "Revenue", value: 2134567, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    { label: "Rating", value: 4.3, icon: "lucide:star", iconColor: "warning" as const, format: { decimals: 1 } },
  ],
};

const performanceDistribution = [
  {
    title: "Below Average",
    icon: "lucide:trending-down",
    metrics: [
      { label: "Unit Price", value: 49.21, icon: "lucide:dollar-sign", iconColor: "primary" as const, format: { unit: "dollar" as const, decimals: 2 } },
      { label: "Units Sold", value: 1, icon: "lucide:shopping-cart", iconColor: "info" as const },
      { label: "Reviews", value: 23, icon: "lucide:star", iconColor: "warning" as const },
      { label: "Est. Revenue", value: 49, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    ],
  },
  {
    title: "Average",
    icon: "lucide:minus",
    metrics: [
      { label: "Unit Price", value: 78.99, icon: "lucide:dollar-sign", iconColor: "primary" as const, format: { unit: "dollar" as const, decimals: 2 } },
      { label: "Units Sold", value: 12, icon: "lucide:shopping-cart", iconColor: "info" as const },
      { label: "Reviews", value: 87, icon: "lucide:star", iconColor: "warning" as const },
      { label: "Est. Revenue", value: 948, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    ],
  },
  {
    title: "Above Average",
    icon: "lucide:trending-up",
    metrics: [
      { label: "Unit Price", value: 92.15, icon: "lucide:dollar-sign", iconColor: "primary" as const, format: { unit: "dollar" as const, decimals: 2 } },
      { label: "Units Sold", value: 45, icon: "lucide:shopping-cart", iconColor: "info" as const },
      { label: "Reviews", value: 156, icon: "lucide:star", iconColor: "warning" as const },
      { label: "Est. Revenue", value: 4147, icon: "lucide:trending-up", iconColor: "success" as const, format: { unit: "dollar" as const } },
    ],
  },
];

const campaignMetrics = {
  title: "Black Friday Campaign",
  icon: "lucide:megaphone",
  metrics: [
    { label: "Impressions", value: 1245678, icon: "lucide:eye", iconColor: "info" as const },
    { label: "Clicks", value: 45678, icon: "lucide:mouse-pointer", iconColor: "primary" as const },
    { label: "CTR", value: 3.67, icon: "lucide:percent", iconColor: "success" as const, format: { unit: "percentage" as const, decimals: 2 } },
    { label: "Revenue", value: 234567, icon: "lucide:dollar-sign", iconColor: "success" as const, format: { unit: "dollar" as const } },
    { label: "ROAS", value: 4.2, icon: "lucide:trending-up", iconColor: "success" as const, format: { decimals: 1 } },
  ],
};

// Code examples
const basicExample = `<script setup>
import VKpiCard from '@/shared/ui/kpis/VKpiCard.vue';
</` + `script>

<template>
  <VKpiCard
    title="Revenue"
    :value="5865995"
    icon="lucide:dollar-sign"
    iconColor="green"
    :format="{ unit: 'dollar' }"
    :comparisons="[
      {
        name: 'PoP',
        difference: -5343924,
        percentage: -48,
        tooltip: 'Period over Period comparison'
      }
    ]"
  />
</template>`;

const advancedExample = `// With multiple comparisons
<VKpiCard
  title="Conversion"
  :value="10.69"
  icon="lucide:percent"
  iconColor="green"
  :format="{ unit: 'percentage', decimals: 2 }"
  :comparisons="comparisons"
  :showAllComparisons="true"
/>

// Reverse logic (for negative metrics)
<VKpiCard
  title="Lost Revenue"
  :value="7271355"
  icon="lucide:trending-down"
  iconColor="red"
  :format="{ unit: 'dollar' }"
  :comparisons="comparisons"
  :reverse="true"
/>

// With loading state
<VKpiCard
  title="Loading..."
  :value="0"
  icon="lucide:loader"
  :loading="true"
/>

// Different sizes
<VKpiCard
  size="sm"
  title="Small Card"
  :value="1234"
/>`;

const comparisonExample = `// Standalone comparison component
<VKpiComparison
  :comparison="{
    name: 'PoP',
    difference: -5343924,
    percentage: -48,
    tooltip: 'Period over Period'
  }"
  :format="{ unit: 'dollar' }"
/>

// With custom slot content
<VKpiComparison
  :comparison="comparison"
  :format="format"
>
  <VIcon icon="lucide:info" :size="14" />
</VKpiComparison>

// Reverse mode
<VKpiComparison
  :comparison="comparison"
  :reverse="true"
/>`;

const multiMetricExample = `<script setup>
import VKpiMultiMetric from '@/shared/ui/kpis/VKpiMultiMetric.vue';
</` + `script>

<template>
  <!-- Basic usage with 3 metrics -->
  <VKpiMultiMetric
    title="Category Performance"
    icon="lucide:shopping-bag"
    :columns="3"
    :metrics="[
      { label: 'Products', value: 342, icon: 'lucide:package', iconColor: 'info' },
      { label: 'Revenue', value: 1245678, icon: 'lucide:trending-up', iconColor: 'success', format: { unit: 'dollar' } },
      { label: 'Rating', value: 4.6, icon: 'lucide:star', iconColor: 'warning', format: { decimals: 1 } }
    ]"
  />

  <!-- With 4 metrics in 4 columns -->
  <VKpiMultiMetric
    title="Product Performance"
    icon="lucide:chart-line"
    :columns="4"
    :metrics="[
      { label: 'Unit Price', value: 78.99, icon: 'lucide:dollar-sign', iconColor: 'primary', format: { unit: 'dollar', decimals: 2 } },
      { label: 'Units Sold', value: 12, icon: 'lucide:shopping-cart', iconColor: 'info' },
      { label: 'Reviews', value: 87, icon: 'lucide:star', iconColor: 'warning' },
      { label: 'Est. Revenue', value: 948, icon: 'lucide:trending-up', iconColor: 'success', format: { unit: 'dollar' } }
    ]"
  />

  <!-- With 5 metrics and custom icon slot -->
  <VKpiMultiMetric
    title="Campaign Metrics"
    :columns="5"
    :metrics="campaignMetrics"
  >
    <template #icon>
      <VIcon icon="lucide:megaphone" :size="20" class="text-error-500" />
    </template>
  </VKpiMultiMetric>

  <!-- With glassmorphism effect -->
  <VKpiMultiMetric
    title="Premium View"
    icon="lucide:sparkles"
    :glassmorphism="true"
    :metrics="metrics"
  />

  <!-- Auto columns (based on metrics count) -->
  <VKpiMultiMetric
    title="Auto Layout"
    :metrics="metrics"
  />
</template>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:bar-chart-3"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          KPI Cards & Comparison
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Powerful KPI card components for displaying
          key performance indicators with comparison data.
          Supports <strong>multiple time periods</strong>, <strong>custom formatting</strong>,
          and <strong>reverse logic</strong> for negative metrics.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:trending-up"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Smart Comparisons
              </h3>
              <p class="feature-description">
                Period over Period, Month over Month, Year over Year
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:palette"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Customizable Icons
              </h3>
              <p class="feature-description">
                13+ color variants with modern Lucide icons
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:dollar-sign"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Format Support
              </h3>
              <p class="feature-description">
                Currency, percentage, number with decimals
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:arrow-up-down"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Reverse Logic
              </h3>
              <p class="feature-description">
                For metrics where decrease is positive
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
            KPI cards automatically animate values on change and support dark mode!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic KPI Cards -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic KPI Cards
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VKpiCard v-bind="revenueData" />
          <VKpiCard v-bind="conversionData" />
          <VKpiCard v-bind="sessionsData" />
        </div>
      </section>

      <!-- With Multiple Comparisons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Multiple Comparisons
        </h4>
        <div class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="showAllComparisons"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="text-sm text-secondaryText">Show all comparisons</span>
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VKpiCard
            v-bind="revenueData"
            :show-all-comparisons="showAllComparisons"
          />
          <VKpiCard
            v-bind="lostRevenueData"
            :show-all-comparisons="showAllComparisons"
          />
        </div>
      </section>

      <!-- Different Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Different Sizes
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VKpiCard
            v-bind="sessionsData"
            size="sm"
          />
          <VKpiCard
            v-bind="sessionsData"
            size="md"
          />
          <VKpiCard
            v-bind="sessionsData"
            size="lg"
          />
        </div>
      </section>

      <!-- Different Icon Colors -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Icon Color Variants
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VKpiCard
            title="Primary"
            :value="1234"
            icon="lucide:star"
            icon-color="primary"
            :format="{ unit: 'number' }"
          />
          <VKpiCard
            title="Success"
            :value="5678"
            icon="lucide:check"
            icon-color="success"
            :format="{ unit: 'number' }"
          />
          <VKpiCard
            title="Warning"
            :value="9012"
            icon="lucide:alert-triangle"
            icon-color="warning"
            :format="{ unit: 'number' }"
          />
          <VKpiCard
            title="Error"
            :value="3456"
            icon="lucide:x-circle"
            icon-color="error"
            :format="{ unit: 'number' }"
          />
        </div>
      </section>

      <!-- Loading State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Loading State
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VKpiCard
            title="Primary"
            :value="1234"
            icon="lucide:star"
            icon-color="primary"
            :format="{ unit: 'number' }"
            :loading="true"
          />
          <VKpiCard
            title="Success"
            :value="5678"
            icon="lucide:check"
            icon-color="success"
            :format="{ unit: 'number' }"
            :loading="true"
          />
          <VKpiCard
            title="Warning"
            :value="9012"
            icon="lucide:alert-triangle"
            icon-color="warning"
            :format="{ unit: 'number' }"
            :loading="true"
          />
          <VKpiCard
            title="Error"
            :value="3456"
            icon="lucide:x-circle"
            icon-color="error"
            :format="{ unit: 'number' }"
            :loading="true"
          />
        </div>
      </section>

      <!-- Standalone Comparison Component -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Standalone Comparison Component
        </h4>
        <div class="p-4 bg-base-100 rounded-lg space-y-3">
          <VKpiComparison
            :comparison="{
              name: 'PoP',
              difference: -5343924,
              percentage: -48,
              tooltip: 'Period over Period comparison'
            }"
            :format="{ unit: 'dollar' }"
          />
          <VKpiComparison
            :comparison="{
              name: 'MoM',
              difference: 1234567,
              percentage: 25,
              tooltip: 'Month over Month comparison'
            }"
            :format="{ unit: 'dollar' }"
          />
          <VKpiComparison
            :comparison="{
              name: 'YoY',
              difference: 15.5,
              percentage: 12,
              tooltip: 'Year over Year comparison'
            }"
            :format="{ unit: 'percentage', decimals: true }"
          />
        </div>
      </section>
    </VCard>

    <!-- VKpiMultiMetric Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        📊 VKpiMultiMetric - Multiple Metrics in One Card
      </h3>

      <!-- Category Performance (3 metrics) -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Category Performance - 2 Metrics per Card
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VKpiMultiMetric
            v-bind="categoryElectronics"
            :columns="2"
          />
          <VKpiMultiMetric
            v-bind="categoryHomeGarden"
            :columns="2"
          />
          <VKpiMultiMetric
            v-bind="categoryFashion"
            :columns="2"
          />
        </div>
      </section>

      <!-- Performance Distribution (4 metrics) -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Performance Distribution - 1 Metric per Card
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VKpiMultiMetric
            v-for="(perf, index) in performanceDistribution"
            :key="index"
            :title="perf.title"
            :icon="perf.icon"
            :metrics="perf.metrics"
            :columns="1"
          />
        </div>
      </section>

      <!-- Campaign Metrics (5 metrics) -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Campaign Metrics - 5 Metrics with Custom Icon
        </h4>
        <div class="grid grid-cols-1 gap-4">
          <VKpiMultiMetric
            v-bind="campaignMetrics"
            :columns="5"
          />
          <VKpiMultiMetric
            title="Holiday Sale Campaign"
            icon="lucide:gift"
            :columns="5"
            :metrics="[
              { label: 'Impressions', value: 987654, icon: 'lucide:eye', iconColor: 'info' },
              { label: 'Clicks', value: 34567, icon: 'lucide:mouse-pointer', iconColor: 'primary' },
              { label: 'CTR', value: 3.5, icon: 'lucide:percent',
                iconColor: 'success', format: { unit: 'percentage', decimals: 2 } },
              { label: 'Revenue', value: 189456,
                icon: 'lucide:dollar-sign', iconColor: 'success', format: { unit: 'dollar' } },
              { label: 'ROAS', value: 3.8,
                icon: 'lucide:trending-up', iconColor: 'warning', format: { decimals: 1 } }
            ]"
          />
        </div>
      </section>

      <!-- Different Column Layouts -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Different Column Layouts
        </h4>
        <div class="space-y-4">
          <!-- 2 columns -->
          <VKpiMultiMetric
            title="Product Comparison - 2 Columns"
            icon="lucide:tags"
            :columns="2"
            :metrics="[
              { label: 'Price', value: 49.99,
                icon: 'lucide:dollar-sign', iconColor: 'primary', format: { unit: 'dollar' } },
              { label: 'Sales', value: 1234,
                icon: 'lucide:shopping-cart', iconColor: 'success' }
            ]"
          />

          <!-- Auto columns (based on count) -->
          <VKpiMultiMetric
            title="Auto Layout - 6 Metrics"
            icon="lucide:layout-grid"
            :metrics="[
              { label: 'Metric 1', value: 100, icon: 'lucide:circle', iconColor: 'primary' },
              { label: 'Metric 2', value: 200, icon: 'lucide:circle', iconColor: 'success' },
              { label: 'Metric 3', value: 300, icon: 'lucide:circle', iconColor: 'warning' },
              { label: 'Metric 4', value: 400, icon: 'lucide:circle', iconColor: 'error' },
              { label: 'Metric 5', value: 500, icon: 'lucide:circle', iconColor: 'info' },
              { label: 'Metric 6', value: 600, icon: 'lucide:circle', iconColor: 'neutral' }
            ]"
          />
        </div>
      </section>

      <!-- With Glassmorphism -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Glassmorphism Effect
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VKpiMultiMetric
            title="Premium Metrics"
            icon="lucide:sparkles"
            :glassmorphism="true"
            :columns="3"
            :metrics="[
              { label: 'VIP Users', value: 1234, icon: 'lucide:crown', iconColor: 'warning' },
              { label: 'Premium Rev', value: 567890,
                icon: 'lucide:dollar-sign', iconColor: 'success', format: { unit: 'dollar' } },
              { label: 'Satisfaction', value: 98.5,
                icon: 'lucide:heart', iconColor: 'error',
                format: { unit: 'percentage', decimals: 1 } }
            ]"
          />
          <VKpiMultiMetric
            title="Standard Metrics"
            icon="lucide:bar-chart"
            :glassmorphism="false"
            :columns="3"
            :metrics="[
              { label: 'Users', value: 5678, icon: 'lucide:users', iconColor: 'info' },
              { label: 'Revenue', value: 234567, icon: 'lucide:dollar-sign',
                iconColor: 'success', format: { unit: 'dollar' } },
              { label: 'Satisfaction', value: 92.3, icon: 'lucide:smile',
                iconColor: 'success', format: { unit: 'percentage', decimals: 1 } }
            ]"
          />
        </div>
      </section>
    </VCard>

    <!-- Basic Usage -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📝 Basic Usage
      </h3>
      <div class="code-block">
        <pre><code>{{ basicExample }}</code></pre>
      </div>
    </VCard>

    <!-- Advanced Usage -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        🚀 Advanced Examples
      </h3>
      <div class="code-block">
        <pre><code>{{ advancedExample }}</code></pre>
      </div>
    </VCard>

    <!-- Comparison Component -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📊 VKpiComparison Component
      </h3>
      <div class="code-block">
        <pre><code>{{ comparisonExample }}</code></pre>
      </div>
    </VCard>

    <!-- Multi-Metric Component -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📈 VKpiMultiMetric Component
      </h3>
      <div class="code-block">
        <pre><code>{{ multiMetricExample }}</code></pre>
      </div>
    </VCard>

    <!-- Props Documentation - VKpiCard -->
    <VCard>
      <h3 class="section-title">
        VKpiCard Props
      </h3>
      <div class="section-description mb-4">
        Available props for VKpiCard component:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>-</code></td>
              <td>KPI title/label</td>
            </tr>
            <tr>
              <td><code>value</code></td>
              <td><code>number | string</code></td>
              <td><code>-</code></td>
              <td>KPI value to display</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>-</code></td>
              <td>Icon name (Lucide format)</td>
            </tr>
            <tr>
              <td><code>iconColor</code></td>
              <td>
                <code>'primary' | 'success' | 'error' | 'warning' | 'info' | 'green' | 'red' |
                  'blue' | 'orange' | 'purple' | 'pink' | 'cyan'</code>
              </td>
              <td><code>'primary'</code></td>
              <td>Icon background color</td>
            </tr>
            <tr>
              <td><code>format</code></td>
              <td><code>KpiFormatOptions</code></td>
              <td><code>{}</code></td>
              <td>Format configuration (unit, decimals)</td>
            </tr>
            <tr>
              <td><code>comparisons</code></td>
              <td><code>KpiComparison[]</code></td>
              <td><code>[]</code></td>
              <td>Array of comparison data</td>
            </tr>
            <tr>
              <td><code>showAllComparisons</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show all comparisons or just primary</td>
            </tr>
            <tr>
              <td><code>reverse</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Reverse color logic (decrease = good)</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'sm' | 'md' | 'lg'</code></td>
              <td><code>'md'</code></td>
              <td>Card size</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading state</td>
            </tr>
            <tr>
              <td><code>animate</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Animate value changes</td>
            </tr>
            <tr>
              <td><code>tooltip</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Info tooltip text</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Props Documentation - VKpiComparison -->
    <VCard>
      <h3 class="section-title">
        VKpiComparison Props
      </h3>
      <div class="section-description mb-4">
        Available props for VKpiComparison component:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>comparison</code></td>
              <td><code>KpiComparison</code></td>
              <td><code>-</code></td>
              <td>Comparison data object</td>
            </tr>
            <tr>
              <td><code>format</code></td>
              <td><code>KpiFormatOptions</code></td>
              <td><code>undefined</code></td>
              <td>Format configuration</td>
            </tr>
            <tr>
              <td><code>reverse</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Reverse color logic</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Props Documentation - VKpiMultiMetric -->
    <VCard>
      <h3 class="section-title">
        VKpiMultiMetric Props
      </h3>
      <div class="section-description mb-4">
        Available props for VKpiMultiMetric component:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>-</code></td>
              <td>Card title</td>
            </tr>
            <tr>
              <td><code>metrics</code></td>
              <td><code>VKpiMultiMetric[]</code></td>
              <td><code>-</code></td>
              <td>Array of metrics to display</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>'lucide:chart-column'</code></td>
              <td>Header icon (Lucide format)</td>
            </tr>
            <tr>
              <td><code>columns</code></td>
              <td><code>2 | 3 | 4 | 5 | 'auto'</code></td>
              <td><code>'auto'</code></td>
              <td>Number of grid columns</td>
            </tr>
            <tr>
              <td><code>glassmorphism</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Enable glassmorphism effect (backdrop-blur)</td>
            </tr>
            <tr>
              <td><code>class</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <h4 class="text-sm font-semibold text-mainText mb-3">
          VKpiMultiMetric Type
        </h4>
        <div class="code-block">
          <pre><code>{
  label: string;
  value: number | string;
  icon?: string;
  iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  format?: {
    unit?: 'number' | 'dollar' | 'percentage';
    decimals?: boolean | number;
    multiply?: number;
  };
}</code></pre>
        </div>
      </div>
    </VCard>

    <!-- Type Definitions -->
    <VCard>
      <h3 class="section-title">
        Type Definitions
      </h3>

      <div class="composable-section">
        <h4 class="text-sm font-semibold text-mainText mb-3">
          KpiFormatOptions
        </h4>
        <div class="code-block mb-4">
          <pre><code>{
  unit?: 'number' | 'dollar' | 'percentage';
  decimals?: boolean | number;
  multiply?: number;
  formatter?: (val: number | string) => string;
}</code></pre>
        </div>

        <h4 class="text-sm font-semibold text-mainText mb-3">
          KpiComparison
        </h4>
        <div class="code-block">
          <pre><code>{
  name: string; // e.g., 'PoP', 'MoM', 'YoY'
  difference: number; // Absolute difference
  percentage: number; // Percentage change
  tooltip?: string; // Tooltip text
}</code></pre>
        </div>
      </div>
    </VCard>

    <!-- Slots Documentation -->
    <VCard>
      <h3 class="section-title">
        Available Slots
      </h3>

      <div class="composable-section">
        <h4 class="text-sm font-semibold text-mainText mb-3">
          VKpiComparison
        </h4>
        <ul class="composable-list">
          <li>
            <code>default</code> - Custom content after percentage (e.g., additional icons)
          </li>
        </ul>
      </div>

      <div class="composable-section mt-6">
        <h4 class="text-sm font-semibold text-mainText mb-3">
          VKpiMultiMetric
        </h4>
        <ul class="composable-list">
          <li>
            <code>icon</code> - Custom icon in header (replaces default icon prop)
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Beautiful card design with icon and color variants</li>
        <li>✅ Smart comparison display (PoP, MoM, YoY)</li>
        <li>✅ Multiple format support (currency, percentage, number)</li>
        <li>✅ Reverse logic for negative metrics (e.g., lost revenue)</li>
        <li>✅ Animated value transitions</li>
        <li>✅ Loading state with skeleton</li>
        <li>✅ Responsive sizing (sm, md, lg)</li>
        <li>✅ Dark mode support with enhanced shadows</li>
        <li>✅ Tooltip support for additional info</li>
        <li>✅ Standalone comparison component</li>
        <li>✅ Custom slot for flexible content</li>
        <li>✅ <strong>VKpiMultiMetric:</strong> Multiple metrics in one card (2-10+ metrics)</li>
        <li>✅ <strong>VKpiMultiMetric:</strong> Flexible column layouts (2, 3, 4, 5 or auto)</li>
        <li>✅ <strong>VKpiMultiMetric:</strong> Icon rotation animation on hover</li>
        <li>✅ <strong>VKpiMultiMetric:</strong> Optional glassmorphism effect</li>
        <li>✅ <strong>VKpiMultiMetric:</strong> Modular sub-components architecture</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// KPI-specific styles
.props-table {
  @apply w-full border-collapse;
}

.props-table th {
  @apply bg-base-200 text-left p-3 text-sm font-semibold
  text-mainText border-b border-cardBorder;
}

.props-table td {
  @apply p-3 text-sm text-secondaryText border-b border-cardBorder;
}

.props-table tbody tr:hover {
  @apply bg-base-100;
}

.props-table code {
  @apply px-2 py-1 bg-base-200 rounded text-xs font-mono text-primary;
}

.examples-section {
  @apply mb-8 last:mb-0;
}

.examples-subtitle {
  @apply text-base font-semibold text-mainText mb-4;
}

.composable-section {
  @apply mt-4;
}

.composable-list {
  @apply list-none pl-0 space-y-2;
}

.composable-list li {
  @apply text-sm text-secondaryText pl-5 relative;
}

.composable-list li::before {
  content: '→';
  @apply absolute left-0 text-primary;
}

.composable-list code {
  @apply px-2 py-0.5 bg-base-200 rounded text-xs font-mono text-primary;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}
</style>

