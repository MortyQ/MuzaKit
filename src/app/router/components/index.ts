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
      permissions: ["read:list"],
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
          permissions: ["read:list"],
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
              permissions: ["read:list"],
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
              permissions: ["read:list"],
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
              permissions: ["read:list"],
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
              permissions: ["read:list"],
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
              permissions: ["read:list"],
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
          permissions: ["read:list"],
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
              permissions: ["read:list"],
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
              permissions: ["read:list"],
            },
          },
        ],
      },
    ],
  },
];

export default componentRoutes;
