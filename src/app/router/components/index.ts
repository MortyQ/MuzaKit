import type { AppRouteRecordRaw } from "../types/types";

import { RouteNames } from "@/app/router/types/names";

/**
 * Component showcase routes
 */
const componentRoutes: AppRouteRecordRaw[] = [
  {
    path: "/components",
    name: RouteNames.ComponentsParent,
    redirect: "/components/library",
    meta: {
      title: "Components",
      menuTitle: "Components",
      menuIcon: "mdi:hammer",
      isMenuParent: true,
    },
    children: [
      {
        path: "ui-gallery",
        name: RouteNames.UiGalleryDisplayParent,
        redirect: "/components/ui-gallery/overview",
        meta: {
          title: "UI Gallery",
          menuTitle: "UI Gallery",
          menuIcon: "mdi:palette",
          isMenuParent: true,
          menuOrder: 3,
        },
        children: [
          {
            path: "overview",
            name: RouteNames.UiGalleryOverview,
            component: () => import("@/pages/UIGallery/index.vue"),
            meta: {
              title: "Overview",
              menuTitle: "Overview",
              menuIcon: "lucide:home",
            },
          },
          {
            path: "feedback",
            name: RouteNames.UiGalleryFeedback,
            component: () => import("@/pages/UIGallery/Feedback.vue"),
            meta: {
              title: "Feedback",
              menuTitle: "Feedback",
              menuIcon: "lucide:message-square",
            },
          },
          {
            path: "forms",
            name: RouteNames.UiGalleryForms,
            component: () => import("@/pages/UIGallery/Forms.vue"),
            meta: {
              title: "Forms",
              menuTitle: "Forms",
              menuIcon: "lucide:clipboard-list",
            },
          },
          {
            path: "display",
            name: RouteNames.UiGalleryDisplay,
            component: () => import("@/pages/UIGallery/Display.vue"),
            meta: {
              title: "Display",
              menuTitle: "Display",
              menuIcon: "lucide:layout",
            },
          },
          {
            path: "layout",
            name: RouteNames.UiGalleryLayout,
            component: () => import("@/pages/UIGallery/Layout.vue"),
            meta: {
              title: "Layout",
              menuTitle: "Layout",
              menuIcon: "lucide:layout-grid",
              menuBadge: "Soon",
            },
          },
        ],
      },
      {
        path: "table",
        name: RouteNames.TableParent,
        redirect: "/components/table/examples",
        meta: {
          title: "Table",
          menuTitle: "Table",
          menuIcon: "mdi:table",
          isMenuParent: true,
        },
        children: [
          {
            path: "examples",
            name: RouteNames.TableExamples,
            component: () => import("@/pages/Table/index.vue"),
            meta: {
              title: "Examples",
              menuTitle: "Examples",
              menuIcon: "mdi:list",
            },
          },
          {
            path: "documentation",
            name: RouteNames.TableDocumentation,
            component: () => import("@/pages/Table/components/documentation/TableDocumentationWrapper.vue"),
            meta: {
              title: "Documentation",
              menuTitle: "Documentation",
              menuIcon: "mdi:document",
            },
          },
        ],
      },
    ],
  },
];

export default componentRoutes;
