<script setup lang="ts">
import { ref } from "vue";

import { MultipleSelectValue, SingleSelectValue } from "@/shared/types";
import VCard from "@/shared/ui/common/VCard.vue";
import VChip from "@/shared/ui/common/VChip.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Interactive examples data
const selectedFilters = ref<string[]>(["primary"]);
const tags = ref(["Vue", "TypeScript", "Vite", "Tailwind", "SCSS"]);

const selectedCategory = ref({
  id: "1",
  name: "Random Category",
});

const selectedSubcategories = ref([
  { id: "1", name: "Random Subcategory Shave Balms" },
  { id: "2", name: "Random Subcategory Nail Tools" },
  { id: "3", name: "Random Subcategory Nail Powders" },
]);

// V-Model example data (with type-safe approach)
const selectedChip = ref<SingleSelectValue<string>>("option1");
const multiSelectChips = ref<MultipleSelectValue<string>>(["feature1", "feature3"]);

// V-Model with objects example
type User = { id: number, name: string };
const selectedUser = ref<SingleSelectValue<User>>({ id: 2, name: "Alice" });
const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" },
  { id: 4, name: "Emma" },
];

const toggleFilter = (id: string) => {
  const index = selectedFilters.value.indexOf(id);
  if (index > -1) {
    selectedFilters.value.splice(index, 1);
  }
  else {
    selectedFilters.value.push(id);
  }
};

const vModelExampleCode = `<` + `script setup lang="ts">
import { ref } from 'vue';
import type { SingleSelectValue, MultipleSelectValue } from '@/shared/ui/common/types';

// Single selection (type-safe)
const selectedChip = ref<SingleSelectValue<string>>('option1');

// Multiple selection (type-safe)
const multiSelectChips = ref<MultipleSelectValue<string>>(['feature1', 'feature3']);
  </` + `script>

<template>
  <!-- Single Selection -->
  <VChip
    v-model="selectedChip"
    label="Option 1"
    value="option1"
    color="default"
    selected-color="primary"
  />

  <!-- Multiple Selection -->
  <VChip
    v-model="multiSelectChips"
    label="Feature A"
    value="feature1"
    color="default"
    selected-color="primary"
    multiple
  />
</template>`;

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
};

const removeSubcategory = (index: number) => {
  selectedSubcategories.value.splice(index, 1);
};
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:tags"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VChip Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Compact elements that represent an input, attribute, or action.
          Chips are commonly used for <strong>filters, tags, categories, or selections</strong>.
          Perfect for search filters, tag lists, and multi-select interfaces.
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
                Multiple Variants
              </h3>
              <p class="feature-description">
                Filled, outlined, and soft styles
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
                Interactive
              </h3>
              <p class="feature-description">
                Clickable and closable functionality
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:tag"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Rich Content
              </h3>
              <p class="feature-description">
                Icons, badges, and custom slots
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:sparkles"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Color Themes
              </h3>
              <p class="feature-description">
                7 semantic color variations
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
            VChip supports active states, badges, and custom content through slots
            for flexible use cases!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Variants -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Variants
        </h4>
        <div class="flex flex-wrap gap-2">
          <VChip
            label="Filled Primary"
            variant="filled"
            color="primary"
          />
          <VChip
            label="Outlined Success"
            variant="outlined"
            color="success"
          />
          <VChip
            label="Soft Warning"
            variant="soft"
            color="warning"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VChip label="Filled Primary" variant="filled" color="primary" /&gt;
&lt;VChip label="Outlined Success" variant="outlined" color="success" /&gt;
&lt;VChip label="Soft Warning" variant="soft" color="warning" /&gt;</code></pre>
        </div>
      </section>

      <!-- Colors -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Colors
        </h4>
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip label="Primary" color="primary" /&gt;
&lt;VChip label="Secondary" color="secondary" /&gt;
&lt;VChip label="Success" color="success" /&gt;
&lt;VChip label="Warning" color="warning" /&gt;
&lt;VChip label="Error" color="error" /&gt;
&lt;VChip label="Info" color="info" /&gt;
&lt;VChip label="Neutral" color="neutral" /&gt;</code></pre>
        </div>
      </section>

      <!-- Default Color -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Default Color with Dynamic Selection
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          Use <code>color="default"</code> for neutral chips that adopt a color when selected.
          Set <code>selectedColor</code> to control the active color.
        </p>
        <div class="flex flex-wrap gap-2">
          <VChip
            label="Default (Primary on select)"
            color="default"
            icon="lucide:tag"
            :active="selectedFilters.includes('default-primary')"
            @click="toggleFilter('default-primary')"
          />
          <VChip
            label="Default (Success on select)"
            color="default"
            selected-color="success"
            icon="lucide:check"
            :active="selectedFilters.includes('default-success')"
            @click="toggleFilter('default-success')"
          />
          <VChip
            label="Default (Warning on select)"
            color="default"
            selected-color="warning"
            icon="lucide:alert-circle"
            :active="selectedFilters.includes('default-warning')"
            @click="toggleFilter('default-warning')"
          />
          <VChip
            label="Default (Error on select)"
            color="default"
            selected-color="error"
            icon="lucide:x"
            :active="selectedFilters.includes('default-error')"
            @click="toggleFilter('default-error')"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VChip
  label="Default (Primary on select)"
  color="default"
  selected-color="primary"
  :active="isSelected"
  @click="toggle"
