<script lang="ts" setup>
/**
 * TablePeriodSelect Component
 *
 * Reusable period selector for tables (Month/Week/Day filtering).
 * Encapsulates useTablePeriodSelect composable and VMultiSelect.
 *
 * @example
 * ```vue
 * <TablePeriodSelect
 *   include-summary
 *   @change="handlePeriodChange"
 * />
 *
 * // In parent component:
 * const periodParams = ref({});
 * const isGroupByDate = ref(true);
 *
 * const handlePeriodChange = (params: PeriodChangePayload) => {
 *   periodParams.value = params.requestParams;
 *   isGroupByDate.value = params.isGroupByDate;
 *   loadData();
 * };
 * ```
 */
import VMultiSelect from "@/shared/ui/common/VMultiSelect.vue";
import {
  useTablePeriodSelect,
  type PeriodOption,
  type PeriodRequestParams,
} from "@/widgets/table/composables/useTablePeriodSelect";

// ==================== Types ====================

export interface PeriodChangePayload {
  /** Selected period option */
  selected: PeriodOption
  /** Request params to spread into API call */
  requestParams: PeriodRequestParams
  /** Whether to group by date (false when "Summary" is selected) */
  isGroupByDate: boolean
}

// ==================== Props ====================

interface Props {
  /**
   * Include "Summary" option in the list
   * @default false
   */
  includeSummary?: boolean

  /**
   * Custom width class for the select
   * @default 'w-40'
   */
  widthClass?: string

  /**
   * Placeholder text
   * @default 'Select period'
   */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  includeSummary: false,
  widthClass: "w-40",
  placeholder: "Select period",
});

// ==================== Emits ====================

const emit = defineEmits<{
  /**
   * Emitted when period selection changes
   * Contains all needed data for API request
   */
  change: [payload: PeriodChangePayload]
}>();

// ==================== Composable ====================

const {
  selectedPeriod,
  periodOptions,
  periodRequestParams,
  isGroupByDate,
  handlePeriodChange: internalHandlePeriodChange,
} = useTablePeriodSelect({
  includeSummary: props.includeSummary,
  onPeriodChange: () => {
    emitChange();
  },
});

// ==================== Methods ====================

const emitChange = () => {
  emit("change", {
    selected: selectedPeriod.value,
    requestParams: periodRequestParams.value,
    isGroupByDate: isGroupByDate.value,
  });
};

const handleSelect = (option: PeriodOption) => {
  internalHandlePeriodChange(option);
};

// ==================== Expose ====================

/**
 * Expose reactive values for parent access if needed
 */
defineExpose({
  selectedPeriod,
  periodRequestParams,
  isGroupByDate,
});
</script>

<template>
  <VMultiSelect
    v-model="selectedPeriod"
    :class="widthClass"
    :close-on-select="true"
    :options="periodOptions"
    :placeholder="placeholder"
    :searchable="false"
    @select="handleSelect"
  />
</template>
