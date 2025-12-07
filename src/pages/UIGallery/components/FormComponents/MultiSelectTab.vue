<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Ruby", value: "ruby" },
];

const frameworks = [
  { label: "Vue.js", value: "vue" },
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Next.js", value: "nextjs" },
  { label: "Nuxt", value: "nuxt" },
];

const countries = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Spain", value: "es" },
  { label: "Italy", value: "it" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "Japan", value: "jp" },
  { label: "China", value: "cn" },
];

const singleValue = ref(null);
const multipleValue = ref([]);
const disabledValue = ref(options[0]);
const notSearchableValue = ref(null);
const loadingValue = ref(null);
const taggableValue = ref([]);
const preselectedValue = ref(frameworks[0]);
const frameworksValue = ref([]);
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:list-checks"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VMultiSelect Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Powerful dropdown component powered by
          <strong>vue-multiselect</strong> with single/multiple selection,
          search, keyboard navigation, and tagging. Perfect for forms,
          filters, and complex data selection.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:check-square"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Single & Multiple
              </h3>
              <p class="feature-description">
                Switch between selection modes easily
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:search"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Searchable
              </h3>
              <p class="feature-description">
                Real-time filtering of options
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:tag"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Taggable
              </h3>
              <p class="feature-description">
                Create new options on the fly
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:keyboard"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Keyboard Nav
              </h3>
              <p class="feature-description">
                Full keyboard accessibility support
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
            Fully compatible with v-model for reactive two-way data binding.
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic Single Select -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic Single Select
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="singleValue"
            :options="options"
            placeholder="Choose a programming language"
          />
          <p class="text-sm text-secondaryText mt-2">
            Selected:
            <code class="px-2 py-1 bg-base-200 rounded text-xs">
              {{ singleValue?.label || 'none' }}
            </code>
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="options"
  placeholder="Choose a programming language"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Multiple Selection -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Multiple Selection
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="multipleValue"
            :options="options"
            placeholder="Choose multiple languages"
            multiple
            :close-on-select="false"
          />
          <p class="text-sm text-secondaryText mt-2">
            Selected ({{ multipleValue.length }}):
            <code class="px-2 py-1 bg-base-200 rounded text-xs">
              {{ multipleValue.map(v => v.label).join(', ') || 'none' }}
            </code>
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="options"
  placeholder="Choose multiple languages"
  multiple
  :close-on-select="false"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Preselected Value -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Preselected Value
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="preselectedValue"
            :options="frameworks"
            placeholder="Select framework"
          />
          <p class="text-sm text-secondaryText mt-2">
            Selected:
            <code class="px-2 py-1 bg-base-200 rounded text-xs">
              {{ preselectedValue?.label }}
            </code>
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;script setup&gt;
const selected = ref(frameworks[0]); // Preselect first option
&lt;/script&gt;

&lt;VMultiSelect
  v-model="selected"
  :options="frameworks"
  placeholder="Select framework"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Not Searchable -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Not Searchable
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="notSearchableValue"
            :options="frameworks"
            placeholder="Select without search"
            :searchable="false"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="options"
  :searchable="false"
  placeholder="Select without search"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Large Dataset with Search -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Large Dataset with Search
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="frameworksValue"
            :options="countries"
            placeholder="Search and select countries"
            multiple
          />
          <p class="text-sm text-secondaryText mt-2">
            Try typing to filter: "united", "germany", etc.
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="largeDataset"
  placeholder="Search and select"
  multiple
/&gt;</code></pre>
        </div>
      </section>

      <!-- Taggable -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Taggable (Create New Options)
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="taggableValue"
            :options="options"
            placeholder="Type to create new tags"
            multiple
            taggable
          />
          <p class="text-sm text-secondaryText mt-2">
            Type a new value and press Enter to create a tag
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="tags"
  :options="existingTags"
  placeholder="Type to create new tags"
  multiple
  taggable
