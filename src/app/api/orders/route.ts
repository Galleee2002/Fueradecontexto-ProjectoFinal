import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderStats } from "@/lib/db/orders"
import { orderFiltersSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"

/**
 * GET /api/orders
 * Query params: search, status, startDate, endDate, page, limit
 * Returns: { orders: Order[], total: number, hasMore: boolean, stats: {...} }
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    await requireAdmin()

    const { searchParams } = new URL(request.url)

    // Parse and validate filters
    const filters = orderFiltersSchema.parse({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    })

    // Execute queries in parallel
    const [{ orders, total }, stats] = await Promise.all([
      getOrders(filters),
      getOrderStats(),
    ])

    // Calculate hasMore for pagination
    const hasMore = filters.page * filters.limit < total

    return NextResponse.json({
      orders,
      total,
      hasMore,
      stats,
    })
  } catch (error: any) {
    console.error("Error fetching orders:", error)

    // Handle auth errors
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid filters", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
