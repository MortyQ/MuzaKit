/**
 * API Client
 *
 * Configured axios instance with interceptors
 * - Automatic authorization token addition
 * - Handle 401 errors and token refresh
 * - Race condition protection for token refresh
 * - Type safety
 */

import axios, { type AxiosInstance } from "axios";

import { setupInterceptors } from "./interceptors";
import type { ApiRequestConfig, TypedAxiosResponse } from "./types";

/**
 * Create axios instance
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
 * Main API client
 */
const apiClient = createApiClient();

/**
 * Setup interceptors with auth error handling
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
 * Typed methods for convenience
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

// Backward compatibility
export const axiosIns = apiClient;
