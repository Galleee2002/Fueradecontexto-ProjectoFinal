import { NextRequest, NextResponse } from "next/server"
import { getUsers, getUserStats, createUser } from "@/lib/db/users"
import { userFiltersSchema, createUserSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"
import { validatePasswordStrength } from "@/lib/auth/password-utils"

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

/**
 * POST /api/users
 * Body: CreateUserFormData (email, password, firstName, lastName, phone, role, emailVerified, isActive)
 * Returns: User (without password)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    await requireAdmin()

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    const { confirmPassword, ...userData } = validatedData

    // Apply defaults if not provided
    const userDataWithDefaults = {
      ...userData,
      role: userData.role || "customer",
      emailVerified: userData.emailVerified ?? false,
      isActive: userData.isActive ?? true,
    }

    // Server-side password strength check (defense in depth)
    const passwordValidation = validatePasswordStrength(userData.password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Contraseña débil",
          details: passwordValidation.errors,
        },
        { status: 400 }
      )
    }

    // Create user (will hash password and validate email uniqueness)
    const user = await createUser(userDataWithDefaults)

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error.message?.includes("ya está registrado")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}
