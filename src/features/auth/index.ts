/**
 * Auth Feature
 *
 * Provides authentication functionality including:
 * - User state management with Pinia
 * - Mock API with simulated delays for easy transition to real API
 * - Permission system
 * - User menu component with avatar
 * - Reusable UserAvatar component
 *
 * @example
 * ```ts
 * import { useAuthStore, UserMenu } from '@/features/auth';
 *
 * const authStore = useAuthStore();
 * await authStore.initialize();
 *
 * if (authStore.isAuthenticated) {
 *   console.log(authStore.user.name);
 * }
 * ```
 */

// Store
export { useAuthStore } from "./store/authStore";

// Components
export { UserMenu, AuthForm, LoginForm, RegisterForm, SocialLogin, AnimatedBackground } from "./components";

// Types
export type { User, UserPermission, UserRoleType, AuthState } from "./types";
export { UserRole } from "./types";

// API (for manual usage if needed)
export { mockGetMe, mockLogin, mockLogout } from "./api/mockApi";

// Re-export UserAvatar from shared
export { default as UserAvatar } from "@/shared/ui/common/UserAvatar.vue";

