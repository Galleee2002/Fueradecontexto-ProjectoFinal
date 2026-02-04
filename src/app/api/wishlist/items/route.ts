import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { addWishlistItem } from "@/lib/db/wishlist"
import { addWishlistItemSchema } from "@/lib/validations/cart"

/**
 * POST /api/wishlist/items
 * Add product to wishlist
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const body = await request.json()

    // Validate input
    const validatedData = addWishlistItemSchema.parse(body)

    // Add to wishlist
    await addWishlistItem(userId, validatedData.productId)

    return NextResponse.json({ success: true })
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

    // Handle unique constraint violation (item already in wishlist)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 409 }
      )
    }

    console.error("[POST /api/wishlist/items] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
