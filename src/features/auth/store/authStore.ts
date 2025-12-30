import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { mockGetMe, mockLogout } from "../api/mockApi";
import type { User, UserPermission } from "../types";

import { type AuthTokens, tokenManager } from "@/shared/api";
import { useApiGet, useApiPost } from "@/shared/composables";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const isInitialized = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value);

  const userInitials = computed(() => {
    if (!user.value) return "?";

    const name = user.value.name || user.value.email;
    const parts = name.split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  });

  const userDisplayName = computed(() => {
    if (!user.value) return "";
    return user.value.nickname || user.value.name || user.value.email;
  });

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: UserPermission): boolean => {
    return user.value?.permissions.includes(permission) ?? false;
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: UserPermission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: UserPermission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const { loading: initLoading, error: initError, execute } = useApiGet<never>("/me", {
    onSuccess: ({ data }) => {
      user.value = data;
    },
  });

  const initialize = async () => {
    if (user.value || isInitialized.value) {
      return;
    }
    await execute();
  };

  const { loading: loginLoading, error: loginError, execute: loginExecute } = useApiPost<AuthTokens>("/auth/login", {
    onSuccess: ({ data }) => {
      tokenManager.setTokens(data);
      router.push("/");
    },
    authMode: "public",
  });

  const login = async (email: string, password: string): Promise<void> => {
    await loginExecute({
      data: {
        email,
        password,
      },
    });
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await mockLogout();
    }
    catch (err) {
      console.error("Logout error:", err);
    }
    finally {
      localStorage.removeItem("accessToken");
      user.value = null;
      isLoading.value = false;
      router.push("/login");
    }
  };

  /**
   * Refresh user data
   */
  const refresh = async (): Promise<void> => {
    if (!isAuthenticated.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      user.value = await mockGetMe();
    }
    catch (err) {
      console.error("Failed to refresh user:", err);
      error.value = err instanceof Error ? err.message : "Failed to refresh";
      // On refresh failure, logout user
      await logout();
    }
    finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user,
    loginLoading,
    loginError,
    initError,
    initLoading,
    isInitialized,
    error,

    // Computed
    isAuthenticated,
    userInitials,
    userDisplayName,

    // Actions
    initialize,
    login,
    logout,
    refresh,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
});
