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
      menuTitle: "Components",
      menuIcon: "mdi:hammer",
      isMenuParent: true,
    },
    children: [
      {
        path: "library",
        name: "Components",
        component: () => import("@/pages/Components/index.vue"),
        meta: {
          title: "Component Library",
          menuTitle: "Components",
          menuIcon: "mdi:layers",
          menuOrder: 2,
        },
      },
      {
        path: "ui-gallery",
        name: "UIGallery",
        component: () => import("@/pages/UIGallery/index.vue"),
        meta: {
          title: "UI Gallery",
          menuTitle: "UI Gallery",
          menuIcon: "mdi:palette",
          menuOrder: 3,
        },
      },
      {
        path: "table",
        name: "Table",
        component: () => import("@/pages/Table/index.vue"),
        meta: {
          title: "Table Examples",
          menuTitle: "Tables",
          menuIcon: "mdi:table",
          menuOrder: 4,
        },
      },
    ],
  },
];

export default componentRoutes;
