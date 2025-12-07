<script setup lang="ts">
import { reactive, ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";
import Table from "@/widgets/table/Table.vue";
import { Column, type RequestPayload } from "@/widgets/table/types";
import { mockDataExpandable, mockDataExpandableTotalRow } from "@/widgets/table/utils/mockData";

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: mockDataExpandable.length,
});


const search = ref("");
const sort = ref([]);
const serverData = ref([...mockDataExpandable]);
const serverLoading = ref(false);

const loaders = reactive({
  exportLoader: false,
});

const columnsExpandable: Column[] = [
  // All left fixed columns in a row
  { key: "name", label: "Name", width:"150px", sortable: true  },
  { key: "count", label: "Count",width:"100px" },
  { key: "salary", label: "Salary", format: { currency: true }, width:"150px",  sortable: true },
  // Regular scrollable columns
  { key: "email", label: "Email", width:"150px"  },
  { key: "phone", label: "Phone", width:"150px",  sortable: true },
  { key: "position", label: "Position",width:"150px"  },
  { key: "status", label: "Status",width:"150px"  },
  { key: "performance", label: "Rating", width:"150px",  sortable: true },
  { key: "accountStatus", label: "Account Status", width: "200px", interactive: true },
  { key: "startDate", label: "Start Date", format: { date: "long" }, width:"150px"  },
  { key: "projects", label: "Projects",width:"150px"  },
  { key: "location", label: "Location",width:"150px"  },
  { key: "manager", label: "Manager",width:"150px"  },
  { key: "budget", label: "Budget", format: { currency: true }, width:"150px"  },
  { key: "revenue", label: "Revenue", format: { currency: true }, width:"150px"   },
  // Right fixed at the end
];

const accountStatusList = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Block",
    value: "block",
  },
];

const exportFormats = ref([
  { label: "Export as CSV", value: "csv", icon: "mdi:file-delimited", loading: loaders.exportLoader },
  { label: "Export as Excel", value: "excel", icon: "mdi:file-excel", loading: loaders.exportLoader },
  { label: "Export as PDF", value: "pdf", icon: "mdi:file-pdf-box", loading: loaders.exportLoader },
]);
// Handlers

const handleServerRequest = async ({ sort, page }: RequestPayload) => {
  serverLoading.value = true;
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  pagination.page = page;
  // Simulate server-side sorting
  let sortedData = [...mockDataExpandable];

  if (sort.length > 0) {
    sortedData.sort((a, b) => {
      for (const sortItem of sort) {
        const aValue = a[sortItem.column];
        const bValue = b[sortItem.column];

        if (aValue === bValue) continue;

        const comparison = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
        });

        return sortItem.order === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }


  serverData.value = sortedData;
  serverLoading.value = false;
};

const expandAction = ({ callback }) => {
  callback();
};

const exportFunc = (format: string) => {
  loaders.exportLoader = true;
  console.log("EXPORT", format);
};
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:chevrons-down-up"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Expandable Rows
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Display <strong>hierarchical data</strong> with expandable parent-child rows.
          Supports controlled and auto expansion modes with custom content.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:folder-tree"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Hierarchical Data
              </h3>
              <p class="feature-description">
                Parent-child relationships
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:hand"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Controlled Mode
              </h3>
              <p class="feature-description">
                Manual expansion control
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
                Auto Mode
              </h3>
              <p class="feature-description">
                Automatic expansion on click
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:code"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Custom Content
              </h3>
              <p class="feature-description">
                Slots for expanded rows
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
            Click on expand icons to reveal child rows and nested data!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Demo Section Title -->
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
          Below is a fully functional example demonstrating expandable rows with
          <strong>controlled expansion mode</strong>, server-side features, sorting,
          pagination, and toolbar. Try expanding parent rows to see child data!
        </p>
      </div>
    </VCard>

    <Table
      v-model:sort-state="sort"
      v-model:search="search"
      :columns="columnsExpandable"
      :data="serverData"
      :total-row="mockDataExpandableTotalRow"
      expand-mode="controlled"
      :pagination="pagination"
      :loading="serverLoading"
      :toolbar="{
        enabled: true,
        title: 'Expandable Table',
        search: true,
        actions: {
          refresh: true,
          resetSort: true,
          export: 'multi',
          columnSetup: 'expandable-table-column-setup',
        }
      }"
      :export-options="{
        formats: exportFormats,
        selectedOnly: false,
      }"
      @toolbar:export="exportFunc"
      @expand-click="expandAction"
      @request="handleServerRequest"
    >
      <template #cell-accountStatus>
        <VMultiSelect
          :options="accountStatusList"
          label="label"
          placeholder="Account Status"
          :searchable="false"
        />
      </template>

      <!-- Total row slots with custom formatting -->
      <template #total-cell-name="{ value }">
        <span class="text-accent font-bold uppercase">
          {{ value }}
        </span>
      </template>
      <template #total-cell-salary="{ value }">
        <span class="text-positive font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
      <template #total-cell-budget="{ value }">
        <span class="text-info font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
      <template #total-cell-revenue="{ value }">
        <span class="text-positive font-bold">
          ${{ value.toLocaleString() }}
        </span>
      </template>
    </Table>


    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic Expandable Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Controlled Expansion Mode
        </h4>
        <div class="code-block">
          <pre><code>&lt;script setup lang="ts"&gt;
