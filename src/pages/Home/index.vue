<script lang="ts" setup>
import { ref } from "vue";

import type { Feature } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";

// Reactive state
const count = ref(0);

// Feature data
const features: Feature[] = [
  {
    title: "Vue 3 + TypeScript",
    description: "Latest Vue 3 with Composition API and TypeScript support",
    // icon: "⚡",
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first CSS framework with custom theme system",
    // icon: "🎨",
  },
  {
    title: "ESLint + Prettier",
    description: "Code quality and formatting tools with modern best practices",
    // icon: "🔧",
  },
  {
    title: "Vite Build Tool",
    description: "Lightning fast development server and optimized builds",
    // icon: "⚡",
  },
  {
    title: "Vue Router",
    description: "Official router with lazy loading and navigation guards",
    // icon: "🗺️",
  },
  {
    title: "Pinia State Management",
    description: "Intuitive, type safe, and flexible store for Vue",
    // icon: "🗃️",
  },
];

// Actions
function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}

function reset() {
  count.value = 0;
}
</script>

<template>
  <div>
    <div class="space-y-8">
      <!-- Hero Section -->
      <section class="text-center py-12">
        <h1 class="text-4xl md:text-6xl font-bold text-primary mb-4">
          Vue 3 Starter Template
        </h1>
        <p class="text-xl text-secondary max-w-2xl mx-auto text-balance">
          A modern, well-architected starter template with TypeScript,
          Tailwind CSS, ESLint, and Prettier - ready for
          production.
        </p>
      </section>

      <!-- Features Grid -->
      <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VCard
          v-for="feature in features"
          :key="feature.title"
          :description="feature.description"
          :title="feature.title"
        />
        <!--          :icon="feature.icon"-->
      </section>

      <!-- Glass Effects Demo -->
      <section class="grid md:grid-cols-2 gap-6">
        <!-- Basic Glass Card -->
        <div class="card-glass">
          <h3 class="text-xl font-bold mb-2 text-gradient-blue">
            Glass Effect Card
          </h3>
          <p class="text-secondaryText">
            This card uses the
            <code class="px-2 py-1 bg-base-200 rounded text-sm">
              card-glass
            </code>
            utility for a modern frosted glass look.
          </p>
        </div>

        <!-- Elevated Glass Card -->
        <div class="card-glass-elevated">
          <h3 class="text-xl font-bold mb-2">
            Elevated Glass
          </h3>
          <p class="text-secondaryText">
            This card has stronger shadow and opacity using
            <code class="px-2 py-1 bg-base-200 rounded text-sm">
              card-glass-elevated
            </code>.
          </p>
        </div>

        <!-- Gradient Overlay -->
        <div
          class="gradient-overlay-strong bg-base-100 border
                 border-base-300 rounded-xl p-6"
        >
          <h3 class="text-xl font-bold mb-2">
            Gradient Overlay
          </h3>
          <p class="text-secondaryText">
            Subtle gradient overlay adds depth with
            <code class="px-2 py-1 bg-base-200 rounded text-sm">
              gradient-overlay-strong
            </code>.
          </p>
        </div>

        <!-- Gradient Border -->
        <div class="gradient-border bg-base-100 rounded-xl p-6">
          <h3 class="text-xl font-bold mb-2 text-gradient-subtle">
            Gradient Border
          </h3>
          <p class="text-secondaryText">
            Beautiful animated gradient border with
            <code class="px-2 py-1 bg-base-200 rounded text-sm">
              gradient-border
            </code>.
          </p>
        </div>
      </section>

      <!-- Interactive Glass Buttons -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-gradient-blue text-center">
          Interactive Glass Elements
        </h2>
        <div class="flex flex-wrap gap-4 justify-center">
          <button class="glass glow-on-hover px-6 py-3 rounded-lg font-medium transition-all">
            Hover for Glow ✨
          </button>
          <button
            class="glass-strong hover:scale-105 px-6
          py-3 rounded-lg font-medium transition-all"
          >
            Glass Strong
          </button>
          <button class="glass-subtle hover:glass px-6 py-3 rounded-lg font-medium transition-all">
            Subtle → Normal
          </button>
        </div>
      </section>

      <!-- Counter Demo -->
      <VCard
        size="xl"
        variant="outlined"
      >
        <h2 class="text-2xl font-semibold mb-4">
          Interactive Counter
        </h2>
        <div class="space-y-4">
          <p class="text-lg">
            Count:
            <span class="font-mono text-primary text-3xl font-bold">{{ count }}</span>
          </p>
          <div class="flex gap-2 justify-center">
            <VButton
              icon="mdi:minus"
              variant="negative"
              @click="decrement"
            />
            <VButton
              icon="mdi:plus"
              variant="positive"
              @click="increment"
            />
            <VButton
              text="Reset"
              @click="reset"
            />
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>
