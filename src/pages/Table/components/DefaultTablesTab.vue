<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import Table from "@/widgets/table/Table.vue";
import type { Column, ExpandableRow } from "@/widgets/table/types";
import { mockDataUsers, mockDataUsersTotalRow } from "@/widgets/table/utils/mockData";

// Example: Custom row styling based on data (using theme colors)
const rowClassName = (row: ExpandableRow): string => {
  // Highlight rows with high performance (rating > 4.5) - Success
  if (Number(row.performance) > 4.5) {
    return "bg-success-50 hover:bg-success-100";
  }

  // Highlight rows with low performance (rating < 4.0) - Error
  if (Number(row.performance) < 4.0) {
    return "bg-error-50 hover:bg-error-100";
  }

  return "";
};

const columnsRegular: Column[] = [
  { key: "id", label: "ID", width: "80px", align: "center" },
  { key: "name", label: "Name", width: "100px" },
  {
    key: "age",
    label: "Age",
    align: "center",
    // Heatmap with background color
    cellStyle: (value) => {
      const num = Number(value);
      if (isNaN(num)) return {};

      // Discrete color buckets
      let backgroundColor;
      const color = "#ffffff";

      if (num < 25) {
        backgroundColor = "#22c55e"; // green-500
      } else if (num < 35) {
        backgroundColor = "#84cc16"; // lime-500
      } else if (num < 45) {
        backgroundColor = "#eab308"; // yellow-500
      } else if (num < 55) {

        backgroundColor = "#dc2626"; // red-600
      } else {
        backgroundColor = "#f59e0b"; // amber-500
      }

      return {
        backgroundColor,
        color,
        fontWeight: "600",
        textAlign: "center",
      };
    },
  },
  { key: "email", label: "Email", width: "100px" },
  { key: "phone", label: "Phone", width: "150px" },
  {
    key: "position",
    label: "Position",
    width: "150px",
  },
  {
    key: "status",
    label: "Status",
    width: "150px",
  },
  { key: "performance", label: "Rating" },
  { key: "startDate", label: "Start Date", format: { date: "long" }, width: "130px" },
  { key: "projects", label: "Projects", width: "100px" },
  {
    key: "location",
    label: "Location",
    width: "150px",
  },
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

    <!-- Row & Cell Styling Documentation -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:palette"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Row & Cell Styling
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Apply <strong>custom styles</strong> to rows and cells based on data conditions.
          Support for dynamic backgrounds, highlights, and custom formatting.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:rows"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Row Styling
              </h3>
              <p class="feature-description">
                Apply classes to entire rows
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:square"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Cell Styling
              </h3>
              <p class="feature-description">
                Custom styles per cell
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:zap"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Dynamic Conditions
              </h3>
              <p class="feature-description">
                Based on data values
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:paintbrush"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Tailwind Support
              </h3>
              <p class="feature-description">
                Use any Tailwind classes
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
            See examples below with green (high performance)
            and red (low performance) row highlights!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Demo Section -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:monitor-play"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Live Interactive Demo
        </h2>
      </div>
      <div class="info-content">
        <p class="info-description">
          Below is a fully functional example demonstrating <strong>
            row styling</strong> based on
          performance ratings. Rows with rating > 4.5 are highlighted in green, and rows with
          rating ~ 4.0 are highlighted in red.
        </p>
      </div>
    </VCard>

    <Table
      :toolbar="{ enabled: true,
                  title: 'Default Table with Custom Row Styling',
                  actions: { columnSetup: 'default_table_columns' } }"
      :columns="columnsRegular"
      :data="mockDataUsers"
      :total-row="mockDataUsersTotalRow"
      :row-class-name="rowClassName"
      height="60vh"
    />

    <Table
      :columns="columnsRegular"
      :data="mockDataUsers"
      :total-row="mockDataUsersTotalRow"
      height="50vh"
    />

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Row Styling Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Row Styling with rowClassName
        </h4>
        <p class="text-secondaryText mb-4">
          Apply Tailwind classes to entire rows based on data conditions.
          The function receives the row data and index, returning a string of classes.
        </p>
        <div class="code-block">
          <pre><code v-pre>&lt;script setup lang="ts"&gt;
import type { ExpandableRow } from "@/widgets/table/types";

const rowClassName = (row: ExpandableRow): string =&gt; {
  if (Number(row.performance) &gt; 4.5) {
    return "bg-success-50 hover:bg-success-100";
  }
  if (Number(row.performance) &lt; 4.0) {
    return "bg-error-50 hover:bg-error-100";
  }
  return "";
};
&lt;/script&gt;
&lt;template&gt;
  &lt;Table :columns="columns" :data="data" :rowClassName="rowClassName" /&gt;
