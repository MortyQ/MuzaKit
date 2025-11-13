<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

const singleCheckbox = ref(false);
const multipleCheckboxes = ref<string[]>([]);
const indeterminateCheckbox = ref(false);
const disabledChecked = ref(true);
const disabledUnchecked = ref(false);

const options = ["Option 1", "Option 2", "Option 3"];

// Code examples
const basicExample = `<script setup>
import { ref } from 'vue';
import VCheckbox from '@/shared/ui/common/VCheckbox.vue';

const isChecked = ref(false);
</` + `script>

<template>
  <!-- Simple checkbox -->
  <VCheckbox
    v-model="isChecked"
    label="Accept terms"
  />

  <!-- With custom label slot -->
  <VCheckbox v-model="isChecked">
    <template #label>
      I agree to <a href="#">Terms</a>
    </template>
  </VCheckbox>
</template>`;

const advancedExample = `// Multiple checkboxes (array binding)
const selectedOptions = ref([]);
const options = ['Option 1', 'Option 2', 'Option 3'];

<VCheckbox
  v-for="option in options"
  :key="option"
  v-model="selectedOptions"
  :value="option"
  :label="option"
/>

// Indeterminate state
<VCheckbox
  v-model="selectAll"
  :indeterminate="someSelected"
  label="Select All"
/>

// Disabled state
<VCheckbox
  v-model="checked"
  label="Disabled"
  disabled
/>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:check-square"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VCheckbox Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Accessible checkbox component with support for <strong>single values, arrays,
            indeterminate state</strong>, and custom labels. Built with form validation in mind.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:check"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                v-model Support
              </h3>
              <p class="feature-description">
                Boolean or array value binding
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:minus-square"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Indeterminate State
              </h3>
              <p class="feature-description">
                For "select all" functionality
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:type"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Custom Labels
              </h3>
              <p class="feature-description">
                Text or HTML via slot
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:shield-check"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Accessible
              </h3>
              <p class="feature-description">
                Proper ARIA and keyboard support
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
            Use array binding for multiple checkboxes with the same v-model!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Single Checkbox -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Single Checkbox
        </h4>
        <div class="flex flex-col gap-3">
          <VCheckbox
            v-model="singleCheckbox"
            label="I agree to terms and conditions"
          />
          <p class="example-result">
            Value: {{ singleCheckbox }}
          </p>
        </div>
      </section>

      <!-- Multiple Checkboxes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Multiple Checkboxes (Array Binding)
        </h4>
        <div class="flex flex-col gap-3">
          <VCheckbox
            v-for="option in options"
            :key="option"
            v-model="multipleCheckboxes"
            :value="option"
            :label="option"
          />
          <p class="example-result">
            Selected: {{ multipleCheckboxes.join(', ') || 'None' }}
          </p>
        </div>
      </section>

      <!-- Indeterminate State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Indeterminate State
        </h4>
        <div class="flex flex-col gap-3">
          <VCheckbox
            v-model="indeterminateCheckbox"
            indeterminate
            label="Indeterminate checkbox (mixed state)"
          />
        </div>
      </section>

      <!-- Disabled States -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled States
        </h4>
        <div class="flex flex-col gap-3">
          <VCheckbox
            v-model="disabledChecked"
            label="Disabled (checked)"
            disabled
          />
          <VCheckbox
            v-model="disabledUnchecked"
            label="Disabled (unchecked)"
            disabled
          />
        </div>
      </section>

      <!-- Custom Label Slot -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Custom Label with Slot
        </h4>
        <VCheckbox v-model="singleCheckbox">
          <template #label>
            <span>
              I agree to the
              <a
                href="#"
                class="text-primary underline"
              >Terms of Service</a>
              and
              <a
                href="#"
                class="text-primary underline"
              >Privacy Policy</a>
            </span>
          </template>
        </VCheckbox>
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

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VCheckbox component:
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
              <td><code>boolean | string | number | any</code></td>
              <td><code>undefined</code></td>
              <td>v-model value (boolean or array)</td>
            </tr>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td><code>auto-generated</code></td>
              <td>HTML id attribute</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Label text</td>
            </tr>
            <tr>
              <td><code>value</code></td>
              <td><code>string | number | boolean | any</code></td>
              <td><code>undefined</code></td>
              <td>Value for array binding</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable checkbox</td>
            </tr>
            <tr>
              <td><code>indeterminate</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show indeterminate state</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Slots Documentation -->
    <VCard>
      <h3 class="section-title">
        Available Slots
      </h3>

      <div class="composable-section">
        <ul class="composable-list">
          <li>
            <code>label</code> - Custom label content (supports HTML)
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
        <li>✅ v-model support for boolean or array values</li>
        <li>✅ Indeterminate state for "select all" functionality</li>
        <li>✅ Custom labels via prop or slot</li>
        <li>✅ Disabled state support</li>
        <li>✅ Accessible with proper ARIA attributes</li>
        <li>✅ Keyboard navigation support</li>
        <li>✅ Theme-aware styling</li>
        <li>✅ Works with form validation libraries</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Checkbox-specific styles
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

.example-result {
  @apply text-sm text-secondaryText mt-2;
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

