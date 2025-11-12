/**
 * Sidebar navigation item
 * Supports infinite nesting through children array
 */
export interface SidebarNavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon name (e.g., "mdi:home") */
  icon: string;
  /** Route path or name (optional for parent items) */
  to?: string | { name: string; params?: Record<string, unknown> };
  /** Click handler (alternative to navigation) */
  onClick?: () => void;
  /** Child navigation items (creates collapsible menu) */
  children?: SidebarNavItem[];
  /** Disabled state */
  disabled?: boolean;
  /** Badge text or count */
  badge?: string | number;
  /** External link */
  external?: boolean;
  /** Hide in navigation */
  hidden?: boolean;
  /** Custom metadata */
  meta?: Record<string, unknown>;
}

/**
 * Sidebar configuration
 */
export interface SidebarConfig {
  /** Brand logo URL or component */
  logo?: string;
  /** Brand name */
  brandName?: string;
  /** Navigation items */
  items: SidebarNavItem[];
  /** Footer items (e.g., Settings, Profile) */
  footerItems?: SidebarNavItem[];
  /** Show theme toggle in footer (default: true) */
  showThemeToggle?: boolean;
}

/**
 * Sidebar state
 */
export interface SidebarState {
  /** Is sidebar collapsed */
  isCollapsed: boolean;
  /** Is mobile menu open */
  isMobileOpen: boolean;
  /** Currently expanded parent IDs */
  expandedItems: Set<string>;
}

