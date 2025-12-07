<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { computed, reactive } from "vue";

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

  if (!isValid || props.loading) return;

  emit("submit", {
    email: formData.email,
    password: formData.password,
    remember: formData.remember,
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
          :disabled="loading"
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
          :disabled="loading"
          autocomplete="current-password"
          :validation="v$.password"
        />
      </div>

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between pt-0.5">
        <VCheckbox
          v-model="formData.remember"
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
        :loading="loading"
        :disabled="loading"
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

