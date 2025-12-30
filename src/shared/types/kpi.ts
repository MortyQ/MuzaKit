/**
 * KPI Types & Interfaces
 * Type definitions for Key Performance Indicator components
 */

/**
 * Comparison period type for KPI metrics
 */
export type KpiPeriod = "PoP" | "MoM" | "WoW" | "YoY";

/**
 * Unit type for displaying KPI values
 */
export type KpiUnit = "dollar" | "percentage" | "number";

/**
 * Color variant for KPI icon background
 */
export type KpiIconColor
  = | "primary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "secondary"
    | "purple"
    | "pink"
    | "orange"
    | "green"
    | "red"
    | "blue"
    | "cyan";

/**
 * Size variant for KPI cards (same as CardSize from VCard)
 */
export type KpiSize = "fit" | "sm" | "md" | "lg" | "xl" | "full";

/**
 * KPI Value Formatting Options
 * Similar to table formatters but tailored for KPI display
 */
export interface KpiFormatOptions {
  /** Unit type for display (dollar, percentage, number) */
  unit?: KpiUnit
  /** Show decimal places (true = 2 decimals, or specify number for custom) */
  decimals?: boolean | number
  /** Multiplier for value conversion (e.g., 0.01 for cents to dollars) */
  multiply?: number
  /** Custom formatter function (highest priority) */

  formatter?: (val: number | string) => string
}

/**
 * Comparison data for a specific period
 */
export interface KpiComparison {
  /** Period name (PoP, MoM, WoW, YoY) */
  name: KpiPeriod
  /** Value difference (absolute) */
  difference: number
  /** Percentage change */
  percentage: number
  /** Optional tooltip text */
  tooltip?: string
}

/**
 * Main KPI Card Props
 */
export interface VKpiCardProps {
  /** KPI title/label */
  title: string
  /** Main KPI value */
  value: number | string
  /** Icon name in format "collection:name" (e.g., "mdi:currency-usd") */
  icon: string
  /** Color variant for icon background */
  iconColor?: KpiIconColor
  /** Formatting options for value display */
  format?: KpiFormatOptions
  /** Array of comparison data (PoP, MoM, WoW, YoY) */
  comparisons?: KpiComparison[]
  /** Show all comparisons or only the first one */
  showAllComparisons?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom tooltip for the info icon */
  tooltip?: string
  /** Reverse color logic (red for positive, green for negative) */
  reverse?: boolean
  /** Size variant */
  size?: KpiSize
  /** Animate value changes (default: true) */
  animate?: boolean
  /** Custom CSS class */
  class?: string
}

/**
 * Note: VKpiCardShortProps removed - use VKpiCard without comparisons prop
 * for "short" version without comparison data
 */
