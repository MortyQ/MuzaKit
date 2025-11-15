<script setup lang="ts">
import { ref } from "vue";

import VAccordion from "@/shared/ui/common/VAccordion.vue";
import type { AccordionItem } from "@/shared/ui/common/VAccordion.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Basic items
const basicItems: AccordionItem[] = [
  {
    id: 1,
    title: "What is Vue.js?",
    content: "Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable and focuses on the view layer only.",
  },
  {
    id: 2,
    title: "What is TypeScript?",
    content: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
  },
  {
    id: 3,
    title: "What is Vite?",
    content: "Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.",
  },
];

// Items with icons and subtitles
const iconItems: AccordionItem[] = [
  {
    id: "profile",
    title: "Profile Settings",
    subtitle: "Update your personal information",
    icon: "mdi:account-circle",
    content: "Manage your profile information, avatar, and display name. You can also change your username and email address here.",
  },
  {
    id: "security",
    title: "Security & Privacy",
    subtitle: "Manage your security settings",
    icon: "mdi:shield-lock",
    content: "Configure your password, two-factor authentication, and privacy settings. Keep your account secure with our advanced security features.",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Control your notification preferences",
    icon: "mdi:bell",
    content: "Control how and when you receive notifications from the application. Customize alerts for different types of activities.",
  },
  {
    id: "billing",
    title: "Billing & Subscription",
    subtitle: "Manage your payments",
    icon: "mdi:credit-card",
    content: "View your subscription plan, payment methods, and billing history. Upgrade or downgrade your plan at any time.",
  },
];

// Items with disabled state
const disabledItems: AccordionItem[] = [
  {
    id: 1,
    title: "Available Section",
    content: "This section is available and can be opened.",
  },
  {
    id: 2,
    title: "Disabled Section",
    content: "This content cannot be accessed.",
    disabled: true,
  },
  {
    id: 3,
    title: "Another Available Section",
    content: "This section is also available.",
  },
];

