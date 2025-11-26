/**
 * useApi Composable
 *
 * Универсальный composable для работы с API
 *
 * Возможности:
 * - Автоматическое управление состоянием (loading, error, data)
 * - Отмена запросов через AbortController
 * - Retry логика
 * - Debouncing
 * - Callbacks (onSuccess, onError, onBefore, onFinish)
 * - Типобезопасность
 *
 * @example
 * ```ts
 * const { data, loading, error, execute } = useApi<User[]>('/users', {
 *   immediate: true,
 *   onSuccess: (users) => console.log('Loaded', users.length, 'users')
 * })
 * ```
 */

import { useDebounceFn } from "@vueuse/core";
import { ref, onUnmounted, type Ref } from "vue";

import { useApiState } from "./useApiState";
import apiClient from "../api/client";
import { handleApiError } from "../api/errorHandler";
import type {
  UseApiOptions,
  UseApiReturn,
  ApiRequestConfig,
  ApiError,
} from "../api/types";

/**
 * Основной composable для API запросов
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
    ...axiosConfig
  } = options;

  // State
  const state = useApiState<T>(initialData as T | null);
  const abortController = ref<AbortController | null>(null);

  /**
   * Выполнение запроса
   */
  const executeRequest = async (config?: ApiRequestConfig<D>): Promise<T | null> => {
    // Отменяем предыдущий запрос если он есть
    if (abortController.value) {
      abortController.value.abort();
    }

    // Создаем новый AbortController
    abortController.value = new AbortController();

    // Before callback
    onBefore?.();

    // Устанавливаем состояние загрузки
    state.setLoading(true);
    state.setError(null);

    try {
      const requestUrl = typeof url === "string" ? url : url.value;
      const mergedConfig: ApiRequestConfig<D> = {
        ...axiosConfig,
        ...config,
        signal: abortController.value.signal,
      };

      // Выполняем запрос
      const response = await apiClient.request<T>({
        url: requestUrl,
        method,
        ...mergedConfig,
      });

      // Устанавливаем данные
      state.setData(response.data);
      state.setStatusCode(response.status);

      // Success callback
      onSuccess?.(response.data);

      return response.data;
    } catch (err: unknown) {
      // Игнорируем отмененные запросы
      if ((err as { name?: string })?.name === "AbortError" || (err as { name?: string })?.name === "CanceledError") {
        return null;
      }

      // Обрабатываем ошибку
      const apiError = handleApiError(err, {
        showToast: !skipErrorNotification,
      });

      state.setError(apiError);
      state.setStatusCode(apiError.status);

      // Error callback
      onError?.(apiError);

      // Retry логика
      if (retry && shouldRetry(apiError, retry)) {
        const retryCount = typeof retry === "number" ? retry : 3;
        return retryRequest(executeRequest, retryCount, retryDelay, config);
      }

      return null;
    } finally {
      state.setLoading(false);
      onFinish?.();
    }
  };

  /**
   * Execute с debouncing если указан
   */
  const execute = debounce > 0
    ? useDebounceFn(executeRequest, debounce)
    : executeRequest;

  /**
   * Отмена запроса
   */
  const abort = (message?: string) => {
    if (abortController.value) {
      abortController.value.abort(message);
      abortController.value = null;
    }
  };

  /**
   * Сброс состояния
   */
  const reset = () => {
    abort();
    state.reset();
  };

  // Автоматическая отмена при unmount
  onUnmounted(() => {
    abort();
  });

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
 * Проверка, нужен ли retry
 */
function shouldRetry(error: ApiError, retry: boolean | number): boolean {
  if (typeof retry === "boolean") {
    return retry;
  }

  // Не делаем retry для клиентских ошибок (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  // Retry для серверных ошибок (5xx) и network ошибок
  return error.status >= 500 || error.status === 0;
}

/**
 * Retry логика с exponential backoff
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
  } catch {
    return retryRequest(requestFn, maxRetries, delay, config, currentRetry + 1);
  }
}

/**
 * Хелпер для GET запросов
 */
export function useGet<T = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T>, "method">,
): UseApiReturn<T> {
  return useApi<T>(url, { ...options, method: "GET" });
}

/**
 * Хелпер для POST запросов
 */
export function usePost<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "POST" });
}

/**
 * Хелпер для PUT запросов
 */
export function usePut<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "PUT" });
}

/**
 * Хелпер для PATCH запросов
 */
export function usePatch<T = unknown, D = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T, D>, "method">,
): UseApiReturn<T, D> {
  return useApi<T, D>(url, { ...options, method: "PATCH" });
}

/**
 * Хелпер для DELETE запросов
 */
export function useDelete<T = unknown>(
  url: string | Ref<string>,
  options?: Omit<UseApiOptions<T>, "method">,
): UseApiReturn<T> {
  return useApi<T>(url, { ...options, method: "DELETE" });
}

