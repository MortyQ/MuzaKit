# Router & Menu Integration

## Overview

This project uses a **Hybrid approach** for router and sidebar menu integration:
- **Single Source of Truth**: Routes define menu structure via extended `meta` properties
- **Auto-generation**: Menu items are automatically generated from routes
- **Flexibility**: Fine-grained control over what appears in menu and how

## Architecture

```
Routes (with meta) → Auto Filter → Menu Items → Sidebar Config
```

### Key Files

- `src/app/router/types.ts` - Extended route types with menu metadata
- `src/app/router/utils.ts` - Route → MenuItem conversion utilities
- `src/app/router/adapters.ts` - MenuItem → SidebarNavItem adapter
- `src/app/router/modules.ts` - Main route registry + menu export

## Route Meta Properties

### RouteMeta Interface

```typescript
interface RouteMeta {
  title?: string;           // Browser tab title
  showInMenu?: boolean;     // Show in sidebar (default: true if name exists)
  menuTitle?: string;       // Menu label (fallback to title)
  menuIcon?: string;        // Icon name (Iconify format)
  menuOrder?: number;       // Sort order (lower = higher)
  menuBadge?: string;       // Badge text ("New", "12", etc)
  isMenuParent?: boolean;   // Parent without own route
  requiresAuth?: boolean;   // Auth guard
  permissions?: string[];   // Permission check
  layout?: string;          // Layout override
}
```

## Usage Examples

### 1. Simple Route with Menu Item

```typescript
{
  path: "/dashboard",
  name: "Dashboard",
  component: () => import("@/pages/Dashboard.vue"),
  meta: {
    title: "Dashboard",
    showInMenu: true,
    menuTitle: "Dashboard",
    menuIcon: "mdi:view-dashboard",
    menuOrder: 1,
  },
}
```

### 2. Parent Menu with Children

```typescript
{
  path: "/products",
  name: "Products",
  redirect: "/products/list",
  meta: {
    title: "Products",
    showInMenu: true,
    menuTitle: "Products",
    menuIcon: "mdi:package",
    menuOrder: 2,
    isMenuParent: true, // No own route, only expand/collapse
  },
  children: [
    {
      path: "list",
      name: "Products.List",
      component: () => import("@/pages/Products/List.vue"),
      meta: {
        title: "Product List",
        menuTitle: "List",
        menuIcon: "mdi:format-list-bulleted",
      },
    },
    {
      path: "create",
      name: "Products.Create",
      component: () => import("@/pages/Products/Create.vue"),
      meta: {
        title: "Create Product",
        menuTitle: "Create",
        menuIcon: "mdi:plus",
        menuBadge: "New",
      },
    },
  ],
}
```

### 3. Deeply Nested Menu (3+ levels)

```typescript
{
  path: "/settings",
  name: "Settings",
  meta: {
    showInMenu: true,
    menuTitle: "Settings",
    menuIcon: "mdi:cog",
    isMenuParent: true,
  },
  children: [
    {
      path: "account",
      name: "Settings.Account",
      meta: {
        menuTitle: "Account",
        menuIcon: "mdi:account",
        isMenuParent: true,
      },
      children: [
        {
          path: "profile",
          name: "Settings.Account.Profile",
          component: () => import("@/pages/Settings/Account/Profile.vue"),
          meta: {
            menuTitle: "Profile",
            menuIcon: "mdi:account-circle",
          },
        },
        {
          path: "security",
          name: "Settings.Account.Security",
          component: () => import("@/pages/Settings/Account/Security.vue"),
          meta: {
            menuTitle: "Security",
            menuIcon: "mdi:shield",
          },
        },
      ],
    },
  ],
}
```

### 4. Hidden Route (Not in Menu)

```typescript
{
  path: "/profile/:id",
  name: "UserProfile",
  component: () => import("@/pages/UserProfile.vue"),
  meta: {
    title: "User Profile",
    showInMenu: false, // Don't show in sidebar
  },
}
```

## Adding New Routes

### Step 1: Create Route Module

Create a new file in `src/app/router/[module]/index.ts`:

```typescript
import type { AppRouteRecordRaw } from "../types";

const myRoutes: AppRouteRecordRaw[] = [
  {
    path: "/my-feature",
    name: "MyFeature",
    component: () => import("@/pages/MyFeature/index.vue"),
    meta: {
      title: "My Feature",
      showInMenu: true,
      menuTitle: "My Feature",
      menuIcon: "mdi:star",
      menuOrder: 10,
    },
  },
];

export default myRoutes;
```

### Step 2: Import in modules.ts

```typescript
import myRoutes from "./my-feature/index";

const modules: Array<AppRouteRecordRaw> = [
  // ...existing routes
  ...myRoutes,
  // ...
];
```

### Step 3: Done!

Menu item will automatically appear in sidebar. No additional configuration needed.

## Menu Items Export

```typescript
// In modules.ts
export const menuItems = routesToMenuItems(menuModules);
```

Use `menuItems` in layouts:

```typescript
import { menuItems } from "@/app/router/modules";
import { menuItemsToSidebarConfig } from "@/app/router/adapters";

const sidebarConfig = menuItemsToSidebarConfig(menuItems, {
  brandName: "My App",
  footerItems: [...],
});
```

## Best Practices

### ✅ DO

- Use descriptive `menuTitle` different from `title` when needed
- Set `menuOrder` for consistent ordering
- Use `isMenuParent: true` for parent items without own page
- Set `showInMenu: false` for detail pages, modals, etc.
- Use icon prefix: `mdi:` for Material Design Icons

### ❌ DON'T

- Don't create separate menu config files
- Don't hardcode menu items in layouts
- Don't forget `name` property (required for menu)
- Don't use same order number for multiple items

## Migration from Old System

### Before (manual config):

```typescript
const sidebarConfig = {
  items: [
    createSidebarItem("home", "Home", "mdi:home", { to: { name: "Home" } }),
    // ...manually defined items
  ],
};
```

### After (auto-generated):

```typescript
// 1. Add meta to route
{
  path: "/",
  name: "Home",
  meta: { showInMenu: true, menuIcon: "mdi:home" }
}

// 2. Import auto-generated menu
import { menuItems } from "@/app/router/modules";
const sidebarConfig = menuItemsToSidebarConfig(menuItems);
```

## Advantages

1. **Single Source of Truth** - routes define everything
2. **Auto-sync** - menu always matches available routes
3. **Type-safe** - full TypeScript support
4. **Flexible** - can override any property
5. **Scalable** - easy to add new features (permissions, badges, etc.)
6. **Maintainable** - one place to manage routing + menu

