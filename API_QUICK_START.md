# 🎯 API Architecture - Quick Start

## ⚡ TL;DR

Modern type-safe architecture for working with API in Vue 3.

### Before:
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

### After:
```ts
const { data: users, loading } = useApi<User[]>('/users', {
  immediate: true
});
```

---

## 📦 What's Included

✅ **useApi** - universal composable for any requests  
✅ **useAuthApi** - specialized composable for auth  
✅ **Typed services** - authService (feature-based)  
✅ **TokenManager** - centralized token management  
✅ **ErrorHandler** - smart error handling with useToast  
✅ **Interceptors** - automatic token refresh  
✅ **Full type safety** - TypeScript first  

---

## 🏗️ Architecture

### Feature-First Structure

```
src/
├── features/
│   └── auth/
│       ├── api/
│       │   ├── auth.service.ts    # Auth API service
│       │   └── index.ts
│       ├── composables/
│       │   ├── useAuthApi.ts      # Auth composable
│       │   └── index.ts
│       ├── store/
│       │   └── authStore.ts       # Pinia store
│       └── types/
│           └── index.ts
│
└── shared/
    ├── api/
    │   ├── client.ts              # Axios instance
    │   ├── interceptors.ts        # Request/Response interceptors
    │   ├── types.ts               # Common API types
    │   ├── tokenManager.ts        # Token management
    │   ├── errorHandler.ts        # Error handling
    │   └── index.ts
    │
    └── composables/
        ├── useApi.ts              # Universal API composable
        ├── useApiState.ts         # State management
        ├── useToast.ts            # Toast notifications
        └── index.ts
```

---

## 🚀 Usage Examples

### 1. GET Request
```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading, error } = useApi('/users', { immediate: true });
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### 2. POST Request
```vue
<script setup lang="ts">
import { usePost } from '@/shared/composables';

const { execute: createUser, loading } = usePost('/users', {
  onSuccess: (user) => console.log('Created:', user)
});

const handleSubmit = async () => {
  await createUser({ 
    data: { name: 'John', email: 'john@example.com' } 
  });
};
</script>
```

### 3. Authentication
```vue
<script setup lang="ts">
import { useAuthApi } from '@/features/auth';

const authApi = useAuthApi();

const handleLogin = async () => {
  await authApi.login({ email: email.value, password: password.value });
  router.push('/dashboard');
};

const handleLogout = async () => {
  await authApi.logout();
};
</script>

<template>
  <button :disabled="authApi.isLoading.value">
    {{ authApi.isLoading.value ? 'Loading...' : 'Login' }}
  </button>
</template>
```

### 4. Direct Service Call
```ts
// In Pinia store or utility function
import { authService } from '@/features/auth/api';

const user = await authService.getMe();
const result = await authService.validateToken();
```

---

## 🎯 Key Features

### Automatic State Management
```ts
const { data, loading, error, hasData, hasError } = useApi('/users');
```

### Request Cancellation
```ts
const { execute, abort } = useApi('/users', { immediate: false });

execute();
abort(); // Cancel the request
```

### Retry Logic
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

### Lifecycle Callbacks
```ts
useApi('/users', {
  onSuccess: (data) => console.log('Success', data),
  onError: (error) => console.error('Error', error),
  onBefore: () => console.log('Starting...'),
  onFinish: () => console.log('Done')
});
```

---

## 🔐 Authentication

### Automatic Token Refresh
Tokens are automatically refreshed when receiving 401 errors.

### Race Condition Protection
Multiple requests won't trigger multiple token refreshes simultaneously.

### Request Queue Mechanism
Requests made during token refresh wait in queue and automatically retry.

---

## 🎨 Toast Notifications

All error handling uses our unified `useToast` composable:

```ts
import { useToast } from '@/shared/composables';

const toast = useToast();

toast.success('Operation completed!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('New feature available');
```

---

## 📚 Documentation

- 📖 [Full Documentation](./src/docs/API_ARCHITECTURE.md)
- 🔄 [Migration Guide](./MIGRATION_GUIDE.md)
- 🏗️ [Feature-First Architecture](./FEATURE_FIRST_ARCHITECTURE.md)
- 🎨 [Examples](./src/pages/Examples/ApiArchitectureExample.vue)

---

## ✨ Advantages

✅ Less boilerplate code  
✅ Automatic request cancellation on component unmount  
✅ Type safety at all levels  
✅ Centralized error handling  
✅ Toast notifications out of the box  
✅ Easy to test and mock  
✅ Backward compatible  
✅ Feature-First architecture  
✅ SSR-friendly  

---

## 🎓 Best Practices

### When to Use What?

| Context | Use | Example |
|---------|-----|---------|
| **Vue Components** | `useApi`, `usePost`, etc. | Reactive state needed |
| **Pinia Stores** | Typed services (`authService`) | No reactive state needed |
| **Auth Operations** | `useAuthApi` | Login, logout, register |
| **Utility Functions** | Typed services | Simple API calls |

### Examples:

#### In Components:
```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading } = useApi('/users', { immediate: true });
</script>
```

#### In Pinia Stores:
```ts
import { defineStore } from 'pinia';
import { authService } from '@/features/auth/api';

export const useMyStore = defineStore('my', () => {
  const loadData = async () => {
    const user = await authService.getMe();
    return user;
  };
});
```

#### Auth Operations:
```vue
<script setup lang="ts">
import { useAuthApi } from '@/features/auth';

const authApi = useAuthApi();
await authApi.login({ email, password });
</script>
```

---

## 🚦 Getting Started

### 1. Try Examples
Visit `/examples/api` to see live examples (add route if not exists)

### 2. Use in Your Component
```vue
<script setup lang="ts">
import { useApi } from '@/shared/composables';

const { data, loading, error } = useApi<User[]>('/users', {
  immediate: true
});
</script>
```

### 3. Create Feature-Specific Services
```typescript
// src/features/posts/api/posts.service.ts
export const postsService = {
  getAll() {
    return typedApiClient.get<Post[]>('/posts').then(r => r.data);
  },
  
  getById(id: string) {
    return typedApiClient.get<Post>(`/posts/${id}`).then(r => r.data);
  },
};
```

---

## 💡 Tips

### Feature-Based Organization
- Keep feature-specific API logic in `features/{feature}/api/`
- Use `shared/api/` only for common utilities
- Auth is in `features/auth/` as an example

### Type Safety
- Always provide generic types: `useApi<User[]>(...)`
- Define response types in feature's `types/` folder
- Use typed services for better DX

### Error Handling
- Let errorHandler show toasts automatically
- Use `skipErrorNotification: true` for custom handling
- useToast for manual notifications

---

Ready to start! 🚀 Check out the examples at `/examples/api`

---

**Version**: 5.0.0  
**Last Updated**: November 27, 2024  
**Status**: ✅ Production Ready

