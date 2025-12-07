<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const textValue = ref("");
const passwordValue = ref("");
const searchValue = ref("");
const emailValue = ref("");
const usernameValue = ref("");
const disabledValue = ref("Disabled");
const textareaValue = ref("Multiline text");
const debouncedValue = ref("");
const loadingValue = ref("");

const emailValidation = ref({
  $error: false,
  $errors: [] as { $message: string }[],
});

// Email validation
const validateEmail = (value: string) => {
  if (!value) {
    emailValidation.value = { $error: false, $errors: [] };
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(value);

  emailValidation.value = isValid
    ? { $error: false, $errors: [] }
    : {
      $error: true,
      $errors: [{ $message: "Please enter a valid email address" }],
    };
};
</script>
<template>
  <div class="page-container gap-5">
    <!-- Info Card -->
    <VCard>
      <div class="info-header">
        <VIcon
          icon="lucide:edit-3"
          :size="24"
          class="info-icon"
        />
        <h2 class="info-title">
          VInput Component
        </h2>
      </div>

      <div class="info-content">
        <p class="info-description">
          Versatile input component with
          <strong>password toggle, validation support, icons, debounce,</strong>
          and textarea mode. Built with DOMPurify sanitization and full Vuelidate compatibility.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-primary">
              <VIcon
                icon="lucide:type"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Multiple Types
              </h3>
              <p class="feature-description">
                Text, password, email, search, textarea
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:shield-check"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Validation Support
              </h3>
              <p class="feature-description">
                Vuelidate compatible with error messages
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:clock"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Debounce
              </h3>
              <p class="feature-description">
                Built-in debounce with custom delay
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:shield"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                XSS Protection
              </h3>
              <p class="feature-description">
                DOMPurify sanitization applied
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
            All inputs are automatically sanitized with DOMPurify to prevent XSS attacks.
          </span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Basic Text Input -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Basic Text Input
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="textValue"
            placeholder="Enter text..."
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="textValue"
  placeholder="Enter text..."
/&gt;</code></pre>
        </div>
      </section>

      <!-- Input Sizes -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Input Sizes
        </h4>
        <div class="flex flex-col gap-3 max-w-md">
          <VInput
            v-model="textValue"
            size="sm"
            placeholder="Small input"
          />
          <VInput
            v-model="textValue"
            size="md"
            placeholder="Medium input (default)"
          />
          <VInput
            v-model="textValue"
            size="lg"
            placeholder="Large input"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput v-model="value" size="sm" placeholder="Small" /&gt;
&lt;VInput v-model="value" size="md" placeholder="Medium" /&gt;
&lt;VInput v-model="value" size="lg" placeholder="Large" /&gt;</code></pre>
        </div>
      </section>

      <!-- With Label and Helper Text -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Label & Helper Text
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="usernameValue"
            name="Username"
            placeholder="Enter username"
            helper-text="Choose a unique username between 3-20 characters"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="username"
  name="Username"
  placeholder="Enter username"
  helper-text="Choose a unique username between 3-20 characters"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Password with Toggle -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Password with Toggle
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="passwordValue"
            name="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="password"
  name="Password"
  type="password"
  placeholder="Enter your password"
/&gt;</code></pre>
        </div>
      </section>

      <!-- Email with Validation -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Email with Validation
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="emailValue"
            name="Email Address"
            type="email"
            icon="mdi:email"
            placeholder="Enter your email"
            :validation="emailValidation"
            @blur="validateEmail(emailValue)"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="email"
  name="Email Address"
  type="email"
  icon="mdi:email"
  placeholder="Enter your email"
  :validation="emailValidation"
  @blur="validateEmail(email)"
/&gt;</code></pre>
        </div>
      </section>

      <!-- With Icons -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Icons
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <VInput
            v-model="searchValue"
            icon="mdi:search"
            placeholder="Search..."
          />
          <VInput
            v-model="textValue"
            icon="mdi:account"
            placeholder="Username"
          />
          <VInput
            v-model="textValue"
            icon="mdi:phone"
            placeholder="Phone number"
          />
          <VInput
            v-model="loadingValue"
            :loading="true"
            placeholder="Loading state"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput v-model="search" icon="mdi:search" placeholder="Search..." /&gt;
&lt;VInput v-model="username" icon="mdi:account" placeholder="Username" /&gt;
&lt;VInput v-model="value" :loading="true" placeholder="Loading..." /&gt;</code></pre>
        </div>
      </section>

      <!-- Textarea Mode -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Textarea Mode
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="textareaValue"
            name="Bio"
            textarea
            :rows="5"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="bio"
  name="Bio"
  textarea
  :rows="5"
  placeholder="Tell us about yourself..."
/&gt;</code></pre>
        </div>
      </section>

      <!-- Debounced Input -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Debounced Input
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="debouncedValue"
            name="Search Query"
            icon="mdi:search"
            :debounce="800"
            placeholder="Type to search (800ms delay)..."
          />
          <p class="text-sm text-secondaryText mt-2">
            Current value:
            <code class="px-2 py-1 bg-base-200 rounded text-xs">
              {{ debouncedValue || 'empty' }}
            </code>
          </p>
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="query"
  icon="mdi:search"
  :debounce="800"
  placeholder="Type to search..."
/&gt;

&lt;!-- Or use true for default 800ms --&gt;
&lt;VInput v-model="query" :debounce="true" /&gt;</code></pre>
        </div>
      </section>

      <!-- Disabled State -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled State
        </h4>
        <div class="max-w-md">
          <VInput
            v-model="disabledValue"
            name="Disabled Input"
            disabled
            placeholder="This input is disabled"
          />
        </div>
        <div class="code-block mt-4">
          <pre><code>&lt;VInput
  v-model="value"
  disabled
  placeholder="This input is disabled"
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
              icon="lucide:type"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Multiple Input Types
            </h4>
            <p class="feature-card-description">
              Text, password, email, search, and textarea
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:eye"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Password Toggle
            </h4>
            <p class="feature-card-description">
              Show/hide password with eye icon
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:shield-check"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Validation Support
            </h4>
            <p class="feature-card-description">
              Full Vuelidate compatibility with errors
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
            <VIcon
              icon="lucide:search"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Icon Support
            </h4>
            <p class="feature-card-description">
              Left icons and loading spinner
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
            <VIcon
              icon="lucide:clock"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Debounce
            </h4>
            <p class="feature-card-description">
              Built-in debounce with custom delay
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-success">
            <VIcon
              icon="lucide:shield"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              XSS Protection
            </h4>
            <p class="feature-card-description">
              DOMPurify sanitization on all inputs
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-warning">
            <VIcon
              icon="lucide:info"
              :size="18"
            />
          </div>
          <div class="feature-card-content">
            <h4 class="feature-card-title">
              Helper Text
            </h4>
            <p class="feature-card-description">
              Support for helper and error messages
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-info">
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
              Proper labels and ARIA attributes
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-card-icon feature-icon-primary">
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
              Small, medium, and large sizes
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
        Available props for VInput component:
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
              <td><code>string | number</code></td>
              <td><code>""</code></td>
              <td>Input value (v-model)</td>
            </tr>
            <tr>
              <td><code>name</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Input label text</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>string</code></td>
              <td><code>"text"</code></td>
              <td>Input type (text, email, password, search, etc.)</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Disable the input</td>
            </tr>
            <tr>
              <td><code>helperText</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Helper text below input</td>
            </tr>
            <tr>
              <td><code>validation</code></td>
              <td><code>ValidationProp</code></td>
              <td><code>undefined</code></td>
              <td>Validation object (Vuelidate compatible)</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Left icon name (Iconify format)</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>"sm" | "md" | "lg"</code></td>
              <td><code>"md"</code></td>
              <td>Input size</td>
            </tr>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td><code>undefined</code></td>
              <td>Custom input ID (auto-generated if not provided)</td>
            </tr>
            <tr>
              <td><code>debounce</code></td>
              <td><code>boolean | number</code></td>
              <td><code>false</code></td>
              <td>Debounce delay (true = 800ms, number = custom ms)</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading spinner in icon position</td>
            </tr>
            <tr>
              <td><code>textarea</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Use textarea element instead of input</td>
            </tr>
            <tr>
              <td><code>rows</code></td>
              <td><code>number</code></td>
              <td><code>4</code></td>
              <td>Textarea rows (only when textarea=true)</td>
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
            <code>name</code> - Custom label content (overrides name prop)
          </li>
          <li>
            <code>icon-left</code> - Custom left icon content
          </li>
          <li>
            <code>icon-right</code> - Custom right icon/action (e.g., clear button)
          </li>
          <li>
            <code>helper-text</code> - Custom helper text below input
          </li>
          <li>
            <code>error-message</code> - Custom error message display
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
            <code>@update:modelValue</code> -
            Emitted when input value changes (with debounce if enabled)
          </li>
          <li>
            <code>@focus</code> - Emitted when input receives focus
          </li>
          <li>
            <code>@blur</code> - Emitted when input loses focus
          </li>
          <li>
            <code>@input</code> - Native input event (not debounced)
          </li>
        </ul>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/shared-info-card-styles.scss";

// Input-specific styles
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

.example-error {
  @apply text-sm text-error mt-2;
}

.features-list {
  @apply list-none pl-0 space-y-2;
}

.features-list li {
  @apply text-sm text-secondaryText;
}
</style>
