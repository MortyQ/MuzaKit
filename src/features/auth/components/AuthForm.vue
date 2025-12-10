<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";


import AnimatedBackground from "./AnimatedBackground.vue";
import DevQuickLogin from "./DevQuickLogin.vue";
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

const authPages = {
  login: LoginForm,
  register: RegisterForm,
};

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
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
  >
    <!-- Animated Background -->
    <AnimatedBackground />

    <!-- Auth Card -->
    <div class="w-full max-w-md relative z-10">
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
          <component :is="authPages[mode]" />
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

      <!-- Dev Quick Login (Easy to remove for production) -->
      <DevQuickLogin
        v-if="isLogin"
        @login="handleLogin"
      />
    </div>
  </div>
</template>
