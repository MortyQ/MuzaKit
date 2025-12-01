# 🚀 API Architecture Documentation

## 📚 Overview

Composable-First Architecture for API operations in Vue 3 applications.

### Key Benefits

✅ **Full Type Safety** - TypeScript first approach  
✅ **Reactivity** - automatic state management (loading, error, data)  
✅ **Simplicity** - minimal API without over-engineering  
✅ **Request Cancellation** - AbortController to prevent memory leaks  
✅ **Retry Logic** - automatic retries with exponential backoff  
✅ **Full Control** - access to response for advanced cases  
✅ **Modularity** - easy to test and extend  
✅ **DX** - excellent developer experience with autocomplete

---

## 🏗️ Architecture

```
src/shared/api/
├── client.ts              # Configured axios instance
├── interceptors.ts        # Modular interceptors
├── types.ts              # API types
├── tokenManager.ts       # Token management
├── errorHandler.ts       # Error handling
└── services/             # Typed services
    ├── auth.service.ts   # Auth API
    └── user.service.ts   # User API

src/shared/composables/
├── useApi.ts             # Universal API composable
├── useAuthApi.ts         # Auth specialized composable
└── useApiState.ts        # State management
```

---

## 📖 Usage Examples

### 1. Basic Usage - useApiGet

```vue
<script setup lang="ts">
import { useApiGet } from '@/shared/composables';

interface User {
  id: string;
  name: string;
  email: string;
}

// Automatic request on component creation
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
      <!-- Explicit check for empty array -->
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

### 2. POST Request - useApiPost

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

### 4. Request Cancellation

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

### 5. Retry Logic

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

### 6. Full Response Access (Advanced Usage)

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useApiGet } from '@/shared/composables';

interface Product {
  id: string;
  name: string;
}

// Get both data and full response
const { data, response, execute } = useApiGet<Product[]>('/products', {
  immediate: true
});

// Use response to access headers
watch(response, (res) => {
  if (res) {
    // Pagination from headers
    const totalItems = res.headers['x-total-count'];
    const currentPage = res.headers['x-page'];
    console.log(`Page ${currentPage}, Total: ${totalItems}`);
    
    // Rate limiting
    const rateLimit = res.headers['x-ratelimit-remaining'];
    if (rateLimit && parseInt(rateLimit) < 10) {
      console.warn('⚠️ Low rate limit!');
    }
    
    // ETag for caching
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

### 7. Reactive URL

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiGet } from '@/shared/composables';

const userId = ref('123');
const url = computed(() => `/users/${userId.value}`);

// Request automatically updates when userId changes
const { data: user, loading } = useApiGet(url, {
  immediate: true,
});

const changeUser = (id: string) => {
  userId.value = id; // Triggers new request
};
</script>
```

### 8. Custom Error Handling

```vue
<script setup lang="ts">
import { useApiGet } from '@/shared/composables';
import { toast } from 'vue-sonner';

const { execute } = useApiGet('/users', {
  skipErrorNotification: true, // Disable automatic toast
  onError: (error) => {
    // Custom handling
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


## 🧪 Testing

### Example Test for Composable

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

## 📊 Migration from Current API

### Before (Old Approach)

```ts
import axiosIns from '@/shared/api/client';

// In component
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

### After (New Approach)

```ts
import { useApiGet } from '@/shared/composables';

const { data: users, loading, error } = useApiGet('/users', {
  immediate: true,
});
```

Benefits:
- ✅ Less boilerplate code
- ✅ Automatic cancellation on unmount
- ✅ Type safety
- ✅ Declarative API
- ✅ Automatic error handling

---

## 🎯 Best Practices

### 1. Use Proper Helpers for HTTP Methods

```ts
// ❌ Bad - universal useApi with method
const { data } = useApi('/users', { method: 'GET' });

// ✅ Good - specialized helpers
const { data } = useApiGet('/users');
const { execute } = useApiPost('/users');
const { execute } = useApiPut('/users/1');
const { execute } = useApiPatch('/users/1');
const { execute } = useApiDelete('/users/1');
```

### 2. Explicit State Checks (no magic helpers)

```ts
// ❌ Bad - hasData is useless for arrays
// (removed - no longer exists)

// ✅ Good - explicit check
const { data } = useApiGet<User[]>('/users');
if (data.value && data.value.length > 0) { ... } // Correct!
if (data.value?.length === 0) { ... } // Empty array
```

### 3. Extract API Logic into Separate Composables

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

### 4. Use AbortController for Long-Running Operations

```ts
const { execute, abort } = useApiGet('/export-data', {
  immediate: false,
  timeout: 120000, // 2 minutes
});

onUnmounted(() => {
  abort(); // Automatically cancelled
});
```

### 5. Use response Only When Needed

```ts
// ❌ Bad - response not needed
const { data, response } = useApiGet('/users');
// Using only data

// ✅ Good - response for headers
const { data, response } = useApiGet('/users');
watch(response, (res) => {
  const rateLimit = res?.headers['x-ratelimit-remaining'];
  console.log('Rate limit:', rateLimit);
});
```

---

## 🚀 Next Steps

1. ✅ Use proper helpers (`useApiGet`, `useApiPost`, etc)
2. ✅ Explicitly check states (without `hasData`, `hasError`)
3. ✅ Use `response` only for advanced cases
4. ✅ Gradually migrate components to new composables
5. ✅ Cover critical parts with tests

---

## 📝 Notes

- **API client** automatically handles 401 errors and refreshes tokens
- **All requests** are automatically cancelled on component unmount
- **Errors** are automatically shown via toast (can be disabled)
- **Simple API** - only necessary fields: `data`, `loading`, `error`, `statusCode`, `response`
- **Full control** - access to `response` for headers, rate limiting, etc
- **Backward compatibility** - old `axiosIns` still works

---

## 📚 Additional Documentation

- [Toast Usage](./TOAST_USAGE.md) - Error notifications

