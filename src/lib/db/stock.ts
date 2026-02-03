import { prisma } from "@/lib/prisma"

/**
 * Stock Management Functions
 * Handle stock reservation and restoration for orders
 */

export interface StockItem {
  productId: string
  quantity: number
}

export interface StockAvailability {
  productId: string
  available: number
  requested: number
}

/**
 * Reserves stock by reducing quantity in database
 * Called when creating an order
 * Uses transaction to ensure atomicity
 */
export async function reserveStock(items: StockItem[]): Promise<void> {
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  )
}

/**
 * Restores stock by incrementing quantity in database
 * Called when payment fails or order is cancelled
 * Uses transaction to ensure atomicity
 */
export async function restoreStock(items: StockItem[]): Promise<void> {
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    )
  )
}

/**
 * Checks if requested quantities are available in stock
 * Returns array of products with insufficient stock
 * Empty array means all items are available
 */
export async function checkStockAvailability(
  items: StockItem[]
): Promise<StockAvailability[]> {
  const insufficientStock: StockAvailability[] = []

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { stock: true, name: true },
    })

    if (!product || product.stock < item.quantity) {
      insufficientStock.push({
        productId: item.productId,
        available: product?.stock || 0,
        requested: item.quantity,
      })
    }
  }

  return insufficientStock
}

/**
 * Stock Flow:
 * 1. checkStockAvailability() - Verify all items are available
 * 2. reserveStock() - Reduce stock when creating order
 * 3. If payment fails: restoreStock() - Return stock to inventory
 * 4. If payment succeeds: Stock remains reserved (order confirmed)
 */
