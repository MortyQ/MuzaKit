import type { RouteRecordRaw } from "vue-router";


import authRoutes from "./auth/index";
import componentRoutes from "./components/index";
import coreRoutes from "./core/index";
import type { AppRouteRecordRaw } from "./types";
import { routesToMenuItems } from "./utils";

/**
 * All application routes
 */
const modules: Array<AppRouteRecordRaw> = [
  // Home route (public)
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home/index.vue"),
    meta: {
      title: "Home",
      showInMenu: true,
      menuTitle: "Home",
      menuIcon: "mdi:home",
      menuOrder: 1,
      requiresAuth: false, // Public page
    },
  },
  // 404 page with explicit path (public)
  {
    path: "/not-found",
    name: "NotFound",
    component: () => import("@/pages/NotFound/index.vue"),
    meta: {
      title: "404 Not Found",
      showInMenu: false,
      requiresAuth: false, // Public page
    },
  },
  // Feature routes
  ...componentRoutes,
  ...coreRoutes,
  ...authRoutes,
  // Catch-all route (must be last!)
  {
    path: "/:pathMatch(.*)*",
    redirect: "/not-found",
    meta: {
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
 * Generate menu items from routes
 * Use this in layouts/components to render sidebar
 */
export const menuItems = routesToMenuItems(menuModules as RouteRecordRaw[]);

export default modules as Array<RouteRecordRaw>;
