import { useVirtualizer } from "@tanstack/vue-virtual";
import {
  computed,
  onActivated,
  onUnmounted,
  type Ref,
} from "vue";

import { VirtualTableOptions } from "@/shared/ui/table/types";

export function useVirtualTable(
  scrollContainerRef: Ref<HTMLElement | null>,
  data: Ref<Record<string, unknown>[]>,
  options: VirtualTableOptions = {},
) {
  const {
    estimateSize = 50,
    overscan = 2,
    measureElement = false,
  } = options;

  const virtualizerOptions: Record<string, unknown> = {
    get count() {
      return data.value.length;
    },
    getScrollElement: () => scrollContainerRef.value,
    estimateSize: () => estimateSize,
    overscan,
  };

  // OPTIMIZATION: WeakMap for caching dynamic heights
  if (measureElement) {
    const heightCache = new WeakMap<Element, number>();

    virtualizerOptions.measureElement = (el: Element | null) => {
      if (!el) return estimateSize;
      const cached = heightCache.get(el);
      if (cached !== undefined) return cached;

      const height = el.getBoundingClientRect().height;
      heightCache.set(el, height);
      return height;
    };
  }

  const virtualizer = useVirtualizer(virtualizerOptions as never);
  const virtualItems = computed(() => virtualizer.value.getVirtualItems());
  const totalSize = computed(() => virtualizer.value.getTotalSize());

  onActivated(() => {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.value;
      if (!el || !virtualizer.value) return;

      virtualizer.value.measure();

      el.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
  });

  // Cleanup
  onUnmounted(() => {
  });

  return {
    virtualizer,
    virtualItems,
    totalSize,
  };
}
