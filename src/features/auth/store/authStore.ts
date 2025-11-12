import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { mockGetMe, mockLogin, mockLogout } from "../api/mockApi";
import type { User, UserPermission } from "../types";

/**
 * Auth Store
 *
 * Manages authentication state and user data
 * Uses mock API with simulated delays for easy transition to real API
 *
 * @example
 * ```ts
 * const authStore = useAuthStore();
 * await authStore.initialize();
 *
 * if (authStore.isAuthenticated) {
 *   console.log(authStore.user.name);
 * }
 * ```
 */
export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const isInitialized = ref(false);
  const error = ref<string | null>(null);

  // Promise to track initialization
  let initializationPromise: Promise<void> | null = null;

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

  /**
   * Initialize auth state
   * Call this on app startup to load user data
   */
  const initialize = (): Promise<void> => {
    // If already initialized, return immediately
    if (isInitialized.value) {
      return Promise.resolve();
    }

    // If initialization is in progress, wait for it
    if (initializationPromise) {
      return initializationPromise;
    }

    // Start initialization
    initializationPromise = (async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        isInitialized.value = true;
        return;
      }

      isLoading.value = true;
      error.value = null;

      try {
        // Simulate API call to getMe
        user.value = await mockGetMe();
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        error.value = err instanceof Error ? err.message : "Failed to load user";
        // Clear invalid token
        localStorage.removeItem("accessToken");
        user.value = null;
      } finally {
        isLoading.value = false;
        isInitialized.value = true;
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  };

  /**
   * Login user
   */
  const login = async (email: string, password: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const { user: userData, token } = await mockLogin(email, password);
      localStorage.setItem("accessToken", token);
      user.value = userData;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await mockLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
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
    } catch (err) {
      console.error("Failed to refresh user:", err);
      error.value = err instanceof Error ? err.message : "Failed to refresh";
      // On refresh failure, logout user
      await logout();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user,
    isLoading,
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

