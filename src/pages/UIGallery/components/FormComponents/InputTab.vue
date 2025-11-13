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

// With support text
<VInput
  v-model="username"
  placeholder="Username"
  support-text="Choose a unique username between 3-20 characters"
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

      <!-- With Support Text -->
      <section class="examples-section">
        <h4 class="examples-subtitle">
          With Support Text
        </h4>
        <VInput
          v-model="textValue"
          placeholder="Username"
          support-text="Choose a unique username between 3-20 characters"
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

    <!-- Features Summary -->
    <VCard>
      <h3 class="section-title mb-4">
        ✨ Key Features
      </h3>
      <ul class="features-list">
        <li>✅ Password toggle</li>
        <li>✅ Email validation support</li>
        <li>✅ Support text & error messages</li>
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
