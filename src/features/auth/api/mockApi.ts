import { User, UserRole } from "../types";

/**
 * Mock API delay helper
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock user data
 * In production, this would come from your backend API
 */
const MOCK_USER: User = {
  id: "user-123",
  email: "john.doe@example.com",
  name: "John Doe",
  nickname: "johndoe",
  avatar: undefined, // Will use initials if not provided
  role: UserRole.ADMIN,
  permissions: [
    "users:read",
    "users:write",
    "users:delete",
    "posts:read",
    "posts:write",
    "posts:delete",
    "settings:read",
    "settings:write",
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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

  // Return mock user
  return { ...MOCK_USER };
}

/**
 * Mock API: Login
 * Simulates login with delay
 *
 * @param email - User email
 * @param password - User password
 * @returns Promise<{ user: User; token: string }>
 */
export async function mockLogin(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  await delay(800);

  // Simple validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Mock successful login
  const token = `mock-token-${Date.now()}`;

  return {
    user: { ...MOCK_USER, email },
    token,
  };
}

/**
 * Mock API: Logout
 * Simulates logout with delay
 */
export async function mockLogout(): Promise<void> {
  await delay(300);
  // In production, you might call API to invalidate token
}

/**
 * Mock API: Update user profile
 */
export async function mockUpdateProfile(
  updates: Partial<Pick<User, "name" | "nickname" | "avatar">>,
): Promise<User> {
  await delay(600);

  return {
    ...MOCK_USER,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

