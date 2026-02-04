import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { addCartItem } from "@/lib/db/cart"
import { addCartItemSchema } from "@/lib/validations/cart"

/**
 * POST /api/cart/items
 * Add item to cart or update quantity if already exists
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const body = await request.json()

    // Validate input
    const validatedData = addCartItemSchema.parse(body)

    // Add item to cart
    const item = await addCartItem({
      userId,
      productId: validatedData.productId,
      size: validatedData.size,
      color: validatedData.color,
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

    console.error("[POST /api/cart/items] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
