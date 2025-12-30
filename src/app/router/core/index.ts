import type { AppRouteRecordRaw } from "../types/types";

import { RouteNames } from "@/app/router/types/names";

const coreRoutes: AppRouteRecordRaw[] = [
  {
    path: "/about",
    name: RouteNames.ABOUT,
    component: () => import("@/pages/About/index.vue"),
    meta: {
      title: "About",
      menuTitle: "About",
      menuIcon: "lucide:info",
      menuBadge: "Old",
      permissions: ["create:listtt"],
    },
  },
  {
    path: "/dashboard",
    name: RouteNames.DASHBOARD,
    component: () => import("@/pages/Dashboard/index.vue"),
    meta: {
      title: "Dashboard",
      menuTitle: "Dashboard",
      menuIcon: "lucide:layout-dashboard",
      menuOrder: 2,
      permissions: ["create:list"],
    },
  },
];

export default coreRoutes;
