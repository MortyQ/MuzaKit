<script setup lang="ts">
import { useRouter } from "vue-router";

import VButton from "@/shared/ui/common/VButton.vue";

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-100">
    <div class="text-center max-w-md px-6">
      <!-- Icon -->
      <div class="mb-8">
        <div
          class="w-32 h-32 mx-auto rounded-full bg-error/10 flex items-center justify-center"
        >
          <svg
            class="w-16 h-16 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
              1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-6xl font-bold text-error mb-4">
        403
      </h1>
      <h2 class="text-3xl font-semibold text-neutral mb-4">
        Access Denied
      </h2>

      <!-- Description -->
      <p class="text-neutral/70 mb-8">
        You don't have permission to access this page. Please contact your administrator
        if you believe this is a mistake.
      </p>

      <!-- Actions -->
      <div class="flex gap-4 justify-center">
        <VButton
          variant="default"
          @click="goBack"
        >
          Go Back
        </VButton>
        <VButton
          variant="primary"
          @click="goHome"
        >
          Go Home
        </VButton>
      </div>
    </div>
  </div>
</template>

