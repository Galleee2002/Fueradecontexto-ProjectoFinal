import { prisma } from "@/lib/prisma"
import { Product, ProductColor, Size, CategorySlug, SortOption } from "@/types"
import type { Prisma } from "@prisma/client"

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ProductFilters {
  categories?: CategorySlug[]
  priceRange?: [number, number]
  sizes?: Size[]
  colors?: string[]
  isFlashSale?: boolean
  isNew?: boolean
  isFeatured?: boolean
  sortBy?: SortOption
  limit?: number
  offset?: number
}

// ============================================
// PRISMA CONFIGURATION
// ============================================

/**
 * Standard include configuration for product queries
 * Includes all related data needed for frontend display
 */
export const productInclude = {
  images: {
    select: { url: true, order: true },
    orderBy: { order: "asc" as const },
  },
  sizes: {
    select: { size: true },
  },
  colors: {
    select: { name: true, hex: true },
  },
  tags: {
    select: { tag: true },
  },
} satisfies Prisma.ProductInclude

// Type for Prisma product with includes
type PrismaProductWithIncludes = Prisma.ProductGetPayload<{
  include: typeof productInclude
}>

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transforms Prisma product data to frontend Product type
 * Flattens nested relations into simple arrays
 */
export function transformProduct(p: PrismaProductWithIncludes): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    discount: p.discount ?? undefined,
    images: p.images.map((img) => img.url),
    category: p.category as CategorySlug,
    sizes: p.sizes.map((s) => s.size as Size),
    colors: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
    rating: p.rating,
    reviewCount: p.reviewCount,
    soldCount: p.soldCount,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isFlashSale: p.isFlashSale,
    stock: p.stock,
    tags: p.tags.map((t) => t.tag),
  }
}

// ============================================
// QUERY BUILDERS
// ============================================

/**
 * Builds Prisma where clause from filters
 */
function buildWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {}

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    where.category = { in: filters.categories }
  }

  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    if (min > 0 || max < 999999) {
      where.price = {
        ...(min > 0 && { gte: min }),
        ...(max < 999999 && { lte: max }),
      }
    }
  }

  // Size filter
  if (filters.sizes && filters.sizes.length > 0) {
    where.sizes = {
      some: {
        size: { in: filters.sizes },
      },
    }
  }

  // Color filter
  if (filters.colors && filters.colors.length > 0) {
    where.colors = {
      some: {
        name: { in: filters.colors },
      },
    }
  }

  // Boolean flags
  if (filters.isFlashSale !== undefined) {
    where.isFlashSale = filters.isFlashSale
  }
  if (filters.isNew !== undefined) {
    where.isNew = filters.isNew
  }
  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured
  }

  return where
}

/**
 * Builds Prisma orderBy clause from sort option
 */
function buildOrderByClause(sortBy?: SortOption): Prisma.ProductOrderByWithRelationInput {
  switch (sortBy) {
    case "price-asc":
      return { price: "asc" }
    case "price-desc":
      return { price: "desc" }
    case "newest":
      return { createdAt: "desc" }
    case "best-selling":
      return { soldCount: "desc" }
    case "relevance":
    default:
      return { soldCount: "desc" } // Default to best-selling
  }
}

// ============================================
// MAIN QUERY FUNCTIONS
// ============================================

/**
 * Get products with optional filters, sorting, and pagination
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
  const where = buildWhereClause(filters)
  const orderBy = buildOrderByClause(filters.sortBy)

  const [prismaProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: productInclude,
      take: filters.limit,
      skip: filters.offset,
    }),
    prisma.product.count({ where }),
  ])

  const products = prismaProducts.map(transformProduct)

  return { products, total }
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prismaProduct = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  })

  if (!prismaProduct) return null

  return transformProduct(prismaProduct)
}

/**
 * Get multiple products by IDs
 * Used for wishlist functionality
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []

  const prismaProducts = await prisma.product.findMany({
    where: {
      id: { in: ids },
    },
    include: productInclude,
  })

  return prismaProducts.map(transformProduct)
}

/**
 * Get products by category with optional exclusion
 * Used for related products
 */
