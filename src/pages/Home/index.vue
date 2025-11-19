<script lang="ts" setup>
import { useModal } from "@/shared/composables/useModal";
import VButton from "@/shared/ui/common/VButton.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VDrawer from "@/shared/ui/common/VDrawer.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

// Drawer controls
const { open: openFeaturesDrawer } = useModal("features-drawer");
const { open: openQuickStartDrawer } = useModal("quick-start-drawer");

// Features
const features = [
  {
    icon: "mdi:vuejs",
    title: "Vue 3 + Composition API",
    description: "Latest Vue 3 with Composition API and full TypeScript support for type-safe development",
  },
  {
    icon: "mdi:tailwind",
    title: "Glassmorphism Design",
    description: "Modern glassmorphism UI with multi-layered shadows and backdrop blur effects",
  },
  {
    icon: "mdi:palette",
    title: "Theme System",
    description: "Light/Dark theme with CSS variables, seamless switching, and persistent preferences",
  },
  {
    icon: "mdi:lightning-bolt",
    title: "Vite + HMR",
    description: "Lightning-fast development with Vite's instant HMR and optimized production builds",
  },
  {
    icon: "mdi:routes",
    title: "Type-Safe Routing",
    description: "Vue Router with lazy loading, navigation guards, and TypeScript route definitions",
  },
  {
    icon: "mdi:database",
    title: "State Management",
    description: "Pinia store with intuitive API, devtools support, and full TypeScript inference",
  },
];

// Tech stack
const techStack = [
  { name: "Vue 3", icon: "mdi:vuejs", color: "text-[#42b883]" },
  { name: "TypeScript", icon: "mdi:language-typescript", color: "text-[#3178c6]" },
  { name: "Tailwind", icon: "mdi:tailwind", color: "text-[#06b6d4]" },
  { name: "Vite", icon: "mdi:lightning-bolt", color: "text-[#646cff]" },
  { name: "Pinia", icon: "mdi:database", color: "text-[#ffd859]" },
  { name: "ESLint", icon: "mdi:check-decagram", color: "text-[#4b32c3]" },
];

// Getting started steps
const steps = [
  {
    number: "01",
    title: "Clone Repository",
    description: "Get started by cloning the MuzaKit repository",
    code: "git clone <your-repo-url>\ncd muzakit",
  },
  {
    number: "02",
    title: "Install Dependencies",
    description: "Install all required packages using npm or pnpm",
    code: "npm install\n# or\npnpm install",
  },
  {
    number: "03",
    title: "Start Development",
    description: "Run the dev server and start building",
    code: "npm run dev\n# Open http://localhost:3001",
  },
];
</script>

