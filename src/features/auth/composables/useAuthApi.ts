/**
 * useAuthApi Composable
 *
 * Specialized composable for auth API operations
 * - Login
 * - Logout
 * - Refresh token
 * - Register
 * - Password reset
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import apiClient, { setupApiClient } from "@/shared/api/client";
import { handleApiError } from "@/shared/api/errorHandler";
import { tokenManager } from "@/shared/api/tokenManager";
import type { AuthTokens } from "@/shared/api/types";

/**
 * Types for auth API
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user?: unknown;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Composable for auth API
 */
export function useAuthApi() {
  const router = useRouter();

  // State
  const isLoading = ref(false);
  const isRefreshing = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => tokenManager.hasTokens());

  /**
   * Setup API client (called on app initialization)
   */
  const initialize = () => {
    setupApiClient({
      onTokenRefreshFailed: () => {
        // On failed token refresh, redirect to login
        tokenManager.clearTokens();
        const currentRoute = router.currentRoute.value;

        if (currentRoute.name !== "login") {
          router.push({
            name: "login",
            query: { redirect: currentRoute.fullPath },
          });
        }
      },
    });
  };

  /**
   * Login
   */
  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
      const data = response.data;

      // Save tokens
      tokenManager.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      });

      return data;
    } catch (err) {
      const apiError = handleApiError(err, { showToast: true });
      error.value = apiError.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Register
   */
  const register = async (data: RegisterData): Promise<LoginResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<LoginResponse>("/auth/register", data);
      const result = response.data;

      // Auto-login after registration
      tokenManager.setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      });

      return result;
    } catch (err) {
      const apiError = handleApiError(err, { showToast: true });
      error.value = apiError.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      // Call API logout (optional)
      await apiClient.post("/auth/logout");
    } catch (err) {
      // Ignore server logout errors
      console.error("Logout error:", err);
    } finally {
      // Always clear tokens locally
      tokenManager.clearTokens();
      isLoading.value = false;

      // Redirect to login
      router.push({ name: "login" });
    }
  };

  /**
   * Refresh token (usually called automatically by interceptor)
   */
  const refreshToken = async (): Promise<string | null> => {
    const currentRefreshToken = tokenManager.getRefreshToken();

    if (!currentRefreshToken) {
      return null;
    }

    isRefreshing.value = true;

    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        { refreshToken: currentRefreshToken },
        { skipAuth: true } as never,
      );

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

      // Save new tokens
      tokenManager.setTokens({
        accessToken,
        refreshToken: newRefreshToken || currentRefreshToken,
        expiresIn,
      });

      return accessToken;
    } catch (err) {
      handleApiError(err, { showToast: false });
      tokenManager.clearTokens();
      return null;
    } finally {
      isRefreshing.value = false;
    }
  };

  /**
   * Password reset request
   */
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await apiClient.post("/auth/password-reset/request", { email });
      return true;
    } catch (err) {
      const apiError = handleApiError(err, { showToast: true });
      error.value = apiError.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Password reset confirm
   */
  const confirmPasswordReset = async (
    token: string,
    newPassword: string,
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await apiClient.post("/auth/password-reset/confirm", {
        token,
        password: newPassword,
      });
      return true;
    } catch (err) {
      const apiError = handleApiError(err, { showToast: true });
      error.value = apiError.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Validate token
   */
  const validateToken = async (): Promise<boolean> => {
    if (!tokenManager.hasTokens()) {
      return false;
    }

    try {
      await apiClient.get("/auth/validate");
      return true;
    } catch {
      tokenManager.clearTokens();
      return false;
    }
  };

  /**
   * Get tokens (for debugging)
   */
  const getTokens = (): AuthTokens | null => {
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  };

  return {
    // State
    isLoading,
    isRefreshing,
    error,
    isAuthenticated,

    // Methods
    initialize,
    login,
    register,
    logout,
    refreshToken,
    requestPasswordReset,
    confirmPasswordReset,
    validateToken,
    getTokens,
  };
}

