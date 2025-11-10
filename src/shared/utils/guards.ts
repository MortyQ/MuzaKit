/**
 * Type guard utilities for checking values
 * Similar to lodash's utility functions but with TypeScript type guards
 */

/**
 * Check if value is null or undefined
 *
 * Use in conditions: if (isNil(value)) or if (!isNil(value))
 * Both work perfectly with TypeScript type narrowing
 *
 * @param value - Value to check
 * @returns true if value is null or undefined
 * @example
 * isNil(null) // true
 * isNil(undefined) // true
 * isNil(0) // false
 * isNil('') // false
 *
 * // In conditions - both work
 * if (isNil(value)) { }
 * if (!isNil(value)) { }
 */
export const isNil = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Check if value is NOT null or undefined
 *
 * ⚠️ USE THIS ONLY for array.filter() and similar methods where you pass the function directly
 * For conditions, use !isNil(value) instead - it's more readable
 *
 * @param value - Value to check
 * @returns true if value is neither null nor undefined
 * @example
 * // ✅ GOOD - Use for filtering arrays (type narrowing works)
 * const array: (string | null)[] = ['a', null, 'b'];
 * const filtered = array.filter(isNotNil); // string[]
 *
 * // ✅ ALSO GOOD - Use in conditions
 * if (isNotNil(value)) { }
 *
 * // ⚠️ PREFER !isNil() for readability in conditions
 * if (!isNil(value)) { } // More readable
 */
export const isNotNil = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, or empty object)
 *
 * @param value - Value to check
 * @returns true if value is considered empty
 * @example
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(0) // false
 * isEmpty('test') // false
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