import type { ExpandableRow } from "@/widgets/table/types";

const data: ExpandableRow[] = [
  {
    id: 1,
    name: "Parent Row 1",
    children: [
      { id: 11, name: "Child 1.1", email: "child1@example.com" },
      { id: 12, name: "Child 1.2", email: "child2@example.com" },
    ],
  },
];

const handleExpandClick = ({ row, callback, expanded }) => {
  if (!expanded) {
    // Optionally lazy-load children here
    loadChildren(row.id).then((children) => {
      row.children = children;
      callback(); // Toggle expansion after loading
    });
  } else {
    callback(); // Just collapse
  }
};
&lt;/script&gt;

&lt;template&gt;
  &lt;Table
    :columns="columns"
    :data="data"
    expand-mode="controlled"
    @expand-click="handleExpandClick"
  /&gt;
&lt;/template&gt;</code></pre>
        </div>
      </section>

      <!-- Auto Expansion Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Auto Expansion Mode
        </h4>
        <p class="text-secondaryText mb-4">
          In auto mode, rows expand and collapse automatically when clicking the expand icon.
          No event handler needed!
        </p>
        <div class="code-block">
          <pre><code>&lt;Table
  :columns="columns"
  :data="data"
  expand-mode="auto"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Multi-level Hierarchy -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Multi-Level Hierarchy
        </h4>
        <p class="text-secondaryText mb-4">
          Support for deep nesting - children can have their own children, creating
          unlimited hierarchy levels with proper indentation.
        </p>
        <div class="code-block">
          <pre><code>const data: ExpandableRow[] = [
  {
    id: 1,
    name: "Department",
    children: [
      {
        id: 11,
        name: "Team A",
        children: [
          { id: 111, name: "Employee 1" },
          { id: 112, name: "Employee 2" },
        ],
      },
      { id: 12, name: "Team B" },
    ],
  },
];</code></pre>
        </div>
      </section>

      <!-- With Other Features -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Combined with Other Features
        </h4>
        <p class="text-secondaryText mb-4">
          Expandable rows work seamlessly with sorting, pagination, selection,
          fixed columns, and all other table features.
        </p>
        <div class="code-block">
          <pre><code>&lt;Table
  :columns="columns"
  :data="data"
  expand-mode="controlled"
  :pagination="pagination"
  :multi-select="{ mode: 'multiple', keyField: 'id' }"
  :toolbar="{
    enabled: true,
    title: 'Hierarchical Data',
    search: true,
  }"
  v-model:selected-rows="selectedRows"
  @expand-click="handleExpandClick"