/&gt;</code></pre>
        </div>
      </section>

      <!-- Disabled State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled State
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="disabledValue"
            :options="options"
            placeholder="This select is disabled"
            disabled
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="options"
  disabled
  placeholder="This select is disabled"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Loading State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Loading State
        </h4>
        <div class="max-w-md">
          <VMultiSelect
            v-model="loadingValue"
            :options="options"
            placeholder="Loading options..."
            loading
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VMultiSelect
  v-model="selected"
  :options="options"
  loading
  placeholder="Loading options..."
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
              icon="lucide:check-circle"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Single Selection
            </h4>
            <p class="feature-card-description">
              Choose one option from the list
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:check-square"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Multiple Selection
            </h4>
            <p class="feature-card-description">
              Select multiple options at once
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:search"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Search & Filter
            </h4>
            <p class="feature-card-description">
              Real-time search through options
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:tag"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Taggable Mode
            </h4>
            <p class="feature-card-description">
              Create new options dynamically
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:keyboard"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Keyboard Navigation
            </h4>
            <p class="feature-card-description">
              Arrow keys, Enter, Escape support
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
              Performance
            </h4>
            <p class="feature-card-description">
              Optimized for large datasets
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:settings-2"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Customizable
            </h4>
            <p class="feature-card-description">
              Control behavior and appearance
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:accessibility"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Accessible
            </h4>
            <p class="feature-card-description">
              ARIA compliant and screen reader friendly
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
              Theme-Aware
            </h4>
            <p class="feature-card-description">
              Automatic theme styling support
            </p>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VMultiSelect component:
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
              <td><code>modelValue</code></td>
              <td><code>Option | Option[] | null</code></td>
              <td><code>null</code></td>
              <td>Selected value(s) - single option or array</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td><code>Option[]</code></td>
              <td><code>[]</code></td>
              <td>Array of available options ({ label, value })</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>'Select option'</code></td>
              <td>Placeholder text when no selection</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Enable multiple selection mode</td>
            </tr>
            <tr>
              <td><code>searchable</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Enable search/filter functionality</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable the entire select component</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading spinner state</td>
            </tr>
            <tr>
              <td><code>taggable</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Allow creating new options by typing</td>
            </tr>
            <tr>
              <td><code>closeOnSelect</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Close dropdown after selecting an option</td>
            </tr>
            <tr>
              <td><code>clearable</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Show clear button to remove selection</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Option Object Format -->
    <VCard>
      <h3 class="section-title">
        Option Object Format
      </h3>

      <div class="composable-section">
        <p class="text-sm text-secondaryText mb-4">
          Each option in the <code>options</code> array should be an object
          with the following structure:
        </p>
        <div class="code-block">
          <pre><code>interface Option {
  label: string;  // Display text shown to user
  value: string | number;  // Actual value stored in v-model
}

// Example:
const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];</code></pre>
        </div>
      </div>
    </VCard>

    <!-- Events Documentation -->
    <VCard>
      <h3 class="section-title">
        Events
      </h3>

      <div class="composable-section">
        <ul class="composable-list">
          <li>
            <code>@update:modelValue</code> -
            Emitted when selection changes (single option or array)
          </li>
          <li>
            <code>@select</code> -
            Emitted when an option is selected
          </li>
          <li>
            <code>@remove</code> -
            Emitted when an option is removed (multiple mode)
          </li>
          <li>
            <code>@search-change</code> -
            Emitted when search query changes
          </li>
          <li>
            <code>@open</code> -
            Emitted when dropdown opens
          </li>
          <li>
            <code>@close</code> -
            Emitted when dropdown closes
          </li>
          <li>
            <code>@tag</code> -
            Emitted when creating a new tag (taggable mode)
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Usage Tips -->
    <VCard>
      <h3 class="section-title">
        Usage Tips & Best Practices
      </h3>

      <div class="composable-section">
        <ul class="composable-list">
          <li>
            <strong>Large datasets:</strong>
            Always enable search for lists with more than 10-15 options
          </li>
          <li>
            <strong>Multiple selection:</strong>
            Set <code>:close-on-select="false"</code>
            to keep dropdown open while selecting multiple items
          </li>
          <li>
            <strong>Taggable mode:</strong>
            Great for tags, categories, or allowing custom user input
          </li>
          <li>
            <strong>Loading state:</strong>
            Use when fetching options from an API
          </li>
          <li>
            <strong>Preselect values:</strong>
            Initialize v-model with default option(s) for better UX
          </li>
          <li>
            <strong>Keyboard shortcuts:</strong>
            Arrow keys navigate, Enter selects, Escape closes
          </li>
        </ul>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// MultiSelect-specific styles
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
  @apply mb-6 last:mb-0;
}

.examples-subtitle {
  @apply text-base font-semibold text-mainText mb-3;
}

.example-result {
  @apply text-sm text-secondaryText mt-2;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}
</style>
