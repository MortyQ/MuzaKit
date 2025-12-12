import type { AppRouteRecordRaw } from "../types/types";

import { guestGuard } from "@/app/router/utils/guards";

const authRoutes: AppRouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login/index.vue"),
    meta: {
      title: "Login",
      layout: "auth",
      requiresAuth: false,
      menuIcon: "mdi:login",
      showInMenu: false,
    },
    beforeEnter: guestGuard,
  },

];

export default authRoutes;