/&gt;</code></pre>
        </div>
      </section>
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
              icon="lucide:folder-tree"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Unlimited Nesting
            </h4>
            <p class="feature-card-description">
              Support for infinite hierarchy levels
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:zap"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Auto & Controlled Modes
            </h4>
            <p class="feature-card-description">
              Choose between automatic or manual control
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:download-cloud"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Lazy Loading
            </h4>
            <p class="feature-card-description">
              Load children on-demand for performance
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:indent"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Visual Indentation
            </h4>
            <p class="feature-card-description">
              Clear depth indicators for hierarchy
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:check-square"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Selection Support
            </h4>
            <p class="feature-card-description">
              Works with row selection features
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:move-vertical"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Sortable
            </h4>
            <p class="feature-card-description">
              Compatible with sorting functionality
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:layers"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Virtualized
            </h4>
            <p class="feature-card-description">
              Efficient rendering for large datasets
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:palette"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Customizable Icons
            </h4>
            <p class="feature-card-description">
              Custom expand/collapse indicators
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:gauge"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              High Performance
            </h4>
            <p class="feature-card-description">
              Optimized for thousands of rows
            </p>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Expandable Props & Events
      </h3>
      <div class="section-description mb-4">
        Configuration options for expandable rows functionality:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Prop/Event</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>expand-mode</code></td>
              <td><code>'auto' | 'controlled'</code></td>
              <td><code>'auto'</code></td>
              <td>Expansion behavior - auto expands immediately, controlled waits for callback</td>
            </tr>
            <tr>
              <td><code>@expand-click</code></td>
              <td><code>Function</code></td>
              <td><code>-</code></td>
              <td>Event fired when expand icon is clicked (controlled mode)</td>
            </tr>
            <tr>
              <td
                colspan="4"
                class="text-sm text-secondaryText italic"
              >
                Event payload: <code>{ row: ExpandableRow, column: Column,
                  callback: () => void, expanded: boolean }</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Data Structure -->
    <VCard>
      <h3 class="section-title">
        Data Structure
      </h3>
      <div class="section-description mb-4">
        The <code>ExpandableRow</code> interface for hierarchical data:
      </div>

      <div class="code-block">
        <pre><code>interface ExpandableRow {
  id: string | number        // Required: unique identifier
  children?: ExpandableRow[] // Optional: array of child rows
  [key: string]: unknown     // Any additional data fields
}

// Example:
const data: ExpandableRow[] = [
  {
    id: 1,
    name: "Parent Department",
    budget: 500000,
    children: [
      {
        id: 11,
        name: "Sub-Department A",
        budget: 200000,
      },
      {
        id: 12,
        name: "Sub-Department B",
        budget: 300000,
        children: [
          {
            id: 121,
            name: "Team 1",
            budget: 150000,
          },
        ],
      },
    ],
  },
];</code></pre>
      </div>
    </VCard>

    <!-- Event Details -->
    <VCard>
      <h3 class="section-title">
        Event Payload Details
      </h3>
      <div class="section-description mb-4">
        Understanding the <code>@expand-click</code> event payload:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>row</code></td>
              <td><code>ExpandableRow</code></td>
              <td>The row object that was clicked for expansion/collapse</td>
            </tr>
            <tr>
              <td><code>column</code></td>
              <td><code>Column</code></td>
              <td>The first column definition (usually contains expand icon)</td>
            </tr>
            <tr>
              <td><code>callback</code></td>
              <td><code>() => void</code></td>
              <td>Function to call after async operations to toggle expansion state</td>
            </tr>
            <tr>
              <td><code>expanded</code></td>
              <td><code>boolean</code></td>
              <td>Current expansion state (true = currently expanded, false = collapsed)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="code-block mt-4">
        <pre><code>const handleExpandClick = ({ row, callback, expanded }) => {
  console.log('Row clicked:', row.id);
  console.log('Currently expanded:', expanded);

  if (!expanded) {
    // Expanding - optionally load children first
    fetchChildren(row.id).then(children => {
      row.children = children;
      callback(); // Toggle to expanded
    });
  } else {
    // Collapsing - just toggle
    callback();
  }
};</code></pre>
      </div>
    </VCard>

    <!-- Composable Usage -->
    <VCard>
      <h3 class="section-title">
        Advanced: Composable Usage
      </h3>
      <div class="section-description mb-4">
        For advanced use cases, you can use the <code>useExpandableTable</code> composable directly:
      </div>

      <div class="code-block">
        <pre><code>import { ref } from 'vue';
