# Authentication System

## Overview

The application uses a **secure-by-default** authentication approach:
- **All routes require authentication by default** (`requiresAuth: true`)
- Public pages must explicitly set `requiresAuth: false`
- Protected routes automatically redirect to `/login` if not authenticated

## How It Works

### 1. Route Protection

```typescript
// Protected route (default behavior)
{
  path: "/dashboard",
  name: "Dashboard",
  component: () => import("@/pages/Dashboard.vue"),
  meta: {
    // requiresAuth: true <- implicit, no need to specify
  }
}

// Public route
{
  path: "/login",
  name: "Login",
  component: () => import("@/pages/Login.vue"),
  meta: {
    requiresAuth: false, // Explicitly public
  }
}
```

### 2. Auth Guard Flow

```
User navigates to route
        ↓
Check meta.requiresAuth (default: true)
        ↓
    [Public?] → Allow access
        ↓
    [Protected?]
        ↓
Check authentication (localStorage.accessToken)
        ↓
    [Not authenticated?] → Redirect to /login?redirect=/original-path
        ↓
    [Authenticated?]
        ↓
Check permissions (if specified)
        ↓
    [No permissions?] → Redirect to /403
        ↓
    [Has permissions?] → Allow access
```

## Authentication Storage

Current implementation uses **localStorage**:
- `accessToken` - JWT or session token
- `user` - User profile data (JSON)

**TODO**: Replace with:
- **Pinia auth store** for state management
- **HTTP-only cookies** for tokens (more secure)
- **API integration** for login/logout
- **`getMe()` API call** for user validation and data fetching

### Async Authentication with getMe()

For production, implement async user validation:

```typescript
// guards.ts
export async function isAuthenticated(): Promise<boolean> {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    // Validate token and fetch user data from API
    const response = await api.get("/auth/me");
    
    // Store user data in Pinia
    const authStore = useAuthStore();
    authStore.setUser(response.data);
    
    return true;
  } catch (error) {
    // Token invalid or expired
    console.error("Auth validation failed:", error);
    localStorage.removeItem("accessToken");
    return false;
  }
}

// Auth guard with async support
export async function authGuard(to, from, next) {
  const meta = to.meta as RouteMeta;
  const requiresAuth = meta.requiresAuth !== false;
  
  if (!requiresAuth) {
    next();
    return;
  }

  // Async authentication check
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }
  
  // Check permissions
  if (meta.permissions) {
    const hasPerms = await hasPermissions(meta.permissions);
    if (!hasPerms) {
      next({ path: "/403" });
      return;
    }
  }
  
  next();
}
```

**Benefits:**
- ✅ Always validates token freshness
- ✅ Fetches latest user data on route change
- ✅ Handles token expiration gracefully
- ✅ Can refresh tokens automatically

**Optimization:**
- Cache `getMe()` response for X seconds
- Only call on protected route entry
- Use Pinia store to avoid repeated calls

## Usage Examples

### Protected Route (Default)

```typescript
{
  path: "/dashboard",
  name: "Dashboard",
  component: () => import("@/pages/Dashboard.vue"),
  meta: {
    title: "Dashboard",
    showInMenu: true,
    menuIcon: "mdi:view-dashboard",
    // requiresAuth is implicitly true
  }
}
```

### Public Route

```typescript
{
  path: "/login",
  name: "Login",
  component: () => import("@/pages/Login.vue"),
  meta: {
    title: "Login",
    requiresAuth: false, // Explicitly public
    showInMenu: false,
  }
}
```

### Route with Permissions

```typescript
{
  path: "/admin",
  name: "Admin",
  component: () => import("@/pages/Admin.vue"),
  meta: {
    title: "Admin Panel",
    requiresAuth: true, // Explicit for clarity
    permissions: ["admin", "superuser"], // Any of these
  }
}
```

### Custom Auth Redirect

```typescript
{
  path: "/premium",
  name: "Premium",
  component: () => import("@/pages/Premium.vue"),
  meta: {
    requiresAuth: true,
    authRedirect: "/pricing", // Redirect here instead of /login
  }
}
```

## Login Flow

### 1. User clicks "Login" in sidebar or is redirected from protected route

```typescript
// Automatic redirect with return URL
router.push({
  path: "/login",
  query: { redirect: currentPath }
});
```

### 2. User enters credentials and submits

