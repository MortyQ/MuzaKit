import NProgress from "nprogress";
import { createRouter, createWebHashHistory } from "vue-router";

import "@/app/layouts/types";
import modules from "@/app/router/modules"; // Import layout types for TypeScript support
import { authGuard, setRouterForGuards } from "@/app/router/utils/guards";
import "nprogress/nprogress.css";


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL || "/"),
  routes: modules,
});

NProgress.configure({ showSpinner: false, speed: 500 });
// Provide router instance to guards for Smart Redirects
setRouterForGuards(router);

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const title = (to.meta as { title?: string }).title;
  document.title = title ? `${title} | MuzaKit` : "MuzaKit";

  await authGuard(to, from, next);
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(() => {
  NProgress.done();
});

export default router;
