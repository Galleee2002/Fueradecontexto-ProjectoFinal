/**
 * Mercado Pago Type Definitions
 */

export interface MPPreferenceItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  currency_id: string
}

export interface MPPayer {
  email: string
  name?: string
  phone?: {
    number: string
  }
}

export interface MPBackUrls {
  success: string
  failure: string
  pending: string
}

export interface MPPaymentInfo {
  id: string
  status: string // "approved" | "rejected" | "pending" | "in_process" | "cancelled" | "refunded" | "charged_back"
  statusDetail: string
  paymentType: string
  transactionAmount: number
}

export type MPPaymentStatus =
  | "approved"
  | "rejected"
  | "pending"
  | "in_process"
  | "cancelled"
  | "refunded"
  | "charged_back"

export type MPWebhookType = "payment" | "merchant_order"

export interface MPWebhookData {
  type: MPWebhookType
  data: {
    id: string
  }
}
