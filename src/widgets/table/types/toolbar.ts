/**
 * Toolbar types for Table component
 */

export interface ToolbarConfig {
  /**
   * Enable toolbar
   * @default false
   */
  enabled?: boolean;

  /**
   * Table title
   */
  title?: string;

  /**
   * Optional subtitle
   */
  subtitle?: string;

  /**
   * Search configuration
   */
  search?: boolean | {
    placeholder?: string;
  };

  /**
   * Toolbar actions
   */
  actions?: {
    /**
     * Refresh button behavior
     * - true/'default': Built-in behavior (resets sort & pagination)
     * - 'custom': Only emits @toolbar:refresh event, no built-in behavior
     * - false: Button hidden
     */
    refresh?: boolean | "default" | "custom";

    /**
     * Reset sort button behavior
     * - true/'default': Built-in behavior (clears sort state)
     * - 'custom': Only emits @toolbar:reset-sort event, no built-in behavior
     * - false: Button hidden
     */
    resetSort?: boolean | "default" | "custom";

    /**
     * Export functionality
     * 'single' - one export button
     * 'multi' - dropdown with multiple export options
     */
    export?: "single" | "multi";

    /**
     * Column setup button configuration
     * - false: Button hidden
     * - string: Storage key (enables persistence with default settings)
     * - object: Full configuration with custom settings
     *
     * @example
     * // Quick setup with persistence
     * columnSetup: 'myTable_columns'
     *
     * @example
     * // Full configuration
     * columnSetup: {
     *   key: 'myTable_columns',
     *   type: 'sessionStorage',
     *   allowReorder: false
     * }
     *
     * @default false
     */
    columnSetup?: false | string | {
      /**
       * Storage key for persistent storage
       * If provided, column settings will be persisted automatically
       * @example 'myTable_columns'
       */
      key?: string;

      /**
       * Storage type
       * @default 'indexedDB'
       */
      type?: "indexedDB" | "localStorage" | "sessionStorage";

      /**
       * Enable column reordering via drag-and-drop
       * @default true
       */
      allowReorder?: boolean;

      /**
       * Initially visible columns (by key)
       * If not provided, all columns are visible
       * Note: This is overridden by saved state if storage key is provided
       */
      initialVisible?: string[];
    };
  };
}

export interface ExportFormat {
  /**
   * Display label
   */
  label: string;

  /**
   * Format value (csv, excel, pdf, etc.)
   */
  value: string;

  /**
   * Optional icon
   */
  icon?: string;

  /**
   * Loading state for this format
   */
  loader?: boolean;
}

export interface ExportOptions {
  /**
   * Available export formats
   */
  formats?: ExportFormat[];

  /**
   * Export only selected rows
   * @default false
   */
  selectedOnly?: boolean;

  /**
   * Global loading state for all exports
   */
  loading?: boolean;
}
