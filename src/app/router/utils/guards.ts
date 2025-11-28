import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import type { RouteMeta } from "../types/types";

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
 * BEST PRACTICES:
 * ✅ Guards should be synchronous and only check state
 * ✅ Initialization happens in App.vue onMounted (once on startup)
 * ✅ Guards use already-loaded auth state for instant decisions
 * ✅ No API calls in guards (they block navigation)
 *
 * ARCHITECTURE:
 * 1. App.vue onMounted → authStore.initialize() (loads user if token exists)
 * 2. Router navigation → guard checks authStore.isAuthenticated
 * 3. Guard redirects based on state (no async operations)
 *
 * For production with real API:
 * - Keep initialization in App.vue with getMe() call
 * - Add token refresh logic in axios interceptor
 * - Use isInitialized flag to prevent premature navigation
 *
 * @example
 * // In route config:
 * meta: { requiresAuth: true, permissions: ['admin'] }
 */
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const meta = to.meta as RouteMeta;
  const authStore = useAuthStore();

  // Wait for initialization on first navigation only
  // After app startup, authStore.isInitialized will be true
  if (!authStore.isInitialized) {
    next();
    return;
  }

  // Check if authentication is required (default: true)
  const requiresAuth = meta.requiresAuth !== false;

  // Allow public routes immediately
  if (!requiresAuth) {
    next();
    return;
  }

  // For protected routes, check authentication
  const authenticated = authStore.isAuthenticated;

  if (!authenticated) {
    // Not authenticated - redirect to login
    const redirectPath = meta.authRedirect || "/login";

    // Don't redirect if already going to login page (prevents redirect loop)
    if (to.path === redirectPath) {
      next();
      return;
    }

    console.warn(`Access denied to ${to.path}, redirecting to ${redirectPath}`);

    // Use next() with redirect path to prevent component rendering
    next({
      path: redirectPath,
      query: {
        // Save original destination for redirect after login
        redirect: to.fullPath,
      },
      replace: true, // Replace history entry to prevent back button issues
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
        replace: true,
      });
      return;
    }
  }

  // All checks passed - allow navigation
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

