import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { updateCartItemQuantity, removeCartItem } from "@/lib/db/cart"
import { updateQuantitySchema } from "@/lib/validations/cart"
import { Size } from "@/types"

/**
 * PATCH /api/cart/items/:key
 * Update cart item quantity
 * Key format: productId-size-colorName
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const userId = await requireAuth()

    // Await params in Next.js 16
    const { key } = await params

    // Parse key: productId-size-colorName
    const parts = key.split("-")
    if (parts.length < 3) {
      return NextResponse.json(
        { error: "Invalid cart item key format" },
        { status: 400 }
      )
    }

    const productId = parts[0]
    const size = parts[1] as Size
    const colorName = parts.slice(2).join("-") // Handle color names with dashes

    const body = await request.json()

    // Validate input
    const validatedData = updateQuantitySchema.parse(body)

    // Update quantity
    const item = await updateCartItemQuantity({
      userId,
      productId,
      size,
      colorName,
      quantity: validatedData.quantity,
    })

    return NextResponse.json({ item })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("[PATCH /api/cart/items/:key] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/items/:key
 * Remove item from cart
 * Key format: productId-size-colorName
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const userId = await requireAuth()

    // Await params in Next.js 16
    const { key } = await params

    // Parse key: productId-size-colorName
    const parts = key.split("-")
    if (parts.length < 3) {
      return NextResponse.json(
        { error: "Invalid cart item key format" },
        { status: 400 }
      )
    }

    const productId = parts[0]
    const size = parts[1] as Size
    const colorName = parts.slice(2).join("-") // Handle color names with dashes

    // Remove item
    await removeCartItem({
      userId,
      productId,
      size,
      colorName,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[DELETE /api/cart/items/:key] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
