/**
 * Error Handler
 *
 * Централизованная обработка ошибок API
 * - Парсинг ошибок
 * - Toast уведомления
 * - Логирование
 */

import type { AxiosError } from "axios";
import { toast } from "vue-sonner";

import type { ApiError, TypedAxiosError } from "./types";

/**
 * Опции обработки ошибок
 */
export interface ErrorHandlerOptions {
  /** Показать toast уведомление */
  showToast?: boolean;
  /** Кастомное сообщение */
  customMessage?: string;
  /** Логировать в консоль */
  logToConsole?: boolean;
}

/**
 * Парсинг ошибки Axios в ApiError
 */
export function parseAxiosError(error: AxiosError | TypedAxiosError): ApiError {
  // Если нет ответа (network error, timeout, etc.)
  if (!error.response) {
    return {
      message: error.message || "Network error",
      status: 0,
      code: error.code,
    };
  }

  const { data, status } = error.response;

  // Попытка извлечь сообщение из разных форматов ответа
  const message =
    (data as Record<string, unknown>)?.message as string ||
    (data as Record<string, unknown>)?.error as string ||
    error.message ||
    getDefaultErrorMessage(status);

  return {
    message,
    status,
    code: (data as Record<string, unknown>)?.code as string | undefined,
    errors: (data as Record<string, unknown>)?.errors as Record<string, string[]> | undefined,
    details: data,
  };
}

/**
 * Получить дефолтное сообщение по HTTP коду
 */
export function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
    422: "Validation error",
    429: "Too many requests",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
  };

  return messages[status] || "Something went wrong";
}

/**
 * Обработчик ошибок
 */
export class ErrorHandler {
  /**
   * Обработать ошибку
   */
  static handle(
    error: AxiosError | TypedAxiosError,
    options: ErrorHandlerOptions = {},
  ): ApiError {
    const {
      showToast = true,
      customMessage,
      logToConsole = import.meta.env.DEV,
    } = options;

    const apiError = parseAxiosError(error);

    // Логирование в development режиме
    if (logToConsole) {
      console.error("[API Error]", {
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        errors: apiError.errors,
        details: apiError.details,
        originalError: error,
      });
    }

    // Показать toast уведомление
    if (showToast) {
      const message = customMessage || apiError.message;

      // Для validation ошибок показываем первую ошибку
      if (apiError.errors && Object.keys(apiError.errors).length > 0) {
        const firstError = Object.values(apiError.errors)[0][0];
        toast.error(firstError || message);
      } else {
        toast.error(message);
      }
    }

    return apiError;
  }

  /**
   * Обработать validation ошибки
   */
  static handleValidationErrors(errors: Record<string, string[]>): string[] {
    const messages: string[] = [];

    Object.entries(errors).forEach(([field, fieldErrors]) => {
      fieldErrors.forEach((error) => {
        messages.push(`${field}: ${error}`);
      });
    });

    return messages;
  }

  /**
   * Проверить, является ли ошибка ошибкой авторизации
   */
  static isAuthError(error: ApiError): boolean {
    return error.status === 401;
  }

  /**
   * Проверить, является ли ошибка validation ошибкой
   */
  static isValidationError(error: ApiError): boolean {
    return error.status === 422 && !!error.errors;
  }

  /**
   * Проверить, является ли ошибка network ошибкой
   */
  static isNetworkError(error: ApiError): boolean {
    return error.status === 0;
  }

  /**
   * Создать ApiError из произвольной ошибки
   */
  static fromError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: 0,
      };
    }

    return {
      message: String(error),
      status: 0,
    };
  }
}

/**
 * Хелпер для обработки ошибок в try-catch блоках
 */
export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiError {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    return ErrorHandler.handle(error as AxiosError, options);
  }

  return ErrorHandler.fromError(error);
}

