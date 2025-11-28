# 🚀 API Architecture Documentation

## 📚 Обзор

Composable-First Architecture для работы с API в Vue 3 приложении.

### Основные преимущества

✅ **Полная типобезопасность** - TypeScript first approach  
✅ **Реактивность** - автоматическое управление состоянием (loading, error, data)  
✅ **Простота** - минимальный API без over-engineering  
✅ **Отмена запросов** - AbortController для предотвращения memory leaks  
✅ **Retry логика** - автоматические повторы с exponential backoff  
✅ **Полный контроль** - доступ к response для продвинутых случаев  
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

### 1. Базовое использование - useApiGet

```vue
<script setup lang="ts">
import { useApiGet } from '@/shared/composables';

interface User {
  id: string;
  name: string;
  email: string;
}

// Автоматический запрос при создании компонента
const { data, loading, error } = useApiGet<User[]>('/users', {
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
    <div v-else-if="data">
      <!-- Явная проверка на пустой массив -->
      <div v-if="data.length === 0">No users found</div>
      <div v-else>
        <div v-for="user in data" :key="user.id">
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>
```

### 2. POST запрос - useApiPost

```vue
<script setup lang="ts">
import { useApiPost } from '@/shared/composables';

interface CreateUserDto {
  name: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const { data, loading, error, execute } = useApiPost<User, CreateUserDto>('/users', {
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
    {{ loading ? 'Creating...' : 'Create User' }}
  </button>
  <div v-if="error" class="error">{{ error.message }}</div>
  <div v-if="data" class="success">User created: {{ data.name }}</div>
</template>
```

### 3. Debounced Search

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useApiGet } from '@/shared/composables';

interface SearchResult {
  id: string;
  title: string;
}

const searchQuery = ref('');

const { data: results, loading, execute } = useApiGet<SearchResult[]>('/search', {
  immediate: false,
  debounce: 500, // 500ms debounce
});

const search = () => {
  if (searchQuery.value.trim()) {
    execute({ params: { q: searchQuery.value } });
  }
};
</script>

<template>
  <input 
    v-model="searchQuery" 
    @input="search"
    placeholder="Search..."
  />
  <div v-if="loading">Searching...</div>
  <div v-else-if="results">
    {{ results.length }} results found
  </div>
</template>
```

### 4. Отмена запроса

```vue
<script setup lang="ts">
import { useApiGet } from '@/shared/composables';

