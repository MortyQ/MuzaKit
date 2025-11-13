<script setup lang="ts">
import { useModal } from "@/shared/composables/useModal";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VModal from "@/shared/ui/common/VModal.vue";

const modal1 = useModal("modal-1", false);
const modal2 = useModal("modal-2", false);
const modal3 = useModal("modal-3", false);

// Code examples
const basicExample = `<script setup>
import { useModal } from '@/shared/composables/useModal';
import VModal from '@/shared/ui/common/VModal.vue';

const modal = useModal('my-modal');
</` + `script>

<template>
  <button @click="modal.open">Open Modal</button>

  <VModal
    id="my-modal"
    title="My Modal"
    max-width="md"
  >
    <p>Modal content goes here</p>

    <template #footer>
      <button @click="modal.close">Close</button>
    </template>
  </VModal>
</template>`;

const advancedExample = `<VModal
  id="advanced-modal"
  title="Advanced Modal"
  max-width="lg"
  :close-on-backdrop="false"
  :close-on-escape="true"
  :show-close-button="true"
  @open="handleOpen"
  @close="handleClose"
>
  <div class="space-y-4">
    <p>Content with custom behavior</p>
    <button @click="openAnotherModal">
      Open Another Modal
    </button>
  </div>

  <template #header>
    <h3 class="custom-header">Custom Header</h3>
  </template>

  <template #footer>
    <button @click="handleCancel">Cancel</button>
    <button @click="handleConfirm">Confirm</button>
  </template>
</VModal>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:layout-panel-top"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Modal System
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          A powerful and flexible modal system built with Vue 3, Pinia, and TypeScript.
          Features automatic <strong>z-index management</strong>, multiple modals support,
          and full customization options.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
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
                Automatic z-index management for multiple modals
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:boxes"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Modals
              </h3>
              <p class="feature-description">
                Open multiple modals simultaneously
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:settings-2"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Fully Customizable
              </h3>
              <p class="feature-description">
                Custom headers, footers, and behavior
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:smartphone"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Responsive
              </h3>
              <p class="feature-description">
                Works seamlessly on all devices
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
            The modal system uses Pinia for state management and automatically
            handles registration/cleanup!
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
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          @click="modal1.open"
        >
          Open Modal 1
        </button>

        <button
          class="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-80 transition-opacity"
          @click="modal2.open"
        >
          Open Modal 2
        </button>

        <button
          class="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-80 transition-opacity"
          @click="modal3.open"
        >
          Open Modal 3
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

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VModal component:
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
              <td>Unique identifier for the modal</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Modal title text</td>
            </tr>
            <tr>
              <td><code>maxWidth</code></td>
              <td><code>'sm'|'md'|'lg'|'xl'|'2xl'|'full'</code></td>
              <td><code>'md'</code></td>
              <td>Maximum width of modal</td>
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
              <td>Close modal when clicking backdrop</td>
            </tr>
            <tr>
              <td><code>closeOnEscape</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Close modal when pressing ESC key</td>
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
            <code>isOpen</code> - Reactive boolean indicating if modal is open
          </li>
          <li>
            <code>zIndex</code> - Computed z-index value for the modal
          </li>
          <li>
            <code>modal</code> - Full modal object from store
          </li>
          <li>
            <code>open()</code> - Function to open the modal
          </li>
          <li>
            <code>close()</code> - Function to close the modal
          </li>
          <li>
            <code>toggle()</code> - Function to toggle modal state
          </li>
        </ul>
      </div>

      <div class="composable-section mt-4">
        <h4 class="composable-subtitle">
          Parameters:
        </h4>
        <ul class="composable-list">
          <li>
            <code>id: string</code> - Unique identifier for the modal
          </li>
          <li>
            <code>autoUnregister: boolean</code> - Auto cleanup on unmount (default: true)
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Modal 1 -->
    <VModal
      id="modal-1"
      title="First Modal"
      max-width="md"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          This is the first modal. You can open multiple modals at the same time.
          The z-index is automatically managed.
        </p>
        <button
          class="px-4 py-2 bg-primary text-white rounded-lg"
          @click="modal2.open"
        >
          Open Modal 2 from here
        </button>
      </div>

      <template #footer>
        <button
          class="px-4 py-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
          @click="modal1.close"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          @click="modal1.close"
        >
          Confirm
        </button>
      </template>
    </VModal>

    <!-- Modal 2 -->
    <VModal
      id="modal-2"
      title="Second Modal"
      max-width="lg"
      :close-on-backdrop="false"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          This modal doesn't close when clicking on the backdrop.
          Click the close button or press ESC to close it.
        </p>
        <button
          class="px-4 py-2 bg-accent text-white rounded-lg"
          @click="modal3.open"
        >
          Open Modal 3
        </button>
      </div>

      <template #footer>
        <button
          class="px-4 py-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
          @click="modal2.close"
        >
          Close
        </button>
      </template>
    </VModal>

    <!-- Modal 3 -->
    <VModal
      id="modal-3"
      title="Third Modal - Small"
      max-width="sm"
    >
      <div class="space-y-4">
        <p class="text-secondaryText">
          This is a smaller modal. All modals are responsive and work on mobile devices.
        </p>
        <div class="p-4 bg-lightPositive rounded-lg">
          <p class="text-sm text-positive-dark">
            ✅ Z-index is automatically managed
          </p>
        </div>
      </div>

      <template #footer>
        <button
          class="px-4 py-2 bg-negative text-white rounded-lg
          hover:bg-negative-dark transition-colors"
          @click="modal3.close"
        >
          Close
        </button>
      </template>
    </VModal>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Automatic z-index management</li>
        <li>✅ Multiple modals support</li>
        <li>✅ ESC key to close (configurable)</li>
        <li>✅ Click backdrop to close (configurable)</li>
        <li>✅ Fully reactive with Pinia</li>
        <li>✅ TypeScript support</li>
        <li>✅ Theme-aware colors</li>
        <li>✅ Responsive design</li>
        <li>✅ Smooth transitions</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Modal-specific styles
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
