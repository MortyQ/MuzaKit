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
          <strong>VFloating</strong> is a unified component for creating floating elements
          (dropdowns, popovers, tooltips). It automatically detects the mode based on props:
        </p>
        <ul class="feature-list">
          <li><strong>Dropdown Mode:</strong> when <code>items</code> prop is provided</li>
          <li><strong>Popover Mode:</strong> when <code>content</code> slot is used</li>
          <li><strong>Unstyled Mode:</strong> full control with <code>unstyled</code> prop</li>
        </ul>

        <div class="features-grid">
          <div class="feature-item">
            <VIcon
              icon="lucide:zap"
              class="feature-icon"
            />
            <span>Auto positioning</span>
          </div>
          <div class="feature-item">
            <VIcon
              icon="lucide:loader"
              class="feature-icon"
            />
            <span>Loading states</span>
          </div>
          <div class="feature-item">
            <VIcon
              icon="lucide:check-circle"
              class="feature-icon"
            />
            <span>Active/Disabled items</span>
          </div>
          <div class="feature-item">
            <VIcon
              icon="lucide:palette"
              class="feature-icon"
            />
            <span>Fully customizable</span>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Dropdown Mode -->
    <VCard title="Dropdown Mode">
      <p class="demo-description">
        Provide <code>items</code> prop for automatic dropdown rendering
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>

    <!-- Popover Mode -->
    <VCard title="Popover Mode">
      <p class="demo-description">
        Use <code>content</code> slot for custom popover content
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>

    <!-- Placement Options -->
    <VCard title="Placement Options">
      <p class="demo-description">
        Control where the floating element appears: bottom-left, bottom-right, top-left, top-right
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>

    <!-- Active & Disabled States -->
    <VCard title="Active & Disabled States">
      <p class="demo-description">
        Items can be marked as active or disabled
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>

    <!-- Loading States -->
    <VCard title="Loading States">
      <p class="demo-description">
        Items can show loading indicators during async operations
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>

    <!-- Unstyled Mode -->
    <VCard title="Unstyled Mode (Full Control)">
      <p class="demo-description">
        Use <code>unstyled</code> prop to disable default styles and apply your own
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
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
    </VCard>
  </div>
</template>

<style scoped>
.page-container {
  @apply flex flex-col p-6;
}

.info-header {
  @apply flex items-center gap-3 mb-4;
}

.info-icon {
  @apply text-primary;
}

.info-title {
  @apply text-2xl font-bold text-mainText;
}

.info-content {
  @apply space-y-4;
}

.info-description {
  @apply text-secondaryText leading-relaxed;
}

.feature-list {
  @apply list-disc list-inside space-y-2 text-secondaryText ml-2;
}

.features-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4 mt-4;
}

.feature-item {
  @apply flex items-center gap-2 text-sm text-secondaryText;
}

.feature-icon {
  @apply text-primary flex-shrink-0;
}

.demo-description {
  @apply text-secondaryText text-sm;
}

.code-block {
  @apply bg-base-200 rounded-lg p-4 overflow-x-auto;
}

.code-block pre {
  @apply text-sm text-mainText font-mono;
}

.code-block code {
  @apply whitespace-pre;
}
</style>