&lt;/template&gt;</code></pre>
        </div>
      </section>

      <!-- Cell Styling Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Cell Styling with cellStyle
        </h4>
        <p class="text-secondaryText mb-4">
          Apply custom styles to individual cells. The function receives the cell value
          and returns CSS properties object. Perfect for heatmaps and conditional formatting.
        </p>
        <div class="code-block">
          <pre><code>const columns: Column[] = [
  {
    key: "age",
    label: "Age",
    align: "center",
    cellStyle: (value) =&gt; {
      const num = Number(value);
      if (isNaN(num)) return {};

      // Create heatmap effect
      let backgroundColor;
      if (num &lt; 25) {
        backgroundColor = "#22c55e"; // green-500
      } else if (num &lt; 35) {
        backgroundColor = "#84cc16"; // lime-500
      } else if (num &lt; 45) {
        backgroundColor = "#eab308"; // yellow-500
      } else {
        backgroundColor = "#f59e0b"; // amber-500
      }

      return {
        backgroundColor,
        color: "#ffffff",
        fontWeight: "600",
        textAlign: "center",
      };
    },
  },
];</code></pre>
        </div>
      </section>

      <!-- Status-Based Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Status-Based Row Styling
        </h4>
        <p class="text-secondaryText mb-4">
          Use switch statements or objects for cleaner code when dealing with multiple conditions.
        </p>
        <div class="code-block">
          <pre><code>const rowClassName = (row: ExpandableRow): string => {
  const statusColors = {
    active: "bg-success-50",
    pending: "bg-warning-50",
    inactive: "bg-neutral-100",
    error: "bg-error-50",
  };

  return statusColors[row.status] || "";
};</code></pre>
        </div>
      </section>

      <!-- Modified Rows Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Highlight Modified Rows
        </h4>
        <p class="text-secondaryText mb-4">
          Track and highlight rows that have been edited by the user.
          Useful for indicating unsaved changes.
        </p>
        <div class="code-block">
          <pre><code>&lt;script setup&gt;
const editedRows = ref&lt;Record&lt;string, boolean&gt;&gt;({});

const rowClassName = (row: ExpandableRow): string => {
  if (editedRows.value[row.id]) {
    return "bg-info-50 ring-2 ring-info-500";
  }
  return "";
};

