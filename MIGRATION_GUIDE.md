# 🚀 Migration Guide - API Architecture

## ✅ Что уже сделано

### Созданные файлы:

```
src/shared/api/
├── client.ts (✓ обновлен)
├── interceptors.ts (✓ создан)
├── types.ts (✓ создан)
├── tokenManager.ts (✓ создан)
├── errorHandler.ts (✓ создан)
├── index.ts (✓ обновлен)
└── services/
    ├── auth.service.ts (✓ создан)
    ├── user.service.ts (✓ создан)
    └── index.ts (✓ создан)

src/shared/composables/
├── useApi.ts (✓ создан)
├── useAuthApi.ts (✓ создан)
├── useApiState.ts (✓ создан)
└── index.ts (✓ обновлен)

src/app/
└── main.ts (✓ обновлен - добавлена инициализация API)

src/docs/
└── API_ARCHITECTURE.md (✓ создана полная документация)

src/pages/Examples/
└── ApiArchitectureExample.vue (✓ создан пример использования)
```

---

## 📋 Пошаговая миграция

### Шаг 1: Обновить authStore (необязательно, но рекомендуется)

Текущий файл: `src/features/auth/store/authStore.ts`

**Было:**
```ts
import axiosIns from "@/shared/api/client";

const login = async (email: string, password: string) => {
  const response = await axiosIns.post("/auth/login", { email, password });
  // ...
};
```

**Стало:**
```ts
import { authService } from "@/shared/api/services";

const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    // tokenManager автоматически сохранит токены через useAuthApi
    user.value = response.user;
    return true;
  } catch (error) {
    // Ошибки автоматически обработаны и показаны через toast
    return false;
  }
};
```

---

### Шаг 2: Обновить компоненты с API вызовами

#### Вариант A: Простой GET запрос

**Было:**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import axiosIns from '@/shared/api/client';

const users = ref([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await axiosIns.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>
```

**Стало:**
```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

interface User {
  id: string;
  name: string;
  email: string;
}

const { data: users, loading, error } = useApi<User[]>('/users', {
  immediate: true,
});
</script>
```

#### Вариант B: POST запрос

**Было:**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import axiosIns from '@/shared/api/client';

const loading = ref(false);

const createUser = async (userData: any) => {
  loading.value = true;
  try {
    const response = await axiosIns.post('/users', userData);
    console.log('Created:', response.data);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
```

**Стало:**
```vue
<script setup lang="ts">
import { usePost } from '@/shared/composables';

interface CreateUserData {
  name: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const { loading, execute: createUser } = usePost<User, CreateUserData>('/users', {
  immediate: false,
  onSuccess: (user) => {
    console.log('Created:', user);
  },
});

// Использование
const handleSubmit = () => {
  createUser({ data: { name: 'John', email: 'john@example.com' } });
};
</script>
```

---

### Шаг 3: Обновить Login страницу

`src/pages/Login/index.vue`

**Добавить:**
```vue
<script setup lang="ts">
import { useAuthApi } from '@/shared/composables';
import { useAuthStore } from '@/features/auth/store';

const authApi = useAuthApi();
const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const result = await authApi.login({
    email: email.value,
    password: password.value
  });

  if (result) {
    // Инициализируем store с данными пользователя
    await authStore.initialize();
    
    // Редирект
    router.push('/dashboard');
  }
  // Ошибки автоматически показаны через toast
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" required />
    <input v-model="password" type="password" required />
    <button :disabled="authApi.isLoading">
      {{ authApi.isLoading ? 'Logging in...' : 'Login' }}
    </button>
    <div v-if="authApi.error">{{ authApi.error }}</div>
  </form>
</template>
```

---

### Шаг 4: Добавить роут для примеров (опционально)

`src/app/router/components/index.ts`

**Добавить:**
```ts
{
  path: "/examples/api",
  name: "api-examples",
  component: () => import("@/pages/Examples/ApiArchitectureExample.vue"),
  meta: {
    title: "API Examples",
  },
},
```

---

## 🔄 Обратная совместимость

Старый код продолжит работать! 

```ts
// Старый способ - всё ещё работает
import axiosIns from '@/shared/api/client';
const response = await axiosIns.get('/users');

// Новый способ - рекомендуется
import { useApi } from '@/shared/composables';
const { data } = useApi('/users', { immediate: true });
```

---

## ⚡ Быстрый старт

### 1. Использование в компоненте:

```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading, error } = useApi('/users', {
  immediate: true,
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### 2. Использование в Pinia Store:

```ts
import { defineStore } from 'pinia';
import { authService } from '@/shared/api/services';

export const useMyStore = defineStore('my-store', () => {
  const user = ref(null);

  const loadUser = async () => {
    try {
      user.value = await authService.getMe();
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  return { user, loadUser };
});
```

### 3. Прямой вызов сервиса:

```ts
import { userService } from '@/shared/api/services';

const updateProfile = async (name: string) => {
  try {
    const user = await userService.updateProfile({ name });
    console.log('Updated:', user);
  } catch (error) {
    // Ошибка автоматически показана через toast
  }
};
```

---

## 🎯 Приоритеты миграции

### Высокий приоритет:
1. ✅ `main.ts` - уже обновлен
2. ⏳ Login/Register компоненты
3. ⏳ Auth store

### Средний приоритет:
4. ⏳ Компоненты с частыми API вызовами
5. ⏳ Формы с POST/PUT запросами

### Низкий приоритет:
6. ⏳ Статичные компоненты
7. ⏳ Редко используемые страницы

---

## 🐛 Troubleshooting

### Ошибка: "Cannot find module"

**Решение:** Перезапустите TypeScript server в IDE или выполните:
```bash
pnpm exec vue-tsc --noEmit
```

### Ошибка: "token is not defined"

**Решение:** Убедитесь что `setupApiClient()` вызван в `main.ts` до монтирования приложения.

### Ошибка 401 после refresh

**Решение:** Проверьте что ваш backend возвращает правильный формат для `/auth/refresh`:
```json
{
  "accessToken": "...",
  "refreshToken": "...", // optional
  "expiresIn": 3600 // optional, в секундах
}
```

---

## 📚 Дополнительные ресурсы

- 📖 [Полная документация](./src/docs/API_ARCHITECTURE.md)
- 🎨 [Примеры использования](./src/pages/Examples/ApiArchitectureExample.vue)
- 🏗️ [Архитектурный обзор](./ARCHITECTURE.md)

---

## ✨ Следующие шаги

1. Протестируйте новую архитектуру на странице `/examples/api`
2. Постепенно мигрируйте критические компоненты
3. Обновите документацию проекта при необходимости
4. Добавьте новые сервисы по мере роста проекта

---

**Готово! 🎉** Ваша новая API архитектура полностью настроена и готова к использованию.

