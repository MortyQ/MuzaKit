import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteRecordNormalized,
  Router,
} from "vue-router";

import type { RouteMeta } from "../types/types";

import { useAuthStore } from "@/features/auth";
import { UserRole, type UserPermission } from "@/features/auth/types";
import { tokenManager } from "@/shared/api";

// ============================================================================
// Router Instance Management
// ============================================================================

let routerInstance: Router | null = null;

/**
 * Set router instance for guards that need access to all routes
 * Must be called after router creation
 */
export function setRouterForGuards(router: Router): void {
  routerInstance = router;
}

// ============================================================================
// Permission Checking (Single Source of Truth)
// ============================================================================

/**
 * Check if current user has required permissions
 * @param required - Array of permission strings (all must match)
 * @param authStore - Optional auth store instance (uses singleton if not provided)
 * @returns true if user has all required permissions or is admin
 */
export function hasPermissions(
  required: readonly string[] | string[] | undefined,
  authStore?: ReturnType<typeof useAuthStore>,
): boolean {
  const store = authStore ?? useAuthStore();

  // No permissions required - allow access
  if (!required || required.length === 0) {
    return true;
  }

  // Not authenticated - deny access
  if (!store.isAuthenticated || !store.user) {
    return false;
  }

  // Admins bypass all permission checks
  if (store.user.role === UserRole.ADMIN) {
    return true;
  }

  // Check if user has ALL required permissions
  return required.every((permission) =>
    store.hasPermission(permission as UserPermission),
  );
}

/**
 * Check if user has ANY of the required permissions (OR logic)
 * Used for parent menu items that should show if user has access to any child
 */
export function hasAnyPermission(
  required: readonly string[] | string[] | undefined,
  authStore?: ReturnType<typeof useAuthStore>,
): boolean {
  const store = authStore ?? useAuthStore();

  if (!required || required.length === 0) {
    return true;
  }

  if (!store.isAuthenticated || !store.user) {
    return false;
  }

  if (store.user.role === UserRole.ADMIN) {
    return true;
  }

  return required.some((permission) =>
    store.hasPermission(permission as UserPermission),
  );
}

// ============================================================================
// Route Finding Utilities
// ============================================================================

/**
 * Error/system routes that should never be auto-selected
 */
const EXCLUDED_ROUTES = new Set([
  "403",
  "404",
  "Forbidden",
  "NotFound",
  "Root",
]);
const EXCLUDED_PATHS = new Set([
  "/",
  "/403",
  "/404",
  "/login",
  "/password-forgot",
  "/reset-password",
]);

/**
 * Smart route finder with priority-based selection.
 * Finds the first accessible route for the current user.
 *
 * Priority order:
 * 1. Routes with explicit showInMenu: true
 * 2. Lower menuOrder values (1 < 2 < 3...)
 * 3. Shorter paths (top-level routes preferred)
 */
function findFirstAccessibleRoute(routes: RouteRecordNormalized[]): RouteLocationRaw | null {
  const candidates: Array<{ route: RouteRecordNormalized, meta: RouteMeta }> = [];

  for (const route of routes) {
    const meta = route.meta as RouteMeta;
    const routeName = String(route.name ?? "");

    // Skip: public routes, unnamed, hidden, system routes, redirects, wildcards
    if (
      meta.requiresAuth === false
      || !route.name
      || meta.showInMenu === false
      || route.redirect
      || route.path.includes("*")
      || EXCLUDED_ROUTES.has(routeName)
      || EXCLUDED_PATHS.has(route.path)
    ) {
      continue;
    }

    // Check user access
    if (hasPermissions(meta.permissions)) {
      candidates.push({ route, meta });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Sort by priority
  candidates.sort((a, b) => {
    // 1. Explicit menu items first
    const aInMenu = a.meta.showInMenu === true;
    const bInMenu = b.meta.showInMenu === true;
    if (aInMenu !== bInMenu) return aInMenu ? -1 : 1;

    // 2. By menuOrder (lower = higher priority)
    const aOrder = a.meta.menuOrder ?? 999;
    const bOrder = b.meta.menuOrder ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;

    // 3. By path depth (shorter = higher priority)
    const aDepth = a.route.path.split("/").filter(Boolean).length;
    const bDepth = b.route.path.split("/").filter(Boolean).length;
    return aDepth - bDepth;
  });

  return { name: candidates[0].route.name as string };
}

// ============================================================================
// URL Validation (Security)
// ============================================================================

/**
 * Validate redirect URL to prevent open redirect vulnerabilities
 * Only allows relative paths starting with /
 */
function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  // Must start with / (relative path) and not be protocol-relative
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  // Prevent javascript: URLs encoded in path
  return !url.toLowerCase().includes("javascript:");
}

/**
 * Sanitize redirect URL, returns "/" if invalid
 */
function sanitizeRedirectUrl(url: unknown): string {
  const urlString = String(url ?? "/");
  return isValidRedirectUrl(urlString) ? urlString : "/";
}

// ============================================================================
// Auth Initialization Helper
// ============================================================================

/**
 * Initialize auth store if needed (has token but not initialized)
 * @returns true if initialization was successful or already initialized
 */
async function ensureAuthInitialized(authStore: ReturnType<typeof useAuthStore>): Promise<boolean> {
  if (authStore.isInitialized) {
    return true;
  }

  const token = tokenManager.getAccessToken();
  if (!token) {
    return false;
  }

  try {
    await authStore.initialize();
    return true;
  }
  catch (error) {
    console.error("[Auth Guard] Initialization failed:", error);
    // Clear invalid token
    tokenManager.clearTokens();
    return false;
  }
}

// ============================================================================
// Navigation Guards
// ============================================================================

/**
 * Main authentication guard
 * Handles: auth check, permission check, root redirect, error pages
 */
export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const meta = to.meta as RouteMeta;
  const authStore = useAuthStore();
  const requiresAuth = meta.requiresAuth !== false;

  // Public routes - allow immediately
  if (!requiresAuth) {
    return next();
  }

  // Ensure auth is initialized
  await ensureAuthInitialized(authStore);

  // Not authenticated - redirect to login
  if (!authStore.isAuthenticated) {
    const loginPath = meta.authRedirect || "/login";

    // Avoid infinite redirect loop
    if (to.path === loginPath) {
      return next();
    }

    return next({
      path: loginPath,
      query: { redirect: to.fullPath },
      replace: true,
    });
  }

  // Handle root redirect (find first accessible route)
  if (meta.isRootRedirect && routerInstance) {
    const firstAccessible = findFirstAccessibleRoute(routerInstance.getRoutes());

    if (firstAccessible) {
      return next(Object.assign({}, firstAccessible, { replace: true }));
    }

    // No accessible routes - show 403
    return next({ path: "/403", replace: true });
  }

  // Check permissions for protected routes
  if (!hasPermissions(meta.permissions)) {
    return next({
      path: "/403",
      query: { from: to.fullPath },
      replace: true,
    });
  }

  // All checks passed
  return next();
}

/**
 * Guest-only guard (for login/register pages)
 * Redirects authenticated users away from guest-only pages
 */
export async function guestGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const authStore = useAuthStore();

  // Try to initialize auth
  await ensureAuthInitialized(authStore);

  // Authenticated users should not access guest pages
  if (authStore.isAuthenticated) {
    const rawRedirect = to.query.redirect;
    const redirectTo = sanitizeRedirectUrl(rawRedirect);
    return next({ path: redirectTo, replace: true });
  }

  return next();
}
