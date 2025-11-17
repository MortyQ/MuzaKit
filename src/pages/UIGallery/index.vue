<script setup lang="ts">
import { useRouter } from "vue-router";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

const router = useRouter();

const categories = [
  {
    id: "feedback",
    title: "Feedback Components",
    description: "User feedback, notifications, and dialogs. Communicate with users through modals, drawers, toasts, and alerts.",
    icon: "lucide:message-square",
    iconColor: "#3b82f6",
    path: "/components/ui-gallery/feedback",
    components: ["Modals", "Drawers", "Toasts"],
    badge: "3 components",
  },
  {
    id: "forms",
    title: "Form Components",
    description: "Form inputs, controls, and validation. Build powerful forms with dropdowns, file uploads, and more.",
    icon: "lucide:clipboard-list",
    iconColor: "#10b981",
    path: "/components/ui-gallery/forms",
    components: ["Multi Select", "Input", "Switch", "Checkboxes", "Buttons", "File Inputs"],
    badge: "6 components",
  },
  {
    id: "display",
    title: "Display Components",
    description: "Content display and presentation. Cards, icons, badges, avatars, and other visual elements.",
    icon: "lucide:layout",
    iconColor: "#f59e0b",
    path: "/components/ui-gallery/display",
    components: ["Cards", "KPI Cards", "Icons", "Tabs", "Accordion", "Popover", "Dropdown"],
    badge: "7 components",
  },
  {
    id: "layout",
    title: "Layout Components",
    description: "Structural components for page layouts. Containers, grids, dividers, and spacing utilities.",
    icon: "lucide:layout-grid",
    iconColor: "#8b5cf6",
    path: "/components/ui-gallery/layout",
    components: [],
    badge: "Coming soon",
    disabled: true,
  },
];

const navigateToCategory = (path: string, disabled?: boolean) => {
  if (disabled) return;
  router.push(path);
};
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-4xl font-bold text-mainText mb-4 text-gradient-animated">
        UI Components Gallery
      </h1>
      <p class="text-lg text-secondaryText max-w-3xl">
        Comprehensive collection of reusable UI components with live examples,
        code snippets, and detailed documentation. Each component follows consistent
        design patterns and best practices.
      </p>
    </div>

    <!-- Category Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VCard
        v-for="category in categories"
        :key="category.id"
        :clickable="!category.disabled"
        :disabled="category.disabled"
        class="category-card bg-gradient-animated"
        @click="navigateToCategory(category.path, category.disabled)"
      >
        <!-- Icon Header -->
        <div class="flex items-start gap-4 mb-4">
          <div
            class="icon-wrapper"
            :style="{ backgroundColor: `${category.iconColor}15` }"
          >
            <VIcon
              :icon="category.icon"
              :size="28"
              :color="category.iconColor"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-semibold text-mainText">
                {{ category.title }}
              </h2>
              <span
                class="badge"
                :class="{ 'badge-disabled': category.disabled }"
              >
                {{ category.badge }}
              </span>
            </div>
            <p class="text-sm text-secondaryText leading-relaxed">
              {{ category.description }}
            </p>
          </div>
        </div>

        <!-- Components List -->
        <div
          v-if="category.components.length > 0"
          class="components-list"
        >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="component in category.components"
              :key="component"
              class="component-tag"
            >
              {{ component }}
            </span>
          </div>
        </div>

        <!-- Coming Soon Message -->
        <div
          v-else
          class="coming-soon"
        >
          <VIcon
            icon="lucide:clock"
            :size="16"
            class="text-secondaryText/60"
          />
          <span class="text-sm text-secondaryText/60">
            Components documentation in progress
          </span>
        </div>
      </VCard>
    </div>

    <!-- Quick Stats -->
    <div class="mt-10 p-6 bg-cardBg border border-cardBorder rounded-lg">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-primary mb-1">
            15
          </div>
          <div class="text-sm text-secondaryText">
            Components Documented
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-success mb-1">
            3
          </div>
          <div class="text-sm text-secondaryText">
            Active Categories
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold text-warning mb-1">
            100%
          </div>
          <div class="text-sm text-secondaryText">
            With Live Examples
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.category-card {
  @apply transition-all duration-200;

  &:hover:not([disabled]) {
    @apply -translate-y-1;
  }
}

.icon-wrapper {
  @apply flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl;
}

.badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary;
}

.badge-disabled {
  @apply bg-secondaryText/10 text-secondaryText/60;
}

.components-list {
  @apply pt-4 border-t border-cardBorder;
}

.component-tag {
  @apply px-3 py-1 text-xs font-medium bg-base-200 text-secondaryText rounded-md;
}

.coming-soon {
  @apply flex items-center gap-2 pt-4 border-t border-cardBorder;
}
</style>

