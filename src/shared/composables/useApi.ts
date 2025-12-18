/**
 * useApi Composable
 *
 * Universal composable for working with API
 *
 * Features:
 * - Automatic state management (loading, error, data)
 * - Request cancellation via AbortController
 * - Global abort on filter changes (useGlobalAbort option)
 * - Retry logic
 * - Debouncing
 * - Callbacks (onSuccess, onError, onBefore, onFinish)
 * - Type safety
 * - Full response access (headers, status, config)
 * - Auto cleanup on unmount (automatically detected for components vs stores)
 *
 * @example Basic usage in components (most common)
 * ```ts
 * const { data, loading, error, execute } = useApi<User[]>('/users', {
 *   immediate: true,
 *   onSuccess: (response) => {
 *     console.log('Loaded', response.data.length, 'users')
 *     console.log('Status:', response.status)
 *     console.log('Headers:', response.headers)
 *   }
 * })
 * ```
 *
 * @example With global abort (cancels on filter change)
 * ```ts
 * const { data, loading, execute } = useApi<User[]>('/users', {
 *   useGlobalAbort: true, // Request will be cancelled when global filters change
 *   immediate: true
 * })
 * ```
 *
 * @example Usage in Pinia stores (automatic cleanup detection)
 * ```ts
 * export const useUserStore = defineStore('user', () => {
 *   const fetchUsers = async () => {
 *     // No autoCleanup needed! Automatically detects we're in a store (no component scope)
 *     const { execute } = useApi<User[]>('/users')
 *     return execute()
 *   }
 *
 *   const createUser = async (data: CreateUserDto) => {
 *     // Works perfectly in stores without any special configuration
 *     const { execute } = useApiPost<User, CreateUserDto>('/users')
 *     return execute({ data })
 *   }
 * })
 * ```
 *
 * @example Public endpoints (no auth, no token refresh on 401)
 * ```ts
 * // Login page - public endpoint that should not trigger token refresh
 * const { data, loading, error, execute } = useApiPost<AuthResponse, LoginDto>('/auth/login', {
 *   authMode: 'public', // Won't attempt token refresh on 401, no auth header
 *   skipErrorNotification: false // Will still show error toast
 * })
 *
 * // Public content endpoint
 * const { data } = useApi<PublicContent>('/public/content', {
 *   immediate: true,
 *   authMode: 'public' // 401 errors won't trigger refresh token flow
 * })
 *
 * // Optional auth - works with or without token
 * const { data } = useApi<Content>('/content', {
 *   immediate: true,
 *   authMode: 'optional' // Adds token if available, but 401 won't refresh
 * })
 *
 * // Check auth status without triggering refresh
 * const { execute: checkAuth } = useApi<User>('/auth/me', {
 *   authMode: 'optional', // If 401 - just return error, don't refresh
 *   skipErrorNotification: true // Don't show error toast
 * })
 * ```
 *
 * @example Advanced usage with full response
 * ```ts
 * const { data, response, execute } = useApi<User[]>('/users', {
 *   immediate: true
 * })
 *
 * // Access response headers, status, etc
 * watch(response, (res) => {
 *   if (res) {
 *     console.log('Headers:', res.headers)
 *     console.log('Status:', res.status)
 *
 *     // Example: Check pagination headers
 *     const total = res.headers['x-total-count']
 *     const page = res.headers['x-page']
 *
 *     // Example: Check rate limit
 *     const rateLimit = res.headers['x-ratelimit-remaining']
 *     if (rateLimit && parseInt(rateLimit) < 10) {
 *       console.warn('Low rate limit!')
 *     }
 *   }
 * })
 * ```
 */

import { useDebounceFn } from "@vueuse/core";
import type { AxiosResponse } from "axios";
import { ref, type Ref, onUnmounted, getCurrentScope } from "vue";

import apiClient from "../api/client";
import type {
  UseApiOptions,
  UseApiReturn,
  ApiRequestConfig,
  ApiError,
} from "../api/types";

import { handleApiError } from "@/shared/api";
import { useApiState } from "@/shared/api/composables";
import { useAbortController } from "@/shared/composables/useAbortController";

/**
 * Main composable for API requests
 */
