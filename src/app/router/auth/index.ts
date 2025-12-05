import type { AppRouteRecordRaw } from "../types/types";

/**
 * Authentication routes (login, register, etc.)
 * These routes should be public (requiresAuth: false)
 */
const authRoutes: AppRouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login/index.vue"),
    meta: {
      title: "Login",
      layout: "empty", // No sidebar/header
      requiresAuth: false, // Public page
      menuIcon: "mdi:login",
      showInMenu: false, // Don't show in sidebar
    },
  },

];

export default authRoutes;
