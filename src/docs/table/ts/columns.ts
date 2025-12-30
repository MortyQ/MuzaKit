export default `# Flexible Columns (AG-Grid Style)

## Overview

Our table uses an **intuitive approach** to column widths:
- **By default** - all columns are flexible, fill space equally, **NOT resizable**
- **With \`width\`** - column is fixed, **can be resized**

## 🎯 Concept

### Simple Rule

| Definition | Behavior | Resizable |
|------------|----------|-----------|
| \`{ key: "name" }\` | Flexible (flex: 1) | ❌ No |
| \`{ key: "id", width: "80px" }\` | Fixed | ✅ Yes |

### Why This Way?

**Maximally simple API:**
- No need to specify \`flex\`, \`minWidth\` - everything works by default
- Want fixed width? Add \`width\`
- Want flexible? Simply don't specify anything!

Inspired by **AG-Grid**, but even simpler!

## 📝 API

### Column Interface

\`\`\`typescript
interface Column {
  key: string
  label: string
  
  // Optional: Fixed width (makes column resizable)
  width?: string         // "150px"
}
\`\`\`

**That's it! Can't be simpler!** 🎉

### Default (Flexible)

\`\`\`typescript
{ key: "name", label: "Name" }
// → minmax(100px, 1fr) in CSS Grid
// → NOT resizable
\`\`\`

### With Width (Fixed)

\`\`\`typescript
{ key: "id", label: "ID", width: "80px" }
// → 80px in CSS Grid
// → Resizable
\`\`\`

## 🚀 Usage Examples

### 1. All Flexible Columns (Default)

\`\`\`vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];
</script>
\`\`\`

**Result:**
- Columns fill entire table width equally
- Columns adjust when window size changes
- Resize is NOT available
- **Minimal code!** 🎉

### 2. Mixed Mode (Recommended)

\`\`\`vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px" },      // Fixed, resizable
  { key: "name", label: "Name" },                 // Flexible
  { key: "email", label: "Email" },               // Flexible
  { key: "status", label: "Status", width: "120px" }, // Fixed, resizable
  { key: "actions", label: "Actions", width: "100px" }, // Fixed, resizable
];
</script>
\`\`\`

**Result:**
- ID, Status, Actions - fixed, can be resized
- Name, Email - flexible, share remaining space equally
- When resizing fixed columns, flexible columns automatically adjust

### 3. All Fixed Columns

\`\`\`vue
<script setup lang="ts">
const columns: Column[] = [
  { key: "id", label: "ID", width: "60px" },
  { key: "name", label: "Name", width: "200px" },
  { key: "email", label: "Email", width: "250px" },
];
</script>
\`\`\`

**Result:**
- All columns have fixed width
- All columns can be resized
- Table may have horizontal scroll

## 🎨 Visual Differences

### Flexible Columns
- ❌ **NO resize handle** (double lines on the right)
- ✅ Automatically stretch/shrink
- ✅ Hover on border does NOT change cursor

### Fixed Columns
- ✅ **HAS resize handle** (double lines on the right)
- ✅ Can be resized with mouse
- ✅ Hover on border changes cursor to \`col-resize\`

## 📊 Width Calculation

### CSS Grid Formula

\`\`\`
Fixed columns: 60px + 120px + 100px = 280px
Remaining space: Container width - 280px

Each flexible column gets: Remaining / Number of flexible columns
\`\`\`

### Example

Container 1000px with mixed columns:
\`\`\`typescript
[
  { key: "id", width: "60px" },      // 60px
  { key: "name" },                    // Flexible
  { key: "email" },                   // Flexible
  { key: "actions", width: "120px" }, // 120px
]
\`\`\`

- Fixed: 60px + 120px = 180px
- Remaining: 1000px - 180px = 820px
- Name: 410px (820px / 2)
- Email: 410px (820px / 2)

## 🔧 Advanced

### Built-in minWidth Protection

All flexible columns have a built-in minimum width of 100px:

\`\`\`typescript
{ key: "name" }
// → minmax(100px, 1fr)
// Never shrinks below 100px
\`\`\`

## ✅ Best Practices

### ✅ Recommended

1. **Use default (flexible) for content columns**
   \`\`\`typescript
   { key: "description" }
   { key: "comment" }
   \`\`\`

2. **Use width for technical columns**
   \`\`\`typescript
   { key: "id", width: "60px" }
   { key: "checkbox", width: "50px" }
   { key: "actions", width: "120px" }
   \`\`\`

3. **Keep it simple - don't over-specify**
   \`\`\`typescript
   { key: "name" }  // That's all you need!
   \`\`\`

4. **Mix both types for optimal layout**
   \`\`\`typescript
   [
     { key: "id", width: "60px" },
     { key: "name" },
     { key: "email" },
     { key: "actions", width: "100px" }
   ]
   \`\`\`

### ❌ Not Recommended

1. **Don't use flexible columns for narrow content**
   \`\`\`typescript
   // ❌ Bad
   { key: "id" }  // ID shouldn't stretch
   
   // ✅ Good
   { key: "id", width: "60px" }
   \`\`\`

2. **Don't make all columns fixed if responsive layout is needed**
   \`\`\`typescript
   // ❌ Bad - not responsive
   { key: "name", width: "200px" }
   { key: "email", width: "250px" }
   
   // ✅ Good - responsive
   { key: "name" }
   { key: "email" }
   \`\`\`

## 🎯 When to Use Flexible vs Fixed Width

| Scenario | Use |
|----------|-----|
| Table should fill entire width | Default (no width) |
| User should not change width | Default (no width) |
| Responsive table | Default (no width) |
| Column with long text | Default (no width) |
| ID, checkboxes, icons | \`width\` |
| Status, badges | \`width\` |
| Action buttons | \`width\` |
| User should customize width | \`width\` |

## 📚 Comparison with Other Libraries

| Library | Concept | Our Equivalent |
|---------|---------|----------------|
| AG-Grid | \`flex: 1\` | Default (no width) ✅ |
| TanStack Table | \`size\` + \`flexGrow\` | \`width\` + default |
| Material-UI | \`flex: 1\` | Default (no width) ✅ |
| Ant Design | no \`width\` = flex | Default (no width) ✅ |

Our API is closest to **AG-Grid** - the most popular table library!
`;