const { data, loading, execute, abort } = useApiGet('/heavy-operation', {
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
import { useApiGet } from '@/shared/composables';

const { data, error, execute } = useApiGet('/unstable-endpoint', {
  retry: 3, // Retry 3 times
  retryDelay: 1000, // 1 second between retries
  onError: (err) => {
    console.error('Failed after retries:', err);
  }
});
</script>
```

### 6. Полный доступ к response (продвинутое использование)

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useApiGet } from '@/shared/composables';

interface Product {
  id: string;
  name: string;
}

// Получаем и data и полный response
const { data, response, execute } = useApiGet<Product[]>('/products', {
  immediate: true
});

// Используем response для доступа к headers
watch(response, (res) => {
  if (res) {
    // Пагинация из headers
    const totalItems = res.headers['x-total-count'];
    const currentPage = res.headers['x-page'];
    console.log(`Page ${currentPage}, Total: ${totalItems}`);
    
    // Rate limiting
    const rateLimit = res.headers['x-ratelimit-remaining'];
    if (rateLimit && parseInt(rateLimit) < 10) {
      console.warn('⚠️ Low rate limit!');
    }
    
    // ETag для кеширования
    const etag = res.headers['etag'];
    console.log('ETag:', etag);
  }
});
</script>

<template>
  <div>
    <ProductList :products="data" />
  </div>
</template>
```

### 7. Реактивный URL

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiGet } from '@/shared/composables';

const userId = ref('123');
const url = computed(() => `/users/${userId.value}`);

// Запрос автоматически обновится при изменении userId
const { data: user, loading } = useApiGet(url, {
  immediate: true,
});

const changeUser = (id: string) => {
  userId.value = id; // Триггерит новый запрос
};
</script>
```

### 8. Кастомная обработка ошибок

```vue
<script setup lang="ts">
import { useApiGet } from '@/shared/composables';
import { toast } from 'vue-sonner';

const { execute } = useApiGet('/users', {
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


## 🧪 Тестирование

### Пример теста для composable

```ts
import { describe, it, expect, vi } from 'vitest';
import { useApiGet } from '@/shared/composables';

describe('useApiGet', () => {
  it('should fetch data successfully', async () => {
    const { data, loading, execute } = useApiGet('/users', {
      immediate: false,
    });

    expect(loading.value).toBe(false);
    
    const result = await execute();
    
    expect(data.value).toBeTruthy();
    expect(loading.value).toBe(false);
  });

  it('should handle errors', async () => {
    const onError = vi.fn();
    
    const { error, execute } = useApiGet('/invalid', {
      immediate: false,
      onError,
    });

    await execute();
    
    expect(error.value).toBeTruthy();
    expect(onError).toHaveBeenCalled();
  });

  it('should abort request on unmount', async () => {
    const { abort, loading, execute } = useApiGet('/users', {
      immediate: false,
    });

    execute();
    expect(loading.value).toBe(true);
    
    abort();
    expect(loading.value).toBe(false);
  });
});
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
import { useApiGet } from '@/shared/composables';

const { data: users, loading, error } = useApiGet('/users', {
  immediate: true,
});
```

Преимущества:
- ✅ Меньше boilerplate кода
- ✅ Автоматическая отмена при unmount
- ✅ Типобезопасность
- ✅ Декларативный API
- ✅ Автоматическая обработка ошибок

---

## 🎯 Best Practices

### 1. Используйте правильные хелперы для HTTP методов

```ts
// ❌ Плохо - универсальный useApi с method
const { data } = useApi('/users', { method: 'GET' });

// ✅ Хорошо - специализированные хелперы
const { data } = useApiGet('/users');
const { execute } = useApiPost('/users');
const { execute } = useApiPut('/users/1');
const { execute } = useApiPatch('/users/1');
const { execute } = useApiDelete('/users/1');
```

### 2. Явные проверки состояний (нет magic helpers)

```ts
// ❌ Плохо - hasData бесполезен для массивов
// (removed - больше не существует)

// ✅ Хорошо - явная проверка
const { data } = useApiGet<User[]>('/users');
if (data.value && data.value.length > 0) { ... } // Правильно!
if (data.value?.length === 0) { ... } // Пустой массив
```

### 3. Выносите API логику в отдельные composables

```ts
// composables/useUsers.ts
export function useUsers() {
  const { data: users, loading, error, execute: refetch } = useApiGet<User[]>('/users', {
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
const { execute, abort } = useApiGet('/export-data', {
  immediate: false,
  timeout: 120000, // 2 minutes
});

onUnmounted(() => {
  abort(); // Автоматически отменяется
});
```

### 5. Используйте response только когда нужно

```ts
// ❌ Плохо - response не нужен
const { data, response } = useApiGet('/users');
// Используем только data

// ✅ Хорошо - response для headers
const { data, response } = useApiGet('/users');
watch(response, (res) => {
  const rateLimit = res?.headers['x-ratelimit-remaining'];
  console.log('Rate limit:', rateLimit);
});
```

---

## 🚀 Следующие шаги

1. ✅ Использовать правильные хелперы (`useApiGet`, `useApiPost`, etc)
2. ✅ Явно проверять состояния (без `hasData`, `hasError`)
3. ✅ Использовать `response` только для продвинутых случаев
4. ✅ Постепенно мигрировать компоненты на новые composables
5. ✅ Покрыть тестами критические части

---

## 📝 Заметки

- **API клиент** автоматически обрабатывает 401 ошибки и обновляет токены
- **Все запросы** автоматически отменяются при unmount компонента
- **Ошибки** автоматически показываются через toast (можно отключить)
- **Простой API** - только нужные поля: `data`, `loading`, `error`, `statusCode`, `response`
- **Полный контроль** - доступ к `response` для headers, rate limiting, etc
- **Обратная совместимость** - старый `axiosIns` все еще работает

---

## 📚 Дополнительная документация

- [Toast Usage](./TOAST_USAGE.md) - Уведомления об ошибках

