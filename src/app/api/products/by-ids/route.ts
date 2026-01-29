import { NextResponse } from "next/server"
import { getProductsByIds } from "@/lib/db/products"

/**
 * POST /api/products/by-ids
 *
 * Body:
 * {
 *   ids: string[]
 * }
 *
 * Response:
 * Product[]
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: "ids must be an array" },
        { status: 400 }
      )
    }

    const products = await getProductsByIds(ids)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products by IDs:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
