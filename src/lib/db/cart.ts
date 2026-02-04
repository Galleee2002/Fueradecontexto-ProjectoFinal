import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { CartItem, ProductColor, Size } from "@/types"
import { productInclude, transformProduct } from "./products"

// Include configuration for cart items with products
export const cartItemInclude = {
  product: {
    include: productInclude,
  },
} satisfies Prisma.CartItemInclude

// Type for Prisma cart item with product
type PrismaCartItemWithProduct = Prisma.CartItemGetPayload<{
  include: typeof cartItemInclude
}>

/**
 * Transform Prisma cart item to frontend CartItem type
 */
export function transformCartItem(item: PrismaCartItemWithProduct): CartItem {
  // Parse selectedColor from JSON
  const selectedColor =
    typeof item.selectedColor === "string"
      ? JSON.parse(item.selectedColor)
      : item.selectedColor

  return {
    product: transformProduct(item.product),
    quantity: item.quantity,
    selectedSize: item.selectedSize as Size,
    selectedColor: selectedColor as ProductColor,
  }
}

/**
 * Get all cart items for a user
 */
export async function getUserCart(userId: string): Promise<CartItem[]> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: cartItemInclude,
    orderBy: { createdAt: "desc" },
  })

  return items.map(transformCartItem)
}

/**
 * Add item to cart or update quantity if already exists
 */
export async function addCartItem(params: {
  userId: string
  productId: string
  size: Size
  color: ProductColor
  quantity: number
}): Promise<CartItem> {
  const { userId, productId, size, color, quantity } = params

  // Check if item already exists
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_selectedSize_colorName: {
        userId,
        productId,
        selectedSize: size,
        colorName: color.name,
      },
    },
    include: cartItemInclude,
  })

  if (existingItem) {
    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId_selectedSize_colorName: {
          userId,
          productId,
          selectedSize: size,
          colorName: color.name,
        },
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: cartItemInclude,
    })

    return transformCartItem(updatedItem)
  }

  // Create new cart item
  const newItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
      selectedSize: size,
      selectedColor: color as any, // Cast to any for JSON field
      colorName: color.name,
      colorHex: color.hex,
    },
    include: cartItemInclude,
  })

  return transformCartItem(newItem)
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(params: {
  userId: string
  productId: string
  size: Size
  colorName: string
  quantity: number
}): Promise<CartItem> {
  const { userId, productId, size, colorName, quantity } = params

  const updatedItem = await prisma.cartItem.update({
    where: {
      userId_productId_selectedSize_colorName: {
        userId,
        productId,
        selectedSize: size,
        colorName,
      },
    },
    data: { quantity },
    include: cartItemInclude,
  })

  return transformCartItem(updatedItem)
}

/**
 * Remove item from cart
 */
export async function removeCartItem(params: {
  userId: string
  productId: string
  size: Size
  colorName: string
}): Promise<void> {
  const { userId, productId, size, colorName } = params

  await prisma.cartItem.delete({
    where: {
      userId_productId_selectedSize_colorName: {
        userId,
        productId,
        selectedSize: size,
        colorName,
      },
    },
  })
}

/**
 * Clear all items from user's cart
 */
export async function clearUserCart(userId: string): Promise<void> {
  await prisma.cartItem.deleteMany({
    where: { userId },
  })
}

// Type for localStorage cart items (minimal product info)
type LocalStorageCartItem = {
  product: { id: string }
  quantity: number
  selectedSize: Size
  selectedColor: ProductColor
}

/**
 * Sync cart from localStorage to database
 * Merge strategy: if item exists in DB, add quantities together
 */
export async function syncCartFromLocalStorage(
  userId: string,
  localItems: LocalStorageCartItem[]
): Promise<CartItem[]> {
  // Use transaction to ensure atomic operation
  return await prisma.$transaction(async (tx) => {
    for (const localItem of localItems) {
      const { product, quantity, selectedSize, selectedColor } = localItem

      // Check if item already exists in database
      const existingItem = await tx.cartItem.findUnique({
        where: {
          userId_productId_selectedSize_colorName: {
            userId,
            productId: product.id,
            selectedSize,
            colorName: selectedColor.name,
          },
        },
      })

      if (existingItem) {
        // Merge: add quantities together
        await tx.cartItem.update({
          where: {
            userId_productId_selectedSize_colorName: {
              userId,
              productId: product.id,
              selectedSize,
              colorName: selectedColor.name,
            },
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        })
      } else {
        // Create new item
        await tx.cartItem.create({
          data: {
            userId,
            productId: product.id,
            quantity,
            selectedSize,
            selectedColor: selectedColor as any, // Cast to any for JSON field
            colorName: selectedColor.name,
            colorHex: selectedColor.hex,
          },
        })
      }
    }

    // Fetch and return merged cart
    const mergedCart = await tx.cartItem.findMany({
      where: { userId },
      include: cartItemInclude,
      orderBy: { createdAt: "desc" },
    })

    return mergedCart.map(transformCartItem)
  })
}
