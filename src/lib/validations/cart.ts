import { z } from "zod"

// Product color schema
export const productColorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
})

// Size enum schema
export const sizeSchema = z.enum(["XS", "S", "M", "L", "XL", "XXL", "Unico"], {
  message: "Invalid size",
})

// Add cart item schema
export const addCartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  size: sizeSchema,
  color: productColorSchema,
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
})

// Update quantity schema
export const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
})

// Cart item for sync (from localStorage)
export const cartItemSchema = z.object({
  product: z.object({
    id: z.string().uuid(),
  }),
  quantity: z.number().int().min(1).max(100),
  selectedSize: sizeSchema,
  selectedColor: productColorSchema,
})

// Sync cart schema
export const syncCartSchema = z.object({
  items: z.array(cartItemSchema),
})

// Add wishlist item schema
export const addWishlistItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
})

// Sync wishlist schema
export const syncWishlistSchema = z.object({
  items: z.array(z.string().uuid("Invalid product ID")),
})

// Type exports
export type AddCartItemInput = z.infer<typeof addCartItemSchema>
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type SyncCartInput = z.infer<typeof syncCartSchema>
export type AddWishlistItemInput = z.infer<typeof addWishlistItemSchema>
export type SyncWishlistInput = z.infer<typeof syncWishlistSchema>
