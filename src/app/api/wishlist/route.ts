import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { getUserWishlist, clearUserWishlist } from "@/lib/db/wishlist"

/**
 * GET /api/wishlist
 * Get all wishlist product IDs for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const items = await getUserWishlist(userId)

    return NextResponse.json({ items })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[GET /api/wishlist] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wishlist
 * Clear all wishlist items for authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuth()

    await clearUserWishlist(userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[DELETE /api/wishlist] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
