<script setup lang="ts">
import { ref } from "vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VPopover from "@/shared/ui/common/VPopover.vue";

const popoverRef = ref();

const codeExample = `<VPopover placement="bottom-right">
  <template #trigger>
    <VButton variant="primary">
      Open Popover
    </VButton>
  </template>
  <template #content>
    <VCard class="w-64">
      <h3>Popover Content</h3>
      <p>This is a popover with custom content.</p>
    </VCard>
  </template>
</VPopover>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:message-circle"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VPopover Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          <strong>VPopover</strong> displays floating content
          positioned relative to a trigger element.
          Perfect for tooltips, user menus, and contextual information.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:move"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Smart Positioning
              </h3>
              <p class="feature-description">
                Auto-adjusts position on scroll/resize
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:mouse-pointer-click"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Click Outside
              </h3>
              <p class="feature-description">
                Closes automatically on outside click
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
                Teleport Support
              </h3>
              <p class="feature-description">
                Renders at document body level
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:layout-template"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Flexible Content
              </h3>
              <p class="feature-description">
                Slot-based for any content type
              </p>
            </div>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Placement Examples -->
    <VCard title="Placement Options">
      <p class="demo-description">
        Choose from 4 placement options: bottom-left, bottom-right, top-left, top-right
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VPopover placement="bottom-left">
          <template #trigger>
            <VButton variant="primary">
              Bottom Left
            </VButton>
          </template>
          <template #content>
            <VCard class="w-64">
              <h3 class="text-sm font-semibold text-mainText mb-2">
                Bottom Left Popover
              </h3>
              <p class="text-sm text-secondaryText">
                Positioned at bottom-left relative to trigger button.
              </p>
            </VCard>
          </template>
        </VPopover>

        <VPopover placement="bottom-right">
          <template #trigger>
            <VButton variant="positive">
              Bottom Right
            </VButton>
          </template>
          <template #content>
            <VCard class="w-64">
              <h3 class="text-sm font-semibold text-mainText mb-2">
                Bottom Right Popover
              </h3>
              <p class="text-sm text-secondaryText">
                Positioned at bottom-right relative to trigger button.
              </p>
            </VCard>
          </template>
        </VPopover>

        <VPopover placement="top-left">
          <template #trigger>
            <VButton variant="warning">
              Top Left
            </VButton>
          </template>
          <template #content>
            <VCard class="w-64">
              <h3 class="text-sm font-semibold text-mainText mb-2">
                Top Left Popover
              </h3>
              <p class="text-sm text-secondaryText">
                Positioned at top-left relative to trigger button.
              </p>
            </VCard>
          </template>
        </VPopover>

        <VPopover placement="top-right">
          <template #trigger>
            <VButton variant="negative">
              Top Right
            </VButton>
          </template>
          <template #content>
            <VCard class="w-64">
              <h3 class="text-sm font-semibold text-mainText mb-2">
                Top Right Popover
              </h3>
              <p class="text-sm text-secondaryText">
                Positioned at top-right relative to trigger button.
              </p>
            </VCard>
          </template>
        </VPopover>
      </div>
    </VCard>

    <!-- Custom Content Example -->
    <VCard title="Custom Content">
      <p class="demo-description">
        Popover can contain any custom content - cards, lists, forms, etc.
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <!-- User Menu Example -->
        <VPopover placement="bottom-right">
          <template #trigger>
            <VButton variant="default">
              <VIcon
                icon="lucide:user"
                :size="16"
              />
              User Menu
            </VButton>
          </template>
          <template #content>
            <VCard class="w-56">
              <div class="flex items-center gap-3 mb-3 pb-3 border-b border-cardBorder">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <VIcon
                    icon="lucide:user"
                    :size="20"
                    class="text-primary"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold text-mainText">
                    John Doe
                  </p>
                  <p class="text-xs text-secondaryText">
                    john@example.com
                  </p>
                </div>
              </div>
              <div class="space-y-1">
                <button
                  class="w-full text-left px-3 py-2 text-sm
                text-secondaryText hover:bg-base-200 rounded-md
                transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:user"
                    :size="16"
                  />
                  Profile
                </button>
                <button
                  class="w-full text-left px-3 py-2
                text-sm text-secondaryText hover:bg-base-200 rounded-md
                transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:settings"
                    :size="16"
                  />
                  Settings
                </button>
                <button
                  class="w-full text-left px-3 py-2 text-sm
                text-error hover:bg-error/10 rounded-md transition-colors
                 flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:log-out"
                    :size="16"
                  />
                  Logout
                </button>
              </div>
            </VCard>
          </template>
        </VPopover>

        <!-- Actions Menu Example -->
        <VPopover
          ref="popoverRef"
          placement="bottom-left"
        >
          <template #trigger>
            <VButton variant="default">
              <VIcon
                icon="lucide:more-vertical"
                :size="16"
              />
              Actions
            </VButton>
          </template>
          <template #content>
            <VCard class="w-48">
              <div class="space-y-1">
                <button
                  class="w-full text-left px-3 py-2 text-sm text-secondaryText
                 hover:bg-base-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:edit"
                    :size="16"
                  />
                  Edit
                </button>
                <button
                  class="w-full text-left px-3 py-2 text-sm text-secondaryText
                hover:bg-base-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:copy"
                    :size="16"
                  />
                  Duplicate
                </button>
                <button
                  class="w-full text-left px-3 py-2 text-sm text-secondaryText
                hover:bg-base-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:download"
                    :size="16"
                  />
                  Download
                </button>
                <div class="h-px bg-cardBorder my-1" />
                <button
                  class="w-full text-left px-3 py-2 text-sm text-error
                hover:bg-error/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <VIcon
                    icon="lucide:trash-2"
                    :size="16"
                  />
                  Delete
                </button>
              </div>
            </VCard>
          </template>
        </VPopover>
      </div>
    </VCard>

    <!-- Programmatic Control -->
    <VCard title="Programmatic Control">
      <p class="demo-description">
        Control popover programmatically using exposed methods
      </p>

      <div class="flex flex-wrap gap-4 mt-4">
        <VPopover
          ref="popoverRef"
          placement="bottom-left"
        >
          <template #trigger>
            <VButton variant="primary">
              Controlled Popover
            </VButton>
          </template>
          <template #content>
            <VCard class="w-64">
              <h3 class="text-sm font-semibold text-mainText mb-2">
                Controlled Popover
              </h3>
              <p class="text-sm text-secondaryText mb-3">
                Use exposed methods to control the popover state.
              </p>
              <VButton
                size="small"
                variant="default"
                @click="popoverRef?.close()"
              >
                Close Me
              </VButton>
            </VCard>
          </template>
        </VPopover>

        <VButton
          variant="default"
          @click="popoverRef?.open()"
        >
          Open Popover
        </VButton>
        <VButton
          variant="default"
          @click="popoverRef?.close()"
        >
          Close Popover
        </VButton>
        <VButton
          variant="default"
          @click="popoverRef?.toggle()"
        >
          Toggle Popover
        </VButton>
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