const handleCellEdit = (rowId: string) => {
  editedRows.value[rowId] = true;
};
&lt;/script&gt;</code></pre>
        </div>
      </section>

      <!-- Multiple Conditions Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Combining Multiple Conditions
        </h4>
        <p class="text-secondaryText mb-4">
          Build class strings dynamically by checking multiple conditions.
        </p>
        <div class="code-block">
          <pre><code>const rowClassName = (row: ExpandableRow, index: number): string => {
  const classes: string[] = [];

  // Add zebra striping
  if (index % 2 === 0) {
    classes.push("bg-neutral-100");
  }

  // Add selection highlight
  if (row.isSelected) {
    classes.push("ring-2 ring-primary-500");
  }

  // Add modification highlight
  if (row.isModified) {
    classes.push("bg-info-50");
  }

  // Add hover effect
  classes.push("hover:bg-neutral-200");

  return classes.join(" ");
};</code></pre>
        </div>
      </section>
    </VCard>

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Styling Props & Options
      </h3>
      <div class="section-description mb-4">
        Configuration options for row and cell styling:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Prop/Option</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>rowClassName</code></td>
              <td><code>string | Function</code></td>
              <td><code>undefined</code></td>
              <td>Class names to apply to entire rows. Can be static string or function</td>
            </tr>
            <tr>
              <td
                colspan="4"
                class="text-sm text-secondaryText italic"
              >
                Function signature: <code>(row: ExpandableRow, index: number) => string</code>
              </td>
            </tr>
            <tr>
              <td><code>column.cellStyle</code></td>
              <td><code>Function</code></td>
              <td><code>undefined</code></td>
              <td>Custom CSS properties for individual cells in a column</td>
            </tr>
            <tr>
              <td
                colspan="4"
                class="text-sm text-secondaryText italic"
              >
                Function signature: <code>(value: unknown) => Record&lt;string, string&gt;</code>
              </td>
            </tr>
            <tr>
              <td><code>column.cellClass</code></td>
              <td><code>string | Function</code></td>
              <td><code>undefined</code></td>
              <td>Class names to apply to cells in a column</td>
            </tr>
            <tr>
              <td
                colspan="4"
                class="text-sm text-secondaryText italic"
              >
                Function signature: <code>(value: unknown, row: Record) => string</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Recommended Classes -->
    <VCard>
      <h3 class="section-title">
        🎨 Recommended Tailwind Classes
      </h3>
      <div class="section-description mb-4">
        Ready-to-use Tailwind classes for common styling scenarios. Our custom theme automatically
        adapts colors for light/dark modes - no <code>dark:</code> prefix needed!
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Use Case</th>
              <th>Base Class</th>
              <th>With Hover</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Success / Active</strong></td>
              <td><code>bg-success-50</code></td>
              <td><code>bg-success-50 hover:bg-success-100</code></td>
              <td>Positive actions, completed tasks</td>
            </tr>
            <tr>
              <td><strong>Positive (Light)</strong></td>
              <td><code>bg-lightPositive</code></td>
              <td><code>bg-lightPositive hover:bg-success-200</code></td>
              <td>Subtle positive highlight</td>
            </tr>
            <tr>
              <td><strong>Error / Critical</strong></td>
              <td><code>bg-error-50</code></td>
              <td><code>bg-error-50 hover:bg-error-100</code></td>
              <td>Errors, failed operations</td>
            </tr>
            <tr>
              <td><strong>Negative (Light)</strong></td>
              <td><code>bg-lightNegative</code></td>
              <td><code>bg-lightNegative hover:bg-error-200</code></td>
              <td>Subtle negative highlight</td>
            </tr>
            <tr>
              <td><strong>Warning / Pending</strong></td>
              <td><code>bg-warning-50</code></td>
              <td><code>bg-warning-50 hover:bg-warning-100</code></td>
              <td>Warnings, pending actions</td>
            </tr>
            <tr>
              <td><strong>Info / Modified</strong></td>
              <td><code>bg-info-50</code></td>
              <td><code>bg-info-50 hover:bg-info-100</code></td>
              <td>Information, modified items</td>
            </tr>
            <tr>
              <td><strong>Primary / Important</strong></td>
              <td><code>bg-primary-50</code></td>
              <td><code>bg-primary-50 hover:bg-primary-100</code></td>
              <td>Important items, emphasis</td>
            </tr>
            <tr>
              <td><strong>Neutral / Default</strong></td>
              <td><code>bg-neutral-100</code></td>
              <td><code>bg-neutral-100 hover:bg-neutral-200</code></td>
              <td>Default background, zebra striping</td>
            </tr>
            <tr>
              <td><strong>Disabled / Inactive</strong></td>
              <td><code>bg-neutral-200</code></td>
              <td><code>bg-neutral-200 opacity-60</code></td>
              <td>Disabled states (add <code>cursor-not-allowed</code>)</td>
            </tr>
            <tr>
              <td><strong>Selection / Focus</strong></td>
              <td><code>ring-2 ring-primary-500</code></td>
              <td><code>ring-2 ring-primary-500 bg-primary-50</code></td>
              <td>Selected or focused rows</td>
            </tr>
            <tr>
              <td><strong>Accent / Highlight</strong></td>
              <td><code>bg-accent/10</code></td>
              <td><code>bg-accent/10 hover:bg-accent/20</code></td>
              <td>Accent color (cyan) highlights</td>
            </tr>
            <tr>
              <td><strong>Secondary / Subtle</strong></td>
              <td><code>bg-base-200</code></td>
              <td><code>bg-base-200 hover:bg-base-300</code></td>
              <td>Subtle backgrounds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-note mt-4">
        <VIcon
          icon="lucide:palette"
          :size="16"
        />
        <span>
          <strong>No <code>dark:</code> prefix needed!</strong> Our theme uses CSS variables
          that automatically adapt to light/dark modes via <code>data-theme</code> attribute.
        </span>
      </div>
    </VCard>

    <!-- Key Features -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:sparkles"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Key Features
        </h2>
      </div>

      <div class="features-grid-compact">
        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:rows"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Row-Level Styling
            </h4>
            <p class="feature-card-description">
              Apply classes to all cells in a row
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:square"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Cell-Level Styling
            </h4>
            <p class="feature-card-description">
              Custom styles per column/cell
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:zap"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Dynamic Conditions
            </h4>
            <p class="feature-card-description">
              Based on data values or state
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:paintbrush"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Tailwind Support
            </h4>
            <p class="feature-card-description">
              Use any Tailwind utility class
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:palette"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Heatmaps
            </h4>
            <p class="feature-card-description">
              Visual data representation
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:moon"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Dark Mode
            </h4>
            <p class="feature-card-description">
              Full dark mode support
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:gauge"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Performance
            </h4>
            <p class="feature-card-description">
              Optimized for large datasets
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:layers"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Multiple Conditions
            </h4>
            <p class="feature-card-description">
              Combine different styling rules
            </p>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Implementation Tips -->
    <VCard>
      <h3 class="section-title">
        💡 Implementation Tips
      </h3>

      <div class="composable-section">
        <h4 class="composable-title">
          When to Use Row vs Cell Styling
        </h4>
        <ul class="composable-list">
          <li>
            <strong>Row Styling (rowClassName):</strong> Use when you want to highlight
            entire rows based on data conditions (status, priority, modifications, etc.)
          </li>
          <li>
            <strong>Cell Styling (cellStyle):</strong> Use for heatmaps, progress indicators,
            or when different cells need different formatting based on their values
          </li>
          <li>
            <strong>Combine Both:</strong> You can use both at the same time for
            maximum flexibility
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Performance Considerations
        </h4>
        <ul class="composable-list">
          <li>
            Keep styling functions pure - avoid side effects or heavy computations
          </li>
          <li>
            Cache computed values when possible (use computed properties or memoization)
          </li>
          <li>
            For very large datasets (10,000+ rows), consider limiting the number
            of condition checks
          </li>
          <li>
            Tailwind classes are optimized and won't impact performance
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Best Practices
        </h4>
        <ul class="composable-list">
          <li>
            <strong>Use theme colors:</strong> Our custom theme automatically handles
            light/dark modes - no need for <code>dark:</code> prefixes
          </li>
          <li>
            <strong>Add hover states:</strong> Include
            <code>hover:</code> classes for better UX
          </li>
          <li>
            <strong>Ensure accessibility:</strong> Maintain sufficient color contrast
            (WCAG AA: 4.5:1 for normal text)
          </li>
          <li>
            <strong>Use semantic colors:</strong> Use <code>success</code>, <code>error</code>,
            <code>warning</code>, <code>info</code> for consistency
          </li>
          <li>
            <strong>Return empty string:</strong> When no styling is needed, return
            <code>""</code> instead of undefined
          </li>
          <li>
            <strong>Test both themes:</strong> Always verify your styling in both
            light and dark modes by toggling theme switcher
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Common Use Cases
        </h4>
        <ul class="composable-list">
          <li>
            <strong>Status Indicators:</strong> Highlight rows by status
            (active, pending, completed, error)
          </li>
          <li>
            <strong>Priority Levels:</strong> Show task priority with color coding
            (high, medium, low)
          </li>
          <li>
            <strong>Performance Metrics:</strong> Visualize KPIs with color gradients
            or thresholds
          </li>
          <li>
            <strong>Change Tracking:</strong> Highlight modified, new, or deleted rows
          </li>
          <li>
            <strong>Heatmaps:</strong> Display numeric data with color intensity
            (age ranges, sales figures)
          </li>
          <li>
            <strong>Validation States:</strong> Show validation errors or warnings
          </li>
          <li>
            <strong>Selection States:</strong> Visually indicate selected or active rows
          </li>
          <li>
            <strong>Zebra Striping:</strong> Alternate row colors for better readability
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Styling Priority
        </h4>
        <ul class="composable-list">
          <li>
            <code>cellStyle</code> has highest priority (inline styles)
          </li>
          <li>
            <code>rowClassName</code> applies to all cells in the row
          </li>
          <li>
            <code>cellClass</code> applies to specific column cells
          </li>
          <li>
            Default table styles have lowest priority
          </li>
          <li>
            Use <code>!important</code> sparingly - Tailwind classes usually work without it
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Advanced Example -->
    <VCard>
      <h3 class="section-title">
        🚀 Advanced Example: Combined Styling
      </h3>
      <div class="section-description mb-4">
        A complete example combining row styling, cell styling, and multiple conditions:
      </div>

      <div class="code-block">
        <pre><code>&lt;script setup lang="ts"&gt;
