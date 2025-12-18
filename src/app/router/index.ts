import { createRouter, createWebHashHistory } from "vue-router";

import "@/app/layouts/types";
import modules from "@/app/router/modules"; // Import layout types for TypeScript support
import { authGuard, setRouterForGuards } from "@/app/router/utils/guards";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL || "/"),
  routes: modules,
  scrollBehavior(to, _from, savedPosition) {
    // If browser back/forward, restore scroll position
    if (savedPosition) {
      return savedPosition;
    }
    // If hash anchor, scroll to it
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    // Default: scroll to top
    return { top: 0, behavior: "smooth" };
  },
});

// Provide router instance to guards for Smart Redirects
setRouterForGuards(router);

router.beforeEach(async (to, from, next) => {
  // Set page title
  const title = (to.meta as { title?: string }).title;
  document.title = title ? `${title} | MuzaKit` : "MuzaKit";

  await authGuard(to, from, next);
});

export default router;
