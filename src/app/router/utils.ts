import type { RouteRecordRaw } from "vue-router";

import type { MenuItem, RouteMeta } from "./types";

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

