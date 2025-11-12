import { defineStore } from "pinia";

/**
 * Authentication Store
 * This is a reference implementation for production use
 *
 * Features:
 * - User state management
 * - getMe() API call for token validation
 * - Permission management
 * - Token caching to avoid excessive API calls
 */

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  permissions: string[];
  lastFetched: number | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    permissions: [],
    lastFetched: null,
    isLoading: false,
  }),

  actions: {
    /**
         * Fetch current user from API (getMe)
         * This validates the token and loads user data
         */
    async fetchUser() {
      // If data is fresh, skip API call
      if (this.isDataFresh) {
        return this.user;
      }

      this.isLoading = true;

      try {
        // TODO: Replace with your actual API call
        // const response = await api.get("/auth/me");

        // Mock API response for demo
        await new Promise((resolve) => setTimeout(resolve, 500));
        const response = {
          data: {
            id: "1",
            email: "demo@example.com",
            name: "Demo User",
            permissions: ["user.read", "user.write"],
          },
        };

        this.user = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
        };
        this.permissions = response.data.permissions;
        this.lastFetched = Date.now();

        return this.user;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.clearUser();
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
         * Login user
         */
    // eslint-disable-next-line
    async login(email: string, password: string) {
      this.isLoading = true;

      try {
        // TODO: Replace with your actual API call
        // const response = await api.post("/auth/login", { email, password });

        // Mock API response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const token = "demo-token-" + Date.now();

        // Store token
        localStorage.setItem("accessToken", token);

        // Fetch user data
        await this.fetchUser();
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
         * Logout user
         */
    // eslint-disable-next-line require-await
    async logout() {
      try {
        // TODO: Call logout API endpoint
        // await api.post("/auth/logout");

        // Clear local storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // Clear store
        this.clearUser();
      } catch (error) {
        console.error("Logout failed:", error);
        // Clear anyway on error
        this.clearUser();
      }
    },

    /**
         * Check if user has specific permission
         */
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    },

    /**
         * Check if user has any of the required permissions
         */
    hasAnyPermission(required: string[]): boolean {
      return required.some((p) => this.permissions.includes(p));
    },

    /**
         * Check if user has all required permissions
         */
    hasAllPermissions(required: string[]): boolean {
      return required.every((p) => this.permissions.includes(p));
    },

    /**
         * Clear user data from store
         */
    clearUser() {
      this.user = null;
      this.permissions = [];
      this.lastFetched = null;
    },

    /**
         * Set user data manually (for demo/testing)
         */
    setUser(user: User) {
      this.user = user;
      this.lastFetched = Date.now();
    },
  },

  getters: {
    /**
     * Check if user is authenticated
     */
    isAuthenticated: (state) => !!state.user,

    /**
     * Get user's full name or email
     */
    displayName: (state) => state.user?.name || state.user?.email || "Guest",

    /**
     * Check if user data is fresh (less than 5 minutes old)
     */
    isDataFresh: (state) => {
      if (!state.lastFetched) return false;
      const FIVE_MINUTES = 5 * 60 * 1000;
      return Date.now() - state.lastFetched < FIVE_MINUTES;
    },
  },

});

/**
 * Usage in guards.ts:
 *
 * import { useAuthStore } from "@/stores/auth";
 *
 * export async function isAuthenticated(): Promise<boolean> {
 *   const token = localStorage.getItem("accessToken");
 *   if (!token) return false;
 *
 *   try {
 *     const authStore = useAuthStore();
 *     await authStore.fetchUser(); // Calls getMe()
 *     return true;
 *   } catch (error) {
 *     return false;
 *   }
 * }
 *
 * export async function hasPermissions(required: string[]): Promise<boolean> {
 *   const authStore = useAuthStore();
 *   return authStore.hasAnyPermission(required);
 * }
 */

