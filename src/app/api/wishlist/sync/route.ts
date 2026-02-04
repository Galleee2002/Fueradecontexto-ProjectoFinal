import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { syncWishlistFromLocalStorage } from "@/lib/db/wishlist"
import { syncWishlistSchema } from "@/lib/validations/cart"

/**
 * POST /api/wishlist/sync
 * Sync wishlist from localStorage to database
 * Merge strategy: add items that don't exist in DB
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const body = await request.json()

    // Validate input
    const validatedData = syncWishlistSchema.parse(body)

    // Sync wishlist from localStorage
    const mergedWishlist = await syncWishlistFromLocalStorage(
      userId,
      validatedData.items
    )

    return NextResponse.json({ items: mergedWishlist })
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

    console.error("[POST /api/wishlist/sync] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
