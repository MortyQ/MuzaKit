<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VFloating from "@/shared/ui/common/VFloating.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

interface LoadingItem {
  label: string;
  value: string;
  icon: string;
  loader?: boolean;
}

const selectedAction = ref<string | number | null>(null);
const loadingAction = ref<string | number | null>(null);

const basicItems = [
  { label: "Edit", value: "edit", icon: "lucide:edit" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { label: "Archive", value: "archive", icon: "lucide:archive" },
  { label: "Delete", value: "delete", icon: "lucide:trash-2" },
];

const statusItems = [
  { label: "Active", value: "active", active: true },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived", disabled: true },
];

const loadingItems = ref<LoadingItem[]>([
  { label: "Save", value: "save", icon: "lucide:save" },
  { label: "Export", value: "export", icon: "lucide:download" },
  { label: "Share", value: "share", icon: "lucide:share-2" },
]);

const handleSelect = (value: string | number) => {
  selectedAction.value = value;
  console.log("Selected:", value);
};

const handleLoadingAction = (value: string | number) => {
  loadingAction.value = value;

  const item = loadingItems.value.find((i) => i.value === value);
  if (item) {
    item.loader = true;

    setTimeout(() => {
      item.loader = false;
      loadingAction.value = null;
    }, 2000);
  }
};

const dropdownCode = `<VFloating
  :items="items"
  placement="bottom-right"
  @select="handleSelect"
>
  <template #trigger="{ isOpen }">
    <VButton variant="primary">
      Actions
      <VIcon
        icon="lucide:chevron-down"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </VButton>
  </template>
  <template #icon="{ icon }">
    <VIcon :icon="icon" :size="16" />
  </template>
</VFloating>`;

const popoverCode = `<VFloating placement="top-right">
  <template #trigger>
    <VIcon
      icon="lucide:info"
      :size="20"
      class="text-primary cursor-pointer"
    />
  </template>

  <template #content>
    <div class="max-w-xs">
      <h3 class="font-semibold mb-2">Information</h3>
      <p class="text-sm text-secondaryText">
        This is custom popover content with rich HTML.
      </p>
    </div>
  </template>
</VFloating>`;

const unstyledCode = `<VFloating
  unstyled
  content-class="bg-cardBg border border-cardBorder rounded-xl p-6 min-w-[400px] shadow-xl"
  placement="bottom-right"
>
  <template #trigger>
    <VButton icon="lucide:settings">Settings</VButton>
  </template>

  <template #content>
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Custom Styled Content</h3>
      <p class="text-sm text-secondaryText">
        Full control over styles, background, padding, width, etc.
      </p>
      <button class="w-full bg-primary text-white rounded-lg py-2">
        Save Changes
      </button>
    </div>
  </template>
</VFloating>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:layers"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VFloating Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Unified component for creating floating elements (dropdowns, popovers, tooltips).
          Automatically detects mode based on props: <strong>items</strong> for dropdown,
          <strong>content</strong> slot for popover, <strong>unstyled</strong> for full control.
          Handles positioning, scroll updates, and click-outside behavior automatically.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:menu"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Dropdown Mode
              </h3>
              <p class="feature-description">
                Pass items prop for menus
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:message-circle"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Popover Mode
              </h3>
              <p class="feature-description">
                Use content slot for rich HTML
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
                Unstyled Mode
              </h3>
              <p class="feature-description">
                Full control over styles
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
                Auto Positioning
              </h3>
              <p class="feature-description">
                Smart placement with 4 variants
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
            VFloating automatically handles positioning, scroll updates, and click-outside behavior!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Dropdown Mode -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Dropdown Mode
        </h4>
        <div class="section-description mb-4">
          Provide <code>items</code> prop for automatic dropdown rendering
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating
            :items="basicItems"
            placement="bottom-left"
            @select="handleSelect"
          >
            <template #trigger="{ isOpen }">
              <VButton variant="primary">
                Actions
                <VIcon
                  icon="lucide:chevron-down"
                  :size="16"
                  class="transition-transform"
                  :class="isOpen ? 'rotate-180' : ''"
                />
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>

          <div
            v-if="selectedAction"
            class="px-4 py-2 bg-base-200 rounded-lg"
          >
            <p class="text-sm text-secondaryText">
              Selected: <strong class="text-mainText">{{ selectedAction }}</strong>
            </p>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>{{ dropdownCode }}</code></pre>
        </div>
      </section>

      <!-- Popover Mode -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Popover Mode
        </h4>
        <div class="section-description mb-4">
          Use <code>content</code> slot for custom popover content with rich HTML
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating placement="bottom-left">
            <template #trigger>
              <VButton variant="default">
                <VIcon
                  icon="lucide:info"
                  :size="18"
                />
                Info
              </VButton>
            </template>

            <template #content>
              <div class="max-w-xs">
                <h3 class="font-semibold mb-2 text-mainText">
                  Helpful Information
                </h3>
                <p class="text-sm text-secondaryText">
                  This is a popover with custom HTML content. You can add any elements here.
                </p>
              </div>
            </template>
          </VFloating>

          <VFloating placement="bottom-left">
            <template #trigger>
              <VButton variant="positive">
                <VIcon
                  icon="lucide:help-circle"
                  :size="18"
                />
                Help
              </VButton>
            </template>

            <template #content>
              <div class="max-w-xs space-y-2">
                <h3 class="font-semibold text-mainText">
                  Need Help?
                </h3>
                <p class="text-sm text-secondaryText">
                  Check our documentation or contact support.
                </p>
                <button class="text-primary text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </template>
          </VFloating>
        </div>

        <div class="code-block mt-4">
          <pre><code>{{ popoverCode }}</code></pre>
        </div>
      </section>

      <!-- Placement Options -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Placement Options
        </h4>
        <div class="section-description mb-4">
          Control where the floating element appears: bottom-left, bottom-right, top-left, top-right
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating
            :items="basicItems"
            placement="bottom-left"
            @select="handleSelect"
          >
            <template #trigger>
              <VButton variant="primary">
                Bottom Left
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>

          <VFloating
            :items="basicItems"
            placement="bottom-right"
            @select="handleSelect"
          >
            <template #trigger>
              <VButton variant="positive">
                Bottom Right
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>

          <VFloating
            :items="basicItems"
            placement="top-left"
            @select="handleSelect"
          >
            <template #trigger>
              <VButton variant="warning">
                Top Left
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>

          <VFloating
            :items="basicItems"
            placement="top-right"
            @select="handleSelect"
          >
            <template #trigger>
              <VButton variant="negative">
                Top Right
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VFloating
  :items="items"
  placement="bottom-left"
  @select="handleSelect"
&gt;
  &lt;template #trigger&gt;
    &lt;VButton variant="primary"&gt;Bottom Left&lt;/VButton&gt;
  &lt;/template&gt;
&lt;/VFloating&gt;

&lt;VFloating placement="bottom-right"&gt;...&lt;/VFloating&gt;
&lt;VFloating placement="top-left"&gt;...&lt;/VFloating&gt;
&lt;VFloating placement="top-right"&gt;...&lt;/VFloating&gt;</code></pre>
        </div>
      </section>

      <!-- Active & Disabled States -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Active & Disabled States
        </h4>
        <div class="section-description mb-4">
          Items can be marked as active or disabled for better UX
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating
            :items="statusItems"
            placement="bottom-left"
            @select="handleSelect"
          >
            <template #trigger>
              <VButton variant="default">
                Status Options
                <VIcon
                  icon="lucide:chevron-down"
                  :size="16"
                />
              </VButton>
            </template>
          </VFloating>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VFloating
  :items="statusItems"
  placement="bottom-left"
  @select="handleSelect"
&gt;
  &lt;template #trigger&gt;
    &lt;VButton variant="default"&gt;
      Status Options
      &lt;VIcon icon="lucide:chevron-down" :size="16" /&gt;
    &lt;/VButton&gt;
  &lt;/template&gt;
&lt;/VFloating&gt;

&lt;!-- In script setup --&gt;
const statusItems = [
  { label: "Active", value: "active", active: true },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived", disabled: true },
];</code></pre>
        </div>
      </section>

      <!-- Loading States -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Loading States
        </h4>
        <div class="section-description mb-4">
          Items can show loading indicators during async operations
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating
            :items="loadingItems"
            placement="bottom-left"
            :close-on-select="false"
            @select="handleLoadingAction"
          >
            <template #trigger>
              <VButton variant="primary">
                Actions with Loading
                <VIcon
                  icon="lucide:chevron-down"
                  :size="16"
                />
              </VButton>
            </template>
            <template #icon="{ icon }">
              <VIcon
                :icon="icon"
                :size="16"
              />
            </template>
          </VFloating>

          <div
            v-if="loadingAction"
            class="px-4 py-2 bg-base-200 rounded-lg"
          >
            <p class="text-sm text-secondaryText">
              Loading: <strong class="text-mainText">{{ loadingAction }}</strong>
            </p>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VFloating
  :items="loadingItems"
  placement="bottom-left"
  :close-on-select="false"
  @select="handleLoadingAction"
&gt;
  &lt;template #trigger&gt;
    &lt;VButton variant="primary"&gt;
      Actions with Loading
      &lt;VIcon icon="lucide:chevron-down" :size="16" /&gt;
    &lt;/VButton&gt;
  &lt;/template&gt;
  &lt;template #icon="{ icon }"&gt;
    &lt;VIcon :icon="icon" :size="16" /&gt;
  &lt;/template&gt;
&lt;/VFloating&gt;

&lt;!-- In script setup --&gt;
const handleLoadingAction = (value: string | number) => {
  const item = loadingItems.value.find((i) => i.value === value);
  if (item) {
    item.loader = true;
    setTimeout(() => { item.loader = false; }, 2000);
  }
};</code></pre>
        </div>
      </section>

      <!-- Unstyled Mode -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Unstyled Mode (Full Control)
        </h4>
        <div class="section-description mb-4">
          Use <code>unstyled</code> prop to disable default styles and apply your own custom design
        </div>

        <div class="flex flex-wrap gap-4">
          <VFloating
            unstyled
            content-class="bg-gradient-to-br from-primary/10 to-primary/5 border-2
              border-primary/20 rounded-2xl p-6 min-w-[320px] shadow-2xl backdrop-blur-xl"
            placement="top-left"
          >
            <template #trigger>
              <VButton variant="primary">
                <VIcon
                  icon="lucide:palette"
                  :size="18"
                />
                Custom Styled
              </VButton>
            </template>

            <template #content>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <VIcon
                      icon="lucide:sparkles"
                      :size="20"
                      class="text-white"
                    />
                  </div>
                  <h3 class="text-lg font-bold text-mainText">
                    Custom Design
                  </h3>
                </div>

                <p class="text-sm text-secondaryText">
                  Full control over background, borders, padding, shadows, and all styles!
                </p>

                <div class="flex gap-2">
                  <button
                    class="flex-1 bg-primary text-white rounded-lg py-2 font-medium
                      hover:bg-primary/90 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    class="flex-1 bg-base-200 text-mainText rounded-lg py-2 font-medium
                      hover:bg-base-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </template>
          </VFloating>
        </div>

        <div class="code-block mt-4">
          <pre><code>{{ unstyledCode }}</code></pre>
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
              icon="lucide:menu"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Dropdown Mode
            </h4>
            <p class="feature-card-description">
              Pass items array for automatic menu
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:message-circle"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Popover Mode
            </h4>
            <p class="feature-card-description">
              Use content slot for rich HTML
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:palette"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Unstyled Mode
            </h4>
            <p class="feature-card-description">
              Full control over styles with unstyled prop
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:move"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Smart Positioning
            </h4>
            <p class="feature-card-description">
              4 placement variants with auto positioning
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:loader-2"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Loading States
            </h4>
            <p class="feature-card-description">
              Built-in async operation support
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:check-circle"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Active & Disabled
            </h4>
            <p class="feature-card-description">
              Item states for better UX
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:mouse-pointer-click"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Click Outside
            </h4>
            <p class="feature-card-description">
              Automatic close on outside click
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:scroll"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Scroll Aware
            </h4>
            <p class="feature-card-description">
              Updates position on scroll and resize
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:zap"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Teleport Support
            </h4>
            <p class="feature-card-description">
              Renders to body for proper z-index
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
        Available props for VFloating component:
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
              <td><code>items</code></td>
              <td><code>FloatingItem[]</code></td>
              <td><code>[]</code></td>
              <td>Array of menu items for dropdown mode</td>
            </tr>
            <tr>
              <td><code>placement</code></td>
              <td><code>'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'</code></td>
              <td><code>'bottom-left'</code></td>
              <td>Position of the floating element</td>
            </tr>
            <tr>
              <td><code>unstyled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable default styles for full control</td>
            </tr>
            <tr>
              <td><code>contentClass</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Custom CSS classes for content wrapper</td>
            </tr>
            <tr>
              <td><code>closeOnSelect</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Auto-close dropdown after item selection</td>
            </tr>
            <tr>
              <td><code>offset</code></td>
              <td><code>number</code></td>
              <td><code>8</code></td>
              <td>Distance between trigger and floating element (px)</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable opening the floating element</td>
            </tr>
            <tr>
              <td><code>teleport</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Teleport content to body for proper z-index</td>
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
            <code>trigger</code> - Trigger element that opens the floating content
          </li>
          <li>
            <code>content</code> - Custom content for popover mode
          </li>
          <li>
            <code>icon</code> - Custom icon renderer for dropdown items
          </li>
        </ul>
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
            <code>@select</code> - Emitted when dropdown item is selected.
            Payload: <code>(value: string | number)</code>
          </li>
          <li>
            <code>@open</code> - Emitted when floating element opens
          </li>
          <li>
            <code>@close</code> - Emitted when floating element closes
          </li>
        </ul>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>