import { useExpandableTable } from '@/widgets/table/composables/useExpandableTable';

const data = ref([/* your expandable data */]);

// Get composable methods
const {
  flattenedData,    // Computed flat list of visible rows
  expandedRows,     // Set of expanded row IDs
  toggleRow,        // Function to expand/collapse by ID
  expandAll,        // Expand all rows
  collapseAll,      // Collapse all rows
  isExpanded        // Check if row is expanded
} = useExpandableTable(data);

// Programmatically control expansion
const expandRow = (rowId) => {
  if (!isExpanded(rowId)) {
    toggleRow(rowId);
  }
};

// Expand all on mount
onMounted(() => {
  expandAll();
});</code></pre>
      </div>

      <div class="composable-section">
        <h4 class="composable-title">
          Available Methods
        </h4>
        <ul class="composable-list">
          <li>
            <code>flattenedData</code> - Computed property that returns flat array of visible
            rows considering expansion state
          </li>
          <li>
            <code>expandedRows</code> - Reactive Set containing IDs of all expanded rows
          </li>
          <li>
            <code>toggleRow(id)</code> - Toggle expansion state for specific row by ID
          </li>
          <li>
            <code>expandAll()</code> - Expand all rows in the hierarchy
          </li>
          <li>
            <code>collapseAll()</code> - Collapse all rows in the hierarchy
          </li>
          <li>
            <code>isExpanded(id)</code> - Check if a row with given ID is currently expanded
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Implementation Tips -->
    <VCard>
      <h3 class="section-title">
        💡 Implementation Tips
      </h3>

      <div class="composable-section">
        <h4 class="composable-title">
          When to Use Each Mode
        </h4>
        <ul class="composable-list">
          <li>
            <strong>Auto Mode:</strong> Use when all children data is already loaded.
            Best for small datasets or when you fetch the entire tree structure at once.
          </li>
          <li>
            <strong>Controlled Mode:</strong> Use for lazy loading children on demand.
            Perfect for large hierarchies where you want to load data progressively.
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Performance Considerations
        </h4>
        <ul class="composable-list">
          <li>
            Virtual scrolling is automatically enabled, so you can handle thousands of rows
            efficiently without performance issues.
          </li>
          <li>
            Only visible rows are rendered in the DOM, even with expanded children.
          </li>
          <li>
            Consider lazy loading for deep hierarchies with many children per node.
          </li>
          <li>
            The flattening algorithm runs in O(n) time, where n is the number of visible rows.
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Best Practices
        </h4>
        <ul class="composable-list">
          <li>
            Always provide unique <code>id</code> fields for each row (parent and children).
          </li>
          <li>
            Use <code>expand-mode="controlled"</code> with the callback pattern for async
            operations.
          </li>
          <li>
            Combine with toolbar search to filter across all hierarchy levels.
          </li>
          <li>
            Use fixed columns for key identifiers when dealing with wide tables.
          </li>
          <li>
            For very large datasets (10,000+ rows), consider server-side tree expansion.
          </li>
        </ul>

        <h4 class="composable-title mt-6">
          Common Use Cases
        </h4>
        <ul class="composable-list">
          <li>
            <strong>Organizational Charts:</strong> Display company hierarchy with departments
            and teams
          </li>
          <li>
            <strong>File Systems:</strong> Show folders and files with unlimited nesting levels
          </li>
          <li>
            <strong>Category Trees:</strong> Product categories, menu structures, taxonomies
          </li>
          <li>
            <strong>Bill of Materials:</strong> Manufacturing components and sub-assemblies
          </li>
          <li>
            <strong>Project Tasks:</strong> Tasks with subtasks and nested work items
          </li>
        </ul>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>
