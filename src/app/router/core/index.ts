import type { AppRouteRecordRaw } from "../types/types";

/**
 * Core application routes
 */
const coreRoutes: AppRouteRecordRaw[] = [
  {
    path: "/about",
    name: "About",
    component: () => import("@/pages/About/index.vue"),
    meta: {
      title: "About",
      showInMenu: true,
      menuTitle: "About",
      menuIcon: "mdi:information",
      menuBadge: "Old",
    },
  },
];

export default coreRoutes;