<template>
  <div class="page-container space-y-16">
    <!-- Hero Section -->
    <section
      class="relative mt-8 min-h-[70vh] flex
    items-center justify-center overflow-hidden"
    >
      <!-- Hero content -->
      <div class="relative z-10 container mx-auto px-8">
        <VCard
          variant="glass-elevated"
          class="max-w-4xl mx-auto text-center"
          padding="xl"
        >
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2
          rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <VIcon
              icon="mdi:star-four-points"
              :size="16"
            />
            <span>Where inspiration meets development</span>
          </div>

          <!-- Title -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6">
            <span class="text-gradient-animated">MuzaKit</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-secondaryText mb-8 max-w-2xl mx-auto text-balance">
            A modern, production-ready Vue 3 starter template
            with glassmorphism design, TypeScript, and best practices built-in
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <VButton
              variant="primary"
              class="px-8 py-4 text-lg font-semibold"
              @click="openQuickStartDrawer"
            >
              <VIcon
                icon="mdi:rocket-launch"
                :size="20"
                class="md:mr-2"
              />
              Quick Start Guide
            </VButton>
            <VButton
              variant="default"
              class="px-8 py-4 text-lg font-medium"
              @click="openFeaturesDrawer"
            >
              <VIcon
                icon="mdi:view-list"
                :size="20"
                class="md:mr-2"
              />
              View All Features
            </VButton>
          </div>

          <!-- Tech Stack Icons -->
          <div class="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-base-300">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="flex flex-col items-center gap-2 group"
            >
              <div
                class="w-12 h-12 rounded-xl bg-base-200/50 flex
                items-center justify-center transition-all group-hover:scale-110
                group-hover:bg-base-200"
              >
                <VIcon
                  :icon="tech.icon"
                  :size="24"
                  :class="tech.color"
                />
              </div>
              <span class="text-xs text-secondaryText font-medium">{{ tech.name }}</span>
            </div>
          </div>
        </VCard>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 max-w-7xl">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Everything you need to start building
        </h2>
        <p class="text-xl text-secondaryText max-w-2xl mx-auto">
          MuzaKit comes with modern tools and best practices to help you build amazing applications
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VCard
          v-for="feature in features"
          :key="feature.title"
          variant="glass"
          class="cursor-pointer transition-all hover:scale-105"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10
               flex items-center justify-center"
            >
              <VIcon
                :icon="feature.icon"
                :size="24"
                class="text-primary"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-secondaryText">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </VCard>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="container mx-auto px-4 max-w-6xl">
      <VCard
        variant="glass-elevated"
        padding="xl"
      >
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Get started in 3 simple steps
          </h2>
          <p class="text-xl text-secondaryText">
            Start building your next project in minutes
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="step in steps"
            :key="step.number"
            class="relative"
          >
            <!-- Step number -->
            <div
              class="absolute -top-4 -left-4 w-16 h-16 rounded-2xl
               bg-gradient-to-br from-primary-500 to-primary-600 flex
               items-center justify-center text-white font-bold text-xl shadow-lg"
            >
              {{ step.number }}
            </div>

            <!-- Step content -->
            <VCard
              variant="default"
              class="pt-8"
            >
              <h3 class="text-xl font-bold mb-2">
                {{ step.title }}
              </h3>
              <p class="text-sm text-secondaryText mb-4">
                {{ step.description }}
              </p>

              <!-- Code block -->
              <div class="bg-base-300/50 rounded-lg p-4 font-mono text-sm">
                <pre class="text-mainText whitespace-pre-wrap">{{ step.code }}</pre>
              </div>
            </VCard>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="mt-12 text-center">
          <p class="text-lg text-secondaryText mb-4">
            Ready to dive deeper?
          </p>
          <VButton
            variant="primary"
            class="px-8 py-3"
          >
            <VIcon
              icon="mdi:book-open-variant"
              :size="20"
              class="mr-2"
            />
            Read the Documentation
          </VButton>
        </div>
      </VCard>
    </section>

    <!-- Why MuzaKit Section -->
    <section class="container mx-auto px-4 max-w-6xl">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <!-- Left: Text content -->
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Why choose MuzaKit?
          </h2>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex
                items-center justify-center mt-1"
              >
                <VIcon
                  icon="mdi:check"
                  :size="18"
                  class="text-primary"
                />
              </div>
              <div>
                <h3 class="font-bold mb-1">
                  Production Ready
                </h3>
                <p class="text-sm text-secondaryText">
                  Battle-tested configuration with ESLint, Prettier, and
                  TypeScript for enterprise-grade applications
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex
                items-center justify-center mt-1"
              >
                <VIcon
                  icon="mdi:check"
                  :size="18"
                  class="text-primary"
                />
              </div>
              <div>
                <h3 class="font-bold mb-1">
                  Modern Design System
                </h3>
                <p class="text-sm text-secondaryText">
                  Beautiful glassmorphism effects with light/dark theme
                  support and CSS variable-based theming
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10
                flex items-center justify-center mt-1"
              >
                <VIcon
                  icon="mdi:check"
                  :size="18"
                  class="text-primary"
                />
              </div>
              <div>
                <h3 class="font-bold mb-1">
                  Developer Experience
                </h3>
                <p class="text-sm text-secondaryText">
                  Lightning-fast HMR, type-safe routing, comprehensive
                  documentation, and reusable components
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10
                flex items-center justify-center mt-1"
              >
                <VIcon
                  icon="mdi:check"
                  :size="18"
                  class="text-primary"
                />
              </div>
              <div>
                <h3 class="font-bold mb-1">
                  Best Practices Built-in
                </h3>
                <p class="text-sm text-secondaryText">
                  Feature-based architecture, composables pattern, and performance
                  optimizations from day one
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual element -->
        <VCard
          variant="glass-elevated"
          class="h-full min-h-[400px] flex items-center justify-center"
        >
          <div class="text-center space-y-6 p-8">
            <div class="text-6xl mb-4">
              🎨
            </div>
            <h3 class="text-2xl font-bold">
              Inspired by Creativity
            </h3>
            <p class="text-secondaryText">
              MuzaKit is your muse for building beautiful, functional interfaces
              that inspire users and developers alike
            </p>
            <div class="flex justify-center gap-10 pt-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">
                  50+
                </div>
                <div class="text-xs text-secondaryText">
                  Components
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">
                  100%
                </div>
                <div class="text-xs text-secondaryText">
                  TypeScript
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">
                  ∞
                </div>
                <div class="text-xs text-secondaryText">
                  Possibilities
                </div>
              </div>
            </div>
          </div>
        </VCard>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="container mx-auto px-4 max-w-4xl">
      <VCard
        variant="glass-elevated"
        class="text-center"
        padding="xl"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to build something amazing?
        </h2>
        <p class="text-xl text-secondaryText mb-8 max-w-2xl mx-auto">
          Start your next project with MuzaKit and experience
          the perfect blend of modern design and developer productivity
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <VButton
            variant="primary"
            class="px-8 py-3 text-lg"
          >
            <VIcon
              icon="mdi:download"
              :size="20"
              class="mr-2"
            />
            Download MuzaKit
          </VButton>
          <VButton
            variant="default"
            class="px-8 py-3 text-lg"
          >
            <VIcon
              icon="mdi:eye"
              :size="20"
              class="mr-2"
            />
            View Examples
          </VButton>
        </div>
      </VCard>
    </section>

    <!-- Quick Start Drawer -->
    <VDrawer
      id="quick-start-drawer"
      title="🚀 Quick Start Guide"
      position="right"
      width="lg"
    >
      <div class="space-y-6">
        <div class="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
          <p class="text-mainText font-medium mb-2">
            Welcome to MuzaKit!
          </p>
          <p class="text-secondaryText text-sm">
            Follow these steps to get your project up and running.
          </p>
        </div>

        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="relative"
        >
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-lg
                bg-gradient-to-br from-primary-500 to-primary-600
                flex items-center justify-center text-white
                font-bold shadow-lg"
            >
              {{ index + 1 }}
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-bold text-mainText mb-2">
                {{ step.title }}
              </h3>
              <p class="text-sm text-secondaryText mb-3">
                {{ step.description }}
              </p>

              <div
                class="bg-neutral-900 dark:bg-neutral-900
                  rounded-lg p-4 font-mono text-sm overflow-x-auto"
              >
                <pre class="text-neutral-100">{{ step.code }}</pre>
              </div>
            </div>
          </div>

          <div
            v-if="index < steps.length - 1"
            class="absolute left-5 top-12 bottom-0 w-0.5 bg-base-300"
          />
        </div>
      </div>

      <template #footer>
        <VButton
          variant="default"
          text="Close"
        />
        <VButton
          variant="primary"
          text="Start Building"
          icon="mdi:rocket-launch"
        />
      </template>
    </VDrawer>

    <!-- Features Drawer -->
    <VDrawer
      id="features-drawer"
      title="✨ All Features"
      position="right"
      width="xl"
    >
      <div class="space-y-6">
        <div
          class="bg-gradient-to-r from-primary-50 to-primary-100
            dark:from-primary-900/20 dark:to-primary-800/20
            p-4 rounded-lg"
        >
          <p class="text-mainText font-semibold mb-1">
            Complete Feature Set
          </p>
          <p class="text-secondaryText text-sm">
            Everything you need to build modern applications
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-4 bg-base-200 rounded-lg hover:bg-base-300
              transition-colors cursor-pointer group"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform"
              >
                <VIcon
                  :icon="feature.icon"
                  :size="20"
                  class="text-primary"
                />
              </div>
              <div>
                <h3 class="font-semibold text-mainText mb-1">
                  {{ feature.title }}
                </h3>
                <p class="text-xs text-secondaryText">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-cardBorder">
          <h4 class="font-semibold text-mainText mb-4">
            🛠️ Tech Stack
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
            >
              <VIcon
                :icon="tech.icon"
                :size="24"
                :class="tech.color"
              />
              <span class="text-sm font-medium text-mainText">
                {{ tech.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <VButton
          variant="default"
          text="Close"
        />
        <VButton
          variant="primary"
          text="Explore Components"
          icon="mdi:compass"
        />
      </template>
    </VDrawer>
  </div>
</template>

