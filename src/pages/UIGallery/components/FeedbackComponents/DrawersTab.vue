<script setup lang="ts">
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VDrawer from "@/shared/ui/common/VDrawer.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Drawers instances
const { open: openRightDrawer } = useModal("drawer-right");
const { open: openLeftDrawer } = useModal("drawer-left");
const { open: openSmallDrawer } = useModal("drawer-small");
const { open: openLargeDrawer } = useModal("drawer-large");

// Code examples
const basicExample = `<script setup>
import { useModal } from '@/shared/composables/useModal';
import VDrawer from '@/shared/ui/common/VDrawer.vue';

const { open } = useModal('my-drawer');
</` + `script>

<template>
  <button @click="open">Open Drawer</button>

  <VDrawer
    id="my-drawer"
    title="My Drawer"
    position="right"
    width="md"
  >
    <p>Drawer content goes here</p>

    <template #footer>
      <VButton text="Cancel" variant="default" />
      <VButton text="Save" variant="primary" />
    </template>
  </VDrawer>
</template>`;

const advancedExample = `<VDrawer
  id="filters-drawer"
  title="Filters"
  position="right"
  width="lg"
  backdrop-blur="none"
  :close-on-backdrop="false"
  :close-on-escape="true"
  @open="handleOpen"
  @close="handleClose"
>
  <div class="space-y-4">
    <!-- Your filter form -->
    <select v-model="selectedBrand">
      <option>All Brands</option>
    </select>
  </div>

  <template #footer>
    <VButton text="Reset" @click="resetFilters" />
    <VButton text="Apply" variant="primary" />
  </template>
</VDrawer>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:panel-right"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Drawer System
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          A flexible slide-out panel system built with Vue 3 and TypeScript.
          Drawers slide in from the side of the screen, perfect for
          <strong>navigation menus</strong>, <strong>filter panels</strong>,
          and <strong>additional content</strong> without leaving the current page.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:move-horizontal"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Left & Right Position
              </h3>
              <p class="feature-description">
                Slide from either side of the screen
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:maximize-2"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Sizes
              </h3>
              <p class="feature-description">
                5 size options from small to full width
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:sparkles"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Glassmorphism
              </h3>
              <p class="feature-description">
                Beautiful glass effect on desktop
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:layers"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Auto Z-Index
              </h3>
              <p class="feature-description">
                Same modal system integration
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
            Drawer has <strong>minimal backdrop blur by default</strong>
            so users can see the content behind while interacting with filters or forms.
            Use <code>backdropBlur</code> prop to adjust: none, xs, sm, md, lg.
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>
      <div class="flex gap-4 flex-wrap">
        <button
          class="px-4 py-2 bg-primary text-white rounded-lg
            hover:bg-primary-dark transition-colors"
          @click="openRightDrawer"
        >
          Open Right Drawer
        </button>

        <button
          class="px-4 py-2 bg-secondary text-white rounded-lg
            hover:opacity-80 transition-opacity"
          @click="openLeftDrawer"
        >
          Open Left Drawer
        </button>

        <button
          class="px-4 py-2 bg-base-200 text-mainText rounded-lg
            hover:bg-base-300 transition-colors"
          @click="openSmallDrawer"
        >
          Small Drawer
        </button>

        <button
          class="px-4 py-2 bg-base-200 text-mainText rounded-lg
            hover:bg-base-300 transition-colors"
          @click="openLargeDrawer"
        >
          Large Drawer
        </button>
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
        🚀 Advanced Configuration
      </h3>
      <div class="code-block">
        <pre><code>{{ advancedExample }}</code></pre>
      </div>
    </VCard>

    <!-- Right Drawer -->
    <VDrawer
      id="drawer-right"
      title="Right Side Drawer"
      position="right"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          This is a drawer that slides in from the right side of the screen.
        </p>
        <div class="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
          <h4 class="font-semibold text-mainText mb-2">
            Key Features:
          </h4>
          <ul class="list-disc list-inside space-y-1 text-secondaryText">
            <li>Slides in from right or left</li>
            <li>Backdrop click to close</li>
            <li>ESC key support</li>
            <li>Multiple size options</li>
            <li>Fully responsive</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <VButton
          text="Cancel"
          variant="default"
        />
        <VButton
          text="Save Changes"
          variant="primary"
        />
      </template>
    </VDrawer>

    <!-- Left Drawer -->
    <VDrawer
      id="drawer-left"
      title="Left Side Drawer"
      position="left"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          This drawer opens from the left side, perfect for navigation menus.
        </p>

        <div class="space-y-2">
          <div
            v-for="i in 5"
            :key="i"
            class="p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
          >
            <div class="font-medium text-mainText">
              Menu Item {{ i }}
            </div>
            <div class="text-sm text-secondaryText">
              Description for item {{ i }}
            </div>
          </div>
        </div>
      </div>
    </VDrawer>

    <!-- Small Drawer -->
    <VDrawer
      id="drawer-small"
      title="Small Drawer"
      position="right"
      width="sm"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          A compact drawer with <code class="code-inline">width="sm"</code> prop.
        </p>
        <p class="text-secondaryText">
          Perfect for quick actions or simple forms.
        </p>
      </div>
    </VDrawer>

    <!-- Large Drawer -->
    <VDrawer
      id="drawer-large"
      title="Large Drawer"
      position="right"
      width="xl"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          A wide drawer with <code class="code-inline">width="xl"</code> prop.
        </p>
        <p class="text-secondaryText">
          Ideal for complex forms, detailed content, or data tables.
        </p>

        <div class="grid grid-cols-2 gap-4 mt-6">
          <div
            v-for="i in 8"
            :key="i"
            class="p-4 bg-base-200 rounded-lg"
          >
            <div class="font-medium text-mainText mb-1">
              Card {{ i }}
            </div>
            <div class="text-sm text-secondaryText">
              More content space available
            </div>
          </div>
        </div>
      </div>
    </VDrawer>

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VDrawer component:
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
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td>required</td>
              <td>Unique identifier for the drawer</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Drawer title text</td>
            </tr>
            <tr>
              <td><code>position</code></td>
              <td><code>'left'|'right'</code></td>
              <td><code>'right'</code></td>
              <td>Side from which drawer slides in</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td><code>'sm'|'md'|'lg'|'xl'|'full'</code></td>
              <td><code>'md'</code></td>
              <td>Width of the drawer</td>
            </tr>
            <tr>
              <td><code>showCloseButton</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Show close button in header</td>
            </tr>
            <tr>
              <td><code>closeOnBackdrop</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Close drawer when clicking backdrop</td>
            </tr>
            <tr>
              <td><code>closeOnEscape</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Close drawer when pressing ESC key</td>
            </tr>
            <tr>
              <td><code>backdropBlur</code></td>
              <td><code>'none'|'xs'|'sm'|'md'|'lg'</code></td>
              <td><code>'xs'</code></td>
              <td>Backdrop blur intensity (minimal by default)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Composable Documentation -->
    <VCard>
      <h3 class="section-title">
        useModal Composable
      </h3>
      <div class="section-description mb-4">
        The <code>useModal</code> composable provides reactive state and control methods:
      </div>

      <div class="composable-section">
        <h4 class="composable-subtitle">
          Returns:
        </h4>
        <ul class="composable-list">
          <li>
            <code>isOpen</code> - Reactive boolean indicating if drawer is open
          </li>
          <li>
            <code>zIndex</code> - Computed z-index value for the drawer
          </li>
          <li>
            <code>modal</code> - Full drawer object from store
          </li>
          <li>
            <code>open()</code> - Function to open the drawer
          </li>
          <li>
            <code>close()</code> - Function to close the drawer
          </li>
          <li>
            <code>toggle()</code> - Function to toggle drawer state
          </li>
        </ul>
      </div>

      <div class="composable-section mt-4">
        <h4 class="composable-subtitle">
          Parameters:
        </h4>
        <ul class="composable-list">
          <li>
            <code>id: string</code> - Unique identifier for the drawer
          </li>
          <li>
            <code>autoUnregister: boolean</code> - Auto cleanup on unmount (default: true)
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
        <li>✅ Slides from left or right side</li>
        <li>✅ Multiple size options (sm, md, lg, xl, full)</li>
        <li>✅ Configurable backdrop blur (none to lg)</li>
        <li>✅ Minimal blur by default for better visibility</li>
        <li>✅ Glassmorphism effect on desktop</li>
        <li>✅ ESC key to close (configurable)</li>
        <li>✅ Click backdrop to close (configurable)</li>
        <li>✅ Uses same modal system (useModal)</li>
        <li>✅ Automatic z-index management</li>
        <li>✅ TypeScript support</li>
        <li>✅ Theme-aware colors</li>
        <li>✅ Fully responsive</li>
        <li>✅ Smooth slide animations</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Drawer-specific styles
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

.composable-section {
  @apply mt-4;
}

.composable-subtitle {
  @apply text-base font-semibold text-mainText mb-3;
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

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>

