<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/features/auth/store/authStore";
import UserAvatar from "@/shared/ui/common/UserAvatar.vue";
import VCard from "@/shared/ui/common/VCard.vue";
import VFloating from "@/shared/ui/common/VFloating.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  /** Compact mode (smaller size) */
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  compact: false,
});

const authStore = useAuthStore();
const { user, userDisplayName, isLoading } = storeToRefs(authStore);
const { logout } = authStore;

const handleLogout = async () => {
  await logout();
};

// Menu actions
const handleMenuSelect = (value: string | number) => {
  switch (value) {
    case "profile":
      // Navigate to profile
      console.log("Navigate to profile");
      break;
    case "settings":
      // Navigate to settings
      console.log("Navigate to settings");
      break;
    case "logout":
      handleLogout();
      break;
  }
};
</script>

<template>
  <div class="user-menu">
    <VFloating
      placement="top-left"
      unstyled
    >
      <!-- Trigger slot -->
      <template #trigger>
        <button
          type="button"
          class="user-menu-trigger flex items-center gap-2 rounded-lg
                 transition-all duration-200 ease-in-out"
          :class="{
            'py-2.5 px-4': !compact,
            'py-2.5 px-2': compact,
          }"
        >
          <!-- Avatar -->
          <UserAvatar
            :name="user?.name"
            :avatar="user?.avatar"
            size="sm"
            :online="!!user"
          />

          <!-- User Info (only in expanded mode) -->
          <Transition name="user-info-fade">
            <div
              v-if="!compact && user"
              class="flex flex-col items-start min-w-0"
            >
              <span class="text-sm font-medium text-mainText truncate max-w-[150px]">
                {{ userDisplayName }}
              </span>
              <span class="text-xs text-secondaryText truncate max-w-[150px]">
                {{ user.email }}
              </span>
            </div>
          </Transition>

          <!-- Chevron Icon (only in expanded mode) -->
          <Transition name="chevron-fade">
            <VIcon
              v-if="!compact"
              icon="mdi:chevron-down"
              :size="16"
              class="text-secondaryText transition-transform duration-200 flex-shrink-0"
            />
          </Transition>

          <!-- Loading Skeleton -->
          <div
            v-if="!compact && isLoading"
            class="flex flex-col gap-1 min-w-0"
          >
            <div class="h-3 bg-base-300 rounded animate-pulse w-20" />
            <div class="h-2.5 bg-base-300 rounded animate-pulse w-32" />
          </div>
        </button>
      </template>

      <!-- Custom content for dropdown -->
      <template #content>
        <VCard>
          <!-- User Info Header with delayed fade-in -->
          <div
            v-if="user"
            class="user-menu-header px-3 py-2.5 border-b border-base-300"
          >
            <div class="flex items-center gap-2.5">
              <UserAvatar
                :name="user.name"
                :avatar="user.avatar"
                size="sm"
              />
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-sm font-semibold text-mainText truncate">
                  {{ user.name }}
                </span>
                <span class="text-xs text-secondaryText truncate">
                  {{ user.email }}
                </span>
                <span
                  class="text-xs font-medium mt-0.5 px-1.5 py-0.5 rounded-full
                         bg-primary/10 text-primary w-fit"
                >
                  {{ user.role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Menu Items with delayed fade-in -->
          <div class="user-menu-items py-0.5">
            <!-- Profile -->
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2
                     transition-colors duration-150 text-left
                     text-mainText hover:bg-base-200 rounded-md
                     focus:outline-none focus-visible:outline-none
                     focus:bg-base-200 focus-visible:bg-base-200"
              @click="handleMenuSelect('profile')"
            >
              <VIcon
                icon="mdi:account"
                :size="18"
                class="flex-shrink-0"
              />
              <span class="text-sm font-medium">Profile</span>
            </button>

            <!-- Settings -->
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2
                     transition-colors duration-150 text-left
                     text-mainText hover:bg-base-200 rounded-md
                     focus:outline-none focus-visible:outline-none
                     focus:bg-base-200 focus-visible:bg-base-200"
              @click="handleMenuSelect('settings')"
            >
              <VIcon
                icon="mdi:cog"
                :size="18"
                class="flex-shrink-0"
              />
              <span class="text-sm font-medium">Settings</span>
            </button>

            <!-- Divider -->
            <div class="my-1 border-t border-base-300" />

            <!-- Logout -->
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2
                     transition-colors duration-150 text-left
                     text-error hover:bg-error/10 rounded-md
                     focus:outline-none focus-visible:outline-none
                     focus:bg-error/10 focus-visible:bg-error/10"
              @click="handleMenuSelect('logout')"
            >
              <VIcon
                icon="mdi:logout"
                :size="18"
                class="flex-shrink-0"
              />
              <span class="text-sm font-medium">Logout</span>
            </button>
          </div>
        </VCard>
      </template>

      <!-- Custom icon rendering -->
      <template #icon="{ icon }">
        <VIcon
          :icon="icon"
          :size="18"
        />
      </template>
    </VFloating>
  </div>
</template>

<style scoped>
/* Ensure content doesn't overflow during animation */
.user-menu-dropdown {
  overflow: hidden;
}

/* Completely remove browser default outline on ALL buttons inside user-menu */
.user-menu :deep(button),
.user-menu-items button {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  -webkit-tap-highlight-color: transparent !important;
}

.user-menu :deep(button:focus),
.user-menu :deep(button:active),
.user-menu-items button:focus,
.user-menu-items button:active {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  -webkit-tap-highlight-color: transparent !important;
}

.user-menu :deep(button:focus-visible),
.user-menu-items button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  -webkit-tap-highlight-color: transparent !important;
}

/* Transition for User Info in trigger - with delayed appearance */
.user-info-fade-enter-active {
  /* Appear with delay - wait for dropdown to close */
  transition: opacity 0.2s ease 0.15s;
}

.user-info-fade-leave-active {
  /* Fast disappearance without delay */
  transition: opacity 0.15s ease;
}

.user-info-fade-enter-from {
  opacity: 0;
}

.user-info-fade-leave-to {
  opacity: 0;
}

.user-info-fade-enter-to,
.user-info-fade-leave-from {
  opacity: 1;
}

/* Transition for Chevron icon - same logic as User Info */
.chevron-fade-enter-active {
  /* Appear with delay - wait for dropdown to close */
  transition: opacity 0.2s ease 0.15s;
}

.chevron-fade-leave-active {
  /* Fast disappearance without delay */
  transition: opacity 0.15s ease;
}

.chevron-fade-enter-from {
  opacity: 0;
}

.chevron-fade-leave-to {
  opacity: 0;
}

.chevron-fade-enter-to,
.chevron-fade-leave-from {
  opacity: 1;
}

@keyframes fadeInDelayed {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


