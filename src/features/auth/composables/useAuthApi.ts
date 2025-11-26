/**
 * useAuthApi Composable
 *
 * Специализированный composable для работы с auth API
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
 * Типы для auth API
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
 * Composable для auth API
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
   * Настройка API клиента (вызывается при инициализации приложения)
   */
  const initialize = () => {
    setupApiClient({
      onTokenRefreshFailed: () => {
        // При неудачном refresh токена редиректим на login
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

      // Сохраняем токены
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

      // Автоматически логиним после регистрации
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
      // Вызываем API logout (опционально)
      await apiClient.post("/auth/logout");
    } catch (err) {
      // Игнорируем ошибки logout на сервере
      console.error("Logout error:", err);
    } finally {
      // Всегда очищаем токены локально
      tokenManager.clearTokens();
      isLoading.value = false;

      // Редирект на login
      router.push({ name: "login" });
    }
  };

  /**
   * Refresh token (обычно вызывается автоматически interceptor'ом)
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

      // Сохраняем новые токены
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
   * Проверить валидность токена
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
   * Получить токены (для отладки)
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

