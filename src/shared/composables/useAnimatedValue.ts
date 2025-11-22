import { onMounted, ref, watch, type Ref } from "vue";

import { animateValue } from "@/shared/utils/kpi";

interface UseAnimatedValueOptions {
  /** Whether to animate value changes */
  animate?: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Multiplier to apply to the value */
  multiply?: number;
}

/**
 * Composable for animating numeric value changes
 *
 * @example
 * ```ts
 * const { animatedValue, formattedValue } = useAnimatedValue(
 *   () => props.value,
 *   { animate: props.animate, multiply: 100 }
 * );
 * ```
 */
export function useAnimatedValue(
  valueGetter: () => number | string,
  options: UseAnimatedValueOptions = {},
) {
  const {
    animate = true,
    duration = 1000,
    multiply = 1,
  } = options;

  const animatedValue = ref(0);
  const isInitialized = ref(false);

  /**
   * Parse and initialize value from string or number
   */
  const parseValue = (): number => {
    const rawValue = valueGetter();
    const numValue = typeof rawValue === "string"
      ? parseFloat(rawValue.replace(/,/g, ""))
      : Number(rawValue);

    return isNaN(numValue) ? 0 : numValue * multiply;
  };

  /**
   * Initialize animated value on mount
   */
  onMounted(() => {
    const targetValue = parseValue();

    if (animate) {
      animateValue(0, targetValue, duration, (val) => {
        animatedValue.value = val;
      });
    } else {
      animatedValue.value = targetValue;
    }

    isInitialized.value = true;
  });

  /**
   * Watch for value changes and animate to new value
   */
  watch(
    () => valueGetter(),
    () => {
      if (!isInitialized.value) return;

      const targetValue = parseValue();

      if (!animate) {
        animatedValue.value = targetValue;
        return;
      }

      animateValue(animatedValue.value, targetValue, duration, (val) => {
        animatedValue.value = val;
      });
    },
  );

  return {
    /** The animated value (reactive ref) */
    animatedValue: animatedValue as Ref<number>,
    /** Whether the value has been initialized */
    isInitialized: isInitialized as Ref<boolean>,
  };
}

