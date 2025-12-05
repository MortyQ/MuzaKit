<script setup lang="ts">
/**
 * DevQuickLogin Component
 *
 * Development-only component for quick login with different user roles
 * Easy to remove for production by simply deleting this component
 *
 * Usage:
 * <DevQuickLogin @login="handleLogin" />
 */

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

const emit = defineEmits<{
  login: [data: LoginData];
}>();

const quickLogin = (email: string) => {
  emit("login", {
    email,
    password: "123", // Mock password
    remember: false,
  });
};
</script>

<template>
  <div class="mt-6 p-4 rounded-lg bg-info/10 border border-info/20">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-lg">🚀</span>
      <div class="flex-1">
        <p class="text-xs font-semibold text-info">
          Quick Login (Development Mode)
        </p>
        <p class="text-[10px] text-secondaryText/70 mt-0.5">
          Click to instantly login as different users
        </p>
      </div>
    </div>

    <!-- Quick Login Buttons -->
    <div class="space-y-2">
      <!-- Admin Login -->
      <button
        type="button"
        class="w-full flex items-center gap-3 p-2.5 rounded-lg bg-primary/10
        hover:bg-primary/20 border border-primary/30 transition-all group"
        @click="quickLogin('admin@example.com')"
      >
        <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span class="text-sm">👑</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-xs font-semibold text-mainText group-hover:text-primary transition-colors">
            Admin User
          </p>
          <p class="text-[10px] text-secondaryText">
            admin@example.com • Full access
          </p>
        </div>
        <span class="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </button>

      <!-- Regular User Login -->
      <button
        type="button"
        class="w-full flex items-center gap-3 p-2.5 rounded-lg bg-accent/10
        hover:bg-accent/20 border border-accent/30 transition-all group"
        @click="quickLogin('user@example.com')"
      >
        <div class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <span class="text-sm">👤</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-xs font-semibold text-mainText group-hover:text-accent transition-colors">
            Regular User
          </p>
          <p class="text-[10px] text-secondaryText">
            user@example.com • Limited access
          </p>
        </div>
        <span class="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </button>
    </div>

    <!-- Info Footer -->
    <div class="mt-3 pt-3 border-t border-info/20">
      <p class="text-[10px] text-secondaryText/70 flex items-center gap-1">
        <span>💡</span>
        <span>Or enter any email and password manually</span>
      </p>
    </div>
  </div>
</template>

