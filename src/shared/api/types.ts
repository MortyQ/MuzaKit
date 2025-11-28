/**
 * API Types
 *
 * Centralized types for API operations
 */

import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import type { Ref } from "vue";

/**
 * Base API response with typed data
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * API error with details
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
  details?: unknown;
}

/**
 * API request configuration with extended options
 */
export interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /** Skip error toast notifications */
  skipErrorNotification?: boolean;
  /** Skip success toast notifications */
  skipSuccessNotification?: boolean;
  /** Custom success message */
  successMessage?: string;
  /** Skip authorization token */
  skipAuth?: boolean;
  /** Use retry logic */
  retry?: boolean | number;
  /** Delay between retry attempts */
  retryDelay?: number;
}

/**
 * API request state
 */
export interface ApiState<T = unknown> {
  /** Response data */
  data: T | null;
  /** Loading flag */
  loading: boolean;
  /** Error */
  error: ApiError | null;
  /** HTTP status code */
  statusCode: number | null;
}

/**
 * Options for useApi composable
 */
export interface UseApiOptions<T = unknown, D = unknown> extends ApiRequestConfig<D> {
  /** Execute request immediately on creation */
  immediate?: boolean;
  /** Callback on successful request */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: ApiError) => void;
  /** Callback before request */
  onBefore?: () => void;
  /** Callback after completion (success or error) */
  onFinish?: () => void;
  /** Initial data */
  initialData?: T;
  /** Delay before request (debounce) */
  debounce?: number;
  /** Request timeout */
  timeout?: number;
}

/**
 * Return type of useApi composable
 *
 * Keep it simple - no computed helpers, use raw state directly:
 * - if (loading.value) { ... }
 * - if (error.value) { ... }
 * - if (data.value) { ... }
 * - if (data.value?.length === 0) { ... } // For arrays
 * - if (response.value) { console.log(response.value.headers) } // For advanced cases
 */
export interface UseApiReturn<T = unknown, D = unknown> {
  /** Reactive data */
  data: Ref<T | null>;
  /** Loading flag */
  loading: Ref<boolean>;
  /** Error */
  error: Ref<ApiError | null>;
  /** HTTP status code */
  statusCode: Ref<number | null>;
  /** Full Axios response - includes headers, status, config (optional, for advanced use) */
  response: Ref<AxiosResponse<T> | null>;
  /** Execute request */
  execute: (config?: ApiRequestConfig<D>) => Promise<T | null>;
  /** Abort request */
  abort: (message?: string) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Authorization tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Generic typed Axios error
 */
export type TypedAxiosError<T = unknown> = AxiosError<{
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
  data?: T;
}>;

/**
 * Generic typed Axios response
 */
export type TypedAxiosResponse<T = unknown> = AxiosResponse<T>;

/**
 * HTTP methods
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Request status can be derived from state:
 * - loading === true → PENDING
 * - error !== null → ERROR
 * - data !== null && !error && !loading → SUCCESS
 * - !data && !error && !loading → IDLE
 *
 * No need for enum - keep it simple!
 */

/**
 * Retry logic options
 */
export interface RetryOptions {
  /** Number of attempts */
  maxRetries?: number;
  /** Delay between attempts (ms) */
  retryDelay?: number;
  /** Use exponential backoff */
  exponentialBackoff?: boolean;
  /** Function to check if retry is needed */
  shouldRetry?: (error: AxiosError) => boolean;
}