// Reactive models
const defaultOpen = ref<(string | number)[]>([1]);
const multipleOpen = ref<(string | number)[]>(["profile", "security"]);
const outlinedOpen = ref<(string | number)[]>([]);
const insetOpen = ref<(string | number)[]>([1]);
const popoutOpen = ref<(string | number)[]>([]);
const disabledOpen = ref<(string | number)[]>([]);
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:chevrons-down"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VAccordion Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Vuetify-inspired expansion panels for creating expandable content sections.
          Features smooth CSS Grid animations, multiple variants, and full accessibility support.
          Perfect for FAQs, settings panels, and collapsible content.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:layout-panel-top"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Four Variants
              </h3>
              <p class="feature-description">
                Default, outlined, inset, and popout styles
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:sparkles"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Smooth Animation
              </h3>
              <p class="feature-description">
                CSS Grid technique for perfect height transitions
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:accessibility"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Accessible
              </h3>
              <p class="feature-description">
                Full ARIA support and keyboard navigation
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:layers"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Flexible
              </h3>
              <p class="feature-description">
                Single, multiple, or accordion mode
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
            Inspired by Vuetify's expansion panels with modern Vue 3 implementation!
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Default Variant -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Default Variant
        </h4>
        <VAccordion
          v-model="defaultOpen"
          :items="basicItems"
          accordion
        />
        <p class="example-result">
          Open items: {{ defaultOpen }}
        </p>
      </section>

      <!-- Multiple Mode with Icons & Subtitles -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Multiple Mode with Icons & Subtitles
        </h4>
        <VAccordion
          v-model="multipleOpen"
          :items="iconItems"
          multiple
        />
        <p class="example-result">
          Open items: {{ multipleOpen }}
        </p>
      </section>

      <!-- Outlined Variant -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Outlined Variant
        </h4>
        <VAccordion
          v-model="outlinedOpen"
          :items="basicItems"
          variant="outlined"
        />
      </section>

      <!-- Inset Variant -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Inset Variant
        </h4>
        <VAccordion
          v-model="insetOpen"
          :items="iconItems"
          variant="inset"
          accordion
        />
      </section>

      <!-- Popout Variant -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Popout Variant
        </h4>
        <VAccordion
          v-model="popoutOpen"
          :items="iconItems"
          variant="popout"
          accordion
        />
      </section>

      <!-- Disabled State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled Items
        </h4>
        <VAccordion
          v-model="disabledOpen"
          :items="disabledItems"
          variant="outlined"
        />
      </section>

      <!-- Custom Slots (Global) -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Custom Slots (Applied to All Items)
        </h4>
        <VAccordion
          v-model="defaultOpen"
          :items="basicItems"
          variant="outlined"
        >
          <template #header="{ item, isOpen }">
            <div class="flex items-center gap-3 flex-1">
              <span
                class="w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold transition-colors"
                :class="isOpen ? 'bg-primary text-white' : 'bg-base-200 text-secondaryText'"
              >
                {{ item.id }}
              </span>
              <div class="flex-1">
                <div class="font-semibold text-mainText">
                  {{ item.title }}
                </div>
                <div class="text-xs text-secondaryText mt-0.5">
                  Custom header design
                </div>
              </div>
            </div>
            <VIcon
              :icon="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-primary text-xl transition-transform"
            />
          </template>

          <template #content="{ item }">
            <div class="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
              <p class="text-sm text-secondaryText leading-relaxed">
                {{ item.content }}
              </p>
            </div>
          </template>
        </VAccordion>
      </section>

      <!-- Dynamic Slots (Unique Content Per Item) -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Dynamic Slots (Unique Content Per Item)
        </h4>
        <VAccordion
          v-model="multipleOpen"
          :items="basicItems"
          variant="outlined"
          multiple
        >
          <!-- Unique content for item with id="1" -->
          <template #content-1>
            <div class="p-4 bg-success/10 border-l-4 border-success">
              <h5 class="font-semibold text-success mb-2">
                ✅ Unique Content for Item 1
              </h5>
              <p class="text-sm text-secondaryText">
                This is custom content specifically for item with id="1".
                You can put any component here!
              </p>
            </div>
          </template>

          <!-- Unique content for item with id="2" -->
          <template #content-2>
            <div class="p-4 bg-warning/10 border-l-4 border-warning">
              <h5 class="font-semibold text-warning mb-2">
                ⚠️ Unique Content for Item 2
              </h5>
              <ul class="list-disc list-inside text-sm text-secondaryText space-y-1">
                <li>Custom bullet point 1</li>
                <li>Custom bullet point 2</li>
                <li>Custom bullet point 3</li>
              </ul>
            </div>
          </template>

          <!-- Unique content for item with id="3" -->
          <template #content-3>
            <div class="p-4 bg-info/10 border-l-4 border-info">
              <h5 class="font-semibold text-info mb-2">
                ℹ️ Unique Content for Item 3
              </h5>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-cardBg p-3 rounded">
                  <p class="text-xs text-secondaryText">
                    Column 1
                  </p>
                  <p class="text-sm font-semibold text-mainText">
                    Data A
                  </p>
                </div>
                <div class="bg-cardBg p-3 rounded">
                  <p class="text-xs text-secondaryText">
                    Column 2
                  </p>
                  <p class="text-sm font-semibold text-mainText">
                    Data B
                  </p>
                </div>
              </div>
            </div>
          </template>
        </VAccordion>
        <p class="example-result">
          Now you can use #content-1, #content-2, #content-3 for unique content per item!
        </p>
      </section>
    </VCard>

    <!-- Basic Usage -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        📝 Basic Usage
      </h3>
      <div class="code-block">
        <pre><code>&lt;script setup&gt;
import { ref } from 'vue';
import VAccordion from '@/shared/ui/common/VAccordion.vue';

const openItems = ref([1]);
const items = [
  { id: 1, title: 'Item 1', content: 'Content 1' },
  { id: 2, title: 'Item 2', content: 'Content 2' },
  { id: 3, title: 'Item 3', content: 'Content 3' },
];
&lt;/script&gt;

&lt;template&gt;
  &lt;VAccordion v-model="openItems" :items="items" /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </VCard>

    <!-- Advanced Examples -->
    <VCard class="code-example-card">
      <h3 class="code-title">
        🚀 Advanced Examples
      </h3>
      <div class="code-block">
        <pre><code>// Multiple Mode with Icons
&lt;VAccordion
  v-model="openItems"
  :items="items"
  multiple
  variant="inset"
/&gt;

