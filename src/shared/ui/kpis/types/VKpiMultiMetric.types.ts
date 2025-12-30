/**
 * Types for VKpiMultiMetric component
 */

export interface VKpiMultiMetric {
  label: string
  value: number | string
  icon?: string
  iconColor?: "primary" | "success" | "warning" | "error" | "info" | "neutral"
  format?: {
    unit?: "number" | "dollar" | "percentage"
    decimals?: boolean | number
    multiply?: number
  }
}

export type VKpiMultiMetricIconColor = "primary" | "success" | "warning" | "error" | "info" | "neutral";

export type VKpiMultiMetricColumns = 1 | 2 | 3 | 4 | 5 | "auto";
