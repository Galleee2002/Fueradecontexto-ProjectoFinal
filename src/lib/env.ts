/**
 * Environment configuration utilities
 * Provides validated access to environment variables
 */

/**
 * Validates and returns base URL for the application
 * Throws error in production if NEXTAUTH_URL not set
 *
 * @returns The base URL for the application
 * @throws Error if NEXTAUTH_URL is not set in production
 */
export function getBaseUrl(): string {
  const url = process.env.NEXTAUTH_URL

  if (process.env.NODE_ENV === "production" && !url) {
    throw new Error("NEXTAUTH_URL must be set in production")
  }

  return url || "http://localhost:3000"
}
