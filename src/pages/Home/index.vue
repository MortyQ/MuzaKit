<script lang="ts" setup>
import type { Feature } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";


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
    title: "ESLint",
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
</script>

<template>
  <div class="page-container">
    <div class="space-y-8">
      <VCard
        class="max-w-3xl mx-auto text-center"
        padding="xl"
      >
        <h1 class="text-4xl md:text-6xl font-bold text-gradient-animated mb-6">
          Vue 3 Starter Template
        </h1>
        <p class="text-xl text-secondaryText mb-8 text-balance">
          A modern, well-architected starter template with TypeScript,
          Tailwind CSS, ESLint, and Prettier - ready for production.
        </p>
        <div class="flex gap-4 justify-center flex-wrap items-center">
          <VButton text="Get Started ✨" />
          <VButton text=" View Docs" />
        </div>
      </VCard>
      <!-- Features Grid -->
      <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VCard
          v-for="feature in features"
          :key="feature.title"
          :description="feature.description"
          :title="feature.title"
          variant="glass"
        />
      </section>

      <!-- Interactive Glass Elements -->
      <VCard
        padding="lg"
      >
        <h2 class="text-3xl font-bold text-gradient-blue text-center mb-8">
          Interactive Glass Elements
        </h2>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <VCard
            variant="glass"
            padding="md"
            class="glow-on-hover cursor-pointer text-center"
          >
            <h3 class="font-bold mb-2">
              Glass
            </h3>
            <p class="text-sm text-secondaryText">
              Hover for glow ✨
            </p>
          </VCard>
          <VCard
            variant="glass-elevated"
            padding="md"
            class="cursor-pointer text-center"
          >
            <h3 class="font-bold mb-2">
              Strong
            </h3>
            <p class="text-sm text-secondaryText">
              More opaque 💪
            </p>
          </VCard>
          <VCard
            variant="glass"
            padding="md"
            class="glass-subtle hover:glass cursor-pointer text-center"
          >
            <h3 class="font-bold mb-2">
              Subtle
            </h3>
            <p class="text-sm text-secondaryText">
              Very light 🪶
            </p>
          </VCard>
        </div>

        <div class="text-center text-sm text-secondaryText">
          <p class="mb-2">
            💡 <strong>Pro tip:</strong> Use glass effects strategically for best performance
          </p>
          <p>
            See
            <code class="px-2 py-1 bg-base-200 rounded text-xs">
              GLASSMORPHISM_STRATEGY.md
            </code>
            for guidelines
          </p>
        </div>
      </VCard>
    </div>
  </div>
</template>
