# 🚀 API Architecture Documentation

## 📚 Обзор

Composable-First Architecture для работы с API в Vue 3 приложении.

### Основные преимущества

✅ **Полная типобезопасность** - TypeScript first approach  
✅ **Реактивность** - автоматическое управление состоянием (loading, error, data)  
✅ **Отмена запросов** - AbortController для предотвращения memory leaks  
✅ **Retry логика** - автоматические повторы с exponential backoff  
✅ **Race condition protection** - правильная обработка concurrent refresh токенов  
✅ **Модульность** - легко тестировать и расширять  
✅ **DX** - отличный developer experience с autocomplete

---

## 🏗️ Архитектура

```
src/shared/api/
├── client.ts              # Настроенный axios instance
├── interceptors.ts        # Модульные interceptors
├── types.ts              # Типы для API
├── tokenManager.ts       # Управление токенами
├── errorHandler.ts       # Обработка ошибок
└── services/             # Типизированные сервисы
    ├── auth.service.ts   # Auth API
    └── user.service.ts   # User API

src/shared/composables/
├── useApi.ts             # Универсальный API composable
├── useAuthApi.ts         # Auth специализированный composable
└── useApiState.ts        # Управление состоянием
```

---

## 📖 Примеры использования

### 1. Базовое использование - useApi

```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

interface User {
  id: string;
  name: string;
  email: string;
}

// Автоматический запрос при создании компонента
const { data, loading, error, hasData } = useApi<User[]>('/users', {
  immediate: true,
  onSuccess: (users) => {
    console.log('Loaded', users.length, 'users');
  }
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="hasData">
      <div v-for="user in data" :key="user.id">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>
```

### 2. Ручное выполнение запроса

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

const { data, loading, error, execute } = usePost<User, CreateUserData>('/users', {
  immediate: false,
  onSuccess: (user) => {
    console.log('User created:', user);
  }
});

const createUser = async () => {
  await execute({
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });
};
</script>

<template>
  <button @click="createUser" :disabled="loading">
    Create User
  </button>
</template>
```

### 3. Debounced Search

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/shared/composables';

const searchQuery = ref('');

const { data: results, loading } = useApi('/search', {
  immediate: false,
  debounce: 500, // 500ms debounce
});

const search = () => {
  execute({ params: { q: searchQuery.value } });
};
</script>

<template>
  <input 
    v-model="searchQuery" 
    @input="search"
    placeholder="Search..."
  />
  <div v-if="loading">Searching...</div>
  <div v-else>{{ results?.length }} results</div>
</template>
```

### 4. Отмена запроса

```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading, execute, abort } = useApi('/heavy-operation', {
  immediate: false,
  timeout: 30000, // 30 seconds timeout
});

const startOperation = () => {
  execute();
};

const cancelOperation = () => {
  abort('User cancelled operation');
};
</script>

<template>
  <button @click="startOperation" :disabled="loading">Start</button>
  <button @click="cancelOperation" v-if="loading">Cancel</button>
</template>
```

### 5. Retry логика

```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, error, execute } = useApi('/unstable-endpoint', {
  retry: 3, // Retry 3 times
  retryDelay: 1000, // 1 second between retries
  onError: (err) => {
    console.error('Failed after retries:', err);
  }
});
</script>
```

### 6. Auth API - Login

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthApi } from '@/shared/composables';
import { useAuthStore } from '@/features/auth/store';

const router = useRouter();
const authApi = useAuthApi();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const result = await authApi.login({
    email: email.value,
    password: password.value
  });

  if (result) {
    // Загружаем данные пользователя
    await authStore.initialize();
    
    // Редирект на dashboard
    router.push('/dashboard');
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit" :disabled="authApi.isLoading">
      {{ authApi.isLoading ? 'Logging in...' : 'Login' }}
    </button>
    <div v-if="authApi.error" class="error">
      {{ authApi.error }}
    </div>
  </form>
</template>
```

### 7. Типизированные сервисы - прямые вызовы

```ts
import { authService, userService } from '@/shared/api/services';

// В actions Pinia store или composable
const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    
    // TypeScript знает точный тип response
    console.log(response.user.name);
    console.log(response.accessToken);
    
    return response;
  } catch (error) {
    // Ошибка уже обработана errorHandler
    console.error('Login failed');
    return null;
  }
};

// Обновление профиля
const updateProfile = async (name: string) => {
  const user = await userService.updateProfile({ name });
  console.log('Updated user:', user);
};

