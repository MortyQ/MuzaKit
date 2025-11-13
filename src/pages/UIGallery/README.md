# UI Gallery Structure

## 📁 Organization

UI Gallery uses a **parent-child routing structure** with separate pages for each category:

```
src/pages/UIGallery/
├── index.vue                          # Overview page with category cards
├── Feedback.vue                       # Feedback components page (/ui-gallery/feedback)
├── Forms.vue                          # Form components page (/ui-gallery/forms)
├── Display.vue                        # Display components page (/ui-gallery/display)
├── Layout.vue                         # Layout components page (/ui-gallery/layout)
├── README.md                          # This file
└── components/
    ├── FeedbackComponents/            # User feedback & notifications
    │   ├── ModalsTab.vue             ✅ Complete
    │   └── ToastsTab.vue             ✅ Complete
    │
    ├── FormComponents/                # Form inputs & controls
    │   ├── MultiSelectTab.vue        ✅ Complete
    │   └── FileInputsTab.vue         ✅ Complete
    │
    ├── DisplayComponents/             # Content display & presentation
    │   ├── CardsTab.vue              ✅ Complete
    │   └── IconsTab.vue              ✅ Complete
    │
    └── LayoutComponents/              # Layout & structure
        └── (to be added)
```

## 🗺️ Routing Structure

```
/components/ui-gallery/
├── overview        → index.vue (Category overview with navigation cards)
├── feedback        → Feedback.vue (Modals, Toasts)
├── forms           → Forms.vue (MultiSelect, FileInputs)
├── display         → Display.vue (Cards, Icons)
└── layout          → Layout.vue (Coming soon)
```

Each category page uses tabs for individual component documentation.

## 📋 Categories

### 1. **FeedbackComponents**
Components for user feedback, notifications, and dialogs:
- **Modals** - Dialog windows and overlays
- **Toasts** - Temporary notifications
- Alerts (planned)
- Loaders (planned)

### 2. **FormComponents**
Form inputs, controls, and validation:
- **Multi Select** - Dropdown with single/multiple selection
- **File Inputs** - File upload components
- Buttons (planned)
- Inputs (planned)
- Checkboxes/Radios (planned)

### 3. **DisplayComponents**
Components for displaying content and data:
- **Cards** - Content containers
- **Icons** - Icon system
- Badges (planned)
- Avatars (planned)
- Tables (exists as separate page)

### 4. **LayoutComponents**
Structural components for page layout:
- Containers (planned)
- Dividers (planned)
- Spacers (planned)

## 🎨 Documentation Standard

Each component tab follows a consistent documentation structure based on **ModalsTab.vue**:

### Required Sections:

1. **Info Card** 
   - Component overview
   - 4 key features with icons
   - Info note with helpful tip

2. **Basic Usage** 
   - Simple code example
   - Copy-paste ready snippet

3. **Advanced Examples**
   - Complex use cases
   - Configuration options

4. **Props Documentation**
   - Table with all props
   - Types, defaults, descriptions

5. **Live Examples**
   - Interactive demonstrations
   - Multiple variants/states

6. **Additional Documentation** (if applicable)
   - Composables documentation
   - Slots documentation
   - Events documentation

7. **Features Summary**
   - Checklist of key features

### Styling

All documentation tabs use shared styles from:
```scss
@import "@/shared/assets/styles/shared-info-card-styles.scss";
```

This ensures consistent styling across all documentation pages.

## 🚀 Adding New Components

To add a new component to UI Gallery:

1. **Choose the category** (Feedback, Form, Display, or Layout)

2. **Create the tab file** in the appropriate folder:
   ```
   components/[Category]/[ComponentName]Tab.vue
   ```

3. **Use the template structure** from `ModalsTab.vue`:
   - Info card with features
   - Code examples
   - Props table
   - Live examples
   - Features summary

4. **Import shared styles**:
   ```scss
   @import "@/shared/assets/styles/shared-info-card-styles.scss";
   ```

5. **Add to index.vue**:
   ```typescript
   import NewComponentTab from "@/pages/UIGallery/components/[Category]/NewComponentTab.vue";
   
   const tabs = [
     // ...
     { id: "newComponent", label: "New Component", icon: "lucide:icon-name" },
   ];
   
   const componentMap = {
     // ...
     newComponent: NewComponentTab,
   };
   ```

## 🎯 Best Practices

1. **Consistent naming**: Use `[ComponentName]Tab.vue` format
2. **Complete examples**: Include both basic and advanced use cases
3. **Live demos**: Show all variants and states
4. **Props table**: Document every prop with type and default
5. **Code snippets**: Make them copy-paste ready
6. **Icons**: Use appropriate Lucide icons for consistency

## 📊 Current Status

| Category | Components | Status |
|----------|-----------|---------|
| Feedback | Modals, Toasts | ✅ Complete |
| Form     | MultiSelect, FileInputs | ✅ Complete |
| Display  | Cards, Icons | ✅ Complete |
| Layout   | - | 🔄 Planned |

## 🔄 Migration from Components Page

Components from the old `/components` page should be migrated to UI Gallery:
- [ ] VButton → FormComponents/ButtonsTab.vue
- [ ] VInput → FormComponents/InputsTab.vue
- [ ] VCheckbox → FormComponents/CheckboxesTab.vue
- [ ] Other components as needed

Each migrated component should follow the documentation standard outlined above.

