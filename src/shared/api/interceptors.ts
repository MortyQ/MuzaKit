/**
 * API Interceptors
 *
 * Modular interceptors for axios
 * - Request interceptor for adding token
 * - Response interceptor for handling 401 and token refresh
 * - Race condition protection for token refresh
 */

import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { tokenManager, TOKEN_TYPE } from "./tokenManager";
import type { RefreshTokenResponse } from "./types.ts";

export const AUTH_HEADER = "Authorization";
export const REFRESH_TOKEN_URL = "/auth/refresh";

/**
 * Queue of requests waiting for token refresh
 */
interface FailedRequestQueue {
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}

let failedQueue: FailedRequestQueue[] = [];
let isRefreshing = false;

/**
 * Process request queue after token refresh
 */
function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    }
    else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

/**
 * Request Interceptor
 * Adds authorization token to each request
 */
export function setupRequestInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Check if we need to add token
      const skipAuth = (config as InternalAxiosRequestConfig &
                { skipAuth?: boolean }).skipAuth;

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
 * Handles 401 errors and performs token refresh
 */
export function setupResponseInterceptor(
  axiosInstance: AxiosInstance,
  onTokenRefreshFailed?: () => void,
): void {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
        skipAuth?: boolean
      };

      // If not 401 error or request was already retried, reject
      if (!originalRequest || error.response?.status !== 401
                || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If this is refresh token request, don't try to refresh again
      if (originalRequest.url === REFRESH_TOKEN_URL) {
        isRefreshing = false;
        processQueue(error, null);

        // Clear tokens
        tokenManager.clearTokens();

        // Call callback for redirect to login
        onTokenRefreshFailed?.();

        return Promise.reject(error);
      }

      // If token is already refreshing, add request to queue
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

      // Mark request as retry
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Perform token refresh
        // Note: refresh token is sent via cookies (withCredentials), not in body
        const response = await axiosInstance.post<RefreshTokenResponse>(
          REFRESH_TOKEN_URL,
          {},
          {
            skipAuth: true,
            withCredentials: true,
          } as InternalAxiosRequestConfig & { skipAuth: boolean },
        );

        // Handle both snake_case (from API) and camelCase
        const accessToken = (response.data as Omit<RefreshTokenResponse, "accessToken">)?.access_token
                    || response.data.accessToken;
        const newRefreshToken = (response.data as Omit<RefreshTokenResponse, "accessToken">)?.refresh_token
                    || response.data.refreshToken;

        // Save new tokens
        const currentRefreshToken = tokenManager.getRefreshToken();
        tokenManager.setTokens({
          accessToken,
          refreshToken: newRefreshToken || currentRefreshToken || "",
        });

        // Update default header
        axiosInstance.defaults.headers.common[AUTH_HEADER] = `${TOKEN_TYPE} ${accessToken}`;

        // Process request queue
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.set(AUTH_HEADER, `${TOKEN_TYPE} ${accessToken}`);

        return axiosInstance(originalRequest);
      }
      catch (refreshError) {
        // Token refresh failed
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        onTokenRefreshFailed?.();

        return Promise.reject(refreshError);
      }
      finally {
        isRefreshing = false;
      }
    },
  );
}

/**
 * Setup all interceptors
 */
export function setupInterceptors(
  axiosInstance: AxiosInstance,
  options: {
    onTokenRefreshFailed?: () => void
  } = {},
): void {
  setupRequestInterceptor(axiosInstance);
  setupResponseInterceptor(axiosInstance, options.onTokenRefreshFailed);
}

/**
 * Get token refresh status
 */
export function getRefreshStatus(): {
  isRefreshing: boolean
  queueLength: number
} {
  return {
    isRefreshing,
    queueLength: failedQueue.length,
  };
}
