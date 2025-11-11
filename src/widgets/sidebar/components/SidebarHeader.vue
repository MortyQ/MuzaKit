<script setup lang="ts">
import { useSidebar } from "../composables/useSidebar";

import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  /** Brand logo URL */
  logo?: string;
  /** Brand name */
  brandName?: string;
  /** Show close button (for mobile) */
  showClose?: boolean;
}

withDefaults(defineProps<Props>(), {
  logo: "",
  brandName: "App",
  showClose: false,
});

const { isCollapsed, toggleCollapse, closeMobile } = useSidebar();

const handleClose = () => {
  closeMobile();
};
</script>

<template>
  <div class="sidebar-header flex items-center justify-between p-4 border-b border-base-300">
    <!-- Logo & Brand (visible when expanded) -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!isCollapsed"
        class="flex items-center gap-3 min-w-0"
      >
        <!-- Logo -->
        <div
          v-if="logo"
          class="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden"
        >
          <img
            :src="logo"
            :alt="brandName"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Brand Name -->
        <span class="font-semibold text-lg text-neutral truncate">
          {{ brandName }}
        </span>
      </div>
    </Transition>

    <!-- Controls -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Close Button (Mobile) -->
      <button
        v-if="showClose"
        type="button"
        class="p-2 rounded-lg hover:bg-base-200 text-neutral transition-colors"
        aria-label="Close sidebar"
        @click="handleClose"
      >
        <VIcon
          icon="mdi:close"
          :size="20"
        />
      </button>

      <!-- Toggle Collapse Button (Desktop) -->
      <button
        v-else
        type="button"
        class="p-2 rounded-lg hover:bg-base-200 text-neutral transition-colors"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapse"
      >
        <VIcon
          :icon="isCollapsed ? 'mdi:menu' : 'mdi:chevron-left'"
          :size="20"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar-header {
  min-height: 65px;
}
</style>

