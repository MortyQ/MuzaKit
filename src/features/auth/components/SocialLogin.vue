<script setup lang="ts">
import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  loading?: boolean
}

defineProps<Props>();

const emit = defineEmits<{
  google: []
  github: []
}>();
</script>

<template>
  <div class="space-y-2.5">
    <!-- Google Button -->
    <button
      type="button"
      :disabled="loading"
      class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
             bg-white hover:bg-gray-50 border border-gray-300
             text-gray-700 font-medium text-sm
             transition-all duration-200
             disabled:opacity-50 disabled:cursor-not-allowed
             shadow-sm hover:shadow"
      @click="emit('google')"
    >
      <VIcon
        icon="mdi:google"
        size="20"
        class="text-[#4285F4]"
      />
      <span>Continue with Google</span>
    </button>

    <!-- GitHub Button -->
    <button
      type="button"
      :disabled="loading"
      class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
             bg-[#24292e] hover:bg-[#1b1f23] border border-[#24292e]
             text-white font-medium text-sm
             transition-all duration-200
             disabled:opacity-50 disabled:cursor-not-allowed
             shadow-sm hover:shadow"
      @click="emit('github')"
    >
      <VIcon
        icon="mdi:github"
        size="20"
      />
      <span>Continue with GitHub</span>
    </button>
  </div>
</template>

<style scoped>
/* Google button specific hover effects */
button:first-child:hover {
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

/* GitHub button specific hover effects */
button:last-child:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
}
</style>
