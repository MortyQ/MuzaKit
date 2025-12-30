export default `# Row Styling

## Overview

The Table component supports custom styling for individual rows through the \`rowClassName\` prop. This allows you to conditionally apply CSS classes to rows based on their data or state.

## 🎯 Basic Concept

\`\`\`typescript
// Static class (applied to all rows)
rowClassName="bg-blue-50 dark:bg-blue-900/20"

// Dynamic function (conditional styling)
:rowClassName="(row, index) => condition ? 'classes' : ''"
\`\`\`

## 📝 API

### Prop Definition

\`\`\`typescript
rowClassName?: string | ((row: ExpandableRow, index: number) => string)
\`\`\`

**Parameters:**
- \`row\`: Row data object
- \`index\`: Row index (0-based)

**Returns:** Space-separated CSS class names

## 💡 Usage Examples

### 1. Static Class (All Rows)

\`\`\`vue
<Table
  :columns="columns"
  :data="data"
  rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800"
/>
\`\`\`

### 2. Conditional Styling (Function)

\`\`\`vue
<script setup lang="ts">
import type { ExpandableRow } from "@/widgets/table/types";

const rowClassName = (row: ExpandableRow, index: number): string => {
  // Highlight high performance
  if (row.performance > 4.5) {
    return "bg-green-50 dark:bg-green-900/20";
  }
  
  // Highlight low performance
  if (row.performance < 4.0) {
    return "bg-red-50 dark:bg-red-900/20";
  }
  
  return "";
};
</script>

<template>
  <Table
    :columns="columns"
    :data="data"
    :rowClassName="rowClassName"
  />
</template>
\`\`\`

### 3. Status-Based Styling

\`\`\`typescript
const rowClassName = (row: ExpandableRow): string => {
  switch (row.status) {
    case "active":
      return "bg-green-50 dark:bg-green-900/20";
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-900/20";
    case "error":
      return "bg-red-50 dark:bg-red-900/20";
    default:
      return "";
  }
};
\`\`\`

### 4. Modified Rows Highlight

\`\`\`typescript
const editedRows = ref<Record<string, boolean>>({});

const rowClassName = (row: ExpandableRow): string => {
  if (editedRows.value[row.id]) {
    return "bg-blue-100 dark:bg-blue-900/30";
  }
  return "";
};
\`\`\`

### 5. Zebra Striping

\`\`\`typescript
const rowClassName = (row: ExpandableRow, index: number): string => {
  return index % 2 === 0 
    ? "bg-white dark:bg-gray-900" 
    : "bg-gray-50 dark:bg-gray-800/50";
};
\`\`\`

### 6. Multiple Conditions

\`\`\`typescript
const rowClassName = (row: ExpandableRow, index: number): string => {
  const classes: string[] = [];
  
  if (row.isSelected) {
    classes.push("ring-2 ring-primary-500");
  }
  
  if (row.isModified) {
    classes.push("bg-blue-50 dark:bg-blue-900/20");
  }
  
  classes.push("hover:bg-gray-50 dark:hover:bg-gray-800");
  
  return classes.join(" ");
};
\`\`\`

## 🎨 Recommended Tailwind Classes

### Background Colors
- \`bg-green-50 dark:bg-green-900/20\` - Success/Active
- \`bg-red-50 dark:bg-red-900/20\` - Error/Inactive
- \`bg-yellow-50 dark:bg-yellow-900/20\` - Warning/Pending
- \`bg-blue-50 dark:bg-blue-900/20\` - Info/Modified
- \`bg-gray-50 dark:bg-gray-800/50\` - Neutral/Zebra

### Hover Effects
- \`hover:bg-green-100 dark:hover:bg-green-900/30\`
- \`hover:bg-red-100 dark:hover:bg-red-900/30\`
- \`hover:bg-gray-50 dark:hover:bg-gray-800\`

### Additional Styles
- \`ring-2 ring-primary-500\` - Selection
- \`opacity-50\` - Disabled state
- \`font-semibold\` - Emphasis

## ⚡ Performance Tips

1. **Keep functions pure** - No side effects
2. **Avoid heavy computations** - Cache results if needed
3. **Use simple conditions** - Fast evaluation
4. **Return empty string** - When no styling needed

## 🎯 Best Practices

1. **Always include dark mode variants**
   \`\`\`typescript
   "bg-green-50 dark:bg-green-900/20"
   \`\`\`

2. **Use semantic colors**
   - Green for success/positive
   - Red for errors/negative
   - Yellow for warnings
   - Blue for information

3. **Ensure accessibility**
   - Sufficient contrast ratios
   - Don't rely on color alone

4. **Consider hover states**
   \`\`\`typescript
   "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
   \`\`\`

## 🔧 Implementation Details

- Classes are applied to **each cell** in the row
- Data attribute \`data-custom-row="true"\` disables default hover
- Works seamlessly with Tailwind CSS
- Supports all CSS classes (not just Tailwind)

## 📚 Related

- [Table Full Documentation](./TABLE_FULL_DOCUMENTATION.md)
- [Getting Started](./GETTING_STARTED.md)
- [Flex Columns](./FLEX_COLUMNS.md)
`;
