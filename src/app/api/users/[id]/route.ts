import { NextRequest, NextResponse } from "next/server"
import { getUserById, updateUserStatus, updateUserRole } from "@/lib/db/users"
import { userStatusSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"
import { z } from "zod"

const userRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
})

/**
 * GET /api/users/[id]
 * Returns: User with full details (addresses, orders included)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin()

    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error fetching user:", error)

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/[id]
 * Body: { isActive: boolean } OR { role: "customer" | "admin" }
 * Returns: Updated User
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin()

    const { id } = await params
    const body = await request.json()

    let user

    // Handle status update
    if ("isActive" in body) {
      const { isActive } = userStatusSchema.parse(body)
      user = await updateUserStatus(id, isActive)
    }
    // Handle role update
    else if ("role" in body) {
      const { role } = userRoleSchema.parse(body)
      user = await updateUserRole(id, role)
    } else {
      return NextResponse.json(
        { error: "Must provide either isActive or role" },
        { status: 400 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error updating user:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
