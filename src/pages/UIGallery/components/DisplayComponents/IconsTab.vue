<script setup lang="ts">
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Code examples
const basicExample = `<script setup>
import VIcon from '@/shared/ui/common/VIcon.vue';
</` + `script>

<template>
  <!-- Basic usage -->
  <VIcon icon="mdi:home" />

  <!-- With size -->
  <VIcon icon="mdi:home" :size="32" />

  <!-- With color -->
  <VIcon icon="mdi:home" color="#3b82f6" />

  <!-- All together -->
  <VIcon
    icon="mdi:home"
    :size="48"
    color="currentColor"
  />
</template>`;

const advancedExample = `// Dynamic icons in v-for
const navigationItems = [
  { id: 1, name: 'Home', icon: 'mdi:home' },
  { id: 2, name: 'Search', icon: 'mdi:search' },
  { id: 3, name: 'Settings', icon: 'mdi:settings' },
];

// With buttons
<button class="btn">
  <VIcon icon="mdi:plus" :size="20" />
  <span>Add Item</span>
</button>

// Conditional icons
<VIcon
  :icon="isActive ? 'mdi:check' : 'mdi:close'"
  :color="isActive ? '#10b981' : '#ef4444'"
/>

// Loading state
<VIcon icon="mdi:loading" :loading="true" />`;

// Example of dynamic icon in array
const navigationItems = [
  { id: 1, name: "Home", icon: "mdi:home" },
  { id: 2, name: "Search", icon: "mdi:search" },
  { id: 3, name: "Settings", icon: "mdi:settings" },
  { id: 4, name: "User Profile", icon: "mdi:user" },
];

