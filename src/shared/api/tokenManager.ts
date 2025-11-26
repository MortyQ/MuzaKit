/**
 * Token Manager
 *
 * Централизованное управление токенами авторизации
 * Решает проблемы:
 * - Жесткой связи с localStorage
 * - Позволяет легко мокать в тестах
 * - Единая точка доступа к токенам
 */

import type { AuthTokens } from "./types";

export const TOKEN_TYPE = "Bearer";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const TOKEN_EXPIRES_KEY = "tokenExpiresAt";

interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(tokens: AuthTokens): void;
  clearTokens(): void;
  getTokenExpiresAt(): number | null;
  isTokenExpired(): boolean;
}

/**
 * LocalStorage реализация хранилища токенов
 */
class LocalStorageTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

    if (tokens.expiresIn) {
      const expiresAt = Date.now() + tokens.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
    }
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
  }

  getTokenExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) return false;

    // Добавляем 5 секунд буфера для предотвращения race conditions
    return Date.now() >= expiresAt - 5000;
  }
}

/**
 * Token Manager класс
 * Singleton для управления токенами
 */
class TokenManager {
  private storage: TokenStorage;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(storage: TokenStorage = new LocalStorageTokenStorage()) {
    this.storage = storage;
  }

  /**
   * Получить access token
   */
  getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }

  /**
   * Получить refresh token
   */
  getRefreshToken(): string | null {
    return this.storage.getRefreshToken();
  }

  /**
   * Сохранить токены
   */
  setTokens(tokens: AuthTokens): void {
    this.storage.setTokens(tokens);
  }

  /**
   * Очистить токены
   */
  clearTokens(): void {
    this.storage.clearTokens();
    this.refreshPromise = null;
  }

  /**
   * Проверить, истек ли токен
   */
  isTokenExpired(): boolean {
    return this.storage.isTokenExpired();
  }

  /**
   * Получить время истечения токена
   */
  getTokenExpiresAt(): number | null {
    return this.storage.getTokenExpiresAt();
  }

  /**
   * Проверить наличие токенов
   */
  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  /**
   * Получить Authorization header
   */
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `${TOKEN_TYPE} ${token}` : null;
  }

  /**
   * Установить promise обновления токена (для предотвращения race conditions)
   */
  setRefreshPromise(promise: Promise<string | null>): void {
    this.refreshPromise = promise;
  }

  /**
   * Получить promise обновления токена
   */
  getRefreshPromise(): Promise<string | null> | null {
    return this.refreshPromise;
  }

  /**
   * Очистить promise обновления токена
   */
  clearRefreshPromise(): void {
    this.refreshPromise = null;
  }

  /**
   * Изменить хранилище (полезно для тестов)
   */
  setStorage(storage: TokenStorage): void {
    this.storage = storage;
  }
}

// Экспортируем singleton instance
export const tokenManager = new TokenManager();

// Экспортируем класс для тестов
export { TokenManager, LocalStorageTokenStorage };

// Экспортируем тип для мокирования
export type { TokenStorage };

