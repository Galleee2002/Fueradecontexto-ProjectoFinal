import { MercadoPagoConfig } from "mercadopago"

/**
 * Mercado Pago SDK Client
 * Configured with access token from environment variables
 */

function createMpClient() {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not defined in environment variables")
  }

  return new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: {
      timeout: 5000,
      idempotencyKey: "your-idempotency-key", // Optional: for request retries
    },
  })
}

// Lazy initialization - only create when accessed
let _mpClient: MercadoPagoConfig | null = null

export const mpClient = new Proxy({} as MercadoPagoConfig, {
  get(target, prop) {
    if (!_mpClient) {
      _mpClient = createMpClient()
    }
    return (_mpClient as any)[prop]
  },
})
