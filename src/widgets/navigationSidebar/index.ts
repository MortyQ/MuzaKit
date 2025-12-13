export { default as Sidebar } from "./Sidebar.vue";
export { useSidebar } from "./composables/useSidebar";
export type { SidebarNavItem, SidebarConfig, SidebarState } from "./types";
import type { RouteRecordRaw } from "vue-router";

import type { SidebarNavItem } from "./types";

/**
 * Route meta for sidebar configuration
 */
export interface SidebarRouteMeta {
  /** Display label in sidebar */
  label?: string;
  /** Icon name */
  icon?: string;
  /** Hide from sidebar */
  hideInSidebar?: boolean;
  /** Order in sidebar (lower = higher) */
  order?: number;
  /** Badge text or count */
  badge?: string | number;
  /** Parent item (for grouping) */
  parent?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Generate sidebar navigation items from Vue Router routes
 * Supports infinite nesting through route hierarchy
 */
export function generateSidebarFromRoutes(
  routes: RouteRecordRaw[],
): SidebarNavItem[] {
  const processRoute = (route: RouteRecordRaw): SidebarNavItem | null => {
    const meta = route.meta as SidebarRouteMeta | undefined;

    // Skip routes hidden in sidebar or without name
    if (meta?.hideInSidebar || !route.name) {
      return null;
    }

    const item: SidebarNavItem = {
      id: String(route.name),
      label: meta?.label || String(route.name),
      icon: meta?.icon || "mdi:home",
      to: route.path ? { name: String(route.name) } : undefined,
      disabled: meta?.disabled,
      badge: meta?.badge,
      meta: route.meta,
    };

    // Process children recursively
    if (route.children && route.children.length > 0) {
      const children = route.children
        .map(processRoute)
        .filter((child): child is SidebarNavItem => child !== null);

      if (children.length > 0) {
        item.children = children;
      }
    }

    return item;
  };

  return routes
    .map(processRoute)
    .filter((item): item is SidebarNavItem => item !== null)
    .sort((a, b) => {
      const orderA = (a.meta as SidebarRouteMeta)?.order ?? 999;
      const orderB = (b.meta as SidebarRouteMeta)?.order ?? 999;
      return orderA - orderB;
    });
}

/**
 * Create a manual sidebar navigation item
 * Useful for items that don't correspond to routes
 */
export function createSidebarItem(
  id: string,
  label: string,
  icon: string,
  options?: {
    to?: string | { name: string; params?: Record<string, never> };
    children?: SidebarNavItem[];
    disabled?: boolean;
    badge?: string | number;
    external?: boolean;
    hidden?: boolean;
    meta?: Record<string, never>;
  },
): SidebarNavItem {
  return {
    id,
    label,
    icon,
    to: options?.to,
    children: options?.children,
    disabled: options?.disabled,
    badge: options?.badge,
    external: options?.external,
    hidden: options?.hidden,
    meta: options?.meta,
  };
}

