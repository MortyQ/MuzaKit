/**
 * Centralized Permissions Configuration
 * Single Source of Truth for all permission-related constants
 *
 * Usage:
 * - Import `Permissions` enum for type-safe permission checks
 * - Import `PermissionValues` for runtime permission arrays
 * - Import `PermissionType` for TypeScript type annotations
 */

/**
 * All available permissions in the system
 * Use this enum in route definitions and permission checks
 */
export enum Permissions {
  // List permissions
  CREATE_LIST = "create:list",
  READ_LIST = "read:list",
  UPDATE_LIST = "update:list",
  DELETE_LIST = "delete:list",
  READ_ALL_LISTS = "read:all-lists",

  // Task permissions
  CREATE_TASK = "create:task",
  READ_TASK = "read:task",
  UPDATE_TASK = "update:task",
  DELETE_TASK = "delete:task",
  READ_ALL_TASKS = "read:all-tasks",

  // User permissions
  READ_USERS = "read:users",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",

  // Admin permissions
  MANAGE_ROLES = "manage:roles",
  MANAGE_PERMISSIONS = "manage:permissions",

  // Dashboard & Analytics
  READ_DASHBOARD = "read:dashboard",
  READ_ANALYTICS = "read:analytics",
}

/**
 * TypeScript type for permission values
 * Use for type annotations where string permission is expected
 */
export type PermissionType = `${Permissions}`;

/**
 * Array of all permission values for runtime checks
 */
export const PermissionValues = Object.values(Permissions) as PermissionType[];

/**
 * Permission groups for common use cases
 */
export const PermissionGroups = {
  /** All list-related permissions */
  LISTS: [
    Permissions.CREATE_LIST,
    Permissions.READ_LIST,
    Permissions.UPDATE_LIST,
    Permissions.DELETE_LIST,
    Permissions.READ_ALL_LISTS,
  ],

  /** All task-related permissions */
  TASKS: [
    Permissions.CREATE_TASK,
    Permissions.READ_TASK,
    Permissions.UPDATE_TASK,
    Permissions.DELETE_TASK,
    Permissions.READ_ALL_TASKS,
  ],

  /** All user management permissions */
  USERS: [
    Permissions.READ_USERS,
    Permissions.UPDATE_USER,
    Permissions.DELETE_USER,
  ],

  /** Admin-level permissions */
  ADMIN: [Permissions.MANAGE_ROLES, Permissions.MANAGE_PERMISSIONS],

  /** All read permissions */
  ALL_READ: PermissionValues.filter((p) => p.startsWith("read:")),

  /** All create permissions */
  ALL_CREATE: PermissionValues.filter((p) => p.startsWith("create:")),

  /** All update permissions */
  ALL_UPDATE: PermissionValues.filter((p) => p.startsWith("update:")),

  /** All delete permissions */
  ALL_DELETE: PermissionValues.filter((p) => p.startsWith("delete:")),

  /** All manage permissions */
  ALL_MANAGE: PermissionValues.filter((p) => p.startsWith("manage:")),
} as const;

/**
 * Map permission to route path for redirects
 */
export const PermissionToRoute: Record<Permissions, string> = {
  // List routes
  [Permissions.CREATE_LIST]: "/lists/create",
  [Permissions.READ_LIST]: "/lists",
  [Permissions.UPDATE_LIST]: "/lists",
  [Permissions.DELETE_LIST]: "/lists",
  [Permissions.READ_ALL_LISTS]: "/lists",

  // Task routes
  [Permissions.CREATE_TASK]: "/tasks/create",
  [Permissions.READ_TASK]: "/tasks",
  [Permissions.UPDATE_TASK]: "/tasks",
  [Permissions.DELETE_TASK]: "/tasks",
  [Permissions.READ_ALL_TASKS]: "/tasks",

  // User routes
  [Permissions.READ_USERS]: "/users",
  [Permissions.UPDATE_USER]: "/users",
  [Permissions.DELETE_USER]: "/users",

  // Admin routes
  [Permissions.MANAGE_ROLES]: "/admin/roles",
  [Permissions.MANAGE_PERMISSIONS]: "/admin/permissions",

  // Dashboard & Analytics
  [Permissions.READ_DASHBOARD]: "/dashboard",
  [Permissions.READ_ANALYTICS]: "/analytics",
};

/**
 * Get human-readable name for permission
 */
export function getPermissionDisplayName(permission: Permissions): string {
  const names: Record<Permissions, string> = {
    // List permissions
    [Permissions.CREATE_LIST]: "Create List",
    [Permissions.READ_LIST]: "Read List",
    [Permissions.UPDATE_LIST]: "Update List",
    [Permissions.DELETE_LIST]: "Delete List",
    [Permissions.READ_ALL_LISTS]: "Read All Lists",

    // Task permissions
    [Permissions.CREATE_TASK]: "Create Task",
    [Permissions.READ_TASK]: "Read Task",
    [Permissions.UPDATE_TASK]: "Update Task",
    [Permissions.DELETE_TASK]: "Delete Task",
    [Permissions.READ_ALL_TASKS]: "Read All Tasks",

    // User permissions
    [Permissions.READ_USERS]: "Read Users",
    [Permissions.UPDATE_USER]: "Update User",
    [Permissions.DELETE_USER]: "Delete User",

    // Admin permissions
    [Permissions.MANAGE_ROLES]: "Manage Roles",
    [Permissions.MANAGE_PERMISSIONS]: "Manage Permissions",

    // Dashboard & Analytics
    [Permissions.READ_DASHBOARD]: "Read Dashboard",
    [Permissions.READ_ANALYTICS]: "Read Analytics",
  };

  return names[permission] || permission;
}
