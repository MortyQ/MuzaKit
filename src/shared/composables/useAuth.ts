import { computed } from "vue";
import { useRouter } from "vue-router";

/**
 * Auth composable
 * Manages authentication state and actions
 */
export function useAuth() {
  const router = useRouter();

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => {
    return !!localStorage.getItem("accessToken");
  });

  /**
   * Login user (demo implementation)
   * TODO: Replace with actual API call and store management
   */
  // eslint-disable-next-line no-unused-vars
  const login = (email: string, _password: string) => {
    // Demo implementation
    localStorage.setItem("accessToken", `token-${Date.now()}`);
    localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }));
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  /**
   * Get current user
   */
  const user = computed(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  });

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}

