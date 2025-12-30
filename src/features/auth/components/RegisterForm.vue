<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs, helpers } from "@vuelidate/validators";
import { computed, reactive } from "vue";

import SocialLogin from "./SocialLogin.vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VInput from "@/shared/ui/common/VInput.vue";

interface Props {
  loading?: boolean
  error?: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [{ name: string, email: string, password: string, terms: boolean }]
  socialLogin: [provider: "google" | "github"]
}>();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

const passwordStrength = computed(() => {
  const pwd = formData.password;
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

const rules = computed(() => ({
  name: {
    required: helpers.withMessage("Full name is required", required),
    minLength: helpers.withMessage("Name must be at least 2 characters", minLength(2)),
  },
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Please enter a valid email", email),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage("Password must be at least 8 characters", minLength(8)),
  },
  confirmPassword: {
    required: helpers.withMessage("Please confirm your password", required),
    sameAs: helpers.withMessage("Passwords do not match", sameAs(formData.password)),
  },
  terms: {
    required: helpers.withMessage("You must agree to the terms", required),
    sameAs: helpers.withMessage("You must agree to the terms", sameAs(true)),
  },
}));

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid || props.loading) return;

  emit("submit", {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    terms: formData.terms,
  });
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
      novalidate
      @submit.prevent="handleSubmit"
    >
      <!-- Name -->
      <VInput
        v-model="formData.name"
        type="text"
        name="Full Name"
        placeholder="Enter your full name"
        icon="mdi:account-outline"
        size="sm"
        :disabled="loading"
        autocomplete="name"
        :validation="v$.name"
      />

      <!-- Email -->
      <VInput
        v-model="formData.email"
        type="email"
        name="Email"
        placeholder="Enter your email"
        icon="mdi:email-outline"
        size="sm"
        :disabled="loading"
        autocomplete="email"
        :validation="v$.email"
      />

      <!-- Password with inline strength -->
      <div>
        <VInput
          v-model="formData.password"
          type="password"
          name="Password"
          placeholder="Create a password"
          icon="mdi:lock-outline"
          size="sm"
          :disabled="loading"
          autocomplete="new-password"
          :validation="v$.password"
        />
        <!-- Inline Password Strength -->
        <div
          v-if="formData.password.length > 0"
          class="flex gap-1 mt-1.5 px-0.5"
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
      <VInput
        v-model="formData.confirmPassword"
        type="password"
        name="Confirm Password"
        placeholder="Confirm your password"
        icon="mdi:lock-check-outline"
        size="sm"
        :disabled="loading"
        autocomplete="new-password"
        :validation="v$.confirmPassword"
      />

      <!-- Terms -->
      <div class="space-y-1">
        <VCheckbox
          v-model="formData.terms"
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
        <p
          v-if="v$.terms.$error"
          class="text-xs text-negative px-1"
        >
          {{ v$.terms.$errors[0].$message }}
        </p>
      </div>

      <!-- Submit Button -->
      <VButton
        type="submit"
        variant="primary"
        text="Create Account"
        :loading="loading"
        :disabled="loading"
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

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
