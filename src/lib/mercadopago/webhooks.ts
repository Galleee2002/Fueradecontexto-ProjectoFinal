import crypto from "crypto"
import type { MPWebhookData } from "./types"

/**
 * Validates and parses Mercado Pago webhook payload
 */
export function parseWebhookPayload(body: unknown): MPWebhookData | null {
  if (!body || typeof body !== "object") {
    return null
  }

  const payload = body as Record<string, unknown>

  // Validate required fields
  if (!payload.type || !payload.data) {
    return null
  }

  const data = payload.data as Record<string, unknown>
  if (!data.id) {
    return null
  }

  return {
    type: payload.type as "payment" | "merchant_order",
    data: {
      id: data.id as string,
    },
  }
}

/**
 * Validates webhook signature using HMAC-SHA256
 * This ensures the webhook actually comes from Mercado Pago
 *
 * @param headers - Request headers from webhook
 * @param dataId - The payment or merchant order ID from webhook data
 * @returns true if signature is valid, false otherwise
 */
export function validateWebhookSignature(
  headers: Headers,
  dataId: string
): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

  if (!secret) {
    console.warn(
      "[MP Webhook] MERCADO_PAGO_WEBHOOK_SECRET not configured - skipping signature validation"
    )
    return true // Allow webhook if secret is not configured (for development)
  }

  try {
    // Get signature and request ID from headers
    const xSignature = headers.get("x-signature")
    const xRequestId = headers.get("x-request-id")

    if (!xSignature || !xRequestId) {
      console.error("[MP Webhook] Missing x-signature or x-request-id headers")
      return false
    }

    // Parse signature header (format: "ts=timestamp,v1=signature")
    const signatureParts = xSignature.split(",")
    let ts: string | null = null
    let hash: string | null = null

    for (const part of signatureParts) {
      const [key, value] = part.split("=")
      if (key === "ts") {
        ts = value
      } else if (key === "v1") {
        hash = value
      }
    }

    if (!ts || !hash) {
      console.error("[MP Webhook] Invalid x-signature format")
      return false
    }

    // Create manifest string: id;request-id;ts
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

    // Calculate HMAC SHA256
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(manifest)
    const calculatedHash = hmac.digest("hex")

    // Compare signatures
    const isValid = calculatedHash === hash

    if (!isValid) {
      console.error("[MP Webhook] Signature validation failed")
      console.error("Expected:", calculatedHash)
      console.error("Received:", hash)
    }

    return isValid
  } catch (error) {
    console.error("[MP Webhook] Error validating signature:", error)
    return false
  }
}

/**
 * Validates webhook source (basic check)
 * This is a fallback validation method
 */
export function validateWebhookSource(headers: Headers): boolean {
  // Mercado Pago sends specific headers
  const userAgent = headers.get("user-agent") || ""
  return userAgent.toLowerCase().includes("mercadopago")
}
