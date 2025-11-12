import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import type { RouteMeta } from "./types";

import { useAuthStore } from "@/features/auth";

/**
 * Check if user is authenticated
 * Currently checks for accessToken in localStorage
 *
 * TODO: Replace with async API call for production:
 *
 * export async function isAuthenticated(): Promise<boolean> {
 *   const token = localStorage.getItem("accessToken");
 *   if (!token) return false;
 *
 *   try {
 *     // Validate token and fetch user data
 *     const authStore = useAuthStore();
 *
 *     // Check if we have recent user data (cache for 5 minutes)
 *     if (authStore.user && authStore.lastFetched > Date.now() - 5 * 60 * 1000) {
 *       return true;
 *     }
 *
 *     // Fetch fresh user data from API
 *     const response = await api.get("/auth/me");
 *     authStore.setUser(response.data);
 *     authStore.lastFetched = Date.now();
 *
 *     return true;
 *   } catch (error) {
 *     console.error("Token validation failed:", error);
 *     localStorage.removeItem("accessToken");
 *     authStore.clearUser();
 *     return false;
 *   }
 * }
 */
export function isAuthenticated(): boolean {
  const authStore = useAuthStore();
  return authStore.isAuthenticated;
}

/**
 * Check if user has required permissions
 *
 * TODO: Implement with Pinia auth store (can be async if needed):
 *
 * export async function hasPermissions(required: string[]): Promise<boolean> {
 *   const authStore = useAuthStore();
 *
 *   // Ensure user data is loaded
 *   if (!authStore.user) {
 *     await authStore.fetchUser(); // Calls getMe()
 *   }
 *
 *   // Check if user has ANY of the required permissions
 *   return required.some(p => authStore.permissions.includes(p));
 *
 *   // Or check if user has ALL permissions:
 *   // return required.every(p => authStore.permissions.includes(p));
 * }
 */
// eslint-disable-next-line no-unused-vars
export function hasPermissions(_required: string[]): boolean {
  // TODO: Implement actual permission check
  // Example: get from Pinia auth store
  // const authStore = useAuthStore();
  // return _required.every(p => authStore.permissions.includes(p));

  console.warn("Permission check not implemented, allowing access");
  return true;
}

/**
 * Authentication guard
 * Checks if route requires authentication and redirects to login if needed
 *
 * TODO: Make async for production with getMe() call:
 *
 * export async function authGuard(
 *   to: RouteLocationNormalized,
 *   from: RouteLocationNormalized,
 *   next: NavigationGuardNext,
 * ) {
 *   const meta = to.meta as RouteMeta;
 *   const requiresAuth = meta.requiresAuth !== false;
 *
 *   if (!requiresAuth) {
 *     next();
 *     return;
 *   }
 *
 *   // Async authentication check with getMe()
 *   const authenticated = await isAuthenticated();
 *
 *   if (!authenticated) {
 *     next({
 *       path: meta.authRedirect || "/login",
 *       query: { redirect: to.fullPath },
 *     });
 *     return;
 *   }
 *
 *   // Async permission check
 *   if (meta.permissions && meta.permissions.length > 0) {
 *     const hasPerms = await hasPermissions(meta.permissions);
 *     if (!hasPerms) {
 *       next({ path: "/403", query: { from: to.fullPath } });
 *       return;
 *     }
 *   }
 *
 *   next();
 * }
 */
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const meta = to.meta as RouteMeta;
  const authStore = useAuthStore();

  // Initialize auth store if not initialized yet
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  // Check if authentication is required (default: true)
  const requiresAuth = meta.requiresAuth !== false;

  // Allow public routes
  if (!requiresAuth) {
    next();
    return;
  }

  // Check authentication
  const authenticated = authStore.isAuthenticated;

  if (!authenticated) {
    // Not authenticated, redirect to log in
    const redirectPath = meta.authRedirect || "/login";

    console.warn(`Access denied to ${to.path}, redirecting to ${redirectPath}`);

    next({
      path: redirectPath,
      query: {
        // Save original destination for redirect after login
        redirect: to.fullPath,
      },
    });
    return;
  }

  // Check permissions if specified
  if (meta.permissions && meta.permissions.length > 0) {
    if (!hasPermissions(meta.permissions)) {
      console.error(`Permission denied for ${to.path}. Required: ${meta.permissions.join(", ")}`);

      next({
        path: "/403", // Forbidden page
        query: { from: to.fullPath },
      });
      return;
    }
  }

  // All checks passed
  next();
}

/**
 * Redirect authenticated users away from auth pages
 * E.g., prevent accessing login page when already logged in
 */
export function guestGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authenticated = isAuthenticated();

  if (authenticated) {
    // Already authenticated, redirect to home or intended page
    const redirectTo = (to.query.redirect as string) || "/";
    next(redirectTo);
  } else {
    next();
  }
}

