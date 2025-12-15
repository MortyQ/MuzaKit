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
  document.title = title ? `${title} | SO Insights` : "SO Insights";

  await authGuard(to, from, next);
});

// Global navigation error handler
router.onError((error, to, from) => {
  console.error("[Router Error]", {
    error: error.message,
    to: to.fullPath,
    from: from.fullPath,
  });

  // Handle chunk loading errors (lazy loading failures)
  if (error.message.includes("Failed to fetch dynamically imported module")
        || error.message.includes("Loading chunk")) {
    // Reload the page to get fresh assets
    window.location.reload();
  }
});

export default router;
