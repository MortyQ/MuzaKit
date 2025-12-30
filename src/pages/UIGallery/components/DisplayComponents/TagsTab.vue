<script setup lang="ts">
import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VTag from "@/shared/ui/common/VTag.vue";
</script>

<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:tag"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VTag Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Versatile tag and badge component for labels, statuses, and categories.
          Supports multiple <strong>variants, colors, sizes</strong>, and can include
          icons. Perfect for tables, sidebars, cards, and status indicators.
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
                Solid, soft, outline, ghost styles
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
                7 Color Schemes
              </h3>
              <p class="feature-description">
                Primary, success, warning, error, info, neutral, gray
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
                Flexible Sizing
              </h3>
              <p class="feature-description">
                XS, SM, MD, LG sizes for any use case
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:star"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Icon Support
              </h3>
              <p class="feature-description">
                Icons on left or right side
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
            VTag is perfect for displaying statuses, categories, and badges throughout
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-secondaryText mb-3">
              Solid - Full background color
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Primary"
                variant="solid"
                color="primary"
              />
              <VTag
                label="Success"
                variant="solid"
                color="success"
              />
              <VTag
                label="Warning"
                variant="solid"
                color="warning"
              />
              <VTag
                label="Error"
                variant="solid"
                color="error"
              />
            </div>
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-3">
              Soft - Subtle background (default)
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Primary"
                variant="soft"
                color="primary"
              />
              <VTag
                label="Success"
                variant="soft"
                color="success"
              />
              <VTag
                label="Warning"
                variant="soft"
                color="warning"
              />
              <VTag
                label="Error"
                variant="soft"
                color="error"
              />
            </div>
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-3">
              Outline - Border only
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Primary"
                variant="outline"
                color="primary"
              />
              <VTag
                label="Success"
                variant="outline"
                color="success"
              />
              <VTag
                label="Warning"
                variant="outline"
                color="warning"
              />
              <VTag
                label="Error"
                variant="outline"
                color="error"
              />
            </div>
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-3">
              Ghost - Transparent with hover
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Primary"
                variant="ghost"
                color="primary"
              />
              <VTag
                label="Success"
                variant="ghost"
                color="success"
              />
              <VTag
                label="Warning"
                variant="ghost"
                color="warning"
              />
              <VTag
                label="Error"
                variant="ghost"
                color="error"
              />
            </div>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VTag label="Primary" variant="solid" color="primary" /&gt;
&lt;VTag label="Success" variant="soft" color="success" /&gt;
&lt;VTag label="Warning" variant="outline" color="warning" /&gt;
&lt;VTag label="Error" variant="ghost" color="error" /&gt;</code></pre>
        </div>
      </section>

      <!-- Colors -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Colors
        </h4>
        <div class="flex flex-wrap gap-2 mb-4">
          <VTag
            label="Primary"
            color="primary"
          />
          <VTag
            label="Success"
            color="success"
          />
          <VTag
            label="Warning"
            color="warning"
          />
          <VTag
            label="Error"
            color="error"
          />
          <VTag
            label="Info"
            color="info"
          />
          <VTag
            label="Neutral"
            color="neutral"
          />
          <VTag
            label="Gray"
            color="gray"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VTag label="Primary" color="primary" /&gt;
&lt;VTag label="Success" color="success" /&gt;
&lt;VTag label="Warning" color="warning" /&gt;
&lt;VTag label="Error" color="error" /&gt;</code></pre>
        </div>
      </section>

      <!-- Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Sizes
        </h4>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <VTag
            label="Extra Small"
            size="xs"
          />
          <VTag
            label="Small (Default)"
            size="sm"
          />
          <VTag
            label="Medium"
            size="md"
          />
          <VTag
            label="Large"
            size="lg"
          />
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VTag label="XS" size="xs" /&gt;
&lt;VTag label="SM" size="sm" /&gt;
&lt;VTag label="MD" size="md" /&gt;
&lt;VTag label="LG" size="lg" /&gt;</code></pre>
        </div>
      </section>

      <!-- With Icons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Icons
        </h4>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-secondaryText mb-2">
              Left Position (Default)
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Star"
                icon="lucide:star"
                color="warning"
              />
              <VTag
                label="Check"
                icon="lucide:check"
                color="success"
              />
              <VTag
                label="Alert"
                icon="lucide:alert-triangle"
                color="warning"
              />
              <VTag
                label="Error"
                icon="lucide:x-circle"
                color="error"
              />
            </div>
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-2">
              Right Position
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Premium"
                icon="lucide:crown"
                icon-position="right"
                color="warning"
              />
              <VTag
                label="Verified"
                icon="lucide:badge-check"
                icon-position="right"
                color="success"
              />
              <VTag
                label="Pro"
                icon="lucide:zap"
                icon-position="right"
                color="primary"
              />
            </div>
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-2">
              Icon Only
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                icon="lucide:star"
                color="warning"
                rounded
              />
              <VTag
                icon="lucide:heart"
                color="error"
                rounded
              />
              <VTag
                icon="lucide:bookmark"
                color="primary"
                rounded
              />
            </div>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VTag label="Star" icon="lucide:star" color="warning" /&gt;
