/**
 * Error Handler
 *
 * Centralized API error handling
 * - Error parsing
 * - Toast notifications
 * - Logging
 */

import type { AxiosError } from "axios";

import type { ApiError, TypedAxiosError } from "./types";

import { useToast } from "@/shared/composables/useToast";

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  /** Show toast notification */
  showToast?: boolean;
  /** Custom message */
  customMessage?: string;
  /** Log to console */
  logToConsole?: boolean;
}

/**
 * Parse Axios error to ApiError
 */
export function parseAxiosError(error: AxiosError | TypedAxiosError): ApiError {
  // If no response (network error, timeout, etc.)
  if (!error.response) {
    return {
      message: error.message || "Network error",
      status: 0,
      code: error.code,
    };
  }

  const { data, status } = error.response;

  // Try to extract message from different response formats
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
 * Get default error message by HTTP status code
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
 * Error handler
 */
export class ErrorHandler {
  /**
   * Handle error
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

    // Logging in development mode
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

    // Show toast notification
    if (showToast) {
      const toast = useToast();
      const message = customMessage || apiError.message;

      // For validation errors, show the first error
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
   * Handle validation errors
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
   * Check if error is an authorization error
   */
  static isAuthError(error: ApiError): boolean {
    return error.status === 401;
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: ApiError): boolean {
    return error.status === 422 && !!error.errors;
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: ApiError): boolean {
    return error.status === 0;
  }

  /**
   * Create ApiError from any error
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
 * Helper for handling errors in try-catch blocks
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

