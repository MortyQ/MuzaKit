<script setup lang="ts">
import { ref } from "vue";

import VCard from "@/shared/ui/common/VCard.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const textValue = ref("");
const passwordValue = ref("");
const searchValue = ref("");
const disabledValue = ref("Disabled");
const textareaValue = ref("Multiline text");
const emailValue = ref("");
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

const basicExample = `<script setup>
import { ref } from 'vue';
import VInput from '@/shared/ui/common/VInput.vue';

const value = ref('');
</` + `script>

<template>
  <VInput
    v-model="value"
    placeholder="Type here"
  />
</template>`;

const advancedExample = `// Password input
<VInput
  v-model="password"
  type="password"
  placeholder="Password"
/>

// Email with validation
<VInput
  v-model="email"
  type="email"
  placeholder="Enter your email"
  :validation="emailValidation"
  @input="validateEmail(email)"
/>

// With helper text
<VInput
  v-model="username"
  placeholder="Username"
  helper-text="Choose a unique username between 3-20 characters"
/>

// With icon
<VInput
  v-model="search"
  icon="mdi:search"
  placeholder="Search..."
/>

// Disabled state
<VInput
  v-model="disabled"
  disabled
/>

// Textarea mode
<VInput
  v-model="bio"
  textarea
  :rows="6"
  placeholder="Write about yourself"
/>

// Debounced input
<VInput
  v-model="query"
  :debounce="800"
  placeholder="Debounced input"
/>`;
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
          Flexible text input supporting password toggle, icons,
          debounce, textarea mode, and validation helpers.
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
                Text, password, textarea
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-success">
              <VIcon
                icon="lucide:search"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Icons & Loading
              </h3>
              <p class="feature-description">
                Left icons & spinner
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-warning">
              <VIcon
                icon="lucide:watch"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Debounce
              </h3>
              <p class="feature-description">
                Built-in delay emit
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-wrapper feature-icon-info">
              <VIcon
                icon="lucide:shield-check"
                :size="20"
              />
            </div>
            <div class="feature-content">
              <h3 class="feature-title">
                Sanitized
              </h3>
              <p class="feature-description">
                DOMPurify applied
              </p>
            </div>
          </div>
        </div>

        <div class="info-note">
          <VIcon
            icon="lucide:info"
            :size="16"
          />
          <span>Use :debounce="true" for default 800ms or pass a number for custom delay.</span>
        </div>
      </div>
    </VCard>

    <!-- Live Examples Section -->
    <VCard>
      <h3 class="section-title mb-6">
        🎮 Live Examples
      </h3>

      <!-- Text -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Text
        </h4>
        <VInput
          v-model="textValue"
          placeholder="Enter text"
        />
      </section>

      <!-- Password -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Password
        </h4>
        <VInput
          v-model="passwordValue"
          type="password"
          placeholder="Enter password"
        />
      </section>

      <!-- Email Validation -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Email with Validation
        </h4>
        <VInput
          v-model="emailValue"
          type="email"
          icon="mdi:email"
          placeholder="Enter your email"
          :validation="emailValidation"
          @input="validateEmail(emailValue)"
        />
      </section>

      <!-- With Helper Text -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Helper Text
        </h4>
        <VInput
          v-model="textValue"
          placeholder="Username"
          helper-text="Choose a unique username between 3-20 characters"
        />
      </section>

      <!-- With Icon -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Icon
        </h4>
        <VInput
          v-model="searchValue"
          icon="mdi:search"
          placeholder="Search..."
        />
      </section>

      <!-- Disabled -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Disabled
        </h4>
        <VInput
          v-model="disabledValue"
          disabled
        />
      </section>

      <!-- Textarea -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Textarea
        </h4>
        <VInput
          v-model="textareaValue"
          textarea
          :rows="5"
          placeholder="Multiline"
        />
      </section>

      <!-- Debounced -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          Debounced
        </h4>
        <VInput
          v-model="searchValue"
          debounce
          placeholder="Debounced emit"
        />
        <code>
          Current Value: {{ searchValue }}
        </code>
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
              <td>Input type (text, email, password, etc.)</td>
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
              <td><code>Validation</code></td>
              <td><code>undefined</code></td>
              <td>Validation object (Vuelidate compatible)</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Left icon name</td>
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
              <td>Input ID attribute</td>
            </tr>
            <tr>
              <td><code>debounce</code></td>
              <td><code>boolean | number</code></td>
              <td><code>false</code></td>
              <td>Debounce delay (true = 800ms, number = custom)</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Show loading spinner</td>
            </tr>
            <tr>
              <td><code>textarea</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Use textarea mode</td>
            </tr>
            <tr>
              <td><code>rows</code></td>
              <td><code>number</code></td>
              <td><code>4</code></td>
              <td>Textarea rows (when textarea=true)</td>
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
        <li>✅ Password toggle</li>
        <li>✅ Email validation support</li>
        <li>✅ Helper text & error messages</li>
        <li>✅ Textarea mode</li>
        <li>✅ Icon & loading support</li>
        <li>✅ Debounced value emit</li>
        <li>✅ Sanitized input (XSS protection)</li>
        <li>✅ Disabled state</li>
      </ul>
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
