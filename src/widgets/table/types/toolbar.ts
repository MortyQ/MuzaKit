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

