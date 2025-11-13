<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Code examples
const basicExample = `<script setup>
import VCard from '@/shared/ui/common/VCard.vue';
</` + `script>

<template>
  <!-- Simple card -->
  <VCard>
    <p>Card content goes here</p>
  </VCard>

  <!-- Card with title -->
  <VCard title="Card Title">
    <p>Card with header</p>
  </VCard>

  <!-- Full featured card -->
  <VCard
    title="Card Title"
    subtitle="Card subtitle"
    description="Optional description text"
    icon="lucide:star"
  >
    <p>Main content area</p>

    <template #footer>
      <button>Action</button>
    </template>
  </VCard>
</template>`;

const advancedExample = `// Different variants
<VCard variant="default">Default style</VCard>
<VCard variant="elevated">With shadow</VCard>
<VCard variant="outlined">With border</VCard>
<VCard variant="ghost">Minimal style</VCard>

// Different sizes (width control)
<VCard size="sm">Small card</VCard>
<VCard size="md">Medium card</VCard>
<VCard size="lg">Large card</VCard>
<VCard size="full">Full width</VCard>

// Clickable card
<VCard clickable @click="handleClick">
  Click me!
</VCard>

// Card as link
<VCard href="/path" target="_blank">
  This is a link card
</VCard>

// Loading state
<VCard loading>
  <template #loading>
    <CustomLoader />
  </template>
</VCard>

// With custom padding
<VCard padding="none">No padding</VCard>
<VCard padding="lg">Large padding</VCard>`;
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:square"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VCard Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Versatile card component for grouping and organizing content.
          Supports multiple <strong>variants, sizes, states</strong>, and can be
          used as a clickable element or link. Perfect for dashboards, galleries,
          and content layouts.
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
                Flexible Layouts
              </h3>
              <p class="feature-description">
                Header, footer, and content slots
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
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
                Default, elevated, outlined, ghost
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
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
                Clickable cards and link cards
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
                Customizable
              </h3>
              <p class="feature-description">
                Size, padding, radius, and more
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
            VCard is the foundation for building consistent UI layouts throughout
            your application!
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VCard
            variant="default"
            title="Default"
          >
            <p class="text-secondaryText">
              Standard card with background
            </p>
          </VCard>

          <VCard
            variant="elevated"
            title="Elevated"
          >
            <p class="text-secondaryText">
              Card with shadow for depth
            </p>
          </VCard>

          <VCard
            variant="outlined"
            title="Outlined"
          >
            <p class="text-secondaryText">
              Card with border, no shadow
            </p>
          </VCard>

          <VCard
            variant="ghost"
            title="Ghost"
          >
            <p class="text-secondaryText">
              Minimal card, no background
            </p>
          </VCard>
        </div>
      </section>

      <!-- Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Sizes (Width Control)
        </h4>
        <div class="flex flex-col gap-4 items-start">
          <VCard
            size="sm"
            title="Small"
          >
            <p class="text-secondaryText">
              Max width: 320px
            </p>
          </VCard>

          <VCard
            size="md"
            title="Medium"
          >
            <p class="text-secondaryText">
              Max width: 448px
            </p>
          </VCard>

          <VCard
            size="lg"
            title="Large"
          >
            <p class="text-secondaryText">
              Max width: 672px
            </p>
          </VCard>

          <VCard
            size="full"
            title="Full Width"
          >
            <p class="text-secondaryText">
              Takes full available width
            </p>
          </VCard>
        </div>
      </section>

      <!-- With Header -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Cards with Headers
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VCard
            title="Simple Title"
            subtitle="With subtitle"
          >
            <p class="text-secondaryText">
              Card content here
            </p>
          </VCard>

          <VCard
            title="With Icon"
            subtitle="And description"
            description="This is a longer description text that provides more context"
            icon="lucide:star"
          >
            <p class="text-secondaryText">
              Card content with icon
            </p>
          </VCard>
        </div>
      </section>

      <!-- Interactive Cards -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Interactive Cards
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VCard
            clickable
            title="Clickable Card"
            @click="() => console.log('Card clicked!')"
          >
            <p class="text-secondaryText">
              Click me to trigger an action (check console)
            </p>
          </VCard>

          <VCard
            href="https://github.com"
            target="_blank"
            title="Link Card"
          >
            <p class="text-secondaryText">
              This card is a link to GitHub
            </p>
          </VCard>
        </div>
      </section>

      <!-- With Footer -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Card with Footer
        </h4>
        <VCard
          title="Card with Actions"
          subtitle="Footer slot for action buttons"
          size="md"
        >
          <p class="text-secondaryText mb-4">
            Main content area with some text.
          </p>

          <template #footer>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-primary text-white rounded-lg">
                Confirm
              </button>
              <button class="px-4 py-2 bg-base-200 text-mainText rounded-lg">
                Cancel
              </button>
            </div>
          </template>
        </VCard>
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
        Available props for VCard component:
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
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Card header title</td>
            </tr>
            <tr>
              <td><code>subtitle</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Card header subtitle</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Card description below header</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Icon to display in header</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'default' | 'elevated' | 'outlined' | 'ghost'</code></td>
              <td><code>'default'</code></td>
              <td>Visual style variant</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'fit' | 'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td>
              <td><code>'full'</code></td>
              <td>Card width</td>
            </tr>
            <tr>
              <td><code>padding</code></td>
              <td><code>'none' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
              <td><code>'sm'</code></td>
              <td>Internal padding</td>
            </tr>
            <tr>
              <td><code>radius</code></td>
              <td><code>'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td>
              <td><code>'md'</code></td>
              <td>Border radius</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading state</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable interactions</td>
            </tr>
            <tr>
              <td><code>clickable</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Make card clickable</td>
            </tr>
            <tr>
              <td><code>href</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>URL for link card</td>
            </tr>
            <tr>
              <td><code>target</code></td>
              <td><code>'_blank' | '_self' | '_parent' | '_top'</code></td>
              <td><code>'_self'</code></td>
              <td>Link target attribute</td>
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
            <code>default</code> - Main content area of the card
          </li>
          <li>
            <code>header</code> - Custom header (overrides title/subtitle/icon props)
          </li>
          <li>
            <code>footer</code> - Footer area for actions or additional content
          </li>
          <li>
            <code>loading</code> - Custom loading state content
          </li>
        </ul>
      </div>
    </VCard>

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Multiple visual variants (default, elevated, outlined, ghost)</li>
        <li>✅ Flexible sizing options for different use cases</li>
        <li>✅ Header with icon, title, subtitle, and description</li>
        <li>✅ Footer slot for actions and buttons</li>
        <li>✅ Can be clickable element or link</li>
        <li>✅ Loading and disabled states</li>
        <li>✅ Customizable padding and border radius</li>
        <li>✅ Theme-aware styling</li>
        <li>✅ Fully accessible with proper semantic HTML</li>
      </ul>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Card-specific styles
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
  @apply mb-8 last:mb-0;
}

.examples-subtitle {
  @apply text-base font-semibold text-mainText mb-4;
}

.composable-section {
  @apply mt-4;
}

.composable-list {
  @apply list-none pl-0 space-y-2;
}

.composable-list li {
  @apply text-sm text-secondaryText pl-5 relative;
}

.composable-list li::before {
  content: '→';
  @apply absolute left-0 text-primary;
}

.composable-list code {
  @apply px-2 py-0.5 bg-base-200 rounded text-xs font-mono text-primary;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}
</style>

