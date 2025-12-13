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

let routerInstance: Router | null = null;

export function setRouterForGuards(router: Router): void {
  routerInstance = router;
}

function hasPermissions(required: string[] | undefined): boolean {
  const authStore = useAuthStore();

  if (!required || required.length === 0) {
    return true;
  }

  if (!authStore.isAuthenticated || !authStore.user) {
    return false;
  }

  if (authStore.user.role === UserRole.ADMIN) {
    return true;
  }

  // Check if user has ALL required permissions (not just any)
  const permissionChecks = required.map((permission) => ({
    permission,
    hasIt: authStore.hasPermission(permission as UserPermission),
  }));

  return permissionChecks.every((check) => check.hasIt);
}

function findFirstAccessibleRoute(routes: RouteRecordNormalized[]):
    RouteLocationRaw | null {
  const candidates: Array<{ route: RouteRecordNormalized; meta: RouteMeta }> = [];

  for (const route of routes) {
    const meta = route.meta as RouteMeta;

    if (meta.requiresAuth === false) {
      continue;
    }
    if (!route.name) {
      continue;
    }
    if (meta.showInMenu === false) {
      continue;
    }
    if (route.redirect || route.path.includes("*") || route.name === "403" || route.path === "/403") {
      continue;
    }

    // Skip Root to avoid loop
    if (route.path === "/") {
      continue;
    }

    const hasAccess = hasPermissions(meta.permissions);

    if (hasAccess) {
      candidates.push({ route, meta });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Sort candidates by priority:
  // 1. Routes with explicit showInMenu: true (menu items)
  // 2. Lower menuOrder (1, 2, 3... take priority over undefined)
  // 3. Shorter paths (top-level routes over nested children)
  candidates.sort((a, b) => {
    const aShowInMenu = a.meta.showInMenu === true;
    const bShowInMenu = b.meta.showInMenu === true;

    // Explicit menu items first
    if (aShowInMenu && !bShowInMenu) return -1;
    if (!aShowInMenu && bShowInMenu) return 1;

    // Then by menuOrder (lower = higher priority)
    const aOrder = a.meta.menuOrder ?? 999;
    const bOrder = b.meta.menuOrder ?? 999;

    if (aOrder !== bOrder) return aOrder - bOrder;

    // Finally by path depth (shorter = top-level = higher priority)
    const aDepth = a.route.path.split("/").filter(Boolean).length;
    const bDepth = b.route.path.split("/").filter(Boolean).length;

    return aDepth - bDepth;
  });

  const selected = candidates[0];

  return { name: selected.route.name as string };
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

  // Initialize auth if needed
  if (!authStore.isInitialized) {
    const token = tokenManager.getAccessToken();
    if (token) {
      try {
        await authStore.initialize();
      }
      catch (e) {
        console.error("Auth init failed", e);
      }
    }
  }

  // Check if authenticated
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

  // Special handling for root redirect route (AFTER auth check)
  // This handles the case when user goes to "/" - redirect to first accessible route
  if (meta.isRootRedirect && routerInstance) {
    const routes = routerInstance.getRoutes();
    const firstAccessible = findFirstAccessibleRoute(routes);

    if (firstAccessible) {
      next(Object.assign({}, firstAccessible, { replace: true }));
      return;
    }

    // No accessible routes found - show 403
    next({
      path: "/403",
      replace: true,
    });
    return;
  }

  // Check permissions for regular routes
  const permissions = meta.permissions || [];
  const hasAccess = hasPermissions(permissions);

  if (!hasAccess) {
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
    const token = tokenManager.getAccessToken();
    if (token) {
      try {
        await authStore.initialize();
      }
      finally {
        // Proceed regardless of initialization success
      }
    }
  }

  if (authStore.isAuthenticated) {
    const redirectTo = (to.query.redirect as string) || "/";
    next({ path: redirectTo, replace: true });
  }
  else {
    next();
  }
}
