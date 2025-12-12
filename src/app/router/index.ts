import { createRouter, createWebHashHistory } from "vue-router";

import "@/app/layouts/types";
import modules from "@/app/router/modules"; // Import layout types for TypeScript support
import { authGuard, setRouterForGuards } from "@/app/router/utils/guards";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL || "/"),
  routes: modules,
});

// Provide router instance to guards for Smart Redirects
setRouterForGuards(router);

router.beforeEach((to, from, next) => {
  // document.title = (to.meta.title as string) || "Vue 3 Starter";

  authGuard(to, from, next);
});

export default router;
