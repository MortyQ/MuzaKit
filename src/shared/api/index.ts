/**
 * API Client
 *
 * Centralized API client with interceptors and typing
 * - Automatic authorization
 * - Token refresh
 * - Error handling
 * - Type safety
 */

// Main client
export { default as apiClient, typedApiClient, setupApiClient } from "./client";

// Legacy export for backward compatibility
export { axiosIns } from "./client";

// Token Manager
export {
  tokenManager,
  TOKEN_TYPE,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRES_KEY,
  type TokenStorage,
} from "./tokenManager";

// Interceptors
export {
  setupInterceptors,
  setupRequestInterceptor,
  setupResponseInterceptor,
  getRefreshStatus,
  AUTH_HEADER,
  REFRESH_TOKEN_URL,
} from "./interceptors";

// Error Handler
export {
  ErrorHandler,
  handleApiError,
  parseAxiosError,
  getDefaultErrorMessage,
  type ErrorHandlerOptions,
} from "./errorHandler";

// Types
export type {
  ApiResponse,
  ApiError,
  ApiRequestConfig,
  ApiState,
  UseApiOptions,
  UseApiReturn,
  AuthTokens,
  RefreshTokenResponse,
  RefreshTokenRequest,
  TypedAxiosError,
  TypedAxiosResponse,
  HttpMethod,
  RetryOptions,
} from "./types";

