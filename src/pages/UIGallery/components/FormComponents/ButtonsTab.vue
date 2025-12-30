<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

const isLoading = ref(false);

const handleLoadingClick = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};

// Code examples
const basicExample = `<script setup>
import VButton from '@/shared/ui/common/VButton.vue';
  </` + `script>

<template>
  <!-- Basic button -->
  <VButton text="Click me" />

  <!-- With icon -->
  <VButton
    text="Save"
    icon="mdi:content-save"
  />

  <!-- Different variants -->
  <VButton text="Primary" variant="primary" />
  <VButton text="Positive" variant="positive" />
  <VButton text="Negative" variant="negative" />
  <VButton text="Warning" variant="warning" />
  <VButton text="Link" variant="link" />
</template>`;

const advancedExample = `// With loading state
<VButton
  text="Save"
  :loading="isLoading"
  @click="handleSave"
/>

// As router link
<VButton
  text="Go to Home"
  to="/"
  icon="mdi:home"
/>

// Icon only button
<VButton
  icon="mdi:delete"
  variant="negative"
/>

// Disabled button
<VButton
  text="Disabled"
  disabled
/>

// With custom content
<VButton>
  <VIcon icon="mdi:plus" />
  <span>Add New Item</span>
</VButton>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:mouse-pointer-click"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VButton Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Versatile button component with multiple variants, loading states, and router integration.
          Supports icons, custom content, and can function as both <strong>button</strong> and
          <strong>router link</strong>.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:palette"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Variants
              </h3>
              <p class="feature-description">
                Primary, positive, negative, warning, link
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:loader"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Loading State
              </h3>
              <p class="feature-description">
                Built-in spinner for async operations
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:link"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Router Integration
              </h3>
              <p class="feature-description">
                Works as RouterLink with 'to' prop
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:sparkles"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Icon Support
              </h3>
              <p class="feature-description">
                Icon-only or with text
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
            VButton automatically becomes RouterLink when 'to' prop is provided!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Variants -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Button Variants
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            text="Default"
            variant="default"
          />
          <VButton
            text="Primary"
            variant="primary"
          />
          <VButton
            text="Positive"
            variant="positive"
          />
          <VButton
            text="Negative"
            variant="negative"
          />
          <VButton
            text="Warning"
            variant="warning"
          />
          <VButton
            text="Link"
            variant="link"
          />
        </div>
      </section>

      <!-- With Icons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Buttons with Icons
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            text="Save"
            icon="mdi:content-save"
            variant="primary"
          />
          <VButton
            text="Delete"
            icon="mdi:delete"
            variant="negative"
          />
          <VButton
            text="Edit"
            icon="mdi:pencil"
            variant="warning"
          />
          <VButton
            text="Download"
            icon="mdi:download"
            variant="positive"
          />
        </div>
      </section>

      <!-- Icon Only -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Icon Only Buttons
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            icon="mdi:plus"
            variant="primary"
          />
          <VButton
            icon="mdi:delete"
            variant="negative"
          />
          <VButton
            icon="mdi:pencil"
            variant="warning"
          />
          <VButton
            icon="mdi:check"
            variant="positive"
          />
          <VButton
            icon="mdi:close"
            variant="default"
          />
        </div>
      </section>

      <!-- Loading State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Loading State
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            text="Click to Load"
            variant="primary"
            :loading="isLoading"
            @click="handleLoadingClick"
          />
          <VButton
            text="Always Loading"
            variant="positive"
            :loading="true"
          />
        </div>
      </section>

      <!-- Disabled State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled State
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            text="Disabled"
            variant="primary"
            disabled
          />
          <VButton
            text="Disabled"
            icon="mdi:lock"
            variant="negative"
            disabled
          />
        </div>
      </section>

      <!-- As Router Link -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          As Router Link
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            text="Go to Home"
            to="/"
            icon="mdi:home"
            variant="link"
          />
          <VButton
            text="Components"
            to="/components"
            icon="mdi:puzzle"
            variant="primary"
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

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VButton component:
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
              <td><code>text</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Button text content</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>'button' | 'submit' | 'reset'</code></td>
              <td><code>'button'</code></td>
              <td>HTML button type</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>
                <code>'default' | 'primary' | 'positive' | 'negative' | 'warning' | 'link'
                </code>
              </td>
              <td><code>'default'</code></td>
              <td>Visual style variant</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Icon name (Iconify format)</td>
            </tr>
            <tr>
              <td><code>loader</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading spinner</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable button interactions</td>
            </tr>
            <tr>
              <td><code>to</code></td>
              <td><code>string | object</code></td>
              <td><code>undefined</code></td>
              <td>Router link destination</td>
            </tr>
            <tr>
              <td><code>replace</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Replace history entry (RouterLink)</td>
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
            <code>default</code> - Custom button content (replaces text)
          </li>
          <li>
            <code>iconLeft</code> - Custom left icon content
          </li>
          <li>
            <code>iconRight</code> - Custom right icon content
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
        <li>✅ Multiple visual variants for different actions</li>
        <li>✅ Loading state with automatic spinner</li>
        <li>✅ Icon support (left, right, or icon-only)</li>
        <li>✅ Works as RouterLink with 'to' prop</li>
        <li>✅ Disabled and loading states</li>
        <li>✅ Custom content via slots</li>
        <li>✅ Accessible with proper ARIA attributes</li>
        <li>✅ Theme-aware styling</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Button-specific styles
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
