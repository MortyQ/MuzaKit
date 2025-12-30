import type { RouteRecordRaw } from "vue-router";

import authRoutes from "./auth/index";
import componentRoutes from "./components/index";
import coreRoutes from "./core/index";
import type { AppRouteRecordRaw } from "./types/types";
import { routesToMenuItems, filterRoutesByPermissions } from "./utils/utils";

import { RouteNames } from "@/app/router/types/names";
import { useAuthStore } from "@/features/auth/store/authStore";

/**
 * All application routes
 */
const modules: Array<AppRouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    meta: {
      title: "Home",
      showInMenu: false,
      isRootRedirect: true,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/pages/Home/index.vue"),
    meta: {
      title: RouteNames.HOME,
      showInMenu: true,
      menuTitle: "Home",
      menuIcon: "mdi:home",
      menuOrder: 1,
      permissions: ["home:read"],
    },
  },

  // 403 Forbidden page (public)
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/pages/Forbidden/index.vue"),
    meta: {
      title: "403 Forbidden",
      layout: "empty",
      showInMenu: false,
    },
  },
  // Feature routes
  ...coreRoutes,
  ...componentRoutes,
  ...authRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.NOT_FOUND,
    component: () => import("@/pages/NotFound/index.vue"),
    meta: {
      title: "404 Not Found",
      showInMenu: false,
    },
  },
];

/**
 * Routes that should appear in main menu
 * Automatically filtered from modules based on meta.showInMenu
 */
export const menuModules = modules.filter(
  (route) => route.meta?.showInMenu !== false && route.name,
);

/**
 * Get menu items filtered by current user permissions
 * Call this function with authStore to get fresh menu items based on user's current permissions
 * Use in computed properties for reactivity
 * @param authStore - Auth store instance
 * @returns Filtered menu items based on user permissions
 */
export function getMenuItems(authStore: ReturnType<typeof useAuthStore>) {
  return routesToMenuItems(
    filterRoutesByPermissions(menuModules as RouteRecordRaw[], authStore),
  );
}

export default modules as Array<RouteRecordRaw>;
