import { NextRequest, NextResponse } from "next/server"
import {
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/db/products"
import { productSchema } from "@/lib/validations/admin"
import { requireAdmin, getCurrentUserId } from "@/lib/auth"

/**
 * GET /api/products/[slug]
 *
 * Params:
 * - slug: Product slug OR id (query param ?byId=true for ID lookup)
 *
 * Response:
 * - Product object or 404
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const byId = searchParams.get("byId") === "true"

    // Support both slug and ID lookup
    const product = byId
      ? await getProductById(slug)
      : await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/products/[slug]?byId=true
 * Update product by ID (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check admin authorization
    // TODO: Replace with real auth
    const userId = getCurrentUserId()
    requireAdmin(userId)

    const { slug: id } = await params
    const body = await request.json()

    // Validate with zod (partial schema for updates)
    const validatedData = productSchema.partial().parse(body)

    // Update product
    const product = await updateProduct(id, validatedData)

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error updating product:", error)

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    // Handle auth errors
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products/[slug]?byId=true
 * Delete product by ID (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check admin authorization
    // TODO: Replace with real auth
    const userId = getCurrentUserId()
    requireAdmin(userId)

    const { slug: id } = await params

    await deleteProduct(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting product:", error)

    // Handle auth errors
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
