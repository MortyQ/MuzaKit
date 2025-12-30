/**
 * Styles for SidebarMenuFlyout component
 */

export const flyoutContainerClasses = {
  wrapper: "fixed z-[100]",
  bridge: (showOnLeft: boolean) => ["absolute top-0 h-full w-[24px]", showOnLeft ? "left-full ml-[-16px]" : "right-full mr-[-16px]"],
  content: "relative min-w-[200px] max-w-[280px] ml-2",
  menu: "sidebar-flyout bg-base-100/95 backdrop-blur-sm border border-base-300/50 rounded-lg py-2 max-h-[calc(100vh-100px)] overflow-y-auto",
  title: "px-4 py-2 border-b border-base-300 mb-1",
  titleText: "text-sm font-semibold text-neutral",
  list: "space-y-1 px-1",
};

export const flyoutItemClasses = {
  base: "w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors focus:outline-none relative cursor-pointer",
  interactive: "hover:bg-base-200 text-neutral/80 hover:text-neutral",
  active: "bg-primary/10 text-primary font-medium",
  disabled: "opacity-50 cursor-not-allowed pointer-events-none",
  nonClickable: "cursor-default",
  icon: "flex-shrink-0",
  label: "flex-1 text-left truncate",
  badge: "flex-shrink-0 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary",
};

export const transitionClasses = {
  enterActive: "transition-all duration-200 ease-out",
  enterFrom: "opacity-0 scale-95",
  enterTo: "opacity-100 scale-100",
  leaveActive: "transition-all duration-150 ease-in",
  leaveFrom: "opacity-100 scale-100",
  leaveTo: "opacity-0 scale-95",
};
