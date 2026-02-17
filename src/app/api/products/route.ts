import { NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct, deleteManyProducts } from "@/lib/db/products"
import type { ProductFilters } from "@/lib/db/products"
import type { CategorySlug, Size, SortOption } from "@/types"
import { productSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"

/**
 * GET /api/products
 *
 * Query parameters:
 * - categories: Comma-separated category slugs
 * - minPrice, maxPrice: Price range numbers
 * - sizes: Comma-separated sizes
 * - colors: Comma-separated color names
 * - isNew, isFeatured: Boolean flags
 * - sortBy: Sort option
 * - limit, offset: Pagination parameters
 *
 * Response:
 * {
 *   products: Product[],
 *   total: number,
 *   hasMore: boolean
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse categories
    const categoriesParam = searchParams.get("categories")
    const categories = categoriesParam
      ? (categoriesParam.split(",") as CategorySlug[])
      : undefined

    // Parse price range
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const priceRange: [number, number] | undefined =
      minPrice || maxPrice
        ? [
            minPrice ? Number(minPrice) : 0,
            maxPrice ? Number(maxPrice) : 999999,
          ]
        : undefined

    // Parse sizes
    const sizesParam = searchParams.get("sizes")
    const sizes = sizesParam ? (sizesParam.split(",") as Size[]) : undefined

    // Parse colors
    const colorsParam = searchParams.get("colors")
    const colors = colorsParam ? colorsParam.split(",") : undefined

    // Parse boolean flags
    const isNew = searchParams.get("isNew") === "true"
    const isFeatured = searchParams.get("isFeatured") === "true"

    // Parse sort option
    const sortBy = (searchParams.get("sortBy") as SortOption) || "relevance"

    // Parse pagination
    const limit = Number(searchParams.get("limit")) || 12
    const offset = Number(searchParams.get("offset")) || 0

    // Build filters object
    const filters: ProductFilters = {
      ...(categories && { categories }),
      ...(priceRange && { priceRange }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
      ...(searchParams.has("isNew") && { isNew }),
      ...(searchParams.has("isFeatured") && { isFeatured }),
      sortBy,
      limit,
      offset,
    }

    // Execute query
    const { products, total } = await getProducts(filters)

    // Calculate if there are more products
    const hasMore = offset + products.length < total

    return NextResponse.json({
      products,
      total,
      hasMore,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * Create a new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    await requireAdmin()

    const body = await request.json()

    // Validate with zod
    const validatedData = productSchema.parse(body)

    // Create product
    const product = await createProduct(validatedData)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    // Handle auth errors
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products
 * Bulk delete products by IDs (Admin only)
 * Body: { ids: string[] }
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      )
    }

    const count = await deleteManyProducts(ids)

    return NextResponse.json({ success: true, deleted: count })
  } catch (error: any) {
    console.error("Error bulk deleting products:", error)

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 }
    )
  }
}
