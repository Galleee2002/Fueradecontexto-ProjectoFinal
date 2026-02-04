import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { syncCartFromLocalStorage } from "@/lib/db/cart"
import { syncCartSchema } from "@/lib/validations/cart"

/**
 * POST /api/cart/sync
 * Sync cart from localStorage to database
 * Merge strategy: add quantities together for duplicate items
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    const body = await request.json()

    // Validate input
    const validatedData = syncCartSchema.parse(body)

    // Sync cart from localStorage
    const mergedCart = await syncCartFromLocalStorage(userId, validatedData.items)

    return NextResponse.json({ items: mergedCart })
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

    console.error("[POST /api/cart/sync] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