/&gt;
&lt;VChip
  label="Default (Success on select)"
  color="default"
  selected-color="success"
  :active="isSelected"
  @click="toggle"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Sizes
        </h4>
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip label="Small" size="sm" icon="lucide:tag" /&gt;
&lt;VChip label="Medium (Default)" size="md" icon="lucide:tag" /&gt;
&lt;VChip label="Large" size="lg" icon="lucide:tag" /&gt;</code></pre>
        </div>
      </section>

      <!-- With Icons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Icons
        </h4>
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip label="Category" icon="lucide:tag" color="primary" /&gt;
&lt;VChip label="Verified" icon="lucide:check-circle" color="success" /&gt;
&lt;VChip label="Warning" icon="lucide:alert-circle" color="warning" /&gt;</code></pre>
        </div>
      </section>

      <!-- With Badges -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Badges
        </h4>
        <div class="flex flex-wrap gap-2">
          <VChip
            label="Random Category"
            icon="lucide:tag"
            badge="CATEGORY"
            badge-color="warning"
            variant="outlined"
            color="primary"
          />
          <VChip
            label="Premium Feature"
            icon="lucide:star"
            badge="PRO"
            badge-color="primary"
            variant="filled"
            color="warning"
          />
          <VChip
            label="New Component"
            icon="lucide:sparkles"
            badge="NEW"
            badge-color="success"
            variant="soft"
            color="success"
          />
          <VChip
            label="Beta Testing"
            icon="lucide:flask-conical"
            badge="BETA"
            badge-color="info"
            variant="outlined"
            color="neutral"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VChip
  label="Random Category"
  icon="lucide:tag"
  badge="CATEGORY"
  badge-color="primary"
  variant="outlined"
  color="primary"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Interactive - Clickable -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Interactive - Clickable Filters
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          Click chips to toggle selection. Selected chips show an active state.
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip
  label="Primary"
  :active="isSelected"
  @click="toggleFilter"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Interactive - Closable Tags -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Interactive - Closable Tags
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip
  label="Tag"
  closable
  @close="removeTag"
/&gt;</code></pre>
        </div>
      </section>

      <!-- V-Model Pattern - Single Select -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          V-Model Pattern - Single Select
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          Use <code>v-model</code> for automatic state management.
          Perfect for single-choice selections (radio-like behavior).
        </p>
        <div class="flex flex-wrap gap-2">
          <VChip
            v-model="selectedChip"
            label="Option 1"
            value="option1"
            color="default"
            selected-color="primary"
            icon="lucide:circle-dot"
          />
          <VChip
            v-model="selectedChip"
            label="Option 2"
            value="option2"
            color="default"
            selected-color="success"
            icon="lucide:circle-dot"
          />
          <VChip
            v-model="selectedChip"
            label="Option 3"
            value="option3"
            color="default"
            selected-color="warning"
            icon="lucide:circle-dot"
          />
          <VChip
            v-model="selectedChip"
            label="Option 4"
            value="option4"
            color="default"
            selected-color="info"
            icon="lucide:circle-dot"
          />
        </div>
        <p class="text-sm text-secondaryText mt-3">
          Selected: <span class="font-semibold">{{ selectedChip || "None" }}</span>
        </p>

        <div class="code-block mt-4">
          <pre><code>{{ vModelExampleCode }}</code></pre>
        </div>
      </section>

      <!-- V-Model Pattern - Multi Select -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          V-Model Pattern - Multi Select
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          For multi-select, use an array and add <code>multiple</code> prop.
          Perfect for filter chips and tag selections.
        </p>
        <div class="flex flex-wrap gap-2">
          <VChip
            v-model="multiSelectChips"
            label="Feature A"
            value="feature1"
            color="default"
            selected-color="primary"
            icon="lucide:check"
            multiple
          />
          <VChip
            v-model="multiSelectChips"
            label="Feature B"
            value="feature2"
            color="default"
            selected-color="success"
            icon="lucide:check"
            multiple
          />
          <VChip
            v-model="multiSelectChips"
            label="Feature C"
            value="feature3"
            color="default"
            selected-color="warning"
            icon="lucide:check"
            multiple
          />
          <VChip
            v-model="multiSelectChips"
            label="Feature D"
            value="feature4"
            color="default"
            selected-color="info"
            icon="lucide:check"
            multiple
          />
          <VChip
            v-model="multiSelectChips"
            label="Feature E"
            value="feature5"
            color="default"
            selected-color="error"
            icon="lucide:check"
            multiple
          />
        </div>
        <p class="text-sm text-secondaryText mt-3">
          Selected:
          <span class="font-semibold">
            {{ multiSelectChips.length > 0 ? multiSelectChips.join(", ") : "None" }}
          </span>
        </p>

        <div class="code-block mt-4">
          <pre><code>&lt;VChip
  v-model="multiSelectChips"
  label="Feature A"
  value="feature1"
  color="default"
  selected-color="primary"
  multiple
