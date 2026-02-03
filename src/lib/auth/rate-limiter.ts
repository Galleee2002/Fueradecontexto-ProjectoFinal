/**
 * In-memory rate limiter for authentication endpoints
 *
 * Usage:
 * - Forgot password: 3 requests per 15 minutes per IP
 * - Resend verification: 3 requests per hour per email
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store for rate limiting
const rateLimitMap = new Map<string, RateLimitRecord>()

/**
 * Check if a key has exceeded the rate limit
 *
 * @param key - Unique identifier (IP, email, etc.)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and optional resetAt timestamp
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; resetAt?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  // No record exists - allow and create new record
  if (!record) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true }
  }

  // Record expired - reset and allow
  if (now >= record.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true }
  }

  // Within window - check count
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      resetAt: record.resetAt,
    }
  }

  // Increment count and allow
  record.count++
  return { allowed: true }
}

/**
 * Clear rate limit for a specific key
 * Useful for testing or manual overrides
 */
export function clearRateLimit(key: string): void {
  rateLimitMap.delete(key)
}

/**
 * Clear all rate limits
 * Useful for testing
 */
export function clearAllRateLimits(): void {
  rateLimitMap.clear()
}

/**
 * Get formatted time remaining for rate limit
 */
export function getTimeRemaining(resetAt: number): string {
  const now = Date.now()
  const diff = resetAt - now

  if (diff <= 0) return "0 segundos"

  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  if (minutes > 0) {
    return `${minutes} minuto${minutes !== 1 ? "s" : ""}`
  }

  return `${seconds} segundo${seconds !== 1 ? "s" : ""}`
}
