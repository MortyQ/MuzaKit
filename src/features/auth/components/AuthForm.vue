<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";


import AnimatedBackground from "./AnimatedBackground.vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";

import { useAuthStore } from "@/features/auth";
import VCard from "@/shared/ui/common/VCard.vue";

type AuthMode = "login" | "register";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const mode = ref<AuthMode>("login");
const isLoading = ref(false);
const error = ref("");

const isLogin = computed(() => mode.value === "login");

const toggleMode = () => {
  mode.value = mode.value === "login" ? "register" : "login";
  error.value = "";
};

const handleLogin = async (data: {
  email: string;
  password: string;
  remember: boolean;
}) => {
  error.value = "";
  isLoading.value = true;

  try {
    await authStore.login(data.email, data.password);

    // Redirect to original destination or home
    const redirectTo = (route.query.redirect as string) || "/";
    router.push(redirectTo);
  } catch (err) {
    error.value = "Invalid credentials. Please try again.";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async (data: {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}) => {
  error.value = "";
  isLoading.value = true;

  try {
    // TODO: Implement register API call
    // For now, just show success and switch to login
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    mode.value = "login";
    error.value = "";

    // You can add a success toast here
    console.log("Registration successful", data);
  } catch (err) {
    error.value = "Registration failed. Please try again.";
    console.error("Register error:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleSocialLogin = async (provider: "google" | "github") => {
  error.value = "";
  isLoading.value = true;

  try {
    // TODO: Implement social login
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Social login with", provider);

    // Mock success
    router.push("/");
  } catch (err) {
    error.value = `Failed to sign in with ${provider}`;
    console.error("Social login error:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: Implement forgot password flow
  console.log("Forgot password clicked");
  alert("Forgot password functionality will be implemented");
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
  >
    <!-- Animated Background -->
    <AnimatedBackground />

    <!-- Auth Card -->
    <div class="w-full max-w-md relative z-10">
      <!-- Glassmorphism Card -->
      <VCard
        variant="elevated"
        padding="md"
        radius="xl"
        class="backdrop-blur-xl bg-cardBg/80 border border-cardBorder/50 shadow-2xl"
      >
        <!-- Header -->
        <div class="text-center mb-5 space-y-1">
          <!-- Logo / Icon -->
          <div class="flex justify-center mb-3">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            >
              <div
                class="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
              >
                🔐
              </div>
            </div>
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-mainText">
            {{ isLogin ? "Welcome Back" : "Create Account" }}
          </h1>

          <!-- Subtitle -->
          <p class="text-sm text-secondaryText">
            {{
              isLogin
                ? "Sign in to continue to your account"
                : "Sign up to get started with us"
            }}
          </p>
        </div>

        <!-- Forms -->
        <div class="space-y-4">
          <!-- Login Form -->
          <Transition
            name="fade-slide"
            mode="out-in"
          >
            <LoginForm
              v-if="isLogin"
              :loading="isLoading"
              :error="error"
              @submit="handleLogin"
              @social-login="handleSocialLogin"
              @forgot-password="handleForgotPassword"
            />

            <!-- Register Form -->
            <RegisterForm
              v-else
              :loading="isLoading"
              :error="error"
              @submit="handleRegister"
              @social-login="handleSocialLogin"
            />
          </Transition>

          <!-- Toggle Mode -->
          <div class="text-center pt-3 border-t border-cardBorder">
            <p class="text-sm text-secondaryText">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button
                type="button"
                class="font-semibold text-primary hover:text-primary-dark ml-1"
                :disabled="isLoading"
                @click="toggleMode"
              >
                {{ isLogin ? "Sign Up" : "Sign In" }}
              </button>
            </p>
          </div>
        </div>
      </VCard>

      <!-- Trust Indicators -->
      <div class="mt-8 text-center space-y-2">
        <p class="text-xs text-secondaryText flex items-center justify-center gap-2">
          <span>🔒</span>
          <span>Your data is secure and encrypted</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

