<script setup lang="ts">
/**
 * API Examples Component
 *
 * Демонстрирует различные способы использования новой API архитектуры
 */

import { ref, computed } from "vue";

import { authService, type User } from "@/features/auth/api";
import { useAuthApi } from "@/features/auth/composables";
import { useApi, usePost } from "@/shared/composables";

// ============================================================================
// Example 1: Basic GET request with auto-fetch
// ============================================================================
const {
  data: users,
  loading: usersLoading,
  error: usersError,
  hasData: hasUsers,
} = useApi<User[]>("/users", {
  immediate: true,
  onSuccess: (data) => {
    console.log("Loaded users:", data);
  },
});

// ============================================================================
// Example 2: Manual POST request
// ============================================================================
interface CreateUserDto {
  name: string;
  email: string;
}

const newUserName = ref("");
const newUserEmail = ref("");

const {
  data: createdUser,
  loading: createLoading,
  execute: createUser,
} = usePost<User, CreateUserDto>("/users", {
  immediate: false,
  onSuccess: (user) => {
    console.log("User created:", user);
    newUserName.value = "";
    newUserEmail.value = "";
  },
});

const handleCreateUser = async () => {
  await createUser({
    data: {
      name: newUserName.value,
      email: newUserEmail.value,
    },
  });
};

// ============================================================================
// Example 3: Debounced search
// ============================================================================
const searchQuery = ref("");
const {
  data: searchResults,
  loading: searchLoading,
  execute: search,
} = useApi<User[]>("/users/search", {
  immediate: false,
  debounce: 500, // 500ms debounce
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    search({
      params: { q: searchQuery.value },
    });
  }
};

// ============================================================================
// Example 4: Auth API
// ============================================================================
const authApi = useAuthApi();
const loginEmail = ref("");
const loginPassword = ref("");

const handleLogin = async () => {
  const result = await authApi.login({
    email: loginEmail.value,
    password: loginPassword.value,
  });

  if (result) {
    console.log("Login successful:", result);
  }
};

const handleLogout = async () => {
  await authApi.logout();
};

