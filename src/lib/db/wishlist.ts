import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

/**
 * Get all wishlist product IDs for a user
 */
export async function getUserWishlist(userId: string): Promise<string[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    select: { productId: true },
    orderBy: { addedAt: "desc" },
  })

  return items.map((item) => item.productId)
}

/**
 * Add product to wishlist
 */
export async function addWishlistItem(
  userId: string,
  productId: string
): Promise<void> {
  await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  })
}

/**
 * Remove product from wishlist
 */
export async function removeWishlistItem(
  userId: string,
  productId: string
): Promise<void> {
  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })
}

/**
 * Clear all items from user's wishlist
 */
export async function clearUserWishlist(userId: string): Promise<void> {
  await prisma.wishlist.deleteMany({
    where: { userId },
  })
}

/**
 * Check if product is in user's wishlist
 */
export async function isInWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  const item = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })

  return item !== null
}

/**
 * Sync wishlist from localStorage to database
 * Merge strategy: add all local items that don't exist in DB
 */
export async function syncWishlistFromLocalStorage(
  userId: string,
  localProductIds: string[]
): Promise<string[]> {
  // Use transaction to ensure atomic operation
  return await prisma.$transaction(async (tx) => {
    for (const productId of localProductIds) {
      // Check if item already exists
      const existingItem = await tx.wishlist.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      // Only create if it doesn't exist
      if (!existingItem) {
        await tx.wishlist.create({
          data: {
            userId,
            productId,
          },
        })
      }
    }

    // Fetch and return merged wishlist
    const mergedWishlist = await tx.wishlist.findMany({
      where: { userId },
      select: { productId: true },
      orderBy: { addedAt: "desc" },
    })

    return mergedWishlist.map((item) => item.productId)
  })
}