const actionButtons = [
  { action: "add", icon: "mdi:plus", color: "#10b981" },
  { action: "edit", icon: "mdi:edit", color: "#3b82f6" },
  { action: "delete", icon: "mdi:delete", color: "#ef4444" },
  { action: "check", icon: "mdi:check", color: "#8b5cf6" },
];
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:shapes"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VIcon Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Flexible icon component powered by <strong>Iconify</strong>.
          Access thousands of icons from multiple collections with a unified API.
          Supports dynamic imports, custom sizes, colors, and loading states.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:package"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Collections
              </h3>
              <p class="feature-description">
                Material Design, Heroicons, Lucide, and more
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:zap"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Dynamic Import
              </h3>
              <p class="feature-description">
                Only loads icons you actually use
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:palette"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Customizable
              </h3>
              <p class="feature-description">
                Custom sizes, colors, and styles
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
                Type Safe
              </h3>
              <p class="feature-description">
                Full TypeScript support with auto-completion
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
            Add new icons to src/shared/config/icons.ts for auto-completion
            and type safety!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic Usage -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic Icons
        </h4>
        <div class="flex gap-4 items-center flex-wrap">
          <VIcon icon="mdi:home" />
          <VIcon icon="mdi:search" />
          <VIcon icon="mdi:settings" />
          <VIcon icon="mdi:user" />
          <VIcon icon="mdi:menu" />
        </div>
      </section>

      <!-- Different Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Different Sizes
        </h4>
        <div class="flex gap-4 items-center flex-wrap">
          <VIcon
            icon="mdi:home"
            :size="16"
          />
          <VIcon
            icon="mdi:home"
            :size="24"
          />
          <VIcon
            icon="mdi:home"
            :size="32"
          />
          <VIcon
            icon="mdi:home"
            :size="48"
          />
          <VIcon
            icon="mdi:home"
            :size="64"
          />
        </div>
      </section>

      <!-- Different Colors -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Different Colors
        </h4>
        <div class="flex gap-4 items-center flex-wrap">
          <VIcon
            icon="mdi:home"
            :size="32"
            color="#ef4444"
          />
          <VIcon
            icon="mdi:home"
            :size="32"
            color="#10b981"
          />
          <VIcon
            icon="mdi:home"
            :size="32"
            color="#3b82f6"
          />
          <VIcon
            icon="mdi:home"
            :size="32"
            color="#f59e0b"
          />
          <VIcon
            icon="mdi:home"
            :size="32"
            color="#8b5cf6"
          />
        </div>
      </section>

      <!-- Dynamic Icons in v-for -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Dynamic Icons (v-for)
        </h4>
        <div class="flex gap-4 flex-wrap">
          <div
            v-for="item in navigationItems"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 bg-cardBg border border-cardBorder rounded-lg"
          >
            <VIcon
              :icon="item.icon"
              :size="20"
              color="currentColor"
            />
            <span class="text-mainText">{{ item.name }}</span>
          </div>
        </div>
      </section>

      <!-- Action Buttons with Icons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Action Buttons with Colored Icons
        </h4>
        <div class="flex gap-4 flex-wrap">
          <VButton
            v-for="btn in actionButtons"
            :key="btn.action"
          >
            <VIcon
              :icon="btn.icon"
              :size="20"
              :color="btn.color"
            />
            <span class="capitalize">{{ btn.action }}</span>
          </VButton>
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
        Available props for VIcon component:
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
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td>required</td>
              <td>Icon name in format "collection:name" (e.g., "mdi:home")</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>string | number</code></td>
              <td><code>24</code></td>
              <td>Icon size in pixels</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td><code>string</code></td>
              <td><code>'currentColor'</code></td>
              <td>Icon color (CSS color value)</td>
            </tr>
            <tr>
              <td><code>class</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Additional CSS classes</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading spinner icon</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Icon Collections -->
    <VCard>
      <h3 class="section-title mb-6">
        📦 Icon Collections
      </h3>

      <div class="collections-container">
        <!-- Material Design Icons -->
        <div class="collection-item">
          <h4 class="collection-title">
            Material Design Icons (mdi)
          </h4>
          <div class="flex gap-4 items-center flex-wrap">
            <VIcon
              icon="mdi:home"
              :size="32"
            />
            <VIcon
              icon="mdi:alert"
              :size="32"
            />
            <VIcon
              icon="mdi:info"
              :size="32"
            />
            <VIcon
              icon="mdi:check"
              :size="32"
            />
            <VIcon
              icon="mdi:close"
              :size="32"
            />
          </div>
        </div>

        <!-- Heroicons -->
        <div class="collection-item">
          <h4 class="collection-title">
            Heroicons
          </h4>
          <div class="flex gap-4 items-center flex-wrap">
            <VIcon
              icon="heroicons:home-solid"
              :size="32"
            />
            <VIcon
              icon="heroicons:user-solid"
              :size="32"
            />
            <VIcon
              icon="heroicons:cog-solid"
              :size="32"
            />
            <VIcon
              icon="heroicons:x-mark-solid"
              :size="32"
            />
          </div>
        </div>

        <!-- Lucide -->
        <div class="collection-item">
          <h4 class="collection-title">
            Lucide Icons
          </h4>
          <div class="flex gap-4 items-center flex-wrap">
            <VIcon
              icon="lucide:home"
              :size="32"
            />
            <VIcon
              icon="lucide:user"
              :size="32"
            />
            <VIcon
              icon="lucide:settings"
              :size="32"
            />
            <VIcon
              icon="lucide:menu"
              :size="32"
            />
          </div>
        </div>
      </div>
    </VCard>

    <!-- Chevrons and Arrows -->
    <VCard>
      <h3 class="section-title mb-4">
        🧭 Navigation Icons
      </h3>
      <div class="flex gap-4 items-center flex-wrap">
        <VIcon
          icon="mdi:chevron-left"
          :size="32"
        />
        <VIcon
          icon="mdi:chevron-right"
          :size="32"
        />
        <VIcon
          icon="mdi:chevron-up"
          :size="32"
        />
        <VIcon
          icon="mdi:chevron-down"
          :size="32"
        />
        <VIcon
          icon="mdi:arrow-left"
          :size="32"
        />
        <VIcon
          icon="mdi:arrow-right"
          :size="32"
        />
      </div>
    </VCard>

    <!-- Loading Icon -->
    <VCard>
      <h3 class="section-title mb-4">
        ⏳ Animated Icons
      </h3>
      <div class="flex gap-4 items-center">
        <VIcon
          icon="mdi:loading"
          :size="32"
          class="animate-spin"
        />
        <span class="text-secondaryText">Loading...</span>
      </div>
    </VCard>

    <!-- Usage Information -->
    <VCard>
      <h3 class="section-title mb-4">
        📚 Usage Information
      </h3>
      <ul class="features-list">
        <li>
          <strong>Icon Format:</strong> Use "collection:name" format
          (e.g., "mdi:home", "heroicons:user-solid")
        </li>
        <li>
          <strong>Size:</strong> Pass number (pixels) or string with units
        </li>
        <li>
          <strong>Color:</strong> Use any valid CSS color
          (hex, rgb, named colors, or "currentColor")
        </li>
        <li>
          <strong>Dynamic Usage:</strong> Works perfectly with v-for loops and dynamic data
        </li>
        <li>
          <strong>Add New Icons:</strong> Add to src/shared/config/icons.ts for auto-completion
        </li>
      </ul>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Access to thousands of icons from Iconify</li>
        <li>✅ Multiple icon collections (MDI, Heroicons, Lucide, etc.)</li>
        <li>✅ Tree-shakable - only bundles icons you use</li>
        <li>✅ Fully customizable size and color</li>
        <li>✅ TypeScript support with auto-completion</li>
        <li>✅ Loading state support</li>
        <li>✅ Works with dynamic data and v-for</li>
        <li>✅ Fallback icon for missing imports</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Icon-specific styles
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

.collections-container {
  @apply flex flex-col gap-6;
}

.collection-item {
  @apply flex flex-col gap-3;
}

.collection-title {
  @apply text-base font-semibold text-mainText;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}

// Animation for loading icon
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