// ============================================================================
// Example 5: Direct service calls (for store actions)
// ============================================================================
const loadUserProfile = async () => {
  try {
    const user = await authService.getMe();
    console.log("User profile:", user);
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
};

const validateToken = async () => {
  try {
    const result = await authService.validateToken();
    console.log("Token valid:", result.valid);
  } catch (error) {
    console.error("Failed to validate token:", error);
  }
};

// ============================================================================
// Example 6: Reactive URL
// ============================================================================
const selectedUserId = ref("123");
const userDetailUrl = computed(() => `/users/${selectedUserId.value}`);

const {
  data: userDetail,
  loading: userDetailLoading,
} = useApi<User>(userDetailUrl, {
  immediate: true,
});

const changeUser = (id: string) => {
  selectedUserId.value = id;
};

// ============================================================================
// Example 7: Request with retry
// ============================================================================
const {
  execute: fetchUnstableData,
  loading: unstableLoading,
} = useApi("/unstable-endpoint", {
  immediate: false,
  retry: 3,
  retryDelay: 1000,
  onError: (error) => {
    console.error("Failed after retries:", error);
  },
});

// ============================================================================
// Example 8: Custom error handling
// ============================================================================
const { execute: fetchWithCustomError } = useApi("/custom-error", {
  immediate: false,
  skipErrorNotification: true,
  onError: (error) => {
    // Кастомная обработка ошибок
    if (error.status === 404) {
      console.error("Resource not found");
    } else {
      console.error("Custom error handler:", error.message);
    }
  },
});

// Wrapper функции для кнопок
const handleFetchUnstable = () => {
  fetchUnstableData();
};

const handleFetchCustomError = () => {
  fetchWithCustomError();
};
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">
      API Architecture Examples
    </h1>

    <!-- Example 1: Auto-fetch users -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        1. Auto-fetch Users (GET)
      </h2>

      <div
        v-if="usersLoading"
        class="text-gray-500"
      >
        Loading users...
      </div>

      <div
        v-else-if="usersError"
        class="text-red-500"
      >
        Error: {{ usersError.message }}
      </div>

      <div
        v-else-if="hasUsers"
        class="space-y-2"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="p-2 bg-gray-100 rounded"
        >
          {{ user.name }} - {{ user.email }}
        </div>
      </div>
    </section>

    <!-- Example 2: Create user -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        2. Create User (POST)
      </h2>

      <form
        class="space-y-3"
        @submit.prevent="handleCreateUser"
      >
        <input
          v-model="newUserName"
          type="text"
          placeholder="Name"
          class="input"
          required
        >
        <input
          v-model="newUserEmail"
          type="email"
          placeholder="Email"
          class="input"
          required
        >
        <button
          type="submit"
          :disabled="createLoading"
          class="btn btn-primary"
        >
          {{ createLoading ? "Creating..." : "Create User" }}
        </button>
      </form>

      <div
        v-if="createdUser"
        class="mt-4 p-3 bg-green-100 rounded"
      >
        User created: {{ createdUser.name }}
      </div>
    </section>

    <!-- Example 3: Debounced search -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        3. Debounced Search
      </h2>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="input mb-3"
        @input="handleSearch"
      >

      <div
        v-if="searchLoading"
        class="text-gray-500"
      >
        Searching...
      </div>

      <div v-else-if="searchResults">
        Found {{ searchResults.length }} results
      </div>
    </section>

    <!-- Example 4: Auth -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        4. Authentication
      </h2>

      <div
        v-if="authApi.isAuthenticated"
        class="space-y-3"
      >
        <p class="text-green-600">
          ✓ Authenticated
        </p>
        <button
          :disabled="authApi.isLoading.value"
          class="btn btn-danger"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>

      <form
        v-else
        class="space-y-3"
        @submit.prevent="handleLogin"
      >
        <input
          v-model="loginEmail"
          type="email"
          placeholder="Email"
          class="input"
          required
        >
        <input
          v-model="loginPassword"
          type="password"
          placeholder="Password"
          class="input"
          required
        >
        <button
          type="submit"
          :disabled="authApi.isLoading.value"
          class="btn btn-primary"
        >
          {{ authApi.isLoading.value ? "Logging in..." : "Login" }}
        </button>

        <div
          v-if="authApi.error.value"
          class="text-red-500"
        >
          {{ authApi.error.value }}
        </div>
      </form>
    </section>

    <!-- Example 5: Direct service calls -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        5. Direct Service Calls (authService)
      </h2>

      <div class="space-x-3">
        <button
          class="btn btn-secondary"
          @click="loadUserProfile"
        >
          Load Profile (getMe)
        </button>
        <button
          class="btn btn-secondary"
          @click="validateToken"
        >
          Validate Token
        </button>
      </div>
    </section>

    <!-- Example 6: Reactive URL -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        6. Reactive URL
      </h2>

      <div class="space-y-3">
        <div class="flex gap-2">
          <button
            class="btn btn-sm"
            @click="changeUser('123')"
          >
            User 123
          </button>
          <button
            class="btn btn-sm"
            @click="changeUser('456')"
          >
            User 456
          </button>
          <button
            class="btn btn-sm"
            @click="changeUser('789')"
          >
            User 789
          </button>
        </div>

        <div v-if="userDetailLoading">
          Loading user...
        </div>
        <div
          v-else-if="userDetail"
          class="p-3 bg-gray-100 rounded"
        >
          <p><strong>ID:</strong> {{ userDetail.id }}</p>
          <p><strong>Name:</strong> {{ userDetail.name }}</p>
          <p><strong>Email:</strong> {{ userDetail.email }}</p>
        </div>
      </div>
    </section>

    <!-- Example 7: Retry logic -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        7. Retry Logic
      </h2>

      <button
        :disabled="unstableLoading"
        class="btn btn-warning"
        @click="handleFetchUnstable"
      >
        {{ unstableLoading ? "Retrying..." : "Fetch Unstable Data (with retry)" }}
      </button>
    </section>

    <!-- Example 8: Custom error handling -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-4">
        8. Custom Error Handling
      </h2>

      <div class="space-y-3">
        <p class="text-sm text-gray-600">
          Пример с отключением автоматических toast уведомлений
        </p>
        <button
          class="btn btn-secondary"
          @click="handleFetchCustomError"
        >
          Trigger Custom Error
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}

.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
  focus:ring-blue-500 focus:border-transparent;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.btn-warning {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}

.btn-sm {
  @apply px-3 py-1 text-sm;
}
</style>

