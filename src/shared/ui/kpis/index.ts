// KPI Components
export { default as VKpiCard } from "./VKpiCard.vue";
export { default as VKpiComparison } from "./VKpiComparison.vue";
export { default as VKpiMultiMetric } from "./VKpiMultiMetric.vue";

// VKpiMultiMetric sub-components (for advanced usage)
export { default as VKpiMultiMetricHeader } from "./VKpiMultiMetricHeader.vue";
export { default as VKpiMultiMetricItem } from "./VKpiMultiMetricItem.vue";

// Types
export type { VKpiCardProps } from "@/shared/types/kpi";
export type {
  VKpiMultiMetric as VKpiMultiMetricType,
  VKpiMultiMetricIconColor,
  VKpiMultiMetricColumns,
} from "./types/VKpiMultiMetric.types";

