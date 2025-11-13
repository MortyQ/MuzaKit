<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";

// Code examples
const basicExample = `<script setup>
import { ref } from 'vue';
import VMultiSelect from '@/shared/ui/common/VMultiSelect.vue';

const selected = ref(null);
const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];
</` + `script>

<template>
  <VMultiSelect
    v-model="selected"
    :options="options"
    placeholder="Select an option"
  />
</template>`;

const advancedExample = `// Multiple selection
<VMultiSelect
  v-model="selectedItems"
  :options="options"
  placeholder="Select multiple"
  multiple
  :close-on-select="false"
/>

// With search disabled
<VMultiSelect
  v-model="selected"
  :options="options"
  :searchable="false"
/>

// Loading state
<VMultiSelect
  v-model="selected"
  :options="options"
  loading
/>

// Taggable (create new options)
<VMultiSelect
  v-model="selected"
  :options="options"
  taggable
  @tag="handleNewTag"
/>`;

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" },
  { label: "Option 5", value: "option5" },
];

const singleValue = ref(null);
const multipleValue = ref([]);
const disabledValue = ref(options[0]);
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
          Powerful multi-select component powered by <strong>vue-multiselect</strong>.
          Supports single and multiple selection, search, custom options,
          and tagging for creating new entries on the fly.
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
                Switch between single or multiple selection
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
                Built-in search for filtering options
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
                Create new options dynamically
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:settings-2"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Customizable
              </h3>
              <p class="feature-description">
                Full control over behavior and styling
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
            Works with v-model for reactive two-way data binding!
          </span>
        </div>
      </div>
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
              <td>Selected value(s)</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td><code>Option[]</code></td>
              <td><code>[]</code></td>
              <td>Array of available options</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>'Select option'</code></td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Enable multiple selection</td>
            </tr>
            <tr>
              <td><code>searchable</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Enable search functionality</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable the select</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading state</td>
            </tr>
            <tr>
              <td><code>taggable</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Allow creating new options</td>
            </tr>
            <tr>
              <td><code>closeOnSelect</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Close dropdown after selection</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Single Select -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Single Select
        </h4>
        <VMultiSelect
          v-model="singleValue"
          :options="options"
          placeholder="Choose one option"
        />
        <p class="example-result">
          Selected: {{ singleValue }}
        </p>
      </section>

      <!-- Multiple Select -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Multiple Select
        </h4>
        <VMultiSelect
          v-model="multipleValue"
          :options="options"
          placeholder="Choose multiple options"
          multiple
          :close-on-select="false"
        />
        <p class="example-result">
          Selected: {{ multipleValue }}
        </p>
      </section>

      <!-- Disabled -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled State
        </h4>
        <VMultiSelect
          v-model="disabledValue"
          :options="options"
          placeholder="Disabled"
          disabled
        />
      </section>

      <!-- Not Searchable -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Not Searchable
        </h4>
        <VMultiSelect
          v-model="singleValue"
          :options="options"
          placeholder="Select without search"
          :searchable="false"
        />
      </section>

      <!-- Loading State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Loading State
        </h4>
        <VMultiSelect
          v-model="singleValue"
          :options="options"
          placeholder="Loading..."
          loading
        />
      </section>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Single and multiple selection modes</li>
        <li>✅ Built-in search and filtering</li>
        <li>✅ Keyboard navigation support</li>
        <li>✅ Custom option templates</li>
        <li>✅ Taggable for dynamic option creation</li>
        <li>✅ Loading and disabled states</li>
        <li>✅ Fully accessible (ARIA compliant)</li>
        <li>✅ Theme-aware styling</li>
        <li>✅ TypeScript support</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@import "@/shared/assets/styles/shared-info-card-styles.scss";

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