export function useApi<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options: UseApiOptions<T, D> = {},
): UseApiReturn<T, D> {
  const {
    method = "GET",
    immediate = false,
    onSuccess,
    onError,
    onBefore,
    onFinish,
    initialData = null,
    debounce = 0,
    skipErrorNotification = false,
    retry = false,
    retryDelay = 1000,
    authMode = "default",
    useGlobalAbort = false,
    ...axiosConfig
  } = options;

  // Detect if we're inside a component scope (has lifecycle)
  // If true - cleanup automatically, if false (store/service) - skip cleanup
  const hasActiveScope = getCurrentScope() !== undefined;

  // State
  const state = useApiState<T>(initialData as T | null);
  const abortController = ref<AbortController | null>(null);

  // Global abort controller (for filter changes)
  const globalAbort = useGlobalAbort ? useAbortController() : null;

  /**
     * Execute request
     */
  const executeRequest = async (config?: ApiRequestConfig<D>):
  Promise<T | null> => {
    // Cancel previous request if exists
    if (abortController.value) {
      abortController.value.abort();
    }

    // Create new AbortController for this request
    abortController.value = new AbortController();

    // If using global abort, listen to global signal and abort local controller
    let globalAbortHandler: (() => void) | null = null;
    if (globalAbort) {
      const globalSignal = globalAbort.getSignal();
      globalAbortHandler = () => {
        abortController.value?.abort();
      };
      globalSignal.addEventListener("abort", globalAbortHandler);
    }

    // Before callback
    onBefore?.();

    // Set loading state
    state.setLoading(true);
    state.setError(null);

    try {
      const requestUrl = typeof url === "string" ? url : url.value;

      // Always use local signal - it will be aborted by:
      // 1. Local abort() call (manual or onUnmounted)
      // 2. Global filter change (via globalAbortHandler)
      const signal = abortController.value.signal;

      const mergedConfig: ApiRequestConfig<D> = {
        ...axiosConfig,
        ...config,
        signal,
        authMode: config?.authMode || authMode,
      };

      // Execute request
      const response = await apiClient.request<T>({
        url: requestUrl,
        method,
        ...mergedConfig,
      });

      // Set data and full response
      state.setData(response.data, response);
      state.setStatusCode(response.status);

      // Success callback
      if (onSuccess) {
        onSuccess(response as AxiosResponse<T>);
      }

      return response.data;
    }
    catch (err: unknown) {
      // Ignore cancelled requests
      if ((err as { name?: string })?.name === "AbortError" || (err as {
        name?: string
      })?.name === "CanceledError") {
        return null;
      }

      // Handle error
      const apiError = handleApiError(err, {
        showToast: !skipErrorNotification,
      });

      state.setError(apiError);
      state.setStatusCode(apiError.status);

      // Error callback
      onError?.(apiError);

      // Retry logic
      if (retry && shouldRetry(apiError, retry)) {
        const retryCount = typeof retry === "number" ? retry : 3;
        return retryRequest(executeRequest, retryCount, retryDelay, config);
      }

      return null;
    }
    finally {
      // Cleanup global abort handler
      if (globalAbortHandler && globalAbort) {
        const globalSignal = globalAbort.getSignal();
        globalSignal.removeEventListener("abort", globalAbortHandler);
      }

      state.setLoading(false);
      onFinish?.();
    }
  };

  /**
     * Execute with debouncing if specified
     */
  const execute = debounce > 0
    ? useDebounceFn(executeRequest, debounce)
    : executeRequest;

  /**
     * Abort request
     * Works with both local and global abort controllers
     */
  const abort = (message?: string) => {
    // Abort local controller if exists
    if (abortController.value) {
      abortController.value.abort(message);
      abortController.value = null;
    }
  };

  /**
     * Reset state
     */
  const reset = () => {
    abort();
    state.reset();
  };

  // Automatic cleanup on component unmount
  // Only register if we're inside a component scope (has active Vue instance)
  // Stores/services won't have active scope, so cleanup won't be registered
  if (hasActiveScope) {
    onUnmounted(() => {
      abort();
    });
  }

  // Immediate execution
  if (immediate) {
    execute();
  }

  return {
    ...state,
    execute,
    abort,
    reset,
  };
}

/**
 * Check if retry is needed
 */
function shouldRetry(error: ApiError, retry: boolean | number): boolean {
  if (typeof retry === "boolean") {
    return retry;
  }

  // Don't retry for client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  // Retry for server errors (5xx) and network errors
  return error.status >= 500 || error.status === 0;
}

/**
 * Retry logic with exponential backoff
 */
async function retryRequest<T, D>(
  requestFn: (config?: ApiRequestConfig<D>) => Promise<T | null>,
  maxRetries: number,
  delay: number,
  config?: ApiRequestConfig<D>,
  currentRetry = 0,
): Promise<T | null> {
  if (currentRetry >= maxRetries) {
    return null;
  }

  // Exponential backoff
  const backoffDelay = delay * Math.pow(2, currentRetry);

  await new Promise((resolve) => setTimeout(resolve, backoffDelay));

  try {
    return await requestFn(config);
  }
  catch {
    return retryRequest(requestFn, maxRetries, delay, config, currentRetry + 1);
  }
}

/**
 * Helper for GET requests
 *
 * @example
 * ```ts
 * const { data, loading, error } = useApiGet<User[]>('/users', {
 *   immediate: true
 * })
 * ```
 */
export function useApiGet<T = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T>, "method">,
): UseApiReturn<T> {
  return useApi<T>(url, { ...options, method: "GET" });
}

/**
 * Helper for POST requests
 *
 * @example
 * ```ts
 * const { data, loading, execute } = useApiPost<User, CreateUserDto>('/users')
 * await execute({ data: { name: 'John' } })
 * ```
 */
export function useApiPost<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "POST" });
}

/**
 * Helper for PUT requests
 *
 * @example
 * ```ts
 * const { execute } = useApiPut<User, UpdateUserDto>('/users/1')
 * await execute({ data: { name: 'John Doe' } })
 * ```
 */
export function useApiPut<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "PUT" });
}

/**
 * Helper for PATCH requests
 *
 * @example
 * ```ts
 * const { execute } = useApiPatch<User, Partial<User>>('/users/1')
 * await execute({ data: { name: 'John' } })
 * ```
 */
export function useApiPatch<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "PATCH" });
}

/**
 * Helper for DELETE requests
 *
 * @example
 * ```ts
 * const { execute } = useApiDelete('/users/1')
 * await execute()
 * ```
 */
export function useApiDelete<T = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T>, "method">,
): UseApiReturn<T> {
  return useApi<T>(url, { ...options, method: "DELETE" });
}
