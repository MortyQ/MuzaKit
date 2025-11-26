/**
 * API State Composable
 *
 * Управление состоянием API запросов
 * Базовый composable для создания реактивного состояния
 */

import { ref, computed, type Ref, type ComputedRef } from "vue";

import { RequestStatus, type ApiState, type ApiError } from "../api/types";

export interface UseApiStateReturn<T = unknown> {
  /** Данные */
  data: Ref<T | null>;
  /** Флаг загрузки */
  loading: Ref<boolean>;
  /** Ошибка */
  error: Ref<ApiError | null>;
  /** HTTP статус код */
  statusCode: Ref<number | null>;
  /** Статус запроса */
  status: Ref<RequestStatus>;
  /** Есть ли данные */
  hasData: ComputedRef<boolean>;
  /** Есть ли ошибка */
  hasError: ComputedRef<boolean>;
  /** Запрос в процессе */
  isPending: ComputedRef<boolean>;
  /** Запрос успешен */
  isSuccess: ComputedRef<boolean>;
  /** Установить данные */
  setData: (newData: T | null) => void;
  /** Установить ошибку */
  setError: (newError: ApiError | null) => void;
  /** Установить загрузку */
  setLoading: (isLoading: boolean) => void;
  /** Установить статус код */
  setStatusCode: (code: number | null) => void;
  /** Сбросить состояние */
  reset: () => void;
}

/**
 * Composable для управления состоянием API
 */
export function useApiState<T = unknown>(initialData: T | null = null): UseApiStateReturn<T> {
  // State
  const data = ref<T | null>(initialData) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  const statusCode = ref<number | null>(null);
  const status = ref<RequestStatus>(RequestStatus.IDLE);

  // Computed
  const hasData = computed(() => data.value !== null);
  const hasError = computed(() => error.value !== null);
  const isPending = computed(() => status.value === RequestStatus.PENDING);
  const isSuccess = computed(() => status.value === RequestStatus.SUCCESS);

  // Methods
  const setData = (newData: T | null) => {
    data.value = newData;
    error.value = null;
    status.value = RequestStatus.SUCCESS;
  };

  const setError = (newError: ApiError | null) => {
    error.value = newError;
    status.value = newError ? RequestStatus.ERROR : RequestStatus.IDLE;
  };

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
    if (isLoading) {
      status.value = RequestStatus.PENDING;
    }
  };

  const setStatusCode = (code: number | null) => {
    statusCode.value = code;
  };

  const reset = () => {
    data.value = initialData;
    loading.value = false;
    error.value = null;
    statusCode.value = null;
    status.value = RequestStatus.IDLE;
  };

  return {
    data,
    loading,
    error,
    statusCode,
    status,
    hasData,
    hasError,
    isPending,
    isSuccess,
    setData,
    setError,
    setLoading,
    setStatusCode,
    reset,
  };
}

/**
 * Создать начальное состояние API
 */
export function createInitialApiState<T = unknown>(initialData: T | null = null): ApiState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
    statusCode: null,
  };
}

