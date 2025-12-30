<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VSwitch from "@/shared/ui/common/VSwitch.vue";

// Reactive states for live examples
const basicSwitch = ref(false);
const coloredSwitch = ref(true);
const iconSwitch = ref(false);
const disabledSwitch = ref(true);

// Code examples
const basicExample = `<script setup>
import { ref } from 'vue';
import VSwitch from '@/shared/ui/common/VSwitch.vue';

const enabled = ref(false);
  </` + `script>

<template>
  <VSwitch
    v-model="enabled"
    true-label="Enabled"
    false-label="Disabled"
  />
</template>`;

const advancedExample = `// Colored switch
<VSwitch
  v-model="on"
  color="#10b981"
  true-label="Active"
  false-label="Inactive"
/>

// With icons
<VSwitch
  v-model="darkMode"
  true-icon="mdi:moon-waning-crescent"
  false-icon="mdi:white-balance-sunny"
  true-label="Dark"
  false-label="Light"
/>

// Disabled state
<VSwitch
  v-model="value"
  disabled
  true-label="Can't change"
/>

// Custom color
<VSwitch
  v-model="premium"
  color="#f59e0b"
  true-label="Premium"
  false-label="Free"
/>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:toggle-left"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VSwitch Component
        </h2>
      </div>
      <div class="info-content">
        <p class="info-description">
          Accessible toggle switch supporting
          <strong>labels, icons, custom colors, disabled state</strong>
          and semantic markup.
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
                Boolean Binding
              </h3>
              <p class="feature-description">
                Simple true/false v-model
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
                Custom Colors
              </h3>
              <p class="feature-description">
                Override active color
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:sun"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Icon Support
              </h3>
              <p class="feature-description">
                Different icons per state
              </p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:shield"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Disabled State
              </h3>
              <p class="feature-description">
                Prevent interactions
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
            Use <code>true-label</code> /
            <code>false-label</code>
            props for accessible visible text.
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic
        </h4>
        <VSwitch
          v-model="basicSwitch"
          true-label="On"
          false-label="Off"
        />
      </section>
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Colored
        </h4>
        <VSwitch
          v-model="coloredSwitch"
          color="#3b82f6"
          true-label="Blue"
          false-label="Gray"
        />
      </section>
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Icons
        </h4>
        <VSwitch
          v-model="iconSwitch"
          true-icon="mdi:moon-waning-crescent"
          false-icon="mdi:white-balance-sunny"
          true-label="Dark"
          false-label="Light"
        />
      </section>
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled
        </h4>
        <VSwitch
          v-model="disabledSwitch"
          disabled
          true-label="Locked"
        />
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
        Available props for VSwitch component:
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
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Current switch value (v-model)</td>
            </tr>
            <tr>
              <td><code>trueLabel</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Label text when active</td>
            </tr>
            <tr>
              <td><code>falseLabel</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Label text when inactive</td>
            </tr>
            <tr>
              <td><code>trueIcon</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Icon when active</td>
            </tr>
            <tr>
              <td><code>falseIcon</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Icon when inactive</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Active background color override</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable toggle interactions</td>
            </tr>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td><code>auto</code></td>
              <td>Custom input id (for accessibility)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Boolean v-model binding</li>
        <li>✅ Custom labels per state</li>
        <li>✅ Optional per-state icons</li>
        <li>✅ Custom active color</li>
        <li>✅ Disabled state support</li>
        <li>✅ Accessible labeling</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Switch-specific styles
.examples-section {
  @apply mb-6 last:mb-0;
}

.examples-subtitle {
  @apply text-base font-semibold text-mainText mb-3;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}

// Props table
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
</style>
