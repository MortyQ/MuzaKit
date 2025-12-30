import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useAbortController } from "@/shared/composables/useAbortController";
import { useApi } from "@/shared/composables/useApi";
import { useGlobalFiltersSync } from "@/shared/composables/useGlobalFiltersSync";
import {
  ALL_FILTERS,
  DEFAULT_FILTERS,
  FILTER_PERMISSIONS,
  type FilterKey,
} from "@/shared/config/globalFilters.config";

export interface Brand {
  BRAND_PK: number
  BK_BRAND_ID: string
  BRAND_GROUPS_ID: number
  BRAND_NAME: string
  BRAND_SHORT_NAME: string
  IS_ACTIVE: boolean
}

export interface Channels {
  DIM_CHANNEL_PK: number
  CHANNEL_ID: number
  NAME: string
  PLATFORM: string
  TLD: string
  LOCALE: string
  CURRENCY: string
  STATUS: string
}

interface Product {
  PRODUCT_ID: number
  PRODUCT_NAME: string
  ASIN: string
  SKU: string
}

interface ProductSearchResult extends Product {
  label_title: string
  label_name: string
}

export interface ProductGroup {
  BRAND_GROUPS_ID: number
  BRAND_GROUPS_SHORT_NAME: string
  PARENT_BRAND_NAME: string
  BRANDS: BrandFromProductGroup[]
}

export type BrandFromProductGroup = {
  BRAND_ID: string
} & Pick<Brand, "BRAND_NAME" | "BRAND_SHORT_NAME">;

// TODO: rename to BrandGroup
export interface ProductGroup {
  BRAND_GROUPS_ID: number
  BRAND_GROUPS_SHORT_NAME: string
  PARENT_BRAND_NAME: string
  BRANDS: BrandFromProductGroup[]
}

// Option type for multiselect
export interface FilterOption {
  label: string
  value: string | number

  [key: string]: unknown
}

export type BrandFilterOption = FilterOption & {
  shortName?: string
};

// All option constant
const ALL_BRANDS_OPTION: BrandFilterOption = { label: "All", value: "all" };
const ALL_CHANNELS_OPTION: FilterOption = { label: "All", value: "all" };

