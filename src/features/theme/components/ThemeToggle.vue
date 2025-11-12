<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";

import type { ThemeMode } from "@/features/theme/composables/useTheme";
import { useThemeStore } from "@/features/theme/composables/useTheme";

interface Props {
  /** Show label next to icon */
  showLabel?: boolean;
  /** Compact mode (smaller size) */
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLabel: false,
  compact: false,
});

const themeStore = useThemeStore();
const { themeMode } = storeToRefs(themeStore);
const { toggleTheme, initTheme } = themeStore;

onMounted(() => {
  initTheme();
});

const themeLabel = computed(() => {
  const labels: Record<ThemeMode, string> = {
    light: "Light",
    dark: "Dark",
    auto: "Auto",
  };
  return labels[themeMode.value];
});

const themeTooltip = computed(() => {
  const next = themeMode.value === "light" ? "dark" : themeMode.value === "dark" ? "auto" : "light";
  return `Switch to ${next} mode`;
});
</script>

<template>
  <button
    class="theme-toggle group relative flex items-center rounded-lg
           transition-all duration-200 ease-in-out
           bg-base-200/50 hover:bg-base-200
           border border-base-300/50 hover:border-primary/30"
    :class="{
      'py-2.5 px-4 gap-3 justify-start': !compact,
      'py-2.5 px-4 justify-center': compact,
    }"
    :title="themeTooltip"
    :aria-label="themeTooltip"
    @click="toggleTheme"
  >
    <!-- Icon Container with rotation animation -->
    <div class="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
      <!-- Sun Icon (Light mode) -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 rotate-90 scale-0"
        enter-to-class="opacity-100 rotate-0 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 rotate-0 scale-100"
        leave-to-class="opacity-0 -rotate-90 scale-0"
      >
        <svg
          v-if="themeMode === 'light'"
          class="absolute w-5 h-5 text-warning"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z
            m-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414z
            m2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z
            M17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z
            M5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707z
            m1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414z
            M4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          />
        </svg>
      </Transition>

      <!-- Moon Icon (Dark mode) -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 rotate-90 scale-0"
        enter-to-class="opacity-100 rotate-0 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 rotate-0 scale-100"
        leave-to-class="opacity-0 -rotate-90 scale-0"
      >
        <svg
          v-if="themeMode === 'dark'"
          class="absolute w-5 h-5 text-info"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          />
        </svg>
      </Transition>

      <!-- Auto Icon (System mode) -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 rotate-90 scale-0"
        enter-to-class="opacity-100 rotate-0 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 rotate-0 scale-100"
        leave-to-class="opacity-0 -rotate-90 scale-0"
      >
        <svg
          v-if="themeMode === 'auto'"
          class="absolute w-5 h-5 text-primary"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7
            a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
          />
        </svg>
      </Transition>
    </div>

    <!-- Label (optional) -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 w-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 w-0"
    >
      <span
        v-if="showLabel"
        class="text-sm font-medium text-mainText whitespace-nowrap overflow-hidden"
      >
        {{ themeLabel }}
      </span>
    </Transition>

    <!-- Active indicator -->
    <div
      class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
             transition-opacity duration-200 pointer-events-none
             bg-gradient-to-r"
      :class="{
        'from-warning/10 to-warning/5': themeMode === 'light',
        'from-info/10 to-info/5': themeMode === 'dark',
        'from-primary/10 to-primary/5': themeMode === 'auto',
      }"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  @apply focus:outline-none focus:ring-2 focus:ring-primary/50;
  @apply focus:ring-offset-2 focus:ring-offset-base-100;
}
</style>

