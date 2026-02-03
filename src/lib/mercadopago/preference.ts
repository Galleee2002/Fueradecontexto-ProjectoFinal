import { Preference } from "mercadopago"
import { mpClient } from "./client"
import type { Order } from "@/types"

/**
 * Creates a Mercado Pago payment preference
 * Returns the preference ID to construct checkout URL
 */
export async function createPreference(input: {
  order: Order
  userEmail: string
}): Promise<string> {
  const preference = new Preference(mpClient)

  if (!input.order.items || input.order.items.length === 0) {
    throw new Error("Order must have items")
  }

  const result = await preference.create({
    body: {
      items: input.order.items.map((item) => ({
        id: item.productId,
        title: item.productSnapshot.name,
        description: `${item.selectedSize} / ${item.selectedColor.name}`,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "ARS",
      })),
      payer: {
        email: input.userEmail,
        name: input.order.shippingAddress.fullName,
        phone: {
          number: input.order.shippingAddress.phone,
        },
      },
      shipments: {
        cost: input.order.shippingCost,
        mode: "not_specified",
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/checkout/success/${input.order.id}`,
        failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
        pending: `${process.env.NEXTAUTH_URL}/checkout/success/${input.order.id}`,
      },
      auto_return: "approved",
      external_reference: input.order.orderNumber,
      notification_url: `${process.env.NEXTAUTH_URL}/api/mercadopago/webhook`,
      statement_descriptor: "Fueradecontexto",
      metadata: {
        order_id: input.order.id,
        order_number: input.order.orderNumber,
      },
    },
  })

  if (!result.id) {
    throw new Error("Failed to create Mercado Pago preference")
  }

  return result.id
}

/**
 * Constructs the Mercado Pago checkout URL
 */
export function getCheckoutUrl(preferenceId: string): string {
  return `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`
}