// Global Custom Slots (apply to all items)
&lt;VAccordion v-model="openItems" :items="items"&gt;
  &lt;template #header="{ item, isOpen }"&gt;
    &lt;div class="custom-header"&gt;
      { item.title }
    &lt;/div&gt;
  &lt;/template&gt;

  &lt;template #content="{ item }"&gt;
    &lt;div class="custom-content"&gt;
      { item.content }
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/VAccordion&gt;

// Dynamic Slots (unique content per item)
&lt;VAccordion v-model="openItems" :items="items"&gt;
  &lt;!-- Unique content for specific item by ID --&gt;
  &lt;template #content-1&gt;
    &lt;Table :columns="columns" :data="data1" /&gt;
  &lt;/template&gt;

  &lt;template #content-2&gt;
    &lt;Chart :config="chartConfig" /&gt;
  &lt;/template&gt;

  &lt;template #content-3&gt;
    &lt;CustomComponent :props="customProps" /&gt;
  &lt;/template&gt;
&lt;/VAccordion&gt;</code></pre>
      </div>
    </VCard>

    <!-- Props Documentation -->
    <VCard>
      <h3 class="section-title">
        Component Props
      </h3>
      <div class="section-description mb-4">
        Available props for VAccordion component:
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
              <td><code>modelValue</code></td>
              <td><code>(string | number)[]</code></td>
              <td><code>[]</code></td>
              <td>Array of open item IDs (v-model)</td>
            </tr>
            <tr>
              <td><code>items</code></td>
              <td><code>AccordionItem[]</code></td>
              <td><code>[]</code></td>
              <td>Array of accordion items</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Allow multiple items to be open</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>"default" | "outlined" | "inset" | "popout"</code></td>
              <td><code>"default"</code></td>
              <td>Visual variant style</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable entire accordion</td>
            </tr>
            <tr>
              <td><code>flat</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Remove elevation/shadows</td>
            </tr>
            <tr>
              <td><code>accordion</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Only one panel can be open (Vuetify mode)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-base font-semibold text-mainText mt-6 mb-3">
        AccordionItem Type
      </h4>
      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>id</code></td>
              <td><code>string | number</code></td>
              <td><code>✅</code></td>
              <td>Unique identifier</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>✅</code></td>
              <td>Item header text</td>
            </tr>
            <tr>
              <td><code>subtitle</code></td>
              <td><code>string</code></td>
              <td><code>❌</code></td>
              <td>Item subtitle (below title)</td>
            </tr>
            <tr>
              <td><code>content</code></td>
              <td><code>string</code></td>
              <td><code>❌</code></td>
              <td>Item content text</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>❌</code></td>
              <td>Icon name (Iconify)</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>❌</code></td>
              <td>Disable specific item</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="text-base font-semibold text-mainText mt-6 mb-3">
        Available Slots
      </h4>
      <div class="overflow-x-auto">
        <table class="props-table">
          <thead>
            <tr>
              <th>Slot Name</th>
              <th>Slot Props</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>header</code></td>
              <td><code>{ item, index, isOpen }</code></td>
              <td>Global header slot (applies to all items)</td>
            </tr>
            <tr>
              <td><code>header-{id}</code></td>
              <td><code>{ item, index, isOpen }</code></td>
              <td>Specific header slot for item with given ID</td>
            </tr>
            <tr>
              <td><code>content</code></td>
              <td><code>{ item, index }</code></td>
              <td>Global content slot (applies to all items)</td>
            </tr>
            <tr>
              <td><code>content-{id}</code></td>
              <td><code>{ item, index }</code></td>
              <td>Specific content slot for item with given ID</td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Smooth height animation (CSS Grid technique)</li>
        <li>✅ Vuetify-inspired design and behavior</li>
        <li>✅ Four visual variants (default, outlined, inset, popout)</li>
        <li>✅ Full ARIA accessibility support</li>
        <li>✅ Keyboard navigation support</li>
        <li>✅ Icon and subtitle support per item</li>
        <li>✅ Disabled state (global and per-item)</li>
        <li>✅ Custom slots for header and content</li>
        <li>✅ Accordion mode (Vuetify behavior)</li>
        <li>✅ Multiple mode (open several at once)</li>
        <li>✅ Flat mode (no shadows/elevation)</li>
        <li>✅ Theme-aware styling</li>
        <li>✅ TypeScript support</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Props table styles
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