/&gt;</code></pre>
        </div>
      </section>

      <!-- V-Model with Objects -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          V-Model with Complex Objects
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          VChip automatically handles object comparison using deep equality.
          Works seamlessly with objects as values without additional configuration.
        </p>
        <div class="flex flex-wrap gap-2">
          <VChip
            v-for="user in users"
            :key="user.id"
            v-model="selectedUser"
            :label="user.name"
            :value="user"
            color="default"
            selected-color="primary"
            icon="lucide:user"
          />
        </div>
        <p class="text-sm text-secondaryText mt-3">
          Selected user:
          <span class="font-semibold">
            {{ selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : "None" }}
          </span>
        </p>

        <div class="code-block mt-4">
          <pre><code>&lt;script setup lang="ts"&gt;
import { ref } from 'vue';
import type { SingleSelectValue } from '@/shared/ui/common/types';

// Define your type
type User = { id: number; name: string };

// Type-safe ref with SingleSelectValue helper
const selectedUser = ref&lt;SingleSelectValue&lt;User&gt;&gt;({ id: 2, name: 'Alice' });

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Alice' },
  { id: 3, name: 'Bob' },
];
&lt;/script&gt;

&lt;template&gt;
  &lt;!-- Objects work automatically with deep equality --&gt;
  &lt;VChip
    v-for="user in users"
    :key="user.id"
    v-model="selectedUser"
    :label="user.name"
    :value="user"
    color="default"
    selected-color="primary"
  /&gt;
&lt;/template&gt;</code></pre>
        </div>

        <div class="info-note mt-4">
          <VIcon
            icon="lucide:lightbulb"
            :size="16"
          />
          <span>
            For custom comparison logic, use the <code>valueComparator</code> prop:
            <code>:value-comparator="(a, b) => a.id === b.id"</code>
          </span>
        </div>
      </section>

      <!-- Real-world Filter Example -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Real-World Filter Example
        </h4>
        <p class="text-secondaryText mb-3 text-sm">
          Category and subcategory filters as used in e-commerce applications.
        </p>
        <div class="flex flex-wrap gap-2">
          <!-- Category Chip -->
          <VChip
            v-if="selectedCategory"
            :label="selectedCategory.name"
            icon="lucide:tag"
            badge="CATEGORY"
            badge-color="primary"
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
            closable
            @close="removeSubcategory(index)"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;!-- Category Chip --&gt;
&lt;VChip
  label="Random Category"
  icon="lucide:tag"
  badge="CATEGORY"
  badge-color="primary"
  variant="outlined"
  color="primary"
  :active="true"
/&gt;

&lt;!-- Subcategory Chips --&gt;
&lt;VChip
  v-for="subcategory in subcategories"
  :key="subcategory.id"
  :label="subcategory.name"
  icon="lucide:hash"
  variant="outlined"
  color="warning"
  closable
  @close="removeSubcategory"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Custom Content with Slots -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Custom Content (Slots)
        </h4>
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

        <div class="code-block mt-4">
          <pre><code>&lt;VChip icon="lucide:star" color="warning"&gt;
  &lt;strong&gt;4.5&lt;/strong&gt;
  &lt;span class="ml-1 opacity-75"&gt;Rating&lt;/span&gt;
