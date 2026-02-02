import { NextRequest, NextResponse } from "next/server"
import { getUsers, getUserStats } from "@/lib/db/users"
import { userFiltersSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"

/**
 * GET /api/users
 * Query params: search, role, isActive, page, limit
 * Returns: { users: User[], total: number, hasMore: boolean, stats: {...} }
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    await requireAdmin()

    const { searchParams } = new URL(request.url)

    // Parse and validate filters
    const filters = userFiltersSchema.parse({
      search: searchParams.get("search") || undefined,
      role: searchParams.get("role") || undefined,
      isActive:
        searchParams.get("isActive") === "true"
          ? true
          : searchParams.get("isActive") === "false"
          ? false
          : undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    })

    // Execute queries in parallel
    const [{ users, total }, stats] = await Promise.all([
      getUsers(filters),
      getUserStats(),
    ])

    // Calculate hasMore for pagination
    const hasMore = filters.page * filters.limit < total

    return NextResponse.json({
      users,
      total,
      hasMore,
      stats,
    })
  } catch (error: any) {
    console.error("Error fetching users:", error)

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
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
