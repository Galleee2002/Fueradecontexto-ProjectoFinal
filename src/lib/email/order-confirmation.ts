import { sendEmail } from "./email-service"
import { formatPrice } from "@/lib/formatters"
import type { OrderItem, Address } from "@/types"
import { getBaseUrl } from "@/lib/env"

/**
 * Order confirmation email data
 */
export interface OrderConfirmationData {
  orderNumber: string
  userEmail: string
  userName: string
  total: number
  items: OrderItem[]
  shippingAddress: Address
}

/**
 * Sends order confirmation email to customer
 * Called by webhook when payment is approved
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData
): Promise<void> {
  // Build items HTML
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: start; gap: 10px;">
          <img
            src="${item.productSnapshot.image}"
            alt="${item.productSnapshot.name}"
            style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"
          />
          <div>
            <strong style="display: block; margin-bottom: 4px;">${item.productSnapshot.name}</strong>
            <span style="color: #666; font-size: 13px; display: block;">
              Talle: ${item.selectedSize} | Color: ${item.selectedColor.name}
            </span>
            <span style="color: #666; font-size: 13px;">
              Cantidad: ${item.quantity}
            </span>
          </div>
        </div>
      </td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top;">
        <strong>${formatPrice(item.subtotal)}</strong>
      </td>
    </tr>
  `
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: #000; color: #fff; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">FUERA DE CONTEXTO</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #000;">¡Gracias por tu compra, ${data.userName}!</h2>
            <p style="margin: 0 0 30px 0; color: #666; font-size: 15px; line-height: 1.5;">
              Tu pedido ha sido confirmado y está siendo procesado. Te notificaremos cuando se envíe.
            </p>

            <!-- Order Number Box -->
            <div style="background: #f9f9f9; border: 2px solid #000; padding: 20px; text-align: center; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Número de Pedido</p>
              <p style="margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">${data.orderNumber}</p>
            </div>

            <!-- Order Items -->
            <h3 style="margin: 30px 0 15px 0; font-size: 18px; color: #000;">Resumen de tu pedido</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 15px 10px; font-weight: bold; font-size: 16px;">Total</td>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #000;">
                  ${formatPrice(data.total)}
                </td>
              </tr>
            </table>

            <!-- Shipping Address -->
            <h3 style="margin: 30px 0 15px 0; font-size: 18px; color: #000;">Dirección de envío</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #333;">
              <p style="margin: 0 0 5px 0;"><strong>${data.shippingAddress.fullName}</strong></p>
              <p style="margin: 0 0 5px 0;">${data.shippingAddress.street}</p>
              <p style="margin: 0 0 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.province}</p>
              <p style="margin: 0;">CP: ${data.shippingAddress.postalCode}</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0 20px 0;">
              <a href="${getBaseUrl()}/mi-cuenta/pedidos"
                 style="display: inline-block; background: #000; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">
                Ver Estado del Pedido
              </a>
            </div>

            <!-- Footer Note -->
            <p style="margin: 30px 0 0 0; color: #999; font-size: 13px; line-height: 1.5; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
              Si tenés alguna pregunta sobre tu pedido, respondé a este email o contactanos a través de nuestro sitio web.
            </p>
          </div>

          <!-- Email Footer -->
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">
              © ${new Date().getFullYear()} Fuera de Contexto. Todos los derechos reservados.
            </p>
            <p style="margin: 0; color: #999; font-size: 11px;">
              <a href="${getBaseUrl()}" style="color: #999; text-decoration: none;">Visitar tienda</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
¡Gracias por tu compra, ${data.userName}!

Tu pedido ha sido confirmado.

Número de pedido: ${data.orderNumber}
Total: ${formatPrice(data.total)}

Productos:
${data.items
  .map(
    (item) =>
      `- ${item.productSnapshot.name} (${item.selectedSize}, ${item.selectedColor.name}) x${item.quantity}: ${formatPrice(item.subtotal)}`
  )
  .join("\n")}

Dirección de envío:
${data.shippingAddress.fullName}
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.province}
CP: ${data.shippingAddress.postalCode}

Ver estado del pedido: ${getBaseUrl()}/mi-cuenta/pedidos

---
Fuera de Contexto
${getBaseUrl()}
  `.trim()

  await sendEmail({
    to: data.userEmail,
    subject: `Confirmación de pedido ${data.orderNumber} - Fuera de Contexto`,
    html,
    text,
  })
}