import { ref } from 'vue';
import type { Column, ExpandableRow } from '@/widgets/table/types';

// Track modified rows
const editedRows = ref&lt;Record&lt;string, boolean&gt;&gt;({});

// Row styling function
const rowClassName = (row: ExpandableRow, index: number): string => {
  const classes: string[] = [];

  // Zebra striping
  if (index % 2 === 0) {
    classes.push("bg-base-100");
  } else {
    classes.push("bg-neutral-100");
  }

  // Highlight modified rows
  if (editedRows.value[row.id]) {
    classes.push("!bg-info-50 ring-1 ring-info-500");
  }

  // Highlight based on status
  if (row.status === 'error') {
    classes.push("!bg-error-50");
  }

  // Add hover effect
  classes.push("hover:bg-neutral-200");

  return classes.join(" ");
};

// Column definition with cell styling
const columns: Column[] = [
  {
    key: "performance",
    label: "Rating",
    align: "center",
    cellStyle: (value) =&gt; {
      const num = Number(value);
      if (num &gt;= 4.5) return {
        backgroundColor: "#22c55e",
        color: "#fff",
        fontWeight: "600"
      };
      if (num &lt; 4.0) return {
        backgroundColor: "#ef4444",
        color: "#fff",
        fontWeight: "600"
      };
      return {};
    },
  },
];
&lt;/script&gt;

&lt;template&gt;
  &lt;Table
    :columns="columns"
    :data="data"
    :row-className="rowClassName"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>
