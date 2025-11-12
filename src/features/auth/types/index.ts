/**
 * User role values
 */
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
  GUEST: "guest",
} as const;

/**
 * User role type
 */
export type UserRoleType = typeof UserRole[keyof typeof UserRole];

/**
 * User permissions type
 */
export type UserPermission =
  | "users:read"
  | "users:write"
  | "users:delete"
  | "posts:read"
  | "posts:write"
  | "posts:delete"
  | "settings:read"
  | "settings:write";

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  role: UserRoleType;
  permissions: UserPermission[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

