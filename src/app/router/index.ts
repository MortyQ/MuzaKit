import { createRouter, createWebHashHistory } from "vue-router";

import "@/app/layouts/types";
import modules from "@/app/router/modules"; // Import layout types for TypeScript support
import { authGuard, setRouterForGuards } from "@/app/router/utils/guards";
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

  await authGuard(to, from, next);
});

router.afterEach(() => {
  progress.done();
});

router.onError(() => {
  progress.done();
});

export default router;
