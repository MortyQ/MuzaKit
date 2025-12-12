import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, RouteRecordNormalized, Router } from "vue-router";

import type { RouteMeta } from "../types/types";

import { useAuthStore } from "@/features/auth";
import { UserRole, type UserPermission } from "@/features/auth/types";

let routerInstance: Router | null = null;

export function setRouterForGuards(router: Router): void {
  routerInstance = router;
}

function hasPermissions(required: string[] | undefined): boolean {
  if (!required || required.length === 0) return true;
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated || !authStore.user) return false;
  if (authStore.user.role === UserRole.ADMIN) return true;
  return required.some((permission) => authStore.hasPermission(permission as UserPermission));
}

function findFirstAccessibleRoute(routes: RouteRecordNormalized[]): RouteLocationRaw | null {
  for (const route of routes) {
    const meta = route.meta as RouteMeta;

    if (meta.requiresAuth === false) continue;
    if (!route.name) continue;
    if (meta.showInMenu === false) continue;
    if (route.redirect || route.path.includes("*") || route.name === "403" || route.path === "/403") continue;

    // Skip Root to avoid loop
    if (route.path === "/") continue;

    if (hasPermissions(meta.permissions)) {
      return { name: route.name as string };
    }
  }

  return null;
}


/**
 * ASYNC Authentication Guard
 */
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const meta = to.meta as RouteMeta;
  const authStore = useAuthStore();
  const requiresAuth = meta.requiresAuth !== false;

  if (!requiresAuth) {
    next();
    return;
  }

  if (!authStore.isInitialized) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await authStore.initialize();
      } catch (e) {
        console.error("Auth init failed", e);
      }
    }
  }

  if (!authStore.isAuthenticated) {
    const redirectPath = meta.authRedirect || "/login";
    if (to.path === redirectPath) {
      next();
      return;
    }
    next({
      path: redirectPath,
      query: { redirect: to.fullPath },
      replace: true,
    });
    return;
  }

  const permissions = meta.permissions || [];
  const hasAccess = hasPermissions(permissions);

  if (!hasAccess) {
    if (to.path === "/" && routerInstance) {
      const routes = routerInstance.getRoutes();
      const firstAccessible = findFirstAccessibleRoute(routes);

      if (firstAccessible) {
        next(Object.assign({}, firstAccessible, { replace: true }));
        return;
      }
    }

    next({
      path: "/403",
      query: { from: to.fullPath },
      replace: true,
    });
    return;
  }

  next();
}

export async function guestGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await authStore.initialize();
      } finally {
        // Proceed regardless of initialization success
      }
    }
  }

  if (authStore.isAuthenticated) {
    const redirectTo = (to.query.redirect as string) || "/";
    next({ path: redirectTo, replace: true });
  } else {
    next();
  }
}
