import type { Product } from "@/types"
import type { ProductFilters } from "@/lib/db/products"

/**
 * API Client for fetching products from API routes
 * Used by Client Components
 */

interface FetchProductsResponse {
  products: Product[]
  total: number
  hasMore: boolean
}

/**
 * Fetch products with filters from API route
 */
export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<FetchProductsResponse> {
  const params = new URLSearchParams()

  // Add filters to query params
  if (filters.categories) {
    params.set("categories", filters.categories.join(","))
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    if (min > 0) params.set("minPrice", min.toString())
    if (max < 999999) params.set("maxPrice", max.toString())
  }
  if (filters.sizes) {
    params.set("sizes", filters.sizes.join(","))
  }
  if (filters.colors) {
    params.set("colors", filters.colors.join(","))
  }
  if (filters.isFlashSale !== undefined) {
    params.set("isFlashSale", filters.isFlashSale.toString())
  }
  if (filters.isNew !== undefined) {
    params.set("isNew", filters.isNew.toString())
  }
  if (filters.isFeatured !== undefined) {
    params.set("isFeatured", filters.isFeatured.toString())
  }
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy)
  }
  if (filters.limit) {
    params.set("limit", filters.limit.toString())
  }
  if (filters.offset) {
    params.set("offset", filters.offset.toString())
  }

  const queryString = params.toString()
  const url = `/api/products${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single product by slug from API route
 */
export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const response = await fetch(`/api/products/${slug}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Batch fetch products by IDs from API route
 * Used for wishlist
 */
export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  const response = await fetch("/api/products/by-ids", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch products by IDs: ${response.statusText}`)
  }

  return response.json()
}