&lt;VTag label="Check" icon="lucide:check" icon-position="right" /&gt;
&lt;VTag icon="lucide:heart" color="error" rounded /&gt;</code></pre>
        </div>
      </section>

      <!-- Rounded / Pill -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Rounded / Pill Style
        </h4>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <VTag
              label="Rounded"
              rounded
              color="primary"
            />
            <VTag
              label="Premium"
              rounded
              icon="lucide:crown"
              color="warning"
            />
            <VTag
              label="12"
              rounded
              color="error"
            />
            <VTag
              label="99+"
              rounded
              color="success"
            />
          </div>

          <div>
            <p class="text-sm text-secondaryText mb-2">
              Perfect for Badges & Counts
            </p>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="text-secondaryText">Notifications</span>
                <VTag
                  label="5"
                  rounded
                  color="error"
                  size="xs"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-secondaryText">Messages</span>
                <VTag
                  label="12"
                  rounded
                  color="primary"
                  size="xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;VTag label="Rounded" rounded color="primary" /&gt;
&lt;VTag label="12" rounded color="error" size="xs" /&gt;</code></pre>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Common Use Cases
        </h4>
        <div class="space-y-6">
          <!-- Status Indicators -->
          <div>
            <p class="text-sm font-medium text-mainText mb-2">
              Status Indicators
            </p>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <VTag
                  label="Active"
                  color="success"
                  icon="lucide:circle"
                  variant="soft"
                />
                <span class="text-secondaryText text-sm">User is online</span>
              </div>
              <div class="flex items-center gap-2">
                <VTag
                  label="Pending"
                  color="warning"
                  icon="lucide:clock"
                  variant="soft"
                />
                <span class="text-secondaryText text-sm">Awaiting approval</span>
              </div>
              <div class="flex items-center gap-2">
                <VTag
                  label="Inactive"
                  color="gray"
                  icon="lucide:circle"
                  variant="soft"
                />
                <span class="text-secondaryText text-sm">User is offline</span>
              </div>
            </div>
          </div>

          <!-- Priority Labels -->
          <div>
            <p class="text-sm font-medium text-mainText mb-2">
              Priority Labels
            </p>
            <div class="flex flex-wrap gap-2">
              <VTag
                label="Critical"
                variant="solid"
                color="error"
                icon="lucide:alert-triangle"
              />
              <VTag
                label="High"
                variant="soft"
                color="error"
              />
              <VTag
                label="Medium"
                variant="soft"
                color="warning"
              />
              <VTag
                label="Low"
                variant="soft"
                color="gray"
              />
            </div>
          </div>

          <!-- In Tables -->
          <div>
            <p class="text-sm font-medium text-mainText mb-2">
              In Tables
            </p>
            <div class="overflow-x-auto">
              <table class="props-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>
                      <VTag
                        label="Active"
                        color="success"
                        variant="soft"
                      />
                    </td>
                    <td>
                      <VTag
                        label="Admin"
                        color="primary"
                        variant="soft"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>
                      <VTag
                        label="Pending"
                        color="warning"
                        variant="soft"
                      />
                    </td>
                    <td>
                      <VTag
                        label="User"
                        color="gray"
                        variant="soft"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="code-block mt-4">
          <pre><code>&lt;!-- In your table --&gt;
&lt;VTag
  :label="row.status"
  :color="getStatusColor(row.status)"
  variant="soft"
/&gt;</code></pre>
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
              Solid, soft, outline, ghost styles
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
              7 Color Schemes
            </h4>
            <p class="feature-card-description">
              Primary, success, warning, error, info, neutral, gray
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
              Flexible Sizing
            </h4>
            <p class="feature-card-description">
              XS, SM, MD, LG sizes available
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:star"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Icon Support
            </h4>
            <p class="feature-card-description">
              Icons on left or right side
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:circle"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Rounded Style
            </h4>
            <p class="feature-card-description">
              Pill-shaped badges and counts
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:tag"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Versatile Usage
            </h4>
            <p class="feature-card-description">
              Perfect for status, categories, badges
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:layout-grid"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Table Friendly
            </h4>
            <p class="feature-card-description">
              Optimized for table cells
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:palette"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Theme-Aware
            </h4>
            <p class="feature-card-description">
              Automatic theme styling support
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:accessibility"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Accessible
            </h4>
            <p class="feature-card-description">
              Proper semantic HTML structure
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
        Available props for VTag component:
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
              <td>Text content of the tag</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'solid' | 'soft' | 'outline' | 'ghost'</code></td>
              <td><code>'soft'</code></td>
              <td>Visual style variant</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td>
                <code>
                  'primary' | 'success' | 'warning' | 'error' |
                  'info' | 'neutral' | 'gray'
                </code>
              </td>
              <td><code>'primary'</code></td>
              <td>Color scheme</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'xs' | 'sm' | 'md' | 'lg'</code></td>
              <td><code>'sm'</code></td>
              <td>Tag size</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Icon to display (lucide format)</td>
            </tr>
            <tr>
              <td><code>iconPosition</code></td>
              <td><code>'left' | 'right'</code></td>
              <td><code>'left'</code></td>
              <td>Icon position</td>
            </tr>
            <tr>
              <td><code>rounded</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Enable pill-shaped style</td>
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
            <code>default</code> - Custom content (overrides label prop)
          </li>
          <li>
            <code>icon</code> - Custom icon content
          </li>
        </ul>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";
</style>
