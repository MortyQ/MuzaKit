/**
 * API Types
 *
 * Централизованные типы для работы с API
 */

import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import type { Ref, ComputedRef } from "vue";

/**
 * Базовый ответ API с типизацией данных
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Ошибка API с деталями
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
  details?: unknown;
}

/**
 * Конфигурация для API запросов с расширенными опциями
 */
export interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /** Скрыть toast уведомления об ошибках */
  skipErrorNotification?: boolean;
  /** Скрыть toast уведомления об успехе */
  skipSuccessNotification?: boolean;
  /** Кастомное сообщение об успехе */
  successMessage?: string;
  /** Не добавлять токен авторизации */
  skipAuth?: boolean;
  /** Использовать retry логику */
  retry?: boolean | number;
  /** Задержка между retry попытками */
  retryDelay?: number;
}

/**
 * Состояние API запроса
 */
export interface ApiState<T = unknown> {
  /** Данные ответа */
  data: T | null;
  /** Флаг загрузки */
  loading: boolean;
  /** Ошибка */
  error: ApiError | null;
  /** HTTP статус код */
  statusCode: number | null;
}

/**
 * Опции для composable useApi
 */
export interface UseApiOptions<T = unknown, D = unknown> extends ApiRequestConfig<D> {
  /** Выполнить запрос сразу при создании */
  immediate?: boolean;
  /** Callback при успешном запросе */
  onSuccess?: (data: T) => void;
  /** Callback при ошибке */
  onError?: (error: ApiError) => void;
  /** Callback перед запросом */
  onBefore?: () => void;
  /** Callback после завершения (успех или ошибка) */
  onFinish?: () => void;
  /** Начальные данные */
  initialData?: T;
  /** Задержка перед запросом (debounce) */
  debounce?: number;
  /** Таймаут для запроса */
  timeout?: number;
}

/**
 * Результат composable useApi
 */
export interface UseApiReturn<T = unknown, D = unknown> {
  /** Реактивные данные */
  data: Ref<T | null>;
  /** Флаг загрузки */
  loading: Ref<boolean>;
  /** Ошибка */
  error: Ref<ApiError | null>;
  /** HTTP статус код */
  statusCode: Ref<number | null>;
  /** Выполнить запрос */
  execute: (config?: ApiRequestConfig<D>) => Promise<T | null>;
  /** Отменить запрос */
  abort: (message?: string) => void;
  /** Сбросить состояние */
  reset: () => void;
  /** Есть ли данные */
  hasData: ComputedRef<boolean>;
  /** Есть ли ошибка */
  hasError: ComputedRef<boolean>;
}

/**
 * Токены авторизации
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * Ответ при обновлении токена
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Запрос для обновления токена
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Generic типизированная ошибка Axios
 */
export type TypedAxiosError<T = unknown> = AxiosError<{
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
  data?: T;
}>;

/**
 * Generic типизированный ответ Axios
 */
export type TypedAxiosResponse<T = unknown> = AxiosResponse<T>;

/**
 * HTTP методы
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Статусы запроса
 */
export enum RequestStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

/**
 * Опции для retry логики
 */
export interface RetryOptions {
  /** Количество попыток */
  maxRetries?: number;
  /** Задержка между попытками (ms) */
  retryDelay?: number;
  /** Использовать exponential backoff */
  exponentialBackoff?: boolean;
  /** Функция для проверки, нужен ли retry */
  shouldRetry?: (error: AxiosError) => boolean;
}

