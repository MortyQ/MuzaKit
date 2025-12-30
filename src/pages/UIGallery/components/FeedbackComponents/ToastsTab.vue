<script setup lang="ts">
import { ref } from "vue";

import { useToast } from "@/shared/composables";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

const toast = useToast();

// Code examples
const basicExample = `<script setup>
import { useToast } from '@/shared/composables';

const toast = useToast();

// Show different toast types
toast.success('Success!', 'Operation completed successfully');
toast.error('Error!', 'Something went wrong');
toast.warning('Warning!', 'Please be careful');
toast.info('Info', 'Here is some information');
  </` + `script>

<template>
  <button @click="toast.success('Done!')">
    Show Success
  </button>
</template>`;

const advancedExample = `// Promise toast - automatically shows loading, success, or error
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

toast.promise(fetchData(), {
  loading: 'Loading data...',
  success: 'Data loaded successfully!',
  error: 'Failed to load data'
});

// Custom toast with options
toast.custom('Custom notification', {
  description: 'With custom options',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked')
  }
});

// Dismiss specific toast or all toasts
const toastId = toast.custom('This can be dismissed');
toast.dismiss(toastId); // Dismiss specific
toast.dismiss(); // Dismiss all`;

// State for promise toast demo
const isLoadingPromise = ref(false);

// Demo functions
const showSuccess = () => {
  toast.success("Success!", "Your operation completed successfully.");
};

const showError = () => {
  toast.error("Error occurred!", "Something went wrong. Please try again.");
};

const showWarning = () => {
  toast.warning("Warning!", "Please check your input before continuing.");
};

const showInfo = () => {
  toast.info("Information", "This is an informational message for you.");
};

const showSimple = () => {
  toast.custom("Simple notification without type");
};

const showPromise = () => {
  isLoadingPromise.value = true;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({ data: "Success data" });
      }
      else {
        reject(new Error("Failed to load"));
      }
      isLoadingPromise.value = false;
    }, 2000);
  });

  toast.promise(promise, {
    loading: "Loading data...",
    success: "Data loaded successfully!",
    error: "Failed to load data",
  });
};

const showWithAction = () => {
  toast.custom("Task completed", {
    description: "Click the button to view details",
  });
};
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:message-square"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          Toast Notifications
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Beautiful toast notifications powered by <strong>vue-sonner</strong>,
          automatically styled to match your theme. Perfect for user feedback,
          loading states, and async operations.
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
                Theme Aware
              </h3>
              <p class="feature-description">
                Auto adapts to light/dark theme
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
                Promise Support
              </h3>
              <p class="feature-description">
                Built-in loading states for async operations
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:bell"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Types
              </h3>
              <p class="feature-description">
                Success, error, warning, info, and custom
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:zap"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Easy to Use
              </h3>
              <p class="feature-description">
                Simple API with powerful features
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
            Toast notifications are non-blocking and automatically dismiss after
            a set duration!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <div class="mb-4">
        <h4 class="text-base font-semibold text-mainText mb-3">
          Basic Toast Types
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            variant="positive"
            text="Success Toast"
            icon="mdi:check-circle"
            @click="showSuccess"
          />
          <VButton
            variant="negative"
            text="Error Toast"
            icon="mdi:alert-circle"
            @click="showError"
          />
          <VButton
            variant="warning"
            text="Warning Toast"
            icon="mdi:alert"
            @click="showWarning"
          />
          <VButton
            variant="primary"
            text="Info Toast"
            icon="mdi:information"
            @click="showInfo"
          />
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold text-mainText mb-3">
          Advanced Features
        </h4>
        <div class="flex flex-wrap gap-3">
          <VButton
            variant="default"
            text="Simple Toast"
            icon="mdi:message-text"
            @click="showSimple"
          />
          <VButton
            variant="primary"
            text="Promise Toast"
            icon="mdi:loading"
            :disabled="isLoadingPromise"
            @click="showPromise"
          />
          <VButton
            variant="link"
            text="Custom Toast"
            icon="mdi:gesture-tap"
            @click="showWithAction"
          />
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
        🚀 Advanced Features
      </h3>
      <div class="code-block">
        <pre><code>{{ advancedExample }}</code></pre>
      </div>
    </VCard>

    <!-- Methods Documentation -->
    <VCard>
      <h3 class="section-title">
        Available Methods
      </h3>
      <div class="section-description mb-4">
        The useToast composable provides these methods:
      </div>

      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Parameters</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>success()</code></td>
              <td><code>message, description?</code></td>
              <td>Show success toast with green color</td>
            </tr>
            <tr>
              <td><code>error()</code></td>
              <td><code>message, description?</code></td>
              <td>Show error toast with red color</td>
            </tr>
            <tr>
              <td><code>warning()</code></td>
              <td><code>message, description?</code></td>
              <td>Show warning toast with orange color</td>
            </tr>
            <tr>
              <td><code>info()</code></td>
              <td><code>message, description?</code></td>
              <td>Show info toast with blue color</td>
            </tr>
            <tr>
              <td><code>promise()</code></td>
              <td><code>promise, options</code></td>
              <td>Show loading/success/error based on promise state</td>
            </tr>
            <tr>
              <td><code>custom()</code></td>
              <td><code>message, options?</code></td>
              <td>Show custom toast with full control</td>
            </tr>
            <tr>
              <td><code>dismiss()</code></td>
              <td><code>toastId?</code></td>
              <td>Dismiss specific toast or all toasts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Composable Documentation -->
    <VCard>
      <h3 class="section-title">
        useToast Composable
      </h3>
      <div class="section-description mb-4">
        Simple and powerful toast notification system built on top of vue-sonner.
      </div>

      <div class="composable-section">
        <h4 class="composable-subtitle">
          Features:
        </h4>
        <ul class="composable-list">
          <li>
            Automatically adapts to your light/dark theme
          </li>
          <li>
            Uses your project's custom color variables
          </li>
          <li>
            Promise support with automatic loading/success/error states
          </li>
          <li>
            Customizable duration (default: 4-5 seconds)
          </li>
          <li>
            Optional description text for more context
          </li>
          <li>
            Action buttons and custom handlers
          </li>
          <li>
            Non-blocking and dismissible
          </li>
        </ul>
      </div>

      <div class="composable-section mt-4">
        <h4 class="composable-subtitle">
          Promise Options:
        </h4>
        <ul class="composable-list">
          <li>
            <code>loading: string</code> - Message shown while promise is pending
          </li>
          <li>
            <code>success: string | function</code> - Message or function for success
          </li>
          <li>
            <code>error: string | function</code> - Message or function for error
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
        <li>✅ Automatically adapts to your light/dark theme</li>
        <li>✅ Uses your project's custom color variables</li>
        <li>✅ Smooth animations and transitions</li>
        <li>✅ Close button for manual dismissal</li>
        <li>✅ Promise toasts with loading states</li>
        <li>✅ Custom actions and cancel buttons</li>
        <li>✅ TypeScript support</li>
        <li>✅ Accessible and keyboard navigable</li>
        <li>✅ Position customization</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Toast-specific styles
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
</style>