export async function getProductsByCategory(
  category: CategorySlug,
  options: {
    excludeId?: string
    limit?: number
  } = {}
): Promise<Product[]> {
  const prismaProducts = await prisma.product.findMany({
    where: {
      category,
      ...(options.excludeId && { id: { not: options.excludeId } }),
    },
    include: productInclude,
    take: options.limit,
  })

  return prismaProducts.map(transformProduct)
}

// ============================================
// ADMIN MUTATIONS
// ============================================

export interface CreateProductData {
  slug: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  discount?: number | null
  category: string
  stock: number
  rating?: number
  reviewCount?: number
  soldCount?: number
  isNew?: boolean
  isFeatured?: boolean
  isFlashSale?: boolean
  images: { url: string; order?: number }[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  tags?: string[]
}

/**
 * Create a new product with all related data
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
  const prismaProduct = await prisma.product.create({
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      discount: data.discount,
      category: data.category,
      stock: data.stock,
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      soldCount: data.soldCount ?? 0,
      isNew: data.isNew ?? false,
      isFeatured: data.isFeatured ?? false,
      isFlashSale: data.isFlashSale ?? false,
      images: {
        create: data.images.map((img, index) => ({
          url: img.url,
          order: img.order ?? index,
        })),
      },
      sizes: {
        create: data.sizes.map((size) => ({ size })),
      },
      colors: {
        create: data.colors,
      },
      tags: {
        create: (data.tags ?? []).map((tag) => ({ tag })),
      },
    },
    include: productInclude,
  })

  return transformProduct(prismaProduct)
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>
): Promise<Product> {
  // If updating relations, delete old ones first
  const updateData: any = {
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.originalPrice !== undefined && { originalPrice: data.originalPrice }),
    ...(data.discount !== undefined && { discount: data.discount }),
    ...(data.category !== undefined && { category: data.category }),
    ...(data.stock !== undefined && { stock: data.stock }),
    ...(data.rating !== undefined && { rating: data.rating }),
    ...(data.reviewCount !== undefined && { reviewCount: data.reviewCount }),
    ...(data.soldCount !== undefined && { soldCount: data.soldCount }),
    ...(data.isNew !== undefined && { isNew: data.isNew }),
    ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
    ...(data.isFlashSale !== undefined && { isFlashSale: data.isFlashSale }),
  }

  // Handle images update
  if (data.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } })
    updateData.images = {
      create: data.images.map((img, index) => ({
        url: img.url,
        order: img.order ?? index,
      })),
    }
  }

  // Handle sizes update
  if (data.sizes) {
    await prisma.productSize.deleteMany({ where: { productId: id } })
    updateData.sizes = {
      create: data.sizes.map((size) => ({ size })),
    }
  }

  // Handle colors update
  if (data.colors) {
    await prisma.productColor.deleteMany({ where: { productId: id } })
    updateData.colors = {
      create: data.colors,
    }
  }

  // Handle tags update
  if (data.tags) {
    await prisma.productTag.deleteMany({ where: { productId: id } })
    updateData.tags = {
      create: data.tags.map((tag) => ({ tag })),
    }
  }

  const prismaProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: productInclude,
  })

  return transformProduct(prismaProduct)
}

/**
 * Delete a product and all related data
 */
export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({
    where: { id },
  })
}

/**
 * Get product by ID (for admin)
 */
export async function getProductById(id: string): Promise<Product | null> {
  const prismaProduct = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  })

  if (!prismaProduct) return null

  return transformProduct(prismaProduct)
}

/**
 * Update product stock
 */
export async function updateProductStock(id: string, stock: number): Promise<Product> {
  const prismaProduct = await prisma.product.update({
    where: { id },
    data: { stock },
    include: productInclude,
  })

  return transformProduct(prismaProduct)
}
