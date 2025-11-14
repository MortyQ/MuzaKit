<script setup lang="ts">
import { ref, computed } from "vue";

import SocialLogin from "./SocialLogin.vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VInput from "@/shared/ui/common/VInput.vue";


interface Props {
  loading?: boolean;
  error?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [{ name: string; email: string; password: string; terms: boolean }];
  socialLogin: [provider: "google" | "github"];
}>();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const terms = ref(false);

const passwordStrength = computed(() => {
  const pwd = password.value;
  if (pwd.length === 0) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/\d/.test(pwd)) strength++;
  if (/[^a-zA-Z\d]/.test(pwd)) strength++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["text-error", "text-warning", "text-info", "text-success"];

  return {
    strength,
    label: labels[strength - 1] || "",
    color: colors[strength - 1] || "",
  };
});

const passwordsMatch = computed(() => {
  if (confirmPassword.value.length === 0) return true;
  return password.value === confirmPassword.value;
});

const isValid = computed(() => {
  return (
    name.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    passwordsMatch.value &&
    terms.value
  );
});

const handleSubmit = () => {
  if (!isValid.value || props.loading) return;

  emit("submit", {
    name: name.value,
    email: email.value,
    password: password.value,
    terms: terms.value,
  });
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter" && isValid.value) {
    handleSubmit();
  }
};
</script>

<template>
  <div class="space-y-3">
    <!-- Social Login -->
    <SocialLogin
      :loading="loading"
      @google="emit('socialLogin', 'google')"
      @github="emit('socialLogin', 'github')"
    />

    <!-- Divider -->
    <div class="relative py-1">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-cardBorder" />
      </div>
      <div class="relative flex justify-center text-xs z-10">
        <span class="px-3 bg-cardBg/80 text-secondaryText">or create account</span>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="p-2 rounded-lg bg-lightNegative border border-negative/20 animate-shake"
    >
      <p class="text-xs text-negative font-medium flex items-center gap-2">
        <span>⚠️</span>
        {{ error }}
      </p>
    </div>

    <!-- Register Form -->
    <form
      class="space-y-3"
      @submit.prevent="handleSubmit"
    >
      <!-- Name -->
      <VInput
        v-model="name"
        type="text"
        name="Full Name"
        placeholder="Enter your full name"
        icon="mdi:account-outline"
        size="sm"
        :disabled="loading"
        autocomplete="name"
        @keypress="handleKeyPress"
      />

      <!-- Email -->
      <VInput
        v-model="email"
        type="email"
        name="Email"
        placeholder="Enter your email"
        icon="mdi:email-outline"
        size="sm"
        :disabled="loading"
        autocomplete="email"
        @keypress="handleKeyPress"
      />

      <!-- Password with inline strength -->
      <div>
        <VInput
          v-model="password"
          type="password"
          name="Password"
          placeholder="Create a password"
          icon="mdi:lock-outline"
          size="sm"
          :disabled="loading"
          autocomplete="new-password"
          @keypress="handleKeyPress"
        />
        <!-- Inline Password Strength -->
        <div
          v-if="password.length > 0"
          class="flex gap-1 mt-1"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="h-0.5 flex-1 rounded-full transition-all duration-300"
            :class="{
              'bg-error': i <= passwordStrength.strength && passwordStrength.strength === 1,
              'bg-warning': i <= passwordStrength.strength && passwordStrength.strength === 2,
              'bg-info': i <= passwordStrength.strength && passwordStrength.strength === 3,
              'bg-success': i <= passwordStrength.strength && passwordStrength.strength === 4,
              'bg-base-300': i > passwordStrength.strength
            }"
          />
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <VInput
          v-model="confirmPassword"
          type="password"
          name="Confirm Password"
          placeholder="Confirm your password"
          icon="mdi:lock-check-outline"
          size="sm"
          :disabled="loading"
          autocomplete="new-password"
          @keypress="handleKeyPress"
        />
        <p
          v-if="confirmPassword && !passwordsMatch"
          class="text-xs text-error mt-1"
        >
          Passwords do not match
        </p>
      </div>

      <!-- Terms -->
      <VCheckbox
        v-model="terms"
        :disabled="loading"
      >
        <template #label>
          <span class="text-xs text-secondaryText">
            I agree to the
            <a
              href="#"
              class="text-primary hover:text-primary-dark"
            >Terms</a>
            and
            <a
              href="#"
              class="text-primary hover:text-primary-dark"
            >Privacy Policy</a>
          </span>
        </template>
      </VCheckbox>

      <!-- Submit Button -->
      <VButton
        type="submit"
        variant="primary"
        text="Create Account"
        :loader="loading"
        :disabled="!isValid || loading"
        class="w-full"
      />
    </form>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>

