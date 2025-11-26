/**
 * API Client
 *
 * Настроенный axios instance с interceptors
 * - Автоматическое добавление токена авторизации
 * - Обработка 401 ошибок и refresh токена
 * - Решение race condition при обновлении токена
 * - Типобезопасность
 */

import axios, { type AxiosInstance } from "axios";

import { setupInterceptors } from "./interceptors";
import type { ApiRequestConfig, TypedAxiosResponse } from "./types";

/**
 * Создание axios instance
 */
function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : "/api",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
}

/**
 * Основной API клиент
 */
const apiClient = createApiClient();

/**
 * Настройка interceptors с обработкой ошибок авторизации
 */
let isInterceptorsSetup = false;

export function setupApiClient(options: {
  onTokenRefreshFailed?: () => void;
} = {}): void {
  if (isInterceptorsSetup) {
    return;
  }

  setupInterceptors(apiClient, {
    onTokenRefreshFailed: options.onTokenRefreshFailed,
  });

  isInterceptorsSetup = true;
}

/**
 * Типизированные методы для удобства использования
 */
export const typedApiClient = {
  get: <T = unknown>(url: string, config?: ApiRequestConfig) =>
    apiClient.get<T>(url, config) as Promise<TypedAxiosResponse<T>>,

  post: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
    apiClient.post<T>(url, data, config) as Promise<TypedAxiosResponse<T>>,

  put: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
    apiClient.put<T>(url, data, config) as Promise<TypedAxiosResponse<T>>,

  patch: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) =>
    apiClient.patch<T>(url, data, config) as Promise<TypedAxiosResponse<T>>,

  delete: <T = unknown>(url: string, config?: ApiRequestConfig) =>
    apiClient.delete<T>(url, config) as Promise<TypedAxiosResponse<T>>,
};

export default apiClient;

// Обратная совместимость
export const axiosIns = apiClient;
