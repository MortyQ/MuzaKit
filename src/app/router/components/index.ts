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
        name: "table.parent",
        meta: {
          title: "Table",
          menuTitle: "Table",
          menuIcon: "mdi:table",
          isMenuParent: true,
        },
        children: [
          {
            path: "examples",
            name: "Table Examples",
            component: () => import("@/pages/Table/index.vue"),
            meta: {
              title: "Examples",
              menuTitle: "Examples",
              menuIcon: "mdi:list",
            },
          },
          {
            path: "documentation",
            name: "Table Documentation",
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
