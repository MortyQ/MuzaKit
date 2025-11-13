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
          title: "Showcase",
          menuTitle: "Showcase",
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
        redirect: "/components/table/examples",
        meta: {
          title: "Table",
          menuTitle: "Table",
          menuIcon: "mdi:table",
          isMenuParent: true,
          menuBadge: "Improved",
        },
        children: [
          {
            path: "examples",
            name: "table.examples",
            component: () => import("@/pages/Table/index.vue"),
            meta: {
              title: "Examples",
              menuTitle: "Examples",
              menuIcon: "mdi:list",
            },
          },
          {
            path: "documentation",
            name: "table.documentation",
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
