import type { AppRouteRecordRaw } from "../types/types";

import { RouteNames } from "@/app/router/types/names";

/**
 * Core application routes
 */
const coreRoutes: AppRouteRecordRaw[] = [
  {
    path: "/about",
    name: RouteNames.About,
    component: () => import("@/pages/About/index.vue"),
    meta: {
      title: "About",
      showInMenu: true,
      menuTitle: "About",
      menuIcon: "mdi:information",
      menuBadge: "Old",
    },
  },
  // Dashboard route
  {
    path: "/dashboard",
    name: RouteNames.Dashboard,
    component: () => import("@/pages/Dashboard/index.vue"),
    meta: {
      title: "Dashboard",
      showInMenu: true,
      menuTitle: "Dashboard",
      menuIcon: "mdi:view-dashboard",
      menuOrder: 2,
    },
  },
];

export default coreRoutes;
