import { DateTime } from "luxon";
import { watch } from "vue";
import type { LocationQuery } from "vue-router";
import { useRoute, useRouter } from "vue-router";

import { useGlobalFiltersStore } from "@/shared/stores/useGlobalFiltersStore";

/**
 * Parse comma-separated string to array
 */
function parseArrayParam(param?: string | string[]): string[] {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

/**
 * Parse ISO date strings to Date objects
 * Returns null if invalid or missing
 */
function parseDateRange(since?: string | string[], until?: string | string[]): [Date, Date] | null {
  // Handle array values from LocationQuery (take first value)
  const sinceStr = Array.isArray(since) ? since[0] : since;
  const untilStr = Array.isArray(until) ? until[0] : until;

  if (!sinceStr || !untilStr) return null;

  try {
    const sinceDate = DateTime.fromISO(sinceStr, { zone: "utc" });
    const untilDate = DateTime.fromISO(untilStr, { zone: "utc" });

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
 * Composable for syncing global filters store with URL query params
 *
 * Provides explicit functions to update URL instead of automatic watchers
 * This gives precise control - only changed params are updated in URL
 *
 * Usage:
 * const { updatePrimaryInterval, updateSecondaryInterval } = useGlobalFiltersSync();
 *
 * // When user changes primary date picker:
 * store.setPrimaryIntervalRange(newRange);
 * updatePrimaryInterval();
 *
 * // When user changes secondary date picker:
 * store.setSecondaryIntervalRange(newRange);
 * updateSecondaryInterval();
 */

// Global singleton flag to prevent circular URL updates
// Shared between all useGlobalFiltersSync() instances
let isUpdatingUrl = false;

// Track if watch is already registered (prevent multiple watches)
let isWatchRegistered = false;

export function useGlobalFiltersSync() {
  const store = useGlobalFiltersStore();
  const route = useRoute();
  const router = useRouter();

  /**
     * Helper to update URL without triggering the watch
     */
  async function updateUrlSilently(updateFn: () => Promise<void>) {
    isUpdatingUrl = true;
    try {
      await updateFn();
    }
    finally {
      isUpdatingUrl = false;
    }
  }

  // ==================== URL → Store (Init & Browser Navigation) ====================

  /**
     * Update store from URL query params
     * Called on init and browser navigation (back/forward)
     * Uses withoutAbort to prevent cancelling requests during URL sync
     */
  function syncFromUrl(query: LocationQuery) {
    store.withoutAbort(() => {
      // Primary interval (always present)
      const primaryRange = parseDateRange(query.primary_since, query.primary_until);
      if (primaryRange) {
        store.setPrimaryIntervalRange(primaryRange);
      }

      // Secondary interval (only if params exist)
      const secondaryRange = parseDateRange(query.secondary_since, query.secondary_until);
      if (secondaryRange) {
        store.setSecondaryIntervalRange(secondaryRange);
      }

      // Brands filter (by shortName)
      const brandShortNames = parseArrayParam(query.brands);
      store.setBrandsFromShortNames(brandShortNames);

      // Channels filter
      const channelIds = parseArrayParam(query.channels).map(Number);
      store.setChannelsFromIds(channelIds);

      // Note: Products are NOT synced here to avoid multiple requests
      // Products are loaded once in initFilters

      // Granularity filter
      const granularityParam = query.granularity as string | undefined;
      if (granularityParam && ["MONTH", "WEEK", "DAY"].includes(granularityParam)) {
        store.setGranularity(granularityParam as "MONTH" | "WEEK" | "DAY");
      }

      // Future filters:
      // if (query.project_id) store.setProjectId(query.project_id);
      // if (query.status) store.setStatus(query.status);
    });
  }

  // ==================== Store → URL (Explicit Updates) ====================

  /**
     * Update only primary interval in URL
     * Call this after user changes primary date picker
     */
  async function updatePrimaryInterval() {
    await updateUrlSilently(async () => {
      await router.replace({
        query: {
          ...route.query,
          primary_since: store.formattedPrimaryInterval.since,
          primary_until: store.formattedPrimaryInterval.until,
        },
      });
    });
  }

  /**
     * Update only secondary interval in URL
     * Call this after user changes secondary date picker
     */
  async function updateSecondaryInterval() {
    await updateUrlSilently(async () => {
      await router.replace({
        query: {
          ...route.query,
          secondary_since: store.formattedSecondaryInterval.since,
          secondary_until: store.formattedSecondaryInterval.until,
        },
      });
    });
  }

  /**
     * Update brands in URL
     * Call this after user changes brands filter
     * Uses shortName for URL params
     */
  async function updateBrands() {
    await updateUrlSilently(async () => {
      const shortNames = store.selectedBrandIds; // Already returns shortNames
      if (shortNames.length === 0) {
        // "All" selected - remove from URL
        const { brands: _brands, ...restQuery } = route.query;
        await router.replace({ query: restQuery });
      }
      else {
        await router.replace({
          query: {
            ...route.query,
            brands: shortNames.join(","),
          },
        });
      }
    });
  }

  /**
     * Update channels in URL
     * Call this after user changes channels filter
     */
  async function updateChannels() {
    await updateUrlSilently(async () => {
      const ids = store.selectedChannelIds;
      if (ids.length === 0) {
        // "All" selected - remove from URL
        const { channels: _channels, ...restQuery } = route.query;
        await router.replace({ query: restQuery });
      }
      else {
        await router.replace({
          query: {
            ...route.query,
            channels: ids.join(","),
          },
        });
      }
    });
  }

  /**
     * Update products in URL
     * Call this after user changes product search filter
     */
  async function updateProducts() {
    await updateUrlSilently(async () => {
      const products = store.productSearch;
      if (products.length === 0) {
        // No products - remove from URL
        const { products: _products, ...restQuery } = route.query;
        await router.replace({ query: restQuery });
      }
      else {
        await router.replace({
          query: {
            ...route.query,
            products: products.join(","),
          },
        });
      }
    });
  }

  /**
     * Update granularity in URL
     * Call this after user changes granularity filter
     */
  async function updateGranularity() {
    await updateUrlSilently(async () => {
      const value = store.granularity;
      if (value === "MONTH") {
        // Default value - remove from URL
        const { granularity: _granularity, ...restQuery } = route.query;
        await router.replace({ query: restQuery });
      }
      else {
        await router.replace({
          query: {
            ...route.query,
            granularity: value,
          },
        });
      }
    });
  }

  const resetAllFilters = async () => {
    await updateUrlSilently(async () => {
      await router.replace({
        query: {},
      });
    });
  };

  // ==================== Watchers (Only for Browser Navigation) ====================

  /**
     * Sync URL → Store (browser back/forward)
     * This is the ONLY watcher - no automatic Store → URL sync
     * Skips if store is not initialized yet (handled by initFilters in MasterLayout)
     * Skips if we're updating URL ourselves (to prevent circular updates)
     * Only registered ONCE (first call to useGlobalFiltersSync)
     */
  if (!isWatchRegistered) {
    isWatchRegistered = true;
    watch(
      () => route.query,
      (newQuery) => {
        // Skip if we're updating URL ourselves
        if (isUpdatingUrl) return;

        // Skip if store not initialized - initFilters will handle initial sync
        if (!store.isInitialized) return;

        syncFromUrl(newQuery);
      },
    );
  }

  return {
    updatePrimaryInterval,
    updateSecondaryInterval,
    updateBrands,
    updateChannels,
    updateProducts,
    updateGranularity,
    resetAllFilters,
  };
}
