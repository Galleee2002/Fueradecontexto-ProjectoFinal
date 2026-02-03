import { NextRequest, NextResponse } from "next/server"
import { getPayment } from "@/lib/mercadopago/payment"
import { updateOrderPaymentStatus } from "@/lib/db/orders"
import { restoreStock } from "@/lib/db/stock"
import { parseWebhookPayload } from "@/lib/mercadopago/webhooks"
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation"

/**
 * POST /api/mercadopago/webhook
 * Receives payment notifications from Mercado Pago
 *
 * Webhook Events:
 * - payment.created
 * - payment.updated
 *
 * Flow:
 * 1. Parse webhook payload
 * 2. Get payment info from MP API
 * 3. Update order in database
 * 4. If approved: Send confirmation email
 * 5. If rejected: Restore stock
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[MP Webhook] Received:", JSON.stringify(body, null, 2))

    // Parse and validate webhook payload
    const webhook = parseWebhookPayload(body)

    if (!webhook) {
      console.log("[MP Webhook] Invalid payload format")
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Only process payment webhooks
    if (webhook.type !== "payment") {
      console.log("[MP Webhook] Ignoring non-payment webhook:", webhook.type)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const paymentId = webhook.data.id

    // Get payment details from Mercado Pago
    let payment
    try {
      payment = await getPayment(paymentId)
      console.log("[MP Webhook] Payment info:", payment)
    } catch (error) {
      console.error("[MP Webhook] Error fetching payment:", error)
      // Return 200 to prevent MP from retrying
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Update order with payment status
    const order = await updateOrderPaymentStatus(paymentId, {
      status: payment.status,
      paymentType: payment.paymentType,
    })

    if (!order) {
      console.error("[MP Webhook] Order not found for payment:", paymentId)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    console.log(
      `[MP Webhook] Order ${order.orderNumber} updated to status: ${payment.status}`
    )

    // Handle payment status
    if (payment.status === "approved") {
      // Payment successful - send confirmation email
      try {
        await sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          userEmail: order.userEmail,
          userName: order.userName,
          total: order.total,
          items: order.items || [],
          shippingAddress: order.shippingAddress,
        })
        console.log(
          `[MP Webhook] Confirmation email sent for order ${order.orderNumber}`
        )
      } catch (error) {
        console.error("[MP Webhook] Error sending confirmation email:", error)
        // Don't fail the webhook - order is already confirmed
      }
    } else if (payment.status === "rejected" || payment.status === "cancelled") {
      // Payment failed - restore stock
      try {
        if (order.items && order.items.length > 0) {
          await restoreStock(
            order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          )
          console.log(`[MP Webhook] Stock restored for order ${order.orderNumber}`)
        }
      } catch (error) {
        console.error("[MP Webhook] Error restoring stock:", error)
        // Don't fail the webhook - order status is already updated
      }
    }

    // Always return 200 to acknowledge webhook
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("[MP Webhook] Unexpected error:", error)
    // Always return 200 to prevent MP from retrying
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

/**
 * GET /api/mercadopago/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Mercado Pago webhook endpoint is active",
  })
}
