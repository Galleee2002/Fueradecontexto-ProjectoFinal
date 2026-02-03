/**
 * Token utilities for email verification and password reset
 * Uses crypto.randomUUID() for cryptographically secure tokens
 */

import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

// ============================================
// TOKEN GENERATION
// ============================================

/**
 * Generate a secure random token using UUID v4
 */
export function generateToken(): string {
  return randomUUID()
}

/**
 * Create a verification token for email verification
 * - Cleans up expired tokens for the same email
 * - Creates new token with 24 hour expiration
 * @returns The generated token string
 */
export async function createVerificationToken(email: string): Promise<string> {
  // Cleanup expired tokens first
  await cleanupExpiredTokens(email, "verification")

  // Generate token
  const token = generateToken()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store in database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

/**
 * Create a password reset token
 * - Cleans up expired tokens for the same email
 * - Creates new token with 1 hour expiration
 * @returns The generated token string
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  // Cleanup expired tokens first
  await cleanupExpiredTokens(email, "reset")

  // Generate token
  const token = generateToken()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  // Store in database
  await prisma.passwordResetToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

// ============================================
// TOKEN VALIDATION
// ============================================

/**
 * Verify a verification token
 * @returns Email if valid, null if invalid or expired
 */
export async function verifyVerificationToken(
  token: string
): Promise<{ email: string } | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  // Token doesn't exist
  if (!record) {
    return null
  }

  // Token expired
  if (record.expires < new Date()) {
    return null
  }

  return { email: record.identifier }
}

/**
 * Verify a password reset token
 * @returns Email if valid, null if invalid or expired
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<{ email: string } | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  // Token doesn't exist
  if (!record) {
    return null
  }

  // Token expired
  if (record.expires < new Date()) {
    return null
  }

  return { email: record.identifier }
}

// ============================================
// TOKEN DELETION
// ============================================

/**
 * Delete a verification token after use
 */
export async function deleteVerificationToken(token: string): Promise<void> {
  await prisma.verificationToken.delete({
    where: { token },
  }).catch(() => {
    // Ignore if token doesn't exist
  })
}

/**
 * Delete a password reset token after use
 */
export async function deletePasswordResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.delete({
    where: { token },
  }).catch(() => {
    // Ignore if token doesn't exist
  })
}

// ============================================
// CLEANUP
// ============================================

/**
 * Clean up expired tokens for a specific identifier
 * This ensures only the latest token is valid
 */
export async function cleanupExpiredTokens(
  identifier: string,
  type: "verification" | "reset"
): Promise<void> {
  const now = new Date()

  if (type === "verification") {
    await prisma.verificationToken.deleteMany({
      where: {
        identifier,
        OR: [
          { expires: { lt: now } }, // Expired
        ],
      },
    })
  } else {
    await prisma.passwordResetToken.deleteMany({
      where: {
        identifier,
        OR: [
          { expires: { lt: now } }, // Expired
        ],
      },
    })
  }
}
