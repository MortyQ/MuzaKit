/**
 * Global Filters Configuration
 *
 * Central configuration for all global filter settings.
 * When adding a new filter, update this file and it will work everywhere.
 */

// ==================== Filter Keys ====================

/**
 * Available filter keys for global filters visibility
 */
export type FilterKey = "brands"
  | "channels"
  | "products"
  | "dateRange"
  | "comparison"
  | "granularity";

// ==================== Filter Configuration ====================

/**
 * All available filters in the system
 */
export const ALL_FILTERS: FilterKey[] = [
  "brands",
  "channels",
  "products",
  "dateRange",
  "comparison",
  "granularity",
];

/**
 * Default filters shown when no route.meta.filters specified
 */
export const DEFAULT_FILTERS: FilterKey[] = [
  "brands",
  "channels",
  "products",
  "dateRange",
  "comparison",
  "granularity",
];

/**
 * URL query parameter names for each filter
 * Used for URL sync and persistence
 */
export const FILTER_URL_PARAMS: Record<FilterKey, string[]> = {
  brands: ["brands"],
  channels: ["channels"],
  products: ["products"],
  dateRange: ["primary_since", "primary_until"],
  comparison: ["secondary_since", "secondary_until"],
  granularity: ["granularity"],
};

/**
 * All URL params that should persist across page navigation
 * Auto-generated from FILTER_URL_PARAMS
 */
export const PERSISTENT_FILTER_PARAMS: string[] = Object.values(FILTER_URL_PARAMS).flat();

/**
 * Permission required for each filter (null = no permission required)
 * Add permission string to restrict filter visibility
 */
export const FILTER_PERMISSIONS: Record<FilterKey, string | null> = {
  brands: null,
  channels: null,
  products: null,
  dateRange: null,
  comparison: null,
  granularity: null,
};

// ==================== TypeScript Augmentation ====================

/**
 * Filters visibility configuration for route.meta
 */
export interface FiltersVisibilityConfig {
  /** Show only these filters (whitelist) */
  show?: FilterKey[]
  /** Hide these filters (blacklist) */
  hide?: FilterKey[]
}

// Augment vue-router RouteMeta
declare module "vue-router" {
  interface RouteMeta {
    /** Filters visibility configuration */
    filters?: FiltersVisibilityConfig
  }
}
