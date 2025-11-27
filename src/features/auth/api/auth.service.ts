import { typedApiClient } from "@/shared/api/client";
import type { ApiRequestConfig } from "@/shared/api/types";

/**
 * Auth types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Auth Service
 */
export const authService = {
  /**
   * Login
   */
  login(data: LoginRequest, config?: ApiRequestConfig): Promise<LoginResponse> {
    return typedApiClient
      .post<LoginResponse, LoginRequest>("/auth/login", data, {
        ...config,
        skipAuth: true,
      } as ApiRequestConfig<LoginRequest>)
      .then((res) => res.data);
  },

  /**
   * Register
   */
  register(
    data: RegisterRequest,
    config?: ApiRequestConfig,
  ): Promise<RegisterResponse> {
    return typedApiClient
      .post<RegisterResponse, RegisterRequest>("/auth/register", data, {
        ...config,
        skipAuth: true,
      } as ApiRequestConfig<RegisterRequest>)
      .then((res) => res.data);
  },

  /**
   * Logout
   */
  logout(config?: ApiRequestConfig): Promise<void> {
    return typedApiClient
      .post<void>("/auth/logout", undefined, config)
      .then((res) => res.data);
  },

  /**
   * Refresh token
   */
  refreshToken(
    data: RefreshTokenRequest,
    config?: ApiRequestConfig,
  ): Promise<RefreshTokenResponse> {
    return typedApiClient
      .post<RefreshTokenResponse, RefreshTokenRequest>("/auth/refresh", data, {
        ...config,
        skipAuth: true,
      } as ApiRequestConfig<RefreshTokenRequest>)
      .then((res) => res.data);
  },

  /**
   * Get current user (me)
   */
  getMe(config?: ApiRequestConfig): Promise<User> {
    return typedApiClient
      .get<User>("/auth/me", config)
      .then((res) => res.data);
  },

  /**
   * Validate token
   */
  validateToken(config?: ApiRequestConfig): Promise<{ valid: boolean }> {
    return typedApiClient
      .get<{ valid: boolean }>("/auth/validate", config)
      .then((res) => res.data);
  },

  /**
   * Request password reset
   */
  requestPasswordReset(
    data: PasswordResetRequest,
    config?: ApiRequestConfig,
  ): Promise<{ message: string }> {
    return typedApiClient
      .post<{ message: string }, PasswordResetRequest>(
        "/auth/password-reset/request",
        data,
        {
          ...config,
          skipAuth: true,
        } as ApiRequestConfig<PasswordResetRequest>,
      )
      .then((res) => res.data);
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset(
    data: PasswordResetConfirm,
    config?: ApiRequestConfig,
  ): Promise<{ message: string }> {
    return typedApiClient
      .post<{ message: string }, PasswordResetConfirm>(
        "/auth/password-reset/confirm",
        data,
        {
          ...config,
          skipAuth: true,
        } as ApiRequestConfig<PasswordResetConfirm>,
      )
      .then((res) => res.data);
  },

  /**
   * Change password
   */
  changePassword(
    data: ChangePasswordRequest,
    config?: ApiRequestConfig,
  ): Promise<{ message: string }> {
    return typedApiClient
      .post<{ message: string }, ChangePasswordRequest>(
        "/auth/change-password",
        data,
        config as ApiRequestConfig<ChangePasswordRequest>,
      )
      .then((res) => res.data);
  },
};

