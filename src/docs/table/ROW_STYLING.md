# Row Styling Documentation

## Overview

The Table component supports custom styling for individual rows through the `rowClassName` prop. This allows you to conditionally apply CSS classes to rows based on their data or state.

## Usage

### Static Class (String)

Apply the same class to all rows:

```vue
<Table
  :columns="columns"
  :data="data"
  rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800"
/>
```

### Dynamic Class (Function)

Apply classes conditionally based on row data:

```vue
<script setup lang="ts">
import type { ExpandableRow } from "@/widgets/table/types";

const rowClassName = (row: ExpandableRow, index: number): string => {
  // Highlight modified rows
  if (row.isModified) {
    return "bg-blue-100 dark:bg-blue-900";
  }
  
  // Highlight error rows
  if (row.hasError) {
    return "bg-red-50 dark:bg-red-900/20";
  }
  
  // Alternate row colors
  if (index % 2 === 0) {
    return "bg-gray-50 dark:bg-gray-800/50";
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
```

## Real-World Examples

### 1. Highlight Edited Rows

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { ExpandableRow } from "@/widgets/table/types";

interface CampaignRow extends ExpandableRow {
  CAMPAIGN_ID: string;
  isModified?: boolean;
}

const editedRows = ref<Record<string, { isModified: boolean }>>({});

const rowClassName = (row: CampaignRow): string => {
  if (editedRows.value[row.CAMPAIGN_ID]?.isModified) {
    return "bg-[#9dccfdff] dark:bg-hover";
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
```

### 2. Status-Based Styling

```vue
<script setup lang="ts">
const rowClassName = (row: ExpandableRow): string => {
  switch (row.status) {
    case "active":
      return "bg-green-50 dark:bg-green-900/20";
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-900/20";
    case "inactive":
      return "bg-gray-50 dark:bg-gray-800/50";
    case "error":
      return "bg-red-50 dark:bg-red-900/20";
    default:
      return "";
  }
};
</script>
```

### 3. Multiple Conditions

```vue
<script setup lang="ts">
const rowClassName = (row: ExpandableRow, index: number): string => {
  const classes: string[] = [];
  
  // Add selection highlight
  if (row.isSelected) {
    classes.push("ring-2 ring-primary-500");
  }
  
  // Add modification highlight
  if (row.isModified) {
    classes.push("bg-blue-50 dark:bg-blue-900/20");
  }
  
  // Add hover effect
  classes.push("hover:bg-gray-50 dark:hover:bg-gray-800");
  
  return classes.join(" ");
};
</script>
```

### 4. Zebra Striping

```vue
<script setup lang="ts">
const rowClassName = (row: ExpandableRow, index: number): string => {
  return index % 2 === 0 
    ? "bg-white dark:bg-gray-900" 
    : "bg-gray-50 dark:bg-gray-800/50";
};
</script>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowClassName` | `string \| ((row: ExpandableRow, index: number) => string)` | `undefined` | Class name(s) to apply to table rows. Can be a static string or a function that returns a class name based on row data and index. |

### Function Signature

```typescript
type RowClassNameFunction = (row: ExpandableRow, index: number) => string;
```

**Parameters:**
- `row`: The row data object (type: `ExpandableRow`)
- `index`: The row index in the current view (0-based)

**Returns:**
- A string containing space-separated CSS class names

## Tips

1. **Performance**: Keep the function pure and avoid heavy computations
2. **Tailwind Classes**: Use Tailwind utility classes for quick styling
3. **Dark Mode**: Always provide dark mode variants for better UX
4. **Accessibility**: Ensure sufficient color contrast for highlighted rows
5. **Multiple Classes**: Return space-separated class names for multiple styles

## Related

- [Table Full Documentation](./TABLE_FULL_DOCUMENTATION.md)
- [Getting Started](./GETTING_STARTED.md)

