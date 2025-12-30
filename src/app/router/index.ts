import { createRouter, createWebHashHistory } from "vue-router";

import "nprogress/nprogress.css";
import "@/app/layouts/types";
import modules from "@/app/router/modules";
import { authGuard, setRouterForGuards } from "@/app/router/utils/guards";
import { PERSISTENT_FILTER_PARAMS } from "@/shared/config/globalFilters.config";
import { progress } from "@/shared/lib/browser/progress";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL || "/"),
  routes: modules,
});

// Provide router instance to guards for Smart Redirects
setRouterForGuards(router);

router.beforeEach(async (to, from, next) => {
  progress.start();

  const title = (to.meta as { title?: string }).title;
  document.title = title ? `${title} | MuzaKit` : "MuzaKit";

  // Preserve filter query params when navigating between pages
  // Only if navigating to a different path (not just query change)
  if (to.path !== from.path && Object.keys(from.query).length > 0) {
    const persistedParams: Record<string, string> = {};

    for (const param of PERSISTENT_FILTER_PARAMS) {
      const value = from.query[param];
      if (value && !to.query[param]) {
        persistedParams[param] = Array.isArray(value) ? value[0] : value;
      }
    }

    // If we have params to persist and target doesn't have them
    if (Object.keys(persistedParams).length > 0) {
      return next({
        ...to,
        query: {
          ...persistedParams,
          ...to.query, // Target query takes priority
        },
      });
    }
  }

  await authGuard(to, from, next);
});

router.afterEach(() => {
  progress.done();
});

router.onError(() => {
  progress.done();
});

export default router;