```typescript
// In Login component
const handleLogin = async () => {
  // Demo: just set token
  localStorage.setItem("accessToken", "token-123");
  
  // Redirect to original destination
  const redirectTo = route.query.redirect || "/";
  router.push(redirectTo);
};
```

### 3. Auto-redirect to original destination

After successful login, user is redirected to:
- Original protected route they tried to access, OR
- Home page if they navigated to login directly

## Logout Flow

### In Sidebar Footer

```typescript
// DefaultLayout.vue
const { logout } = useAuth();

const footerItems = computed(() => {
  if (isAuthenticated.value) {
    return [
      {
        id: "logout",
        label: "Logout",
        icon: "mdi:logout",
        onClick: logout, // onClick instead of navigation
      }
    ];
  }
});
```

### Logout Implementation

```typescript
// useAuth composable
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  router.push("/login");
};
```

## useAuth Composable

```typescript
import { useAuth } from "@/shared/composables/useAuth";

const {
  isAuthenticated, // Computed: boolean
  user,           // Computed: User | null
  login,          // (email, password) => Promise<void>
  logout,         // () => void
} = useAuth();
```

### Example Usage

```vue
<script setup>
import { useAuth } from "@/shared/composables/useAuth";

const { isAuthenticated, user, logout } = useAuth();
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ user?.name }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <router-link to="/login">Login</router-link>
  </div>
</template>
```

## Guards Reference

### `authGuard(to, from, next)`

Main authentication guard that:
1. Checks if route requires auth (default: yes)
2. Validates authentication token
3. Checks permissions if specified
4. Redirects to login or 403 if needed

### `guestGuard(to, from, next)`

Prevents authenticated users from accessing auth pages:
- Used for `/login`, `/register` routes
- Redirects to home if already authenticated

**Usage:**
```typescript
{
  path: "/login",
  beforeEnter: guestGuard, // Per-route guard
  // ...
}
```

## Permission System

### Define Permissions

```typescript
{
  path: "/users",
  meta: {
    permissions: ["user.read", "user.write"], // Any of these
  }
}
```

### Check Implementation

```typescript
// guards.ts
export function hasPermissions(required: string[]): boolean {
  // TODO: Implement with Pinia store
  const authStore = useAuthStore();
  return required.some(p => authStore.permissions.includes(p));
}
```

## Security Best Practices

### ✅ DO

- Store sensitive tokens in HTTP-only cookies
- Implement token refresh mechanism
- Use HTTPS in production
- Validate tokens on backend
- Implement CSRF protection
- Set token expiration

### ❌ DON'T

- Store tokens in localStorage (vulnerable to XSS)
- Trust client-side auth checks only
- Store passwords or sensitive data
- Use long-lived tokens without refresh

## Migration to Production

### 1. Replace localStorage with HTTP-only cookies

```typescript
// Server sets cookie
Set-Cookie: accessToken=xxx; HttpOnly; Secure; SameSite=Strict
```

### 2. Implement Pinia auth store

```typescript
// stores/auth.ts
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    permissions: [],
  }),
  actions: {
    async login(email, password) {
      const response = await api.post("/auth/login", { email, password });
      this.user = response.data.user;
      this.permissions = response.data.permissions;
    },
    logout() {
      this.user = null;
      this.permissions = [];
    },
  },
});
```

### 3. Update guards to use store

```typescript
import { useAuthStore } from "@/stores/auth";

export function isAuthenticated(): boolean {
  const authStore = useAuthStore();
  return !!authStore.user;
}
```

### 4. Add token refresh

```typescript
// Auto-refresh before token expires
setInterval(async () => {
  await authStore.refreshToken();
}, 14 * 60 * 1000); // Every 14 minutes
```

## Testing

### Demo Login

Login page includes "Demo Login" button for testing:
- Email: `demo@example.com`
- Password: `password`
- Creates temporary token in localStorage

### Manual Testing

```javascript
// In browser console
// Login
localStorage.setItem("accessToken", "test-token");
location.reload();

// Logout
localStorage.removeItem("accessToken");
location.reload();
```

## Troubleshooting

### Issue: Infinite redirect loop

**Cause:** Login page requires auth
**Solution:** Ensure `requiresAuth: false` on login route

### Issue: Can't access any routes

**Cause:** No token in localStorage
**Solution:** Use demo login or set token manually

### Issue: Still seeing login button after login

**Cause:** `isAuthenticated` not reactive
**Solution:** Use `computed` in useAuth composable

## Future Enhancements

- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] Social login (Google, GitHub, etc.)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session management
- [ ] Audit logging

