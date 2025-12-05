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
    | "home:read"
    | "dashboard:read"
    | "about:read";

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

