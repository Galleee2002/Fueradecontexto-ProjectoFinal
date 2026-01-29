/**
 * Temporary authentication utilities
 * TODO: Replace with real NextAuth.js implementation
 */

export const TEMP_ADMIN_USER_ID = "user-test-001";

/**
 * Check if a user has admin privileges
 * TODO: Replace with real auth - check user.role === "admin" from session
 */
export function isAdmin(userId?: string): boolean {
  return userId === TEMP_ADMIN_USER_ID;
}

/**
 * Get current user ID (hardcoded for development)
 * TODO: Replace with real auth - get from session
 */
export function getCurrentUserId(): string {
  return TEMP_ADMIN_USER_ID;
}

/**
 * Verify admin access or throw error
 * Use this in API routes to protect admin endpoints
 */
export function requireAdmin(userId?: string): void {
  if (!isAdmin(userId)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