// Загрузка аватара
const uploadAvatar = async (file: File) => {
  const { url } = await userService.uploadAvatar(file);
  console.log('Avatar URL:', url);
};
```

### 8. Использование в Pinia Store

```ts
import { defineStore } from 'pinia';
import { authService, type User } from '@/shared/api/services';
import { tokenManager } from '@/shared/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  const initialize = async () => {
    if (!tokenManager.hasTokens()) {
      return;
    }

    isLoading.value = true;
    try {
      user.value = await authService.getMe();
    } catch (error) {
      console.error('Failed to load user:', error);
      tokenManager.clearTokens();
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await authService.login({ email, password });
      
      // Токены уже сохранены в authService через useAuthApi
      user.value = response.user;
      
      return true;
    } catch {
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    initialize,
    login,
  };
});
```

### 9. Реактивный URL

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApi } from '@/shared/composables';

const userId = ref('123');
const url = computed(() => `/users/${userId.value}`);

// Запрос автоматически обновится при изменении userId
const { data: user, loading } = useApi(url, {
  immediate: true,
});

const changeUser = (id: string) => {
  userId.value = id; // Триггерит новый запрос
};
</script>
```

### 10. Кастомная обработка ошибок

```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';
import { toast } from 'vue-sonner';

const { execute } = useApi('/users', {
  skipErrorNotification: true, // Отключаем автоматический toast
  onError: (error) => {
    // Кастомная обработка
    if (error.status === 404) {
      toast.error('Users not found');
    } else if (error.status === 403) {
      toast.error('You do not have permission');
    } else {
      toast.error('Something went wrong');
    }
  }
});
</script>
```

---

## 🔧 Инициализация в приложении

### main.ts

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthApi } from '@/shared/composables';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Инициализация API клиента с обработкой ошибок auth
const authApi = useAuthApi();
authApi.initialize();

app.mount('#app');
```

---

## 🧪 Тестирование

### Пример теста для composable

```ts
import { describe, it, expect, vi } from 'vitest';
import { useApi } from '@/shared/composables';
import { tokenManager } from '@/shared/api';

describe('useApi', () => {
  it('should fetch data successfully', async () => {
    const { data, loading, execute } = useApi('/users', {
      immediate: false,
    });

    expect(loading.value).toBe(false);
    
    const result = await execute();
    
    expect(data.value).toBeTruthy();
    expect(loading.value).toBe(false);
  });

  it('should handle errors', async () => {
    const onError = vi.fn();
    
    const { error, execute } = useApi('/invalid', {
      immediate: false,
      onError,
    });

    await execute();
    
    expect(error.value).toBeTruthy();
    expect(onError).toHaveBeenCalled();
  });
});
```

### Мокирование tokenManager в тестах

```ts
import { TokenManager } from '@/shared/api/tokenManager';

class MockTokenStorage implements TokenStorage {
  private tokens: Map<string, string> = new Map();

  getAccessToken() {
    return this.tokens.get('access') || null;
  }

  setTokens(tokens: AuthTokens) {
    this.tokens.set('access', tokens.accessToken);
    this.tokens.set('refresh', tokens.refreshToken);
  }

  clearTokens() {
    this.tokens.clear();
  }
}

// В тестах
const mockManager = new TokenManager(new MockTokenStorage());
```

---

## 📊 Миграция с текущего API

### Было (старый подход)

```ts
import axiosIns from '@/shared/api/client';

// В компоненте
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
```

### Стало (новый подход)

```ts
import { useApi } from '@/shared/composables';

const { data: users, loading } = useApi('/users', {
  immediate: true,
});
```

Преимущества:
- ✅ Меньше boilerplate кода
- ✅ Автоматическая отмена при unmount
- ✅ Типобезопасность
- ✅ Декларативный API

---

## 🎯 Best Practices

### 1. Используйте типизированные сервисы для store actions

```ts
// ❌ Плохо
const user = await apiClient.get('/users/me');

// ✅ Хорошо
const user = await authService.getMe();
```

### 2. Используйте composables в компонентах

```ts
// ❌ Плохо - прямой вызов в компоненте
const response = await apiClient.get('/users');

// ✅ Хорошо - использование composable
const { data: users, loading } = useApi('/users', { immediate: true });
```

### 3. Выносите API логику в отдельные composables

```ts
// composables/useUsers.ts
export function useUsers() {
  const { data: users, loading, error, execute: refetch } = useApi<User[]>('/users', {
    immediate: true,
  });

  const activeUsers = computed(() => 
    users.value?.filter(u => u.active) ?? []
  );

  return {
    users,
    activeUsers,
    loading,
    error,
    refetch,
  };
}
```

### 4. Используйте AbortController для длительных операций

```ts
const { execute, abort } = useApi('/export-data', {
  immediate: false,
  timeout: 120000, // 2 minutes
});

onUnmounted(() => {
  abort(); // Автоматически отменяется
});
```

---

## 🚀 Следующие шаги

1. ✅ Инициализировать API в `main.ts`
2. ✅ Обновить auth store для использования новых сервисов
3. ✅ Постепенно мигрировать компоненты на новые composables
4. ✅ Добавить новые сервисы по мере необходимости
5. ✅ Покрыть тестами критические части

---

## 📝 Заметки

- API клиент автоматически обрабатывает 401 ошибки и обновляет токены
- Все запросы автоматически отменяются при unmount компонента
- Ошибки автоматически показываются через toast (можно отключить)
- Поддержка как composables, так и прямых вызовов сервисов
- Полная обратная совместимость с существующим кодом

