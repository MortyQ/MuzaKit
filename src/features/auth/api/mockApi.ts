import { User, UserRole } from "../types";

/**
 * Mock API delay helper
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock user data
 * In production, this would come from your backend API
 */
const MOCK_ADMIN_USER: User = {
  id: "admin-123",
  email: "admin@example.com",
  name: "Admin User",
  nickname: "admin",
  avatar: undefined, // Will use initials if not provided
  role: UserRole.ADMIN,
  permissions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Mock regular user with limited permissions
 */
const MOCK_REGULAR_USER: User = {
  id: "user-456",
  email: "user@example.com",
  name: "Regular User",
  nickname: "user",
  avatar: undefined,
  role: UserRole.USER,
  permissions: ["home:read"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Get mock user based on email
 */
function getMockUser(email: string): User {
  if (email === "admin@example.com") {
    return { ...MOCK_ADMIN_USER };
  }
  return { ...MOCK_REGULAR_USER, email };
}

/**
 * Mock API: Get current user (getMe)
 * Simulates API call with delay
 *
 * @returns Promise<User>
 *
 * @example
 * const user = await mockGetMe();
 */
export async function mockGetMe(): Promise<User> {
  // Simulate network delay (500-1000ms)
  const randomDelay = Math.random() * 500 + 500;
  await delay(randomDelay);

  // Check if token exists
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Unauthorized");
  }

  // Get saved email from localStorage (saved during login)
  const savedEmail = localStorage.getItem("userEmail") || "admin@example.com";

  // Return mock user based on email
  return getMockUser(savedEmail);
}

/**
 * Mock API: Login
 * Simulates login with delay
 *
 * Login as different users to test permissions:
 * - admin@example.com - Admin with all permissions
 * - user@example.com - Regular user with limited permissions
 *
 * @param email - User email
 * @param password - User password
 * @returns Promise<{ user: User; token: string }>
 */
export async function mockLogin(
  email: string,
  password: string,
): Promise<{ user: User, token: string }> {
  await delay(800);

  // Simple validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Mock successful login
  const token = `mock-token-${Date.now()}`;

  // Save email to localStorage for mockGetMe
  localStorage.setItem("userEmail", email);

  return {
    user: getMockUser(email),
    token,
  };
}

/**
 * Mock API: Logout
 * Simulates logout with delay
 */
export async function mockLogout(): Promise<void> {
  await delay(300);
  // Clear saved email
  localStorage.removeItem("userEmail");
  // In production, you might call API to invalidate token
}

/**
 * Mock API: Update user profile
 */
export async function mockUpdateProfile(
  updates: Partial<Pick<User, "name" | "nickname" | "avatar">>,
): Promise<User> {
  await delay(600);

  const savedEmail = localStorage.getItem("userEmail") || "admin@example.com";
  const currentUser = getMockUser(savedEmail);

  return {
    ...currentUser,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}
