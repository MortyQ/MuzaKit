/**
 * Type definitions for v-model support in UI components
 */

/**
 * Represents any value that can be used in v-model
 * Supports primitives, objects, arrays, etc.
 */
export type VModelValue = string | number | boolean | object | null | undefined;

/**
 * Single selection model value
 */
export type SingleSelectValue<T = VModelValue> = T | null;

/**
 * Multiple selection model value
 */
export type MultipleSelectValue<T = VModelValue> = T[];

/**
 * Union type for both single and multiple selection
 */
export type SelectValue<T = VModelValue> = SingleSelectValue<T> | MultipleSelectValue<T>;

/**
 * Value comparator function type
 * Used for custom equality comparison logic
 */
export type ValueComparator<T = VModelValue> = (a: T, b: T) => boolean;

/**
 * Common props for components that support v-model selection
 */
export interface VModelSelectProps<T = VModelValue> {
  /** Value for v-model (unique identifier for this item) */
  value?: T;
  /** Model value for v-model */
  modelValue?: SelectValue<T>;
  /** Multiple selection mode (for array modelValue) */
  multiple?: boolean;
  /**
   * Custom comparison function for complex values (objects)
   * If not provided, uses deep equality comparison
   */
  valueComparator?: ValueComparator<T>;
}

