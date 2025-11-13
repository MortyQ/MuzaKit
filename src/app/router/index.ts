import { createRouter, createWebHistory } from "vue-router";

import "@/app/layouts/types";
import { authGuard } from "@/app/router/guards";
import modules from "@/app/router/modules"; // Import layout types for TypeScript support

/**
 * Application routes configuration
 * Following Vue Router 4 best practices with lazy loading for better performance
 *
 * Layout usage:
 * - No meta.layout or meta.layout: "default" → DefaultLayout (with header/nav)
 * - meta.layout: "auth" → AuthLayout (centered, no nav)
 *
 * Auth protection:
 * - By default, all routes require authentication (requiresAuth: true)
 * - Set meta.requiresAuth: false for public pages (login, register, etc.)
 * - Use meta.permissions: ["admin"] to require specific permissions
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes: modules,
});

/**
 * Global navigation guards
 */
router.beforeEach(async (to, from, next) => {
  // 1. Set page title
  document.title = (to.meta.title as string) || "Vue 3 Starter";

  // 2. Check authentication
  await authGuard(to, from, next);
});

export default router;
