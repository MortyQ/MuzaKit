/**
 * Centralized route names enum
 * All route names should be defined here and referenced from routes
 * This ensures type safety and prevents typos
 */
export enum RouteNames {
  // Core
  HOME = "Home",
  ABOUT = "About",
  DASHBOARD = "Dashboard",
  NOT_FOUND = "NotFound",

  // Components
  COMPONENTS_PARENT = "components-parent",
  UI_GALLERY_DISPLAY_PARENT = "ui-gallery-display-parent",
  UI_GALLERY_OVERVIEW = "ui-gallery-overview",
  UI_GALLERY_FEEDBACK = "ui-gallery-feedback",
  UI_GALLERY_FORMS = "ui-gallery-forms",
  UI_GALLERY_DISPLAY = "ui-gallery-display",
  UI_GALLERY_LAYOUT = "ui-gallery-layout",
  TABLE_PARENT = "table-parent",
  TABLE_EXAMPLES = "table-examples",
  TABLE_DOCUMENTATION = "table-documentation",
}
