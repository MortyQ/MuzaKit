import type { AppRouteRecordRaw } from "../types";

/**
 * Component showcase routes
 */
const componentRoutes: AppRouteRecordRaw[] = [
  {
    path: "/components",
    name: "components.parent",
    redirect: "/components/library",
    meta: {
      title: "Components",
      showInMenu: true,
      menuTitle: "Components",
      menuIcon: "mdi:hammer",
      requiresAuth: false,
      isMenuParent: true,
    },
    children: [
      {
        path: "library",
        name: "Components",
        component: () => import("@/pages/Components/index.vue"),
        meta: {
          title: "Component Library",
          showInMenu: true,
          menuTitle: "Components",
          menuIcon: "mdi:layers",
          menuOrder: 2,
          requiresAuth: false,
        },
      },
      {
        path: "ui-gallery",
        name: "UIGallery",
        component: () => import("@/pages/UIGallery/index.vue"),
        meta: {
          title: "UI Gallery",
          showInMenu: true,
          menuTitle: "UI Gallery",
          menuIcon: "mdi:palette",
          menuOrder: 3,
          requiresAuth: false,
        },
      },
      {
        path: "table",
        name: "Table",
        component: () => import("@/pages/Table/index.vue"),
        meta: {
          title: "Table Examples",
          showInMenu: true,
          menuTitle: "Tables",
          menuIcon: "mdi:table",
          menuOrder: 4,
        },
      },
    ],
  },
];

export default componentRoutes;
