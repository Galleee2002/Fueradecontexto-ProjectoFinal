import { Payment } from "mercadopago"
import { mpClient } from "./client"
import type { MPPaymentInfo } from "./types"

/**
 * Retrieves payment information from Mercado Pago
 * Used by webhook handler to verify payment status
 */
export async function getPayment(paymentId: string): Promise<MPPaymentInfo> {
  const payment = new Payment(mpClient)
  const result = await payment.get({ id: paymentId })

  if (!result.id) {
    throw new Error(`Payment ${paymentId} not found`)
  }

  return {
    id: result.id.toString(),
    status: result.status || "unknown",
    statusDetail: result.status_detail || "unknown",
    paymentType: result.payment_type_id || "unknown",
    transactionAmount: result.transaction_amount || 0,
  }
}

/**
 * Maps Mercado Pago status to our internal payment status
 */
export function mapMpStatusToPaymentStatus(
  mpStatus: string
): "pending" | "paid" | "failed" | "refunded" {
  switch (mpStatus) {
    case "approved":
      return "paid"
    case "rejected":
    case "cancelled":
      return "failed"
    case "refunded":
    case "charged_back":
      return "refunded"
    case "pending":
    case "in_process":
    case "authorized":
    default:
      return "pending"
  }
}

/**
 * Determines if payment status is final (no more updates expected)
 */
export function isPaymentFinal(status: string): boolean {
  return ["approved", "rejected", "cancelled", "refunded", "charged_back"].includes(
    status
  )
}
