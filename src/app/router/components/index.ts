import type { AppRouteRecordRaw } from "../types/types";

import { RouteNames } from "@/app/router/types/names";

/**
 * Component showcase routes
 */
const componentRoutes: AppRouteRecordRaw[] = [
  {
    path: "/components",
    name: RouteNames.COMPONENTS_PARENT,
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
        name: RouteNames.UI_GALLERY_DISPLAY_PARENT,
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
            name: RouteNames.UI_GALLERY_OVERVIEW,
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
            name: RouteNames.UI_GALLERY_FEEDBACK,
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
            name: RouteNames.UI_GALLERY_FORMS,
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
            name: RouteNames.UI_GALLERY_DISPLAY,
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
            name: RouteNames.UI_GALLERY_LAYOUT,
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
        name: RouteNames.TABLE_PARENT,
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
            name: RouteNames.TABLE_EXAMPLES,
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
            name: RouteNames.TABLE_DOCUMENTATION,
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
