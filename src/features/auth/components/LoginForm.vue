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
  submit: [{ email: string; password: string; remember: boolean }];
  socialLogin: [provider: "google" | "github"];
  forgotPassword: [];
}>();

const email = ref("");
const password = ref("");
const remember = ref(false);

const isValid = computed(() => {
  return email.value.length > 0 && password.value.length > 0;
});

const handleSubmit = () => {
  if (!isValid.value || props.loading) return;

  emit("submit", {
    email: email.value,
    password: password.value,
    remember: remember.value,
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
        <span class="px-3 bg-cardBg/80 text-secondaryText">or continue with email</span>
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

    <!-- Login Form -->
    <form
      class="space-y-3"
      @submit.prevent="handleSubmit"
    >
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

      <!-- Password -->
      <VInput
        v-model="password"
        type="password"
        name="Password"
        placeholder="Enter your password"
        icon="mdi:lock-outline"
        size="sm"
        :disabled="loading"
        autocomplete="current-password"
        @keypress="handleKeyPress"
      />

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between pt-0.5">
        <VCheckbox
          v-model="remember"
          label="Remember me"
          :disabled="loading"
        />

        <button
          type="button"
          :disabled="loading"
          class="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          @click="emit('forgotPassword')"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <VButton
        type="submit"
        variant="primary"
        text="Sign In"
        :loader="loading"
        :disabled="!isValid || loading"
        class="w-full !mt-4"
      />

      <!-- Demo Login -->
      <div class="text-center">
        <button
          type="button"
          :disabled="loading"
          class="text-xs text-secondaryText hover:text-mainText transition-colors"
          @click="email = 'demo@example.com'; password = 'password'; handleSubmit();"
        >
          Use demo account
        </button>
      </div>
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

