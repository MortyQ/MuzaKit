/**
 * KPI Utilities
 * Helper functions for formatting and working with KPI data
 */

import type { KpiIconColor, KpiUnit } from "@/shared/types/kpi";
import { formatCurrency } from "@/shared/utils/formatters";

/**
 * Format KPI number based on format configuration
 */
export const formatKpiValue = (
  value: number | string,
  formatOptions?: {
    unit?: KpiUnit
    decimals?: boolean | number
    multiply?: number
    formatter?: (val: number | string) => string
  },
): string => {
  const {
    unit = "number",
    decimals = false,
    multiply = 1,
    formatter,
  } = formatOptions || {};

  // Custom formatter has highest priority
  if (formatter) {
    return formatter(value);
  }

  // Convert to number
  let numValue = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : Number(value);

  if (isNaN(numValue)) {
    return "0";
  }

  // Apply multiplier
  numValue *= multiply;

  // Determine decimal places
  const decimalPlaces = typeof decimals === "number" ? decimals : (decimals ? 2 : 0);

  // Format based on unit
  switch (unit) {
    case "dollar":
      return formatCurrency(numValue, {
        code: "USD",
        decimals: decimalPlaces,
      });

    case "percentage":
      if (decimalPlaces > 0) {
        return numValue.toFixed(decimalPlaces);
      }
      return Math.round(numValue).toString();

    case "number":
    default:
      // Always use toLocaleString for thousand separators (commas)
      return numValue.toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
  }
};

/**
 * Format comparison value (difference)
 */
export const formatComparisonValue = (
  value: number,
  formatOptions?: {
    unit?: KpiUnit
    decimals?: boolean | number
  },
): string => {
  const { unit = "number", decimals = false } = formatOptions || {};
  const absValue = Math.abs(value);
  const decimalPlaces = typeof decimals === "number" ? decimals : (decimals ? 2 : 0);

  if (unit === "dollar") {
    return formatCurrency(absValue, {
      code: "USD",
      decimals: decimalPlaces,
    });
  }

  // Always use toLocaleString for thousand separators (commas)
  return absValue.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Get icon color classes for KPI card
 * Uses adaptive colors that look good on both light and dark themes
 */
export const getKpiIconColorClass = (color: KpiIconColor): string => {
  const colorMap: Record<KpiIconColor, string> = {
    // Adaptive colors using primary shades (400 for light theme, 500 for dark)
    primary: "bg-primary-400 dark:bg-primary-500",
    success: "bg-success-400 dark:bg-success-500",
    error: "bg-error-400 dark:bg-error-500",
    warning: "bg-warning-400 dark:bg-warning-500",
    info: "bg-info-400 dark:bg-info-500",
    secondary: "bg-neutral-400 dark:bg-neutral-500",
    // Standard Tailwind colors with adaptive shades
    purple: "bg-purple-400 dark:bg-purple-500",
    pink: "bg-pink-400 dark:bg-pink-500",
    orange: "bg-orange-400 dark:bg-orange-500",
    green: "bg-green-400 dark:bg-green-500",
    red: "bg-red-400 dark:bg-red-500",
    blue: "bg-blue-400 dark:bg-blue-500",
    cyan: "bg-cyan-400 dark:bg-cyan-500",
  };

  return colorMap[color] || colorMap.primary;
};

/**
 * Determine if comparison is positive (up) or negative (down)
 */
export const isComparisonPositive = (difference: number): boolean => {
  return difference >= 0;
};

/**
 * Get comparison trend classes (color based on positive/negative and reverse logic)
 */
export const getComparisonClasses = (
  difference: number,
  reverse = false,
): {
  textColor: string
  iconColor: string
} => {
  const isPositive = isComparisonPositive(difference);

  if (!reverse) {
    // Normal: positive = green, negative = red
    return {
      textColor: isPositive ? "text-success-500" : "text-error-500",
      iconColor: isPositive ? "text-success-500" : "text-error-500",
    };
  }
  else {
    // Reversed: positive = red, negative = green
    return {
      textColor: isPositive ? "text-error-500" : "text-success-500",
      iconColor: isPositive ? "text-error-500" : "text-success-500",
    };
  }
};

/**
 * Get comparison color value for icon color prop
 */
export const getComparisonColor = (
  difference: number,
  reverse = false,
): string => {
  const isPositive = isComparisonPositive(difference);

  // Tailwind color values
  const successColor = "rgb(34, 197, 94)"; // green-500
  const errorColor = "rgb(239, 68, 68)"; // red-500

  if (!reverse) {
    return isPositive ? successColor : errorColor;
  }
  else {
    return isPositive ? errorColor : successColor;
  }
};

/**
 * Animate number value (for smooth transitions)
 */
export const animateValue = (
  startValue: number,
  endValue: number,
  duration: number,
  onUpdate: (value: number) => void,
): void => {
  const startTime = Date.now();

  const update = () => {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = startValue + (endValue - startValue) * easedProgress;
    onUpdate(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  update();
};
