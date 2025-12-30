<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VTabs, { ITab } from "@/shared/ui/common/VTabs.vue";

const tabsBasic: ITab[] = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "settings", label: "Settings", disabled: true },
];

const controlledTabs: ITab[] = [
  { id: "first", label: "First", activeByDefault: true },
  { id: "second", label: "Second" },
  { id: "third", label: "Third" },
];

const lastSelected = ref("first");

const handleControlled = (payload: { tabId: string, callback: () => void }) => {
  // Simulate async validation before switching
  setTimeout(() => {
    lastSelected.value = payload.tabId;
    payload.callback();
  }, 500);
};

const basicExample = `<script setup>
import { ref } from 'vue';
import VTabs from '@/shared/ui/common/VTabs.vue';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
];
  </` + `script>

<template>
  <VTabs :tabs="tabs" />
</template>`;

const advancedExample = `// Controlled mode with async approval
<VTabs
  :tabs="controlledTabs"
  tab-selection-mode="controlled"
  @tab-selected="handleControlled"
/>

// Using URL hash sync
<VTabs
  :tabs="tabs"
  use-hash
/>

// With disabled tabs
<VTabs
  :tabs="tabs"
  :use-hash="false"
/>

// Custom active tab
<VTabs
  :tabs="tabs"
  active-tab-id="details"
/>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:folder"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VTabs Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Flexible tab system with hash sync, controlled mode,
          disabled tabs, and custom icons support.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:hash"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Hash Sync
              </h3>
              <p class="feature-description">
                Persists active tab in URL
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:shield"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Controlled Mode
              </h3>
              <p class="feature-description">
                Approve tab switch manually
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:slash"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Disabled Tabs
              </h3>
              <p class="feature-description">
                Skip non-active tabs
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
                Events
              </h3>
              <p class="feature-description">
                Listen to selections
              </p>
            </div>
          </div>
        </div>

        <div class="info-note">
          <VIcon
            icon="lucide:info"
            :size="16"
          />
          <span>Use tabSelectionMode="controlled" for async approval flows.</span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic
        </h4>
        <VTabs
          :tabs="tabsBasic"
          :use-hash="false"
        />
      </section>

      <!-- Controlled -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Controlled
        </h4>
        <VTabs
          :use-hash="false"
          :tabs="controlledTabs"
          tab-selection-mode="controlled"
          @tab-selected="handleControlled"
        />
        <p class="example-result">
          Last selected: {{ lastSelected }}
        </p>
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

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ URL hash synchronization</li>
        <li>✅ Controlled selection mode</li>
        <li>✅ Disabled tabs support</li>
        <li>✅ Tab selection events</li>
        <li>✅ Icons per tab (extendable)</li>
        <li>✅ Accessible keyboard navigation</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Tabs-specific styles
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
