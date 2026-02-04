import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { getUserCart, clearUserCart } from "@/lib/db/cart"

/**
 * GET /api/cart
 * Get all cart items for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const items = await getUserCart(userId)

    return NextResponse.json({ items })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[GET /api/cart] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart
 * Clear all cart items for authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuth()

    await clearUserCart(userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[DELETE /api/cart] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
