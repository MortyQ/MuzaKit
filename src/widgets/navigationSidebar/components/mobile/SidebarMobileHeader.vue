<script setup lang="ts">
import VIcon from "@/shared/ui/common/VIcon.vue";
import { useSidebar } from "@/widgets/navigationSidebar/composables/useSidebar";

interface Props {
  /** Logo URL or path */
  logo?: string
  /** Brand name */
  brandName?: string
}

withDefaults(defineProps<Props>(), {
  logo: "",
  brandName: "",
});

const { closeMobile } = useSidebar();
</script>

<template>
  <div class="sidebar-mobile-header flex items-center gap-3 px-4 py-4 border-b border-base-300/50">
    <!-- Logo -->
    <div
      v-if="logo"
      class="flex-shrink-0"
    >
      <img
        :src="logo"
        :alt="brandName"
        class="w-8 h-8 rounded-lg object-cover"
      >
    </div>

    <!-- Brand Name -->
    <h1
      v-if="brandName"
      class="flex-1 text-lg font-semibold text-neutral truncate"
    >
      {{ brandName }}
    </h1>

    <!-- Close button -->
    <button
      type="button"
      class="flex-shrink-0 p-2 rounded-lg hover:bg-base-200 transition-colors"
      aria-label="Close menu"
      @click="closeMobile"
    >
      <VIcon
        icon="mdi:close"
        :size="20"
      />
    </button>
  </div>
</template>

<style scoped>
.sidebar-mobile-header {
  min-height: 65px;
}
</style>
