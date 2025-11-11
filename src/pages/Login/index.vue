<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    // TODO: Replace with actual API call
    // const authStore = useAuthStore();
    // await authStore.login(email.value, password.value);

    // For demo: just set a token
    localStorage.setItem("accessToken", "demo-token-" + Date.now());

    // Redirect to original destination or home
    const redirectTo = (route.query.redirect as string) || "/";
    router.push(redirectTo);
  } catch (err) {
    error.value = "Invalid credentials";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
};

// Demo login for testing
const demoLogin = () => {
  email.value = "demo@example.com";
  password.value = "password";
  handleLogin();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <VCard
      class="w-full max-w-md"
    >
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          Login
        </h1>
        <p class="text-sm text-neutral/60 text-center mt-2">
          Sign in to your account
        </p>
      </template>

      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <!-- Error message -->
        <div
          v-if="error"
          class="p-3 bg-error/10 text-error rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- Email -->
        <VInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="demo@example.com"
          required
        />

        <!-- Password -->
        <VInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <!-- Submit -->
        <VButton
          type="submit"
          variant="primary"
          class="w-full"
          :loading="isLoading"
        >
          Sign In
        </VButton>

        <!-- Demo login -->
        <VButton
          type="button"
          variant="default"
          class="w-full"
          @click="demoLogin"
        >
          Demo Login (for testing)
        </VButton>
      </form>

      <template #footer>
        <p class="text-xs text-neutral/60 text-center">
          Protected routes will redirect here if not authenticated
        </p>
      </template>
    </VCard>
  </div>
</template>

