<script lang="ts" setup>
import { onMounted, ref, watch, nextTick, onBeforeUnmount, computed, Component } from "vue";
import { useRoute, useRouter } from "vue-router";

import VButton from "@/shared/ui/common/VButton.vue";
import VFloating from "@/shared/ui/common/VFloating.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";

const router = useRouter();
const route = useRoute();

export type ITab = {
  id: number | string
  label: string
  disabled?: boolean
  icon?: string
  styles?: string
  activeByDefault?: boolean
  component?: Component
};

export interface TabSelectedPayload {
  tabId: number | string
  callback: () => void
  tab?: ITab
}

const props = withDefaults(defineProps<{
  tabs: ITab[]
  loading?: boolean
  reset?: boolean
  useHash?: boolean // Enable/disable URL hash synchronization (default: true)
  /**
   * Tab selection mode:
   * - 'auto' (default): Tabs switch immediately on click
   * - 'controlled': Tab switching is controlled via @tab-selected callback
   *   Parent must call the provided callback to complete the switch
   */
  tabSelectionMode?: "auto" | "controlled"
}>(), {
  useHash: true,
  tabSelectionMode: "auto",
});

const emits = defineEmits<{
  tabSelected: [payload: TabSelectedPayload]
}>();

// Initialize active tab from URL hash or default
const getInitialTab = (): number | string => {
  // First, try to get tab from URL hash (synchronously, before render)
  // Only if useHash is enabled (default true)
  if (props.useHash && route.hash) {
    const hashTabId = route.hash.replace("#tab-", "");
    const tabFromHash = props.tabs.find((tab) => String(tab.id) === hashTabId);
    if (tabFromHash) {
      return tabFromHash.id;
    }
  }

  // If no valid hash, use activeByDefault or first tab
  const defaultTab = props.tabs.find((tab) => tab.activeByDefault);
  return defaultTab?.id || props.tabs[0]?.id;
};

const currentTabId = ref<number | string>(getInitialTab());

// Handle tab selection
const selectTab = (tabId: number | string, updateRoute = true) => {
  const tab = props.tabs.find((t) => t.id === tabId);

  // Skip if tab doesn't exist or is disabled
  if (!tab || tab.disabled) return;

  // Create callback that completes the tab switch
  const completeTabSwitch = () => {
    currentTabId.value = tabId;

    // Update URL hash only if useHash is enabled (default true)
    if (props.useHash && updateRoute && route.hash !== `#tab-${tabId}`) {
      router.push({
        hash: `#tab-${tabId}`,
        query: route.query,
      });
    }
  };

  if (props.tabSelectionMode === "controlled") {
    // Controlled mode: emit event with callback, parent controls tab switch
    emits("tabSelected", {
      tabId,
      callback: completeTabSwitch,
      tab,
    });
  }
  else {
    // Auto mode (default): switch immediately, emit for notification
    completeTabSwitch();
    emits("tabSelected", {
      tabId,
      callback: () => {
      }, // Already switched, callback is no-op
      tab,
    });
  }
};

// Watch for reset prop
watch(
  () => props.reset,
  (shouldReset) => {
    if (shouldReset && props.tabs.length > 0) {
      selectTab(props.tabs[0].id);
    }
  },
);

// Initialize from URL hash on mount
onMounted(() => {
  // Initial tab is already set correctly in getInitialTab()
  // Create callback for initial tab
  const completeInitialTabSwitch = () => {
    // Only sync URL hash if useHash is enabled (default true)
    if (props.useHash !== false && route.hash !== `#tab-${currentTabId.value}`) {
      router.replace({
        hash: `#tab-${currentTabId.value}`,
        query: route.query,
      });
    }
  };

  const initialTab = props.tabs.find((t) => t.id === currentTabId.value);

  // Complete initial tab switch and emit notification
  completeInitialTabSwitch();
  emits("tabSelected", {
    tabId: currentTabId.value,
    callback: () => {
    }, // Already initialized, callback is no-op
    tab: initialTab,
  });
});

const isTabActive = (tabId: number | string): boolean => {
  return currentTabId.value === tabId;
};

// Overflow tabs logic
const tabsContainerRef = ref<HTMLElement | null>(null);
const visibleTabs = ref<ITab[]>([...props.tabs]);
const overflowTabs = ref<ITab[]>([]);
const moreButtonWidth = 70; // Width of icon button (48px) + small buffer
const tabWidthCache = ref<Map<string | number, number>>(new Map());

const calculateVisibleTabs = () => {
  if (!tabsContainerRef.value || props.tabs.length === 0) return;

  const container = tabsContainerRef.value;
  const containerWidth = container.offsetWidth;

  // Skip if container has no width (hidden or not rendered)
  if (containerWidth === 0) return;

  const tabElements = container.querySelectorAll(".tab-button:not(.more-button)");

  // Update tab width cache - match tabs by ID to handle reordering
  tabElements.forEach((element) => {
    const tabId = (element as HTMLElement).getAttribute("data-tab-id");
    if (!tabId) return;

    const tab = props.tabs.find((t) => String(t.id) === tabId);
    if (tab && element) {
      tabWidthCache.value.set(tab.id, (element as HTMLElement).offsetWidth);
    }
  });

  // Calculate total width needed for all tabs
  let totalWidth = 0;
  const tabWidths: number[] = [];

  for (const tab of props.tabs) {
    const tabWidth = tabWidthCache.value.get(tab.id) || 150;
    tabWidths.push(tabWidth);
    totalWidth += tabWidth;
  }

  // Check if all tabs fit without More button
  if (totalWidth <= containerWidth) {
    // All tabs fit, no overflow needed
    visibleTabs.value = [...props.tabs];
    overflowTabs.value = [];
    return;
  }

  // Need overflow - reserve space for "More" button
  const availableWidth = containerWidth - moreButtonWidth;
  let accumulatedWidth = 0;
  let splitIndex = 0;

  // Find the split point where tabs start overflowing
  for (let i = 0; i < props.tabs.length; i++) {
    const tabWidth = tabWidths[i];
    if (accumulatedWidth + tabWidth <= availableWidth) {
      accumulatedWidth += tabWidth;
      splitIndex = i + 1;
    }
    else {
      break;
    }
  }

  // Split tabs maintaining original order
  visibleTabs.value = props.tabs.slice(0, splitIndex);
  overflowTabs.value = props.tabs.slice(splitIndex);
};

