import { computed, ref, watch } from "vue";

import type { SidebarState } from "../types";

const STORAGE_KEY = "sidebar-state";

// Shared state across all sidebar instances
const state = ref<SidebarState>({
  isCollapsed: false,
  isMobileOpen: false,
  expandedItems: new Set<string>(),
});

// Load initial state from localStorage
const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      state.value.isCollapsed = parsed.isCollapsed ?? false;
      state.value.expandedItems = new Set(parsed.expandedItems ?? []);
    }
  }
  catch (error) {
    console.warn("[useSidebar] Failed to load state from localStorage:", error);
  }
};

// Save state to localStorage
const saveState = () => {
  try {
    const toSave = {
      isCollapsed: state.value.isCollapsed,
      expandedItems: Array.from(state.value.expandedItems),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  catch (error) {
    console.warn("[useSidebar] Failed to save state to localStorage:", error);
  }
};

// Initialize on first load
loadState();

// Watch for changes and save to localStorage
watch(
  () => state.value.isCollapsed,
  () => {
    saveState();
  },
  { immediate: false },
);

watch(
  () => state.value.expandedItems.size,
  () => {
    saveState();
  },
  { immediate: false },
);

export function useSidebar() {
  // Computed values
  const isCollapsed = computed(() => state.value.isCollapsed);
  const isMobileOpen = computed(() => state.value.isMobileOpen);
  const expandedItems = computed(() => state.value.expandedItems);

  // Actions
  const toggleCollapse = () => {
    state.value.isCollapsed = !state.value.isCollapsed;
  };

  const setCollapsed = (collapsed: boolean) => {
    state.value.isCollapsed = collapsed;
  };

  const toggleMobile = () => {
    state.value.isMobileOpen = !state.value.isMobileOpen;
  };

  const openMobile = () => {
    state.value.isMobileOpen = true;
  };

  const closeMobile = () => {
    state.value.isMobileOpen = false;
  };

  const toggleExpanded = (itemId: string) => {
    if (state.value.expandedItems.has(itemId)) {
      state.value.expandedItems.delete(itemId);
    }
    else {
      state.value.expandedItems.add(itemId);
    }
    // Trigger reactivity
    state.value.expandedItems = new Set(state.value.expandedItems);
  };

  const isExpanded = (itemId: string): boolean => {
    return state.value.expandedItems.has(itemId);
  };

  const collapseAll = () => {
    state.value.expandedItems.clear();
  };

  const expandAll = (itemIds: string[]) => {
    itemIds.forEach((id) => state.value.expandedItems.add(id));
    // Trigger reactivity
    state.value.expandedItems = new Set(state.value.expandedItems);
  };

  return {
    // State
    isCollapsed,
    isMobileOpen,
    expandedItems,

    // Actions
    toggleCollapse,
    setCollapsed,
    toggleMobile,
    openMobile,
    closeMobile,
    toggleExpanded,
    isExpanded,
    collapseAll,
    expandAll,
  };
}
