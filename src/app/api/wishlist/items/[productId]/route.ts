import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { removeWishlistItem } from "@/lib/db/wishlist"

/**
 * DELETE /api/wishlist/items/:productId
 * Remove product from wishlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const userId = await requireAuth()

    // Await params in Next.js 16
    const { productId } = await params

    // Remove from wishlist
    await removeWishlistItem(userId, productId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[DELETE /api/wishlist/items/:productId] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
