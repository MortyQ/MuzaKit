# Theme Feature

Современная система управления темами для Vue 3 приложения с поддержкой светлой, темной и автоматической (системной) темы.

## ✨ Возможности

- 🌞 **Светлая тема** - классический светлый интерфейс
- 🌙 **Темная тема** - комфортная темная тема для работы в условиях низкой освещенности
- 🖥️ **Автоматический режим** - синхронизация с системными настройками
- 💾 **Сохранение настроек** - автоматическое сохранение выбранной темы в localStorage
- 🔄 **Плавные переходы** - анимированная смена тем
- ⚡ **Легковесная** - минимальное влияние на производительность

## 📦 Структура

```
features/theme/
├── components/
│   └── ThemeToggle.vue      # Компонент переключателя темы
├── composables/
│   └── useTheme.ts          # Pinia store для управления темой
├── utils/
│   └── createThemes.ts      # Tailwind CSS plugin для тем
├── index.ts                 # Публичное API
└── README.md                # Документация
```

## 🚀 Использование

### Базовое использование

```vue
<script setup lang="ts">
import { ThemeToggle } from '@/features/theme';
</script>

<template>
  <ThemeToggle />
</template>
```

### С настройками

```vue
<template>
  <!-- Компактный режим (только иконка) -->
  <ThemeToggle compact />
  
  <!-- С подписью -->
  <ThemeToggle show-label />
  
  <!-- С подписью и на всю ширину -->
  <ThemeToggle show-label class="w-full" />
</template>
```

### Программное управление темой

```vue
<script setup lang="ts">
import { useThemeStore } from '@/features/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const { themeMode, isDark, isLight, isAuto } = storeToRefs(themeStore);
const { setThemeMode, toggleTheme, initTheme } = themeStore;

// Установить конкретную тему
setThemeMode('dark');
setThemeMode('light');
setThemeMode('auto');

// Переключить тему (light -> dark -> auto -> light)
toggleTheme();

// Инициализировать тему при загрузке приложения
onMounted(() => {
  initTheme();
});
</script>
```

## 🎨 Props компонента ThemeToggle

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `showLabel` | `boolean` | `false` | Показывать текстовую подпись рядом с иконкой |
| `compact` | `boolean` | `false` | Компактный режим (меньший размер, только иконка) |

## 🔧 API Store

### State

- `themeMode: Ref<ThemeMode>` - Текущий режим темы (`'light'` \| `'dark'` \| `'auto'`)
- `resolvedTheme: Ref<ResolvedTheme>` - Реальная применяемая тема (`'light'` \| `'dark'`)

### Computed

- `isDark: ComputedRef<boolean>` - Активна ли темная тема
- `isLight: ComputedRef<boolean>` - Активна ли светлая тема
- `isAuto: ComputedRef<boolean>` - Включен ли автоматический режим

### Methods

- `setThemeMode(mode: ThemeMode)` - Установить конкретный режим темы
- `toggleTheme()` - Переключить тему в цикле (light → dark → auto → light)
- `initTheme()` - Инициализировать тему из localStorage или системных настроек

## 🎯 Интеграция с сайдбаром

Theme toggle автоматически добавляется в футер сайдбара. Для управления отображением используйте параметр `showThemeToggle` в конфигурации:

```typescript
const sidebarConfig = computed<SidebarConfig>(() => ({
  brandName: "Vue Starter",
  items: navigationItems,
  footerItems: footerItems.value,
  showThemeToggle: true, // По умолчанию true
}));
```

## 🎨 Кастомизация цветов

Цвета тем настраиваются в `tailwind.config.js` через плагин `createThemes`:

```javascript
createThemes({
  light: {
    primary: '#2563eb',
    'base-100': '#ffffff',
    // ... другие цвета
  },
  dark: {
    primary: '#60a5fa',
    'base-100': '#1e293b',
    // ... другие цвета
  },
})
```

## 💡 Архитектурное решение

### Почему это Feature, а не Shared/UI?

Theme находится в `features/` потому что:

1. **Имеет бизнес-логику** - управление состоянием через Pinia
2. **Работает с данными** - сохранение в localStorage
3. **Комплексная функциональность** - определение системной темы, синхронизация
4. **Не просто UI компонент** - это полноценная feature с логикой

`shared/ui` подходит только для "глупых" UI компонентов без состояния (VButton, VInput, VCard).

## 🔍 Технические детали

### Работа с системной темой

При выборе режима `auto`, тема автоматически синхронизируется с системными настройками:

```typescript
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (themeMode.value === "auto") {
    resolvedTheme.value = e.matches ? "dark" : "light";
    updateDocumentTheme(resolvedTheme.value);
  }
});
```

### Применение темы к DOM

Тема применяется через data-атрибут на `<html>` элементе:

```typescript
function updateDocumentTheme(theme: ResolvedTheme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
```

### Анимации

Используются Vue Transition для плавной смены иконок:

- Вращение на 90° при смене
- Масштабирование от 0 до 1
- Изменение прозрачности
- Длительность 300ms

## 📝 Примеры использования

### В Header компоненте

```vue
<template>
  <header class="header">
    <nav>
      <!-- Навигация -->
    </nav>
    <ThemeToggle />
  </header>
</template>
```

### В выпадающем меню пользователя

```vue
<template>
  <div class="user-menu">
    <ThemeToggle show-label class="w-full" />
  </div>
</template>
```

### В настройках приложения

```vue
<script setup lang="ts">
import { useThemeStore } from '@/features/theme';

const themeStore = useThemeStore();
const { themeMode } = storeToRefs(themeStore);
const { setThemeMode } = themeStore;

const themeOptions = [
  { value: 'light', label: 'Светлая', icon: '☀️' },
  { value: 'dark', label: 'Темная', icon: '🌙' },
  { value: 'auto', label: 'Системная', icon: '🖥️' },
];
</script>

<template>
  <div class="settings-section">
    <h3>Тема оформления</h3>
    <div class="theme-options">
      <button
        v-for="option in themeOptions"
        :key="option.value"
        :class="{ active: themeMode === option.value }"
        @click="setThemeMode(option.value)"
      >
        {{ option.icon }} {{ option.label }}
      </button>
    </div>
  </div>
</template>
```

## 🐛 Устранение неполадок

### Тема не сохраняется

Убедитесь, что `initTheme()` вызывается при монтировании приложения:

```typescript
// В ThemeToggle.vue или App.vue
onMounted(() => {
  themeStore.initTheme();
});
```

### Анимации работают неправильно

Проверьте, что Tailwind CSS properly настроен и включает необходимые утилиты для transition.

### Системная тема не синхронизируется

Убедитесь, что браузер поддерживает `matchMedia` API и у пользователя есть соответствующие системные настройки.

## 🔄 Миграция со старой версии

Если вы используете старую версию с только `light`/`dark`:

```typescript
// Старая версия
const { isDark, toggleTheme } = useTheme();

// Новая версия - совместимо!
const themeStore = useThemeStore();
const { isDark, toggleTheme } = themeStore;
// toggleTheme теперь циклически переключает: light -> dark -> auto -> light
```