// Dropdown items for overflow tabs
const dropdownItems = computed(() => {
  return overflowTabs.value.map((tab) => ({
    label: tab.label,
    value: tab.id,
    icon: tab.icon,
    disabled: tab.disabled,
    active: tab.id === currentTabId.value,
  }));
});

// Handle dropdown tab selection
const handleDropdownSelect = (tabId: string | number) => {
  selectTab(tabId);
};

// ResizeObserver to recalculate on container size change
let resizeObserver: ResizeObserver | null = null;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  // Wait for DOM to be fully ready
  await nextTick();
  await nextTick();

  if (tabsContainerRef.value) {
    // Initial calculation
    calculateVisibleTabs();

    // Setup ResizeObserver with debounce
    resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        calculateVisibleTabs();
      }, 100);
    });

    resizeObserver.observe(tabsContainerRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  if (resizeObserver && tabsContainerRef.value) {
    resizeObserver.unobserve(tabsContainerRef.value);
    resizeObserver.disconnect();
  }
});

// Watch tabs changes
watch(() => props.tabs, async () => {
  await nextTick();
  calculateVisibleTabs();
}, { deep: true });

defineExpose({
  currentTabId,
  selectTab,
});
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- Tabs Header -->
    <div
      v-if="props.tabs.length > 0"
      class="flex justify-between items-center"
    >
      <!-- Loading Skeleton -->
      <section
        v-if="props.loading"
        aria-busy="true"
        class="flex gap-4 py-4"
      >
        <div
          v-for="item in props.tabs.length"
          :key="item"
          class="h-10 w-32 rounded-lg bg-base-200 animate-pulse"
        />
      </section>

      <!-- Tabs List -->
      <div
        class="flex w-full border-b border-base-300"
      >
        <div
          ref="tabsContainerRef"
          class="flex overflow-x-auto scrollbar-hide scroll-smooth flex-1"
        >
          <nav
            aria-label="Tabs navigation"
            class="flex"
            role="tablist"
          >
            <button
              v-for="tab in visibleTabs"
              :key="tab.id"
              :aria-disabled="tab.disabled"
              :aria-selected="isTabActive(tab.id)"
              :class="[
                {
                  'text-primary border-primary': isTabActive(tab.id),
                  'text-neutral/60 border-transparent hover:text-primary hover:bg-base-200/50':
                    !isTabActive(tab.id) && !tab.disabled,
                  'text-neutral/30 border-transparent cursor-not-allowed': tab.disabled,
                  'cursor-pointer': !tab.disabled,
                },
                tab.styles,
              ]"
              :data-tab-id="tab.id"
              :tabindex="tab.disabled ? -1 : 0"
              class="tab-button relative flex items-center
              justify-center gap-2 px-5 py-3.5 text-sm font-medium
              whitespace-nowrap transition-all duration-200 ease-in-out border-b-2 -mb-px
              focus:outline-none focus-visible:bg-primary/10 focus-visible:ring-2
              focus-visible:ring-primary/20 focus-visible:ring-inset"
              role="tab"
              type="button"
              @click="selectTab(tab.id)"
              @keydown.enter="selectTab(tab.id)"
              @keydown.space.prevent="selectTab(tab.id)"
            >
              <!-- Icon Slot or Icon -->
              <slot
                v-if="!tab.icon"
                :name="`tab-icon-${tab.id}`"
              />
              <VIcon
                v-else
                :class="
                  isTabActive(tab.id)
                    ? 'w-5 h-5 transition-transform duration-200 scale-110'
                    : 'w-5 h-5 transition-transform duration-200'
                "
                :icon="tab.icon"
              />

              <!-- Tab Label -->
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>

        <!-- More Button with Dropdown for overflow tabs -->
        <div
          v-if="overflowTabs.length > 0"
          class="relative flex-shrink-0 more-button"
        >
          <VFloating
            :items="dropdownItems"
            placement="bottom-right"
            @select="handleDropdownSelect"
          >
            <template #trigger>
              <VButton icon="mdi:dots-horizontal" />
            </template>
          </VFloating>
        </div>
      </div>

      <!-- Right Slot (e.g., actions, filters) -->
      <div
        v-if="$slots['tabs-right']"
        class="flex-shrink-0 ml-4"
      >
        <slot
          :current-tab-id="currentTabId"
          name="tabs-right"
        />
      </div>
    </div>

    <!-- Tab Content -->
    <div
      v-if="!props.loading"
      :aria-labelledby="`tab-${currentTabId}`"
      class="flex-1 flex flex-col min-h-0"
      role="tabpanel"
    >
      <div class="flex-1 pt-4">
        <slot :name="`${currentTabId}`" />
      </div>
    </div>
  </div>
</template>
