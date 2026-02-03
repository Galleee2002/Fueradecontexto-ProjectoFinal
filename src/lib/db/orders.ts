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
