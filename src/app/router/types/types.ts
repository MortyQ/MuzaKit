import type { RouteRecordRaw } from "vue-router";

/**
 * Extended route meta information
 */
export interface RouteMeta {
  /** Page title (for browser tab) */
  title?: string

  /** Show this route in sidebar menu */
  showInMenu?: boolean

  /** Menu item title (if different from page title) */
  menuTitle?: string

  /** Icon name for menu item */
  menuIcon?: string

  /** Order in menu (lower = higher priority) */
  menuOrder?: number

  /** Badge text (e.g., "New", "Beta", number) */
  menuBadge?: string

  /** If true, this is a parent menu item without its own route */
  isMenuParent?: boolean

  /** Require authentication (default: true, set false for public pages) */
  requiresAuth?: boolean

  /** Required permissions (only checked if authenticated) */
  permissions?: readonly string[] | string[]

  /** Redirect path if not authenticated */
  authRedirect?: string

  /** Page layout override */
  layout?: "default" | "auth" | "empty" | "master"

  /** Hide from breadcrumbs */
  hideFromBreadcrumbs?: boolean

  /** Special flag for root route to always trigger redirect to first accessible route */
  isRootRedirect?: boolean

  filters?: {
    /** Filters to hide on this page */
    hide?: string[]
    /** Filters to show on this page */
    show?: string[]
  }
}

/**
 * Extended route record with typed meta
 */
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, "meta" | "children"> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

/**
 * Menu item generated from route
 */
export interface MenuItem {
  id: string
  label: string
  icon?: string
  badge?: string
  to?: string | { name: string }
  children?: MenuItem[]
  order?: number
  disabled?: boolean
}
