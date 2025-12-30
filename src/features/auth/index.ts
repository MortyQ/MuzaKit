// Store
export { useAuthStore } from "./store/authStore";

// Components
export { UserMenu, LoginForm, RegisterForm, SocialLogin, AnimatedBackground } from "./components";

// Types
export type { User, UserPermission, UserRoleType, AuthState } from "./types";
export { UserRole } from "./types";

// API
export { mockGetMe, mockLogin, mockLogout } from "./api/mockApi";

// Re-export UserAvatar from shared
export { default as UserAvatar } from "@/shared/ui/common/UserAvatar.vue";
