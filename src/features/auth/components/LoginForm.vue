<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { computed, reactive } from "vue";

import { useAuthStore } from "@/features/auth";
import VButton from "@/shared/ui/common/VButton.vue";
import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const authStore = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
  remember: false,
});



const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Please enter a valid email", email),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage("Password must be at least 6 characters", minLength(6)),
  },
}));

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;
  await authStore.login(formData.email, formData.password);

};
</script>

<template>
  <div class="space-y-3">
    <!-- Divider -->
    <div class="relative py-1">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-cardBorder" />
      </div>
      <div class="relative flex justify-center text-xs z-10">
        <span class="px-3 bg-cardBg/80 text-secondaryText">or continue with email</span>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="authStore.loginError"
      class="p-2 rounded-lg bg-lightNegative border border-negative/20 animate-shake"
    >
      <p class="text-xs text-negative font-medium flex items-center gap-2">
        <span>⚠️</span>
        {{ authStore.loginError.message }}
      </p>
    </div>

    <!-- Login Form -->
    <form
      class="space-y-3"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <!-- Email -->
      <div class="space-y-1">
        <VInput
          v-model="formData.email"
          type="email"
          name="Email"
          placeholder="Enter your email"
          icon="mdi:email-outline"
          size="sm"
          :disabled="authStore.loginLoading"
          autocomplete="email"
          :validation="v$.email"
        />
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <VInput
          v-model="formData.password"
          type="password"
          name="Password"
          placeholder="Enter your password"
          icon="mdi:lock-outline"
          size="sm"
          :disabled="authStore.loginLoading"
          autocomplete="current-password"
          :validation="v$.password"
        />
      </div>

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between pt-0.5">
        <VCheckbox
          v-model="formData.remember"
          label="Remember me"
          :disabled="authStore.loginLoading"
        />

        <button
          type="button"
          :disabled="authStore.loginLoading"
          class="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <VButton
        type="submit"
        variant="primary"
        text="Sign In"
        :loading="authStore.loginLoading || authStore.initLoading"
        class="w-full !mt-4"
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

