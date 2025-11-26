# 🎯 API Architecture - Quick Start

## ⚡ TL;DR

Новая типобезопасная архитектура для работы с API в Vue 3.

### До:
```ts
const loading = ref(false);
const users = ref([]);

const load = async () => {
  loading.value = true;
  try {
    const response = await axiosIns.get('/users');
    users.value = response.data;
  } finally {
    loading.value = false;
  }
};
```

### После:
```ts
const { data: users, loading } = useApi<User[]>('/users', {
  immediate: true
});
```

---

## 📦 Что включено

✅ **useApi** - универсальный composable для любых запросов  
✅ **useAuthApi** - специализированный composable для auth  
✅ **Типизированные сервисы** - authService, userService  
✅ **TokenManager** - централизованное управление токенами  
✅ **ErrorHandler** - умная обработка ошибок  
✅ **Interceptors** - автоматический refresh токенов  
✅ **Полная типобезопасность** - TypeScript first  

---

## 🚀 Примеры

### 1. GET запрос
```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading, error } = useApi('/users', { immediate: true });
</script>
```

### 2. POST запрос
```vue
<script setup lang="ts">
import { usePost } from '@/shared/composables';

const { execute: createUser, loading } = usePost('/users', {
  onSuccess: (user) => console.log('Created:', user)
});

await createUser({ data: { name: 'John', email: 'john@example.com' } });
</script>
```

### 3. Auth
```vue
<script setup lang="ts">
import { useAuthApi } from '@/shared/composables';

const authApi = useAuthApi();

await authApi.login({ email, password });
await authApi.logout();
</script>
```

### 4. Прямой вызов сервиса
```ts
import { authService } from '@/shared/api/services';

const user = await authService.getMe();
```

---

## 📁 Структура

```
src/shared/api/
├── client.ts           # Axios instance
├── interceptors.ts     # Request/Response interceptors
├── types.ts           # Типы
├── tokenManager.ts    # Управление токенами
├── errorHandler.ts    # Обработка ошибок
└── services/          # API сервисы
    ├── auth.service.ts
    └── user.service.ts

src/shared/composables/
├── useApi.ts          # Основной composable
├── useAuthApi.ts      # Auth composable
└── useApiState.ts     # State management
```

---

## 🎯 Основные фичи

### Автоматическое управление состоянием
```ts
const { data, loading, error, hasData, hasError } = useApi('/users');
```

### Отмена запросов
```ts
const { execute, abort } = useApi('/users', { immediate: false });

execute();
abort(); // Отменить запрос
```

### Retry логика
```ts
useApi('/api/endpoint', {
  retry: 3,
  retryDelay: 1000
});
```

### Debouncing
```ts
useApi('/search', {
  debounce: 500 // 500ms
});
```

### Callbacks
```ts
useApi('/users', {
  onSuccess: (data) => console.log('Success', data),
  onError: (error) => console.error('Error', error),
  onBefore: () => console.log('Starting...'),
  onFinish: () => console.log('Done')
});
```

---

## 🔐 Авторизация

### Автоматический refresh токенов
Токены автоматически обновляются при получении 401 ошибки.

### Race condition protection
Множественные запросы не вызовут несколько refresh одновременно.

### Queue mechanism
Запросы, пришедшие во время refresh, ждут в очереди и автоматически повторяются.

---

## 📚 Документация

- 📖 [Полная документация](./src/docs/API_ARCHITECTURE.md)
- 🔄 [Migration Guide](./MIGRATION_GUIDE.md)
- 🎨 [Примеры](./src/pages/Examples/ApiArchitectureExample.vue)

---

## ✨ Преимущества

✅ Меньше boilerplate кода  
✅ Автоматическая отмена запросов при unmount  
✅ Типобезопасность на всех уровнях  
✅ Централизованная обработка ошибок  
✅ Toast уведомления из коробки  
✅ Легко тестировать  
✅ Обратная совместимость  

---

## 🎓 Рекомендации

1. **В компонентах** → используйте `useApi`, `usePost`, etc.
2. **В Pinia stores** → используйте типизированные сервисы
3. **Для auth** → используйте `useAuthApi`

---

Готово! 🚀 Начните с примеров на `/examples/api`

