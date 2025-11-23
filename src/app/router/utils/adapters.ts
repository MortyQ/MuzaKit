import type { MenuItem } from "@/app/router/types/types";
import type { SidebarNavItem } from "@/widgets/sidebar/types";

/**
 * Options for converting MenuItems to SidebarConfig
 */
export interface SidebarConfigOptions {
  brandName?: string;
  footerItems?: MenuItem[];
  showThemeToggle?: boolean;
  showUserMenu?: boolean;
}

/**
 * Convert router MenuItem to Sidebar NavItem
 */
export function menuItemToSidebarItem(menuItem: MenuItem): SidebarNavItem {
  const sidebarItem: SidebarNavItem = {
    id: menuItem.id,
    label: menuItem.label,
    icon: menuItem.icon,
    to: menuItem.to,
    badge: menuItem.badge,
    disabled: menuItem.disabled,
  };

  if (menuItem.children && menuItem.children.length > 0) {
    sidebarItem.children = menuItem.children.map(menuItemToSidebarItem);
  }

  return sidebarItem;
}

/**
 * Convert array of MenuItems to SidebarConfig
 */
export function menuItemsToSidebarConfig(
  items: MenuItem[],
  options?: SidebarConfigOptions,
) {
  return {
    brandName: options?.brandName || "App",
    items: items.map(menuItemToSidebarItem),
    footerItems: options?.footerItems?.map(menuItemToSidebarItem) || [],
    showThemeToggle: options?.showThemeToggle ?? true,
    showUserMenu: options?.showUserMenu ?? true,
  };
}

