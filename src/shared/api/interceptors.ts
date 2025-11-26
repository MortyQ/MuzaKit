/**
 * API Interceptors
 *
 * Модульные interceptors для axios
 * - Request interceptor для добавления токена
 * - Response interceptor для обработки 401 и refresh token
 * - Решение race condition при refresh токена
 */

import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { tokenManager, TOKEN_TYPE } from "./tokenManager";
import type { RefreshTokenResponse } from "./types";

export const AUTH_HEADER = "Authorization";
export const REFRESH_TOKEN_URL = "/auth/refresh";

/**
 * Очередь запросов, ожидающих обновления токена
 */
interface FailedRequestQueue {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}

let failedQueue: FailedRequestQueue[] = [];
let isRefreshing = false;

/**
 * Обработка очереди запросов после обновления токена
 */
function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

/**
 * Request Interceptor
 * Добавляет токен авторизации к каждому запросу
 */
export function setupRequestInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Проверяем, нужно ли добавлять токен
      const skipAuth = (config as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth;

      if (!skipAuth) {
        const authHeader = tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.set(AUTH_HEADER, authHeader);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );
}

/**
 * Response Interceptor
 * Обрабатывает ошибки 401 и выполняет refresh токена
 */
export function setupResponseInterceptor(
  axiosInstance: AxiosInstance,
  onTokenRefreshFailed?: () => void,
): void {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        skipAuth?: boolean;
      };

      // Если ошибка не 401 или запрос уже был повторен, отклоняем
      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // Если это запрос на refresh токена, не пытаемся его обновить снова
      if (originalRequest.url === REFRESH_TOKEN_URL) {
        isRefreshing = false;
        processQueue(error, null);

        // Очищаем токены
        tokenManager.clearTokens();

        // Вызываем callback для редиректа на login
        onTokenRefreshFailed?.();

        return Promise.reject(error);
      }

      // Если токен уже обновляется, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.set(AUTH_HEADER, `${TOKEN_TYPE} ${token}`);
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      // Помечаем запрос как повторный
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        tokenManager.clearTokens();
        onTokenRefreshFailed?.();
        return Promise.reject(error);
      }

      try {
        // Выполняем refresh токена
        const response = await axiosInstance.post<RefreshTokenResponse>(
          REFRESH_TOKEN_URL,
          { refreshToken },
          { skipAuth: true } as InternalAxiosRequestConfig & { skipAuth: boolean },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Сохраняем новые токены
        tokenManager.setTokens({
          accessToken,
          refreshToken: newRefreshToken || refreshToken,
        });

        // Обновляем дефолтный header
        axiosInstance.defaults.headers.common[AUTH_HEADER] = `${TOKEN_TYPE} ${accessToken}`;

        // Обрабатываем очередь запросов
        processQueue(null, accessToken);

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.set(AUTH_HEADER, `${TOKEN_TYPE} ${accessToken}`);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh токена не удался
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        onTokenRefreshFailed?.();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}

/**
 * Настройка всех interceptors
 */
export function setupInterceptors(
  axiosInstance: AxiosInstance,
  options: {
    onTokenRefreshFailed?: () => void;
  } = {},
): void {
  setupRequestInterceptor(axiosInstance);
  setupResponseInterceptor(axiosInstance, options.onTokenRefreshFailed);
}

/**
 * Получить статус обновления токена
 */
export function getRefreshStatus(): {
  isRefreshing: boolean;
  queueLength: number;
} {
  return {
    isRefreshing,
    queueLength: failedQueue.length,
  };
}

