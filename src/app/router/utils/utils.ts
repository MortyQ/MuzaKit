import type { RouteRecordRaw } from "vue-router";

import type { MenuItem, RouteMeta } from "../types/types";

import { useAuthStore } from "@/features/auth/store/authStore";
import { UserRole, type UserPermission } from "@/features/auth/types";
// Get the type of auth store instance and export for reuse
export type AuthStore = ReturnType<typeof useAuthStore>;

/**
 * Check if user has required permissions for a route
 * NOTE: This function requires authStore to be passed as parameter
 * @param permissions - Required permissions array
 * @param authStore - Auth store instance
 * @param isMenuParent - If true, requires ANY permission (OR logic), otherwise requires ALL (AND logic)
 * @returns true if user has permissions or no permissions required
 */
export function hasRoutePermissions(
  permissions: string[] | undefined,
  authStore: AuthStore,
  isMenuParent = false,
): boolean {
  // If no permissions required, allow access
  if (!permissions || permissions.length === 0) {
    return true;
  }

  // If user not authenticated, deny access
  if (!authStore.isAuthenticated) {
    return false;
  }

  // Admins always have access to all routes
  if (authStore.user?.role === UserRole.ADMIN) {
    return true;
  }

  // For menu parents: user needs ANY of the permissions (OR logic)
  // For regular routes: user needs ALL permissions (AND logic)
  if (isMenuParent) {
    return permissions.some((permission) =>
      authStore.hasPermission(permission as UserPermission),
    );
  }
  else {
    return permissions.every((permission) =>
      authStore.hasPermission(permission as UserPermission),
    );
  }
}

/**
 * Filter routes based on user permissions
 * Recursively filters children as well
 * NOTE: This function requires authStore to be passed as parameter
 * @param routes - Array of route records
 * @param authStore - Auth store instance
 * @returns Filtered routes that user has permission to access
 */
export function filterRoutesByPermissions(
  routes: RouteRecordRaw[] | Array<RouteRecordRaw & { meta?: RouteMeta }>,
  authStore: AuthStore,
): Array<RouteRecordRaw & { meta?: RouteMeta }> {
  return routes
    .filter((route) => {
      const meta = route.meta as RouteMeta | undefined;
      // Pass isMenuParent flag to use OR logic for parent menu items
      return hasRoutePermissions(meta?.permissions, authStore, meta?.isMenuParent);
    })
    .map((route) => {
      // If route has children, filter them recursively
      if (route.children && route.children.length > 0) {
        const filteredChildren = filterRoutesByPermissions(route.children, authStore);

        return {
          ...route,
          children: filteredChildren,
        };
      }
      return route;
    });
}

/**
 * Convert routes to menu items
 * @param routes - Array of route records
 * @param parentPath - Parent path for nested routes
 */
export function routesToMenuItems(
  routes: RouteRecordRaw[] | Array<RouteRecordRaw & { meta?: RouteMeta }>,
  parentPath = "",
): MenuItem[] {
  const menuItems: MenuItem[] = [];

  for (const route of routes) {
    const meta = route.meta as RouteMeta | undefined;

    // Skip routes that shouldn't be shown in menu
    if (meta?.showInMenu === false) {
      continue;
    }

    // Build full path
    const fullPath = route.path.startsWith("/")
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

    // Create menu item
    const menuItem: MenuItem = {
      id: route.name?.toString() || fullPath,
      label: meta?.menuTitle || meta?.title || route.name?.toString() || "Untitled",
      icon: meta?.menuIcon,
      badge: meta?.menuBadge,
      order: meta?.menuOrder ?? 999,
      disabled: false,
    };

    // Add route link only if not a parent menu item
    if (!meta?.isMenuParent && route.name) {
      menuItem.to = { name: route.name.toString() };
    }

    // Process children recursively
    if (route.children && route.children.length > 0) {
      const childMenuItems = routesToMenuItems(route.children, fullPath);
      if (childMenuItems.length > 0) {
        menuItem.children = childMenuItems;
      }
    }

    menuItems.push(menuItem);
  }

  // Sort by order
  return menuItems.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/**
 * Filter routes that should be shown in menu
 */
export function getMenuRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    const meta = route.meta as RouteMeta | undefined;
    return meta?.showInMenu !== false;
  });
}

/**
 * Generate menu config from routes for sidebar
 */
export function generateSidebarConfig(routes: RouteRecordRaw[]) {
  const menuItems = routesToMenuItems(routes);

  return {
    items: menuItems.filter((item) => !item.children || item.children.length === 0),
    groups: menuItems.filter((item) => item.children && item.children.length > 0),
  };
}