export const useGlobalFiltersStore = defineStore("globalFilters", () => {
  const { resetAllFilters: resetAllFiltersURL } = useGlobalFiltersSync();
  const { abort: abortPendingRequests } = useAbortController();
  const router = useRouter();
  const authStore = useAuthStore();

  // Flag to skip abort when syncing from URL (browser navigation)
  let isSyncingFromUrl = false;

  /**
     * Conditionally abort pending requests
     * Skips abort when syncing from URL to prevent cancelling new requests
     */
  const maybeAbort = () => {
    if (!isSyncingFromUrl) {
      abortPendingRequests();
    }
  };

  /**
     * Run a function with abort disabled (for URL sync)
     */
  const withoutAbort = (fn: () => void) => {
    isSyncingFromUrl = true;
    try {
      fn();
    }
    finally {
      isSyncingFromUrl = false;
    }
  };

  // ==================== Filter Visibility ====================

  /**
     * Get visible filters based on route.meta configuration
     */
  const visibleFilters = computed<FilterKey[]>(() => {
    const meta = router.currentRoute.value.meta?.filters;

    if (!meta) return DEFAULT_FILTERS;

    if (meta.show) return meta.show;
    if (meta.hide) return ALL_FILTERS.filter((f) => !meta.hide!.includes(f));

    return DEFAULT_FILTERS;
  });

  /**
     * Check if a specific filter should be visible
     * Considers both route.meta and user permissions
     */
  const isFilterVisible = (filter: FilterKey): boolean => {
    // 1. Check route.meta (does page want to show this filter?)
    if (!visibleFilters.value.includes(filter)) {
      return false;
    }

    // 2. Check permissions (does user have access?)
    const requiredPermission = FILTER_PERMISSIONS[filter];
    if (requiredPermission) {
      // Cast to UserPermission type from authStore
      type Permission = Parameters<typeof authStore.hasPermission>[0];
      return authStore.hasPermission(requiredPermission as Permission);
    }

    return true;
  };

  // ==================== Helper Functions ====================

  /**
     * Parse ISO date strings to Date objects
     */
  function parseDateRange(since: string, until: string): [Date, Date] | null {
    try {
      const sinceDate = DateTime.fromISO(since, { zone: "utc" });
      const untilDate = DateTime.fromISO(until, { zone: "utc" });

      if (sinceDate.isValid && untilDate.isValid) {
        return [sinceDate.toJSDate(), untilDate.toJSDate()];
      }
    }
    catch (error) {
      console.error("Failed to parse date range:", error);
    }
    return null;
  }

  /**
     * Get default main date range (Last 3 Months)
     */
  const getDefaultMainRange = (): [Date, Date] => {
    const today = DateTime.utc().startOf("day");
    const startDate = today.minus({ months: 3 });
    return [startDate.toJSDate(), today.toJSDate()];
  };

  /**
     * Get default comparison date range (6-3 months ago)
     * Same duration as primary, shifted back by 3 months
     */
  const getDefaultComparisonRange = (): [Date, Date] => {
    const today = DateTime.utc().startOf("day");
    const startDate = today.minus({ months: 6 });
    const endDate = today.minus({ months: 3 }).minus({ days: 1 });
    return [startDate.toJSDate(), endDate.toJSDate()];
  };

  /**
     * Format Date to ISO string (YYYY-MM-DD)
     * UTC-safe for API calls
     */
  const formatDateToISO = (date: Date): string => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toISODate() || "";
  };

  // ==================== State ====================

  /**
     * Flag indicating if filters are fully initialized from URL
     * Other components should wait for this before making API calls
     */
  const isInitialized = ref(false);

  /**
     * Main date range (Last 3 Months by default)
     * Used for primary data queries
     */
  const primaryInterval = ref<[Date, Date]>(getDefaultMainRange());

  /**
     * Comparison date range (6-3 months ago by default)
     * Used when comparison mode is enabled
     */
  const secondaryInterval = ref<[Date, Date]>(getDefaultComparisonRange());

  /**
     * Brands list
     */
  const brands = ref<Brand[]>([]);
  const isBrandLoading = ref(false);

  /**
     * Channels list
     */
  const channels = ref<Channels[]>([]);
  const isChannelLoading = ref(false);

  /**
     * Brand Groups list
     */
  const brandGroups = ref<ProductGroup[]>([]);
  const isBrandGroupLoading = ref(false);

  /**
     * Selected brands (for filter)
     * Contains "All" option or specific brand options
     */
  const selectedBrands = ref<BrandFilterOption[]>([ALL_BRANDS_OPTION]);

  /**
     * Selected channels (for filter)
     * Contains "All" option or specific channel options
     */
  const selectedChannels = ref<FilterOption[]>([ALL_CHANNELS_OPTION]);

  /**
     * Product search filter (ASINs/SKUs)
     */
  const productSearch = ref<string[]>([]);

  /**
     * Product search results
     */
  const searchProductResult = ref<ProductSearchResult[]>([]);
  const isSearchProductLoading = ref(false);

  /**
     * Granularity for data aggregation
     */
  type Granularity = "MONTH" | "WEEK" | "DAY";
  const granularity = ref<Granularity>("MONTH");

  // ==================== Getters ====================
  /**
     * Format primary interval as object for API calls
     * Returns: { since: "YYYY-MM-DD", until: "YYYY-MM-DD" }
     */
  const formattedPrimaryInterval = computed<{ since: string, until: string }>(() => {
    return {
      since: formatDateToISO(primaryInterval.value[0]),
      until: formatDateToISO(primaryInterval.value[1]),
    };
  });

  /**
     * Format comparison date range for API calls
     * Returns: { since: "YYYY-MM-DD", until: "YYYY-MM-DD" }
     */
  const formattedSecondaryInterval = computed<{ since: string, until: string }>(() => {
    return {
      since: formatDateToISO(secondaryInterval.value[0]),
      until: formatDateToISO(secondaryInterval.value[1]),
    };
  });

  /**
     * Check if all brands selected
     */
  const isAllBrandsSelected = computed(() => {
    return selectedBrands.value.some((b) => b.value === "all");
  });

  /**
     * Check if all channels selected
     */
  const isAllChannelsSelected = computed(() => {
    return selectedChannels.value.some((c) => c.value === "all");
  });

  /**
     * Get selected brand IDs for API calls
     * Returns empty array if "All" is selected (meaning no filter)
     */
  const selectedBrandIds = computed<string[]>(() => {
    if (isAllBrandsSelected.value) return [];
    return selectedBrands.value
      .map((b) => b.shortName)
      .filter((s): s is string => !!s);
  });

  /**
     * Get selected channel IDs for API calls
     * Returns empty array if "All" is selected (meaning no filter)
     */
  const selectedChannelIds = computed<number[]>(() => {
    if (isAllChannelsSelected.value) return [];
    return selectedChannels.value.map((c) => Number(c.value));
  });

  /**
     * Get selected product IDs for API calls
     */
  const selectedProductIds = computed<number[]>(() => {
    return searchProductResult.value.map((p) => p.PRODUCT_ID);
  });

  /**
     * Get current granularity for API calls
     */
  const currentGranularity = computed(() => granularity.value);

  // ==================== Filter Groups (for watch dependencies) ====================

  /**
     * KPI-only filters - used for KPI components that need comparison data
     * Includes: primary interval, secondary interval, brands, channels, products
     * Does NOT include: granularity (KPIs don't depend on granularity)
     *
     * @example
     * watch(() => filtersStore.kpiFilters, () => { loadKpis(); });
     */
  const kpiFilters = computed(() => [
    formattedPrimaryInterval.value,
    formattedSecondaryInterval.value,
    selectedBrandIds.value,
    selectedChannelIds.value,
    selectedProductIds.value,
  ]);

  /**
     * Table/Chart filters - used for components that don't need comparison data
     * Includes: primary interval, brands, channels, products, granularity
     * Does NOT include: secondary interval (no comparison needed)
     *
     * @example
     * watch(() => filtersStore.tableFilters, () => { loadTableData(); });
     */
  const tableFilters = computed(() => [
    formattedPrimaryInterval.value,
    selectedBrandIds.value,
    selectedChannelIds.value,
    selectedProductIds.value,
    currentGranularity.value,
  ]);

  /**
     * All filters - used when component needs all filter values
     * Includes: everything (primary, secondary, brands, channels, products, granularity)
     *
     * @example
     * watch(() => filtersStore.allFilters, () => { loadAllData(); });
     */
  const allFilters = computed(() => [
    formattedPrimaryInterval.value,
    formattedSecondaryInterval.value,
    selectedBrandIds.value,
    selectedChannelIds.value,
    selectedProductIds.value,
    currentGranularity.value,
  ]);

  // ==================== API Request Params (ready-to-use objects) ====================

  /**
     * KPI request params - for KPI components that need comparison data
     * Ready to spread into API calls: { ...kpiRequestParams }
     *
     * @example
     * await api.post('/sales/kpi', { ...filtersStore.kpiRequestParams });
     */
  const kpiRequestParams = computed(() => ({
    brand: selectedBrandIds.value,
    channel: selectedChannelIds.value,
    product: selectedProductIds.value,
    primaryInterval: formattedPrimaryInterval.value,
    secondaryInterval: formattedSecondaryInterval.value,
  }));

  /**
     * Table/Chart request params - for components that don't need comparison
     * Ready to spread into API calls: { ...tableRequestParams }
     *
     * @example
     * await api.post('/sales', { ...filtersStore.tableRequestParams, page: 1, limit: 10 });
     */
  const tableRequestParams = computed(() => ({
    brand: selectedBrandIds.value,
    channel: selectedChannelIds.value,
    product: selectedProductIds.value,
    granularity: currentGranularity.value,
    period: formattedPrimaryInterval.value,
  }));

  /**
     * All request params - includes everything
     * Ready to spread into API calls: { ...allRequestParams }
     *
     * @example
     * await api.post('/endpoint', { ...filtersStore.allRequestParams });
     */
  const allRequestParams = computed(() => ({
    brand: selectedBrandIds.value,
    channel: selectedChannelIds.value,
    product: selectedProductIds.value,
    granularity: currentGranularity.value,
    period: formattedPrimaryInterval.value,
    primaryInterval: formattedPrimaryInterval.value,
    secondaryInterval: formattedSecondaryInterval.value,
  }));

  // ==================== Actions ====================

  /**
     * Update main date range
     * @param range - Tuple of [startDate, endDate]
     * Aborts pending API requests
     */
  const setPrimaryIntervalRange = (range: [Date, Date] | Date[]) => {
    // Abort any pending requests when filters change
    maybeAbort();

    if (range.length === 2) {
      primaryInterval.value = [range[0], range[1]];
    }
  };

  /**
     * Update comparison date range
     * @param range - Tuple of [startDate, endDate]
     * Aborts pending API requests
     */
  const setSecondaryIntervalRange = (range: [Date, Date] | Date[]) => {
    // Abort any pending requests when filters change
    maybeAbort();

    if (range.length === 2) {
      secondaryInterval.value = [range[0], range[1]];
    }
  };

  /**
     * Set selected brands
     * If "All" is selected, clear other selections
     * Aborts pending API requests
     */
  const setSelectedBrands = (options: BrandFilterOption[]) => {
    // Abort any pending requests when filters change
    maybeAbort();

    // If user selects "All", reset to only "All"
    const hasAll = options.some((o) => o.value === "all");
    const previousHadAll = selectedBrands.value.some((o) => o.value === "all");

    if (hasAll && !previousHadAll) {
      // User just selected "All" - reset to only All
      selectedBrands.value = [ALL_BRANDS_OPTION];
    }
    else if (hasAll && options.length > 1) {
      // User selected something else while "All" was selected - remove "All"
      selectedBrands.value = options.filter((o) => o.value !== "all");
    }
    else if (options.length === 0) {
      // Nothing selected - default to "All"
      selectedBrands.value = [ALL_BRANDS_OPTION];
    }
    else {
      selectedBrands.value = options;
    }
  };

  /**
     * Set selected channels
     * If "All" is selected, clear other selections
     * Aborts pending API requests
     */
  const setSelectedChannels = (options: FilterOption[]) => {
    // Abort any pending requests when filters change
    maybeAbort();

    const hasAll = options.some((o) => o.value === "all");
    const previousHadAll = selectedChannels.value.some((o) => o.value === "all");

    if (hasAll && !previousHadAll) {
      selectedChannels.value = [ALL_CHANNELS_OPTION];
    }
    else if (hasAll && options.length > 1) {
      selectedChannels.value = options.filter((o) => o.value !== "all");
    }
    else if (options.length === 0) {
      selectedChannels.value = [ALL_CHANNELS_OPTION];
    }
    else {
      selectedChannels.value = options;
    }
  };

  /**
     * Set brands from URL (by shortNames)
     */
  const setBrandsFromShortNames = (shortNames: string[]) => {
    if (shortNames.length === 0) {
      selectedBrands.value = [ALL_BRANDS_OPTION];
      return;
    }

    const foundShortNames = new Set<string>();
    const options: BrandFilterOption[] = [];

    // Find brands in standalone brands list
    for (const brand of brands.value) {
      if (shortNames.includes(brand.BRAND_SHORT_NAME)
        && !foundShortNames.has(brand.BRAND_SHORT_NAME)) {
        foundShortNames.add(brand.BRAND_SHORT_NAME);
        options.push({
          label: brand.BRAND_NAME,
          value: brand.BK_BRAND_ID,
          shortName: brand.BRAND_SHORT_NAME,
        });
      }
    }

    // Find brands in brandGroups
    for (const group of brandGroups.value) {
      for (const brand of group.BRANDS) {
        if (shortNames.includes(brand.BRAND_SHORT_NAME)
          && !foundShortNames.has(brand.BRAND_SHORT_NAME)) {
          foundShortNames.add(brand.BRAND_SHORT_NAME);
          options.push({
            label: brand.BRAND_NAME,
            value: brand.BRAND_ID,
            shortName: brand.BRAND_SHORT_NAME,
          });
        }
      }
    }

    selectedBrands.value = options.length > 0 ? options : [ALL_BRANDS_OPTION];
  };

  /**
     * Set channels from URL (by IDs)
     */
  const setChannelsFromIds = (ids: number[]) => {
    if (ids.length === 0) {
      selectedChannels.value = [ALL_CHANNELS_OPTION];
      return;
    }
    const options: FilterOption[] = channels.value
      .filter((c) => ids.includes(c.DIM_CHANNEL_PK))
      .map((c) => ({
        label: c.NAME,
        value: c.DIM_CHANNEL_PK,
      }));
    selectedChannels.value = options.length > 0 ? options : [ALL_CHANNELS_OPTION];
  };

  /**
     * Reset all filters to default values
     * - Primary interval: Last 3 Months
     * - Secondary interval: 6-3 months ago
     * - Brands: All
     * - Channels: All
     * - Products: cleared
     */
  const resetAllFilters = async () => {
    primaryInterval.value = getDefaultMainRange();
    secondaryInterval.value = getDefaultComparisonRange();
    selectedBrands.value = [ALL_BRANDS_OPTION];
    selectedChannels.value = [ALL_CHANNELS_OPTION];
    productSearch.value = [];
    searchProductResult.value = [];
    granularity.value = "MONTH";

    await resetAllFiltersURL();
  };

  /**
     * Fetch brands from API
     */
  const fetchBrands = async () => {
    if (brands.value.length) return;
    isBrandLoading.value = true;

    const { execute } = useApi<Brand[]>("/brands", {
      useGlobalAbort: false, // Don't abort filter data loading
    });

    const data = await execute();
    if (data) {
      brands.value = data;
    }

    isBrandLoading.value = false;
  };

  /**
     * Fetch channels from API
     */
  const fetchChannels = async () => {
    if (channels.value.length) return;
    isChannelLoading.value = true;

    const { execute } = useApi<Channels[]>("/channels", {
      useGlobalAbort: false,
    });

    const data = await execute();
    if (data) {
      channels.value = data;
    }

    isChannelLoading.value = false;
  };

  /**
     * Fetch brand groups from API
     */
  const fetchBrandGroups = async () => {
    if (brandGroups.value.length) return;
    isBrandGroupLoading.value = true;

    const { execute } = useApi<ProductGroup[]>("/brands/groups", {
      useGlobalAbort: false,
    });

    const data = await execute();
    if (data) {
      brandGroups.value = data;
    }

    isBrandGroupLoading.value = false;
  };

  /**
     * Search products by ASINs/SKUs
     * @param search - Comma/semicolon/newline separated string of ASINs/SKUs
     */
  const searchProducts = async (search: string) => {
    // Format search string: replace newlines and semicolons with commas
    const formattedSearch = search.replace(/[\r\n;]+/g, ",").trim();

    if (!formattedSearch) {
      // Clear search
      productSearch.value = [];
      searchProductResult.value = [];
      return;
    }

    // Store search terms immediately (for URL sync and display)
    productSearch.value = formattedSearch.split(",").map((s) => s.trim()).filter(Boolean);

    isSearchProductLoading.value = true;

    const { execute } = useApi<Product[]>("/products", {
      method: "POST",
      useGlobalAbort: false,
    });

    const data = await execute({
      data: { search: formattedSearch },
    });

    if (data && data.length > 0) {
      // Map results with labels
      searchProductResult.value = data.map((product) => ({
        ...product,
        label_title: product.SKU,
        label_name: product.PRODUCT_NAME,
      }));
    }
    else {
      searchProductResult.value = [];
    }

    isSearchProductLoading.value = false;
  };

  /**
     * Clear product search
     */
  const clearProductSearch = () => {
    productSearch.value = [];
    searchProductResult.value = [];
  };

  /**
     * Set product search values (without API call)
     * Used for direct state manipulation
     */
  const setProductSearch = (products: string[]) => {
    productSearch.value = products;
  };

  /**
     * Set granularity
     */
  const setGranularity = (value: "MONTH" | "WEEK" | "DAY") => {
    maybeAbort();
    granularity.value = value;
  };

  /**
     * Initialize all filters - load data and restore from URL
     * Call this once in DefaultLayout before rendering page content
     * @param query - URL query params to restore filters from
     */
  const initFilters = async (query: Record<string, string | undefined>) => {
    if (isInitialized.value) return;

    // Load all filter data in parallel
    // await Promise.all([
    //   fetchBrands(),
    //   fetchChannels(),
    //   fetchBrandGroups(),
    // ]);

    // Restore primary dates from URL
    if (query.primary_since && query.primary_until) {
      const primaryRange = parseDateRange(query.primary_since, query.primary_until);
      if (primaryRange) {
        primaryInterval.value = primaryRange;
      }
    }

    // Restore secondary dates from URL
    if (query.secondary_since && query.secondary_until) {
      const secondaryRange = parseDateRange(query.secondary_since, query.secondary_until);
      if (secondaryRange) {
        secondaryInterval.value = secondaryRange;
      }
    }

    // Restore brands from URL (by shortName)
    if (query.brands) {
      const brandShortNames = query.brands.split(",").filter(Boolean);
      setBrandsFromShortNames(brandShortNames);
    }

    // Restore channels from URL
    if (query.channels) {
      const channelIds = query.channels.split(",").filter(Boolean).map(Number);
      setChannelsFromIds(channelIds);
    }

    // Restore products from URL (single request for all products)
    if (query.products) {
      const productsStr = query.products;
      await searchProducts(productsStr);
    }

    // Restore granularity from URL
    if (query.granularity && ["MONTH", "WEEK", "DAY"].includes(query.granularity)) {
      granularity.value = query.granularity as "MONTH" | "WEEK" | "DAY";
    }

    // Mark as initialized - now other components can make API calls
    isInitialized.value = true;
  };

  // ==================== Store API ====================

  return {
    // State
    primaryInterval,
    secondaryInterval,
    brands,
    channels,
    brandGroups,
    isBrandLoading,
    isChannelLoading,
    isBrandGroupLoading,
    selectedBrands,
    selectedChannels,
    isInitialized,
    productSearch,
    searchProductResult,
    isSearchProductLoading,
    granularity,

    // Getters
    isAllBrandsSelected,
    isAllChannelsSelected,
    formattedPrimaryInterval,
    formattedSecondaryInterval,
    selectedBrandIds,
    selectedChannelIds,
    selectedProductIds,
    currentGranularity,
    visibleFilters,

    // Filter Groups (for watch dependencies)
    kpiFilters,
    tableFilters,
    allFilters,

    // API Request Params (ready-to-use objects)
    kpiRequestParams,
    tableRequestParams,
    allRequestParams,

    // Filter Visibility
    isFilterVisible,

    // Actions
    initFilters,
    resetAllFilters,
    setPrimaryIntervalRange,
    setSecondaryIntervalRange,
    setSelectedBrands,
    setSelectedChannels,
    setBrandsFromShortNames,
    setChannelsFromIds,
    fetchBrands,
    fetchChannels,
    fetchBrandGroups,
    searchProducts,
    clearProductSearch,
    setProductSearch,
    setGranularity,
    withoutAbort,
  };
});
