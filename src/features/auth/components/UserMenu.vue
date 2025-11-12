<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { useAuthStore } from "@/features/auth/store/authStore";
import UserAvatar from "@/shared/ui/common/UserAvatar.vue";
import VDropdown from "@/shared/ui/common/VDropdown.vue";
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

// Dropdown items for VDropdown
const dropdownItems = computed(() => [
  {
    label: "Profile",
    value: "profile",
    icon: "mdi:account",
  },
  {
    label: "Settings",
    value: "settings",
    icon: "mdi:cog",
  },
]);
</script>

<template>
  <div class="user-menu">
    <VDropdown
      :items="dropdownItems"
      placement="top-left"
      @select="handleMenuSelect"
    >
      <!-- Trigger slot -->
      <template #trigger="{ isOpen }">
        <button
          type="button"
          class="user-menu-trigger flex items-center gap-2 rounded-lg
                 transition-all duration-200 ease-in-out
                 hover:bg-base-200/50 focus:outline-none focus:ring-2
                 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-base-100"
          :class="{
            'py-2.5 px-4': !compact,
            'py-2.5 px-2': compact,
            'bg-base-200/50': isOpen,
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

          <!-- Chevron Icon (only in expanded mode) -->
          <VIcon
            v-if="!compact"
            icon="mdi:chevron-down"
            :size="16"
            :class="isOpen
              ? 'text-secondaryText transition-transform duration-200 flex-shrink-0 rotate-180'
              : 'text-secondaryText transition-transform duration-200 flex-shrink-0'"
          />

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
        <div class="user-menu-dropdown min-w-[250px]">
          <!-- User Info Header -->
          <div
            v-if="user"
            class="px-3 py-2.5 border-b border-base-300"
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

          <!-- Menu Items -->
          <div class="py-0.5">
            <!-- Profile -->
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2
                     transition-colors duration-150 text-left
                     text-mainText hover:bg-base-200 rounded-md"
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
                     text-mainText hover:bg-base-200 rounded-md"
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
                     text-error hover:bg-error/10 rounded-md"
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
        </div>
      </template>

      <!-- Custom icon rendering -->
      <template #icon="{ icon }">
        <VIcon
          :icon="icon"
          :size="18"
        />
      </template>
    </VDropdown>
  </div>
</template>


