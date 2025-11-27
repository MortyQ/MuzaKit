/**
 * API State Composable
 *
 * Managing API request state
 * Base composable for creating reactive state
 */

import { ref, computed, type Ref, type ComputedRef } from "vue";

import { RequestStatus, type ApiState, type ApiError } from "../types";

export interface UseApiStateReturn<T = unknown> {
  /** Data */
  data: Ref<T | null>;
  /** Loading flag */
  loading: Ref<boolean>;
  /** Error */
  error: Ref<ApiError | null>;
  /** HTTP status code */
  statusCode: Ref<number | null>;
  /** Request status */
  status: Ref<RequestStatus>;
  /** Has data */
  hasData: ComputedRef<boolean>;
  /** Has error */
  hasError: ComputedRef<boolean>;
  /** Request is pending */
  isPending: ComputedRef<boolean>;
  /** Request is successful */
  isSuccess: ComputedRef<boolean>;
  /** Set data */
  setData: (newData: T | null) => void;
  /** Set error */
  setError: (newError: ApiError | null) => void;
  /** Set loading */
  setLoading: (isLoading: boolean) => void;
  /** Set status code */
  setStatusCode: (code: number | null) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Composable for API state management
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
 * Create initial API state
 */
export function createInitialApiState<T = unknown>(initialData: T | null = null): ApiState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
    statusCode: null,
  };
}