&lt;/VChip&gt;</code></pre>
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
              icon="lucide:palette"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Multiple Variants
            </h4>
            <p class="feature-card-description">
              Filled, outlined, and soft styles
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:droplet"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              7 Color Themes
            </h4>
            <p class="feature-card-description">
              Primary, secondary, success, warning, error, info, neutral
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:maximize-2"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Three Sizes
            </h4>
            <p class="feature-card-description">
              Small, medium, and large chip sizes
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:tag"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Icon Support
            </h4>
            <p class="feature-card-description">
              Add icons from iconify library
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:badge"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Badge Integration
            </h4>
            <p class="feature-card-description">
              Optional badges for categories and labels
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:mouse-pointer-click"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Clickable
            </h4>
            <p class="feature-card-description">
              Click events and active states
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:x"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Closable
            </h4>
            <p class="feature-card-description">
              Removable chips with close button
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:square-slash"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Disabled State
            </h4>
            <p class="feature-card-description">
              Non-interactive disabled chips
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:layers"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Slot Support
            </h4>
            <p class="feature-card-description">
              Custom content through default slot
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
        Available props for VChip component:
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
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Label text of the chip</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'filled' | 'outlined' | 'soft'</code></td>
              <td><code>'soft'</code></td>
              <td>Visual variant style</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td>
                <code>'primary' | 'secondary' | 'success' | 'warning' |
                  'error' | 'info' | 'neutral'</code>
              </td>
              <td><code>'primary'</code></td>
              <td>Color scheme</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'sm' | 'md' | 'lg'</code></td>
              <td><code>'md'</code></td>
              <td>Size variant</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Icon to display (iconify format)</td>
            </tr>
            <tr>
              <td><code>badge</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Custom badge text (e.g., "Category", "New")</td>
            </tr>
            <tr>
              <td><code>badgeColor</code></td>
              <td>
                <code>'primary' | 'success' | 'warning' | 'error' |
                  'info' | 'neutral' | 'gray'</code>
              </td>
              <td><code>'primary'</code></td>
              <td>Badge color theme</td>
            </tr>
            <tr>
              <td><code>closable</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show close/delete button</td>
            </tr>
            <tr>
              <td><code>active</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Active/selected state</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disabled state</td>
            </tr>
            <tr>
              <td><code>class</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Custom CSS class</td>
            </tr>
            <tr>
              <td><code>value</code></td>
              <td><code>any</code></td>
              <td><code>undefined</code></td>
              <td>Value for v-model (unique identifier, supports primitives and objects)</td>
            </tr>
            <tr>
              <td><code>modelValue</code></td>
              <td><code>any</code></td>
              <td><code>undefined</code></td>
              <td>Model value for v-model binding</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Enable multiple selection mode (array modelValue)</td>
            </tr>
            <tr>
              <td><code>valueComparator</code></td>
              <td><code>(a: any, b: any) => boolean</code></td>
              <td><code>undefined</code></td>
              <td>Custom comparison function for complex values</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Events & Slots Documentation -->
    <VCard>
      <h3 class="section-title">
        Events & Slots
      </h3>

      <div class="composable-section">
        <h4 class="text-base font-semibold text-mainText mb-3">
          Events
        </h4>
        <ul class="composable-list">
          <li>
            <code>@click</code> - Emitted when chip is clicked (MouseEvent)
          </li>
          <li>
            <code>@close</code> - Emitted when close button is clicked (MouseEvent)
          </li>
          <li>
            <code>@update:modelValue</code> - Emitted when v-model value changes (any)
          </li>
        </ul>
      </div>

      <div class="composable-section mt-6">
        <h4 class="text-base font-semibold text-mainText mb-3">
          Slots
        </h4>
        <ul class="composable-list">
          <li>
            <code>default</code> - Custom content to replace label text
          </li>
        </ul>
      </div>

      <div class="composable-section mt-6">
        <h4 class="text-base font-semibold text-mainText mb-3">
          TypeScript Types
        </h4>
        <p class="text-sm text-secondaryText mb-3">
          Import helper types from <code>@/shared/ui/common/types</code>
          for type-safe v-model usage:
        </p>
        <ul class="composable-list">
          <li>
            <code>VModelValue</code> - Base type for any v-model value (string | number | boolean |
            object | null | undefined)
          </li>
          <li>
            <code>SingleSelectValue&lt;T&gt;</code> - Type for single selection (T | null)
          </li>
          <li>
            <code>MultipleSelectValue&lt;T&gt;</code> - Type for multiple selection (T[])
          </li>
          <li>
            <code>SelectValue&lt;T&gt;</code> - Union type for both single and multiple selection
          </li>
          <li>
            <code>ValueComparator&lt;T&gt;</code> - Type for custom comparison functions
          </li>
        </ul>

        <div class="code-block mt-4">
          <pre><code>// Example with TypeScript
import type {
  SingleSelectValue,
  MultipleSelectValue,
  ValueComparator
} from '@/shared/ui/common/types';

// Single select
const selected = ref&lt;SingleSelectValue&lt;string&gt;&gt;('option1');

// Multiple select
const filters = ref&lt;MultipleSelectValue&lt;string&gt;&gt;(['filter1', 'filter2']);

// With custom objects
type Product = { id: number; name: string };
const selectedProduct = ref&lt;SingleSelectValue&lt;Product&gt;&gt;(null);

// Custom comparator
const comparator: ValueComparator&lt;Product&gt; = (a, b) => a.id === b.id;</code></pre>
        </div>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>
