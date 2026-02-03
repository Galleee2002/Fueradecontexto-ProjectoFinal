import { prisma } from "@/lib/prisma"
import { Order, OrderItem, Address } from "@/types"
import { OrderFiltersData } from "@/lib/validations/admin"
import type { Prisma } from "@prisma/client"

// ============================================
// PRISMA CONFIGURATION
// ============================================

/**
 * Standard include configuration for order queries
 * Includes user info and items
 */
export const orderInclude = {
  user: {
    select: { firstName: true, lastName: true, email: true },
  },
  items: true,
} satisfies Prisma.OrderInclude

// Type for Prisma order with includes
type PrismaOrderWithIncludes = Prisma.OrderGetPayload<{
  include: typeof orderInclude
}>

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transforms Prisma order data to frontend Order type
 * Parses JSON fields to typed objects
 */
export function transformOrder(prismaOrder: PrismaOrderWithIncludes): Order {
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    userId: prismaOrder.userId,
    userName: `${prismaOrder.user.firstName} ${prismaOrder.user.lastName}`,
    userEmail: prismaOrder.user.email,
    status: prismaOrder.status as Order["status"],
    paymentStatus: prismaOrder.paymentStatus as Order["paymentStatus"],
    subtotal: prismaOrder.subtotal,
    discount: prismaOrder.discount,
    shippingCost: prismaOrder.shippingCost,
    tax: prismaOrder.tax,
    total: prismaOrder.total,
    shippingAddress: prismaOrder.shippingAddress as unknown as Address,
    billingAddress: prismaOrder.billingAddress as unknown as Address,
    createdAt: prismaOrder.createdAt,
    updatedAt: prismaOrder.updatedAt,
    items: prismaOrder.items?.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productSnapshot: item.productSnapshot as any,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor as any,
    })),
  }
}

// ============================================
// QUERY BUILDERS
// ============================================

/**
 * Builds Prisma where clause from filters
 */
function buildWhereClause(filters: Partial<OrderFiltersData>): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {}

  // Search: orderNumber OR user name OR user email
  if (filters.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      {
        user: {
          firstName: { contains: filters.search, mode: "insensitive" },
        },
      },
      { user: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
    ]
  }

  // Status filter
  if (filters.status) {
    where.status = filters.status
  }

  // Date range filter
  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate),
    }
  } else if (filters.startDate) {
    where.createdAt = { gte: new Date(filters.startDate) }
  } else if (filters.endDate) {
    where.createdAt = { lte: new Date(filters.endDate) }
  }

  return where
}

// ============================================
// MAIN QUERY FUNCTIONS
// ============================================

/**
 * Get orders with optional filters and pagination
 */
export async function getOrders(
  filters: Partial<OrderFiltersData> = {}
): Promise<{ orders: Order[]; total: number }> {
  const where = buildWhereClause(filters)
  const skip = ((filters.page || 1) - 1) * (filters.limit || 20)
  const take = filters.limit || 20

  const [prismaOrders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders: prismaOrders.map(transformOrder),
    total,
  }
}

/**
 * Get single order by ID with full details
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const prismaOrder = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  })

  return prismaOrder ? transformOrder(prismaOrder) : null
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const prismaOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  })

  return transformOrder(prismaOrder)
}

/**
 * Get order statistics for dashboard
 */
export async function getOrderStats(): Promise<{
  total: number
  pending: number
  confirmed: number
  shipped: number
  delivered: number
}> {
  const [total, pending, confirmed, shipped, delivered] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "confirmed" } }),
    prisma.order.count({ where: { status: "shipped" } }),
    prisma.order.count({ where: { status: "delivered" } }),
  ])

  return { total, pending, confirmed, shipped, delivered }
}

// ============================================
// CHECKOUT & MERCADO PAGO FUNCTIONS
// ============================================

export interface CreateOrderInput {
  userId: string
  shippingAddress: Omit<Address, "id" | "label" | "isDefault">
  shippingCost: number
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    selectedSize: string
    selectedColor: { name: string; hex: string }
    productSnapshot: { name: string; price: number; image: string }
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
}

/**
 * Generates a unique order number
 * Format: FDC-YYYY-XXXXX
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  return `FDC-${year}-${random}`
}

/**
 * Creates a new order with pending status
 * Stock must be reserved BEFORE calling this function
 */
export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const orderNumber = generateOrderNumber()

  const prismaOrder = await prisma.order.create({
    data: {
      orderNumber,
      userId: data.userId,
      status: "pending",
      paymentStatus: "pending",
      subtotal: data.subtotal,
      discount: data.discount,
      shippingCost: data.shippingCost,
      tax: data.tax,
      total: data.total,
      shippingAddress: data.shippingAddress as any,
      billingAddress: data.shippingAddress as any, // Same as shipping for now
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.unitPrice * item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor as any,
          productSnapshot: item.productSnapshot as any,
        })),
      },
    },
    include: orderInclude,
  })

  return transformOrder(prismaOrder)
}

/**
 * Updates order with Mercado Pago preference ID
 * Called after creating MP preference
 */
export async function updateOrderMpPreference(
  orderId: string,
  preferenceId: string
): Promise<Order> {
  const prismaOrder = await prisma.order.update({
    where: { id: orderId },
    data: { mpPreferenceId: preferenceId },
    include: orderInclude,
  })

  return transformOrder(prismaOrder)
}

/**
 * Updates order payment status from Mercado Pago webhook
 * Also updates order status if payment is successful
 */
export async function updateOrderPaymentStatus(
  mpPaymentId: string,
  paymentData: {
    status: string
    paymentType: string
    merchantOrder?: string
  }
): Promise<Order | null> {
  // Find order by MP payment ID
  const order = await prisma.order.findFirst({
    where: { mpPaymentId },
    include: orderInclude,
  })

  if (!order) {
    // Try to find by preference ID (first webhook before payment ID is set)
    const orderByPreference = await prisma.order.findFirst({
      where: { mpPreferenceId: { not: null } },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    })

    if (!orderByPreference) return null

    // Update with payment ID
    const prismaOrder = await prisma.order.update({
      where: { id: orderByPreference.id },
      data: {
        mpPaymentId,
        mpStatus: paymentData.status,
        mpPaymentType: paymentData.paymentType,
        mpMerchantOrder: paymentData.merchantOrder,
        paymentStatus: mapMpStatusToPaymentStatus(paymentData.status),
        status:
          paymentData.status === "approved" ? "confirmed" : orderByPreference.status,
        paidAt: paymentData.status === "approved" ? new Date() : null,
      },
      include: orderInclude,
    })

    return transformOrder(prismaOrder)
  }

  // Update existing order
  const paymentStatus = mapMpStatusToPaymentStatus(paymentData.status)
  const orderStatus = paymentStatus === "paid" ? "confirmed" : order.status

  const prismaOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus,
      status: orderStatus,
      mpStatus: paymentData.status,
      mpPaymentType: paymentData.paymentType,
      mpMerchantOrder: paymentData.merchantOrder,
      paidAt: paymentStatus === "paid" ? new Date() : order.paidAt,
    },
    include: orderInclude,
  })

  return transformOrder(prismaOrder)
}

/**
 * Maps Mercado Pago status to internal payment status
 */
function mapMpStatusToPaymentStatus(
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
    default:
      return "pending"
  }
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const prismaOrders = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  })

  return prismaOrders.map(transformOrder)
}
