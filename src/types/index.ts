export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  category: CategorySlug
  sizes: Size[]
  colors: ProductColor[]
  rating: number
  reviewCount: number
  soldCount: number
  isNew?: boolean
  isFeatured?: boolean
  isFlashSale?: boolean
  stock: number
  tags: string[]
}

export type CategorySlug =
  | "buzos"
  | "gorras"
  | "camperas"
  | "remeras"
  | "accesorios"

export interface Category {
  slug: CategorySlug
  name: string
  icon: string
  description: string
  productCount: number
}

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Unico"

export interface ProductColor {
  name: string
  hex: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: Size
  selectedColor: ProductColor
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  image: string
  backgroundColor: string
}

export interface FilterState {
  categories: CategorySlug[]
  priceRange: [number, number]
  sizes: Size[]
  colors: string[]
  sortBy: SortOption
}

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "best-selling"

export interface WishlistItem {
  productId: string
  addedAt: Date
}

export interface OrderSummary {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered"
  items: CartItem[]
  total: number
}

export interface Address {
  id: string
  label: string
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  phone: string
  isDefault: boolean
}

// ============================================
// ORDERS (Admin)
// ============================================

export interface Order {
  id: string
  orderNumber: string
  userId: string
  userName: string          // Computed: user.firstName + lastName
  userEmail: string         // Denormalized for search
  status: "pending" | "confirmed" | "shipped" | "delivered"
  paymentStatus: "pending" | "paid" | "failed"
  subtotal: number
  discount: number
  shippingCost: number
  tax: number
  total: number
  shippingAddress: Address  // Parsed from JSON
  billingAddress: Address   // Parsed from JSON
  createdAt: Date
  updatedAt: Date
  items?: OrderItem[]       // Optional, loaded in detail view
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productSnapshot: { name: string; price: number; image: string }
  quantity: number
  unitPrice: number
  subtotal: number
  selectedSize: string
  selectedColor: { name: string; hex: string }
}

// ============================================
// USERS (Admin)
// ============================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string          // Computed: firstName + lastName
  phone: string | null
  avatar: string | null
  emailVerified: boolean
  role: "customer" | "admin"
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
  ordersCount?: number      // Computed: _count.orders
  addresses?: Address[]     // Optional, loaded in detail view
  orders?: Order[]          // Optional, loaded in detail view
}
