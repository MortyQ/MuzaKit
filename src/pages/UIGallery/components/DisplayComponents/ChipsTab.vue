<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VChip from "@/shared/ui/common/VChip.vue";

// Interactive example data
const selectedFilters = ref<string[]>(["primary"]);
const tags = ref(["Vue", "TypeScript", "Vite", "Tailwind", "SCSS"]);

const toggleFilter = (id: string) => {
  const index = selectedFilters.value.indexOf(id);
  if (index > -1) {
    selectedFilters.value.splice(index, 1);
  } else {
    selectedFilters.value.push(id);
  }
};

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
};

// Category/Subcategory example
const selectedCategory = ref({
  id: "1",
  name: "Beauty & Personal Care",
});

const selectedSubcategories = ref([
  { id: "1", name: "After Shave Balms" },
  { id: "2", name: "Acrylic Nail Tools" },
  { id: "3", name: "Acrylic False Nail Powders" },
]);

const removeSubcategory = (index: number) => {
  selectedSubcategories.value.splice(index, 1);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Overview -->
    <VCard>
      <h2 class="text-2xl font-bold text-mainText mb-3">
        Chips / Filter Tags
      </h2>
      <p class="text-secondaryText mb-4">
        Chips are compact elements that represent an input, attribute, or action.
        They're commonly used for filters, tags, categories, or selections.
      </p>
      <div class="flex flex-wrap gap-2">
        <VChip label="Default Chip" />
        <VChip
          label="With Icon"
          icon="lucide:tag"
        />
        <VChip
          label="Clickable"
          clickable
        />
        <VChip
          label="Closable"
          closable
        />
        <VChip
          label="Active"
          :active="true"
        />
        <VChip
          label="With Badge"
          badge="New"
        />
      </div>
    </VCard>

    <!-- Filter Example (Like Screenshot) -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Filter Chips Example
      </h3>
      <p class="text-secondaryText mb-4">
        Real-world example of using chips for category and subcategory filters.
      </p>
      <div class="flex flex-wrap gap-2">
        <!-- Category Chip -->
        <VChip
          v-if="selectedCategory"
          :label="selectedCategory.name"
          icon="lucide:tag"
          badge="CATEGORY"
          variant="outlined"
          color="primary"
          :active="true"
        />

        <!-- Subcategory Chips -->
        <VChip
          v-for="(subcategory, index) in selectedSubcategories"
          :key="subcategory.id"
          :label="subcategory.name"
          icon="lucide:hash"
          variant="outlined"
          color="warning"
          class="text-mainText"
          closable
          @close="removeSubcategory(index)"
        />
      </div>
    </VCard>

    <!-- Variants -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Variants
      </h3>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-secondaryText mb-2">
            Filled
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip
              label="Filled Primary"
              variant="filled"
              color="primary"
            />
            <VChip
              label="Filled Success"
              variant="filled"
              color="success"
            />
            <VChip
              label="Filled Warning"
              variant="filled"
              color="warning"
            />
            <VChip
              label="Filled Error"
              variant="filled"
              color="error"
            />
          </div>
        </div>

        <div>
          <p class="text-sm text-secondaryText mb-2">
            Outlined
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip
              label="Outlined Primary"
              variant="outlined"
              color="primary"
            />
            <VChip
              label="Outlined Success"
              variant="outlined"
              color="success"
            />
            <VChip
              label="Outlined Warning"
              variant="outlined"
              color="warning"
            />
            <VChip
              label="Outlined Error"
              variant="outlined"
              color="error"
            />
          </div>
        </div>

        <div>
          <p class="text-sm text-secondaryText mb-2">
            Soft (Default)
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip
              label="Soft Primary"
              variant="soft"
              color="primary"
            />
            <VChip
              label="Soft Success"
              variant="soft"
              color="success"
            />
            <VChip
              label="Soft Warning"
              variant="soft"
              color="warning"
            />
            <VChip
              label="Soft Error"
              variant="soft"
              color="error"
            />
          </div>
        </div>
      </div>
    </VCard>

    <!-- Colors -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Colors
      </h3>
      <div class="flex flex-wrap gap-2">
        <VChip
          label="Primary"
          color="primary"
        />
        <VChip
          label="Secondary"
          color="secondary"
        />
        <VChip
          label="Success"
          color="success"
        />
        <VChip
          label="Warning"
          color="warning"
        />
        <VChip
          label="Error"
          color="error"
        />
        <VChip
          label="Info"
          color="info"
        />
        <VChip
          label="Neutral"
          color="neutral"
        />
      </div>
    </VCard>

    <!-- Sizes -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Sizes
      </h3>
      <div class="flex flex-wrap gap-2 items-center">
        <VChip
          label="Small"
          size="sm"
          icon="lucide:tag"
        />
        <VChip
          label="Medium (Default)"
          size="md"
          icon="lucide:tag"
        />
        <VChip
          label="Large"
          size="lg"
          icon="lucide:tag"
        />
      </div>
    </VCard>

    <!-- Interactive - Clickable -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Interactive - Clickable Filters
      </h3>
      <p class="text-secondaryText mb-4">
        Click chips to toggle selection. Selected chips show an active state with a ring effect.
      </p>
      <div class="flex flex-wrap gap-2">
        <VChip
          label="Primary"
          :active="selectedFilters.includes('primary')"
          @click="toggleFilter('primary')"
        />
        <VChip
          label="Secondary"
          color="secondary"
          :active="selectedFilters.includes('secondary')"
          @click="toggleFilter('secondary')"
        />
        <VChip
          label="Success"
          color="success"
          :active="selectedFilters.includes('success')"
          @click="toggleFilter('success')"
        />
        <VChip
          label="Warning"
          color="warning"
          :active="selectedFilters.includes('warning')"
          @click="toggleFilter('warning')"
        />
        <VChip
          label="Error"
          color="error"
          :active="selectedFilters.includes('error')"
          @click="toggleFilter('error')"
        />
      </div>
      <p class="text-sm text-secondaryText mt-3">
        Selected: {{ selectedFilters.length > 0 ? selectedFilters.join(", ") : "None" }}
      </p>
    </VCard>

    <!-- Interactive - Closable Tags -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Interactive - Closable Tags
      </h3>
      <p class="text-secondaryText mb-4">
        Click the × button to remove tags.
      </p>
      <div class="flex flex-wrap gap-2">
        <VChip
          v-for="(tag, index) in tags"
          :key="tag"
          :label="tag"
          color="primary"
          variant="soft"
          closable
          @close="removeTag(index)"
        />
      </div>
      <p class="text-sm text-secondaryText mt-3">
        Tags remaining: {{ tags.length }}
      </p>
    </VCard>

    <!-- With Icons -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        With Icons
      </h3>
      <div class="flex flex-wrap gap-2">
        <VChip
          label="Category"
          icon="lucide:tag"
          color="primary"
        />
        <VChip
          label="Verified"
          icon="lucide:check-circle"
          color="success"
        />
        <VChip
          label="Warning"
          icon="lucide:alert-circle"
          color="warning"
        />
        <VChip
          label="Error"
          icon="lucide:x-circle"
          color="error"
        />
        <VChip
          label="Star"
          icon="lucide:star"
          color="info"
        />
      </div>
    </VCard>

    <!-- With Badges -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        With Badges
      </h3>
      <div class="flex flex-wrap gap-2">
        <VChip
          label="Beauty & Personal Care"
          icon="lucide:tag"
          badge="Category"
          variant="outlined"
          color="primary"
        />
        <VChip
          label="Premium Feature"
          icon="lucide:star"
          badge="Pro"
          variant="filled"
          color="warning"
        />
        <VChip
          label="New Component"
          icon="lucide:sparkles"
          badge="New"
          variant="soft"
          color="success"
        />
        <VChip
          label="Beta Testing"
          icon="lucide:flask-conical"
          badge="Beta"
          variant="outlined"
          color="info"
        />
      </div>
    </VCard>

    <!-- States -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        States
      </h3>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-secondaryText mb-2">
            Normal
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip label="Normal Chip" />
            <VChip
              label="With Icon"
              icon="lucide:tag"
            />
          </div>
        </div>

        <div>
          <p class="text-sm text-secondaryText mb-2">
            Active
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip
              label="Active Chip"
              :active="true"
            />
            <VChip
              label="Active with Icon"
              icon="lucide:tag"
              :active="true"
            />
          </div>
        </div>

        <div>
          <p class="text-sm text-secondaryText mb-2">
            Disabled
          </p>
          <div class="flex flex-wrap gap-2">
            <VChip
              label="Disabled Chip"
              disabled
            />
            <VChip
              label="Disabled with Click"
              disabled
              @click="() => {}"
            />
            <VChip
              label="Disabled Closable"
              closable
              disabled
            />
          </div>
        </div>
      </div>
    </VCard>

    <!-- Custom Content with Slots -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Custom Content (Slots)
      </h3>
      <div class="flex flex-wrap gap-2">
        <VChip
          icon="lucide:star"
          color="warning"
          variant="soft"
        >
          <strong>4.5</strong>
          <span class="ml-1 opacity-75">Rating</span>
        </VChip>

        <VChip
          icon="lucide:users"
          color="primary"
        >
          <span class="font-semibold">1.2K</span>
          <span class="ml-1 text-xs opacity-75">users</span>
        </VChip>

        <VChip
          icon="lucide:download"
          color="success"
        >
          <span class="font-mono font-bold">256</span>
          <span class="ml-1 text-xs">downloads</span>
        </VChip>
      </div>
    </VCard>

    <!-- Usage Example Code -->
    <VCard>
      <h3 class="text-xl font-semibold text-mainText mb-4">
        Usage Example
      </h3>
      <div class="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 overflow-x-auto">
        <pre class="text-sm"><code>&lt;template&gt;
  &lt;!-- Simple chip --&gt;
  &lt;VChip label="Category" /&gt;

  &lt;!-- With icon and badge --&gt;
  &lt;VChip
    label="Beauty &amp; Personal Care"
    icon="lucide:tag"
    badge="Category"
    variant="outlined"
    color="primary"
  /&gt;

  &lt;!-- Clickable with active state --&gt;
  &lt;VChip
    label="Filter"
    :active="isActive"
    @click="toggleFilter"
  /&gt;

  &lt;!-- Closable --&gt;
  &lt;VChip
    label="Tag"
    closable
    @close="removeTag"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
      <p class="text-secondaryText mt-3">
        For complete documentation, see
        <code class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">
          /src/docs/components/VCHIP_USAGE.md
        </code>
      </p>
    </VCard>
  </div>
</template>

