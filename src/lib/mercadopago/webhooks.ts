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
 * Validates webhook source
 * Basic validation - can be enhanced with IP whitelisting or signature verification
 */
export function validateWebhookSource(headers: Headers): boolean {
  // Mercado Pago sends specific headers
  const userAgent = headers.get("user-agent") || ""
  return userAgent.toLowerCase().includes("mercadopago")
}
