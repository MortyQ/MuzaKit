import type { AppRouteRecordRaw } from "../types/types";

import { RouteNames } from "@/app/router/types/names";

const coreRoutes: AppRouteRecordRaw[] = [
  {
    path: "/about",
    name: RouteNames.About,
    component: () => import("@/pages/About/index.vue"),
    meta: {
      title: "About",
      showInMenu: true,
      menuTitle: "About",
      menuIcon: "lucide:info",
      menuBadge: "Old",
      permissions: ["create:listtt"],
    },
  },
  {
    path: "/dashboard",
    name: RouteNames.Dashboard,
    component: () => import("@/pages/Dashboard/index.vue"),
    meta: {
      title: "Dashboard",
      showInMenu: true,
      menuTitle: "Dashboard",
      menuIcon: "lucide:layout-dashboard",
      menuOrder: 2,
      permissions: ["read:list"],
    },
  },
];

export default coreRoutes;
