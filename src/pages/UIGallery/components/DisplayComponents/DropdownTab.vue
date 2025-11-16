<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VDropdown from "@/shared/ui/common/VDropdown.vue";
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

  // Find and update the item
  const item = loadingItems.value.find((i) => i.value === value);
  if (item) {
    item.loader = true;

    // Simulate async action
    setTimeout(() => {
      item.loader = false;
      loadingAction.value = null;
    }, 2000);
  }
};

const codeExample = `<VDropdown
  :items="items"
  placement="bottom-right"
  @select="handleSelect"
>
  <template #trigger="{ isOpen }">
    <VButton variant="primary">
      Actions
      <VIcon
        icon="lucide:chevron-down"
        :class="isOpen ? 'transition-transform rotate-180' : 'transition-transform'"
      />
    </VButton>
  </template>
  <template #icon="{ icon }">
    <VIcon :icon="icon" :size="16" />
  </template>
</VDropdown>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:chevron-down"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VDropdown Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          <strong>VDropdown</strong> provides a flexible dropdown menu with support for icons,
          loading states, disabled items, and active states.
          Perfect for action menus and select controls.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:layout"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Flexible Positioning
              </h3>
              <p class="feature-description">
                4 placement options for optimal positioning
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
                Loading States
              </h3>
              <p class="feature-description">
                Built-in support for async actions
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
                Icon Support
              </h3>
              <p class="feature-description">
                Icons via flexible slot system
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:check-circle"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Active States
              </h3>
              <p class="feature-description">
                Visual feedback for current selection
              </p>
            </div>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Basic Example -->
    <VCard title="Basic Dropdown">
      <p class="demo-description">
        Simple dropdown with icons and click handlers
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VDropdown
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
                :class="isOpen ? 'transition-transform rotate-180' : 'transition-transform'"
              />
            </VButton>
          </template>
          <template #icon="{ icon }">
            <VIcon
              :icon="icon"
              :size="16"
            />
          </template>
        </VDropdown>

        <div
          v-if="selectedAction"
          class="px-4 py-2 bg-base-200 rounded-lg"
        >
          <p class="text-sm text-secondaryText">
            Selected: <strong class="text-mainText">{{ selectedAction }}</strong>
          </p>
        </div>
      </div>
    </VCard>

    <!-- Placement Options -->
    <VCard title="Placement Options">
      <p class="demo-description">
        Control where the dropdown appears relative to the trigger
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VDropdown
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
        </VDropdown>

        <VDropdown
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
        </VDropdown>

        <VDropdown
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
        </VDropdown>

        <VDropdown
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
        </VDropdown>
      </div>
    </VCard>

    <!-- Active & Disabled States -->
    <VCard title="Active & Disabled States">
      <p class="demo-description">
        Items can be marked as active or disabled
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VDropdown
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
        </VDropdown>
      </div>
    </VCard>

    <!-- Loading States -->
    <VCard title="Loading States">
      <p class="demo-description">
        Items can show loading indicators during async operations
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VDropdown
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
        </VDropdown>

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

    <!-- Custom Trigger -->
    <VCard title="Custom Trigger">
      <p class="demo-description">
        Use any element as a trigger using the trigger slot
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <!-- Icon Button Trigger -->
        <VDropdown
          :items="basicItems"
          placement="bottom-left"
          @select="handleSelect"
        >
          <template #trigger>
            <button
              class="w-10 h-10 rounded-lg bg-base-200 hover:bg-base-300
            flex items-center justify-center transition-colors"
            >
              <VIcon
                icon="lucide:more-vertical"
                :size="20"
              />
            </button>
          </template>
          <template #icon="{ icon }">
            <VIcon
              :icon="icon"
              :size="16"
            />
          </template>
        </VDropdown>

        <!-- Avatar Trigger -->
        <VDropdown
          :items="[
            { label: 'Profile', value: 'profile', icon: 'lucide:user' },
            { label: 'Settings', value: 'settings', icon: 'lucide:settings' },
            { label: 'Logout', value: 'logout', icon: 'lucide:log-out' },
          ]"
          placement="bottom-right"
          @select="handleSelect"
        >
          <template #trigger>
            <button
              class="w-10 h-10 rounded-full bg-primary/20
            hover:bg-primary/30 flex items-center justify-center transition-colors"
            >
              <VIcon
                icon="lucide:user"
                :size="20"
                class="text-primary"
              />
            </button>
          </template>
          <template #icon="{ icon }">
            <VIcon
              :icon="icon"
              :size="16"
            />
          </template>
        </VDropdown>

        <!-- Text Trigger -->
        <VDropdown
          :items="basicItems"
          placement="bottom-left"
          @select="handleSelect"
        >
          <template #trigger="{ isOpen }">
            <button
              class="px-4 py-2 rounded-lg bg-base-200 hover:bg-base-300
              transition-colors flex items-center gap-2"
            >
              <span class="text-sm font-medium text-mainText">Menu</span>
              <VIcon
                icon="lucide:chevron-down"
                :size="16"
                class="transition-transform"
                :class="isOpen ? 'transition-transform rotate-180' : 'transition-transform'"
              />
            </button>
          </template>
          <template #icon="{ icon }">
            <VIcon
              :icon="icon"
              :size="16"
            />
          </template>
        </VDropdown>
      </div>
    </VCard>

    <!-- Code Example -->
    <VCard title="Code Example">
      <div class="code-block">
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

.demo-description {
  @apply text-sm text-secondaryText mb-4;
}

.code-block {
  @apply bg-base-200 rounded-lg p-4;

  pre {
    @apply overflow-x-auto text-sm;
  }

  code {
    @apply text-mainText font-mono;
  }
}
</style>

