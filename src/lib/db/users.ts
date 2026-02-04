import { prisma } from "@/lib/prisma"
import { User } from "@/types"
import { UserFiltersData } from "@/lib/validations/admin"
import { transformOrder } from "@/lib/db/orders"
import { hashPassword } from "@/lib/auth/password-utils"
import type { Prisma } from "@prisma/client"

// ============================================
// PRISMA CONFIGURATION
// ============================================

/**
 * Minimal include for user list view
 * Only includes order count
 */
export const userInclude = {
  _count: { select: { orders: true } },
} satisfies Prisma.UserInclude

/**
 * Detailed include for single user view
 * Includes addresses and recent orders
 */
export const userDetailInclude = {
  addresses: true,
  orders: {
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" as const },
    take: 10, // Last 10 orders only
  },
} satisfies Prisma.UserInclude

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transforms Prisma user data to frontend User type
 * CRITICAL: NEVER includes password field
 */
export function transformUser(prismaUser: any, includeRelations = false): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    // CRITICAL: NEVER include password
    firstName: prismaUser.firstName,
    lastName: prismaUser.lastName,
    fullName: `${prismaUser.firstName} ${prismaUser.lastName}`,
    phone: prismaUser.phone,
    avatar: prismaUser.avatar,
    emailVerified: prismaUser.emailVerified,
    role: prismaUser.role as User["role"],
    isActive: prismaUser.isActive,
    lastLoginAt: prismaUser.lastLoginAt,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    ordersCount: prismaUser._count?.orders,
    ...(includeRelations && {
      addresses: prismaUser.addresses,
      orders: prismaUser.orders?.map(transformOrder),
    }),
  }
}

// ============================================
// QUERY BUILDERS
// ============================================

/**
 * Builds Prisma where clause from filters
 */
function buildWhereClause(filters: Partial<UserFiltersData>): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {}

  // Search: firstName OR lastName OR email
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  // Role filter
  if (filters.role) {
    where.role = filters.role
  }

  // isActive filter (handle boolean conversion)
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  return where
}

// ============================================
// MAIN QUERY FUNCTIONS
// ============================================

/**
 * Get users with optional filters and pagination
 */
export async function getUsers(
  filters: Partial<UserFiltersData> = {}
): Promise<{ users: User[]; total: number }> {
  const where = buildWhereClause(filters)
  const skip = ((filters.page || 1) - 1) * (filters.limit || 20)
  const take = filters.limit || 20

  const [prismaUsers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: userInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ])

  return {
    users: prismaUsers.map((u) => transformUser(u, false)),
    total,
  }
}

/**
 * Get single user by ID with full details
 */
export async function getUserById(id: string): Promise<User | null> {
  const prismaUser = await prisma.user.findUnique({
    where: { id },
    include: userDetailInclude,
  })

  return prismaUser ? transformUser(prismaUser, true) : null
}

/**
 * Update user active status
 */
export async function updateUserStatus(
  id: string,
  isActive: boolean
): Promise<User> {
  const prismaUser = await prisma.user.update({
    where: { id },
    data: { isActive },
    include: userInclude,
  })

  return transformUser(prismaUser, false)
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  role: User["role"]
): Promise<User> {
  const prismaUser = await prisma.user.update({
    where: { id },
    data: { role },
    include: userInclude,
  })

  return transformUser(prismaUser, false)
}

/**
 * Get user statistics for dashboard
 */
export async function getUserStats(): Promise<{
  total: number
  active: number
  inactive: number
  customers: number
  admins: number
}> {
  const [total, active, inactive, customers, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.user.count({ where: { role: "admin" } }),
  ])

  return { total, active, inactive, customers, admins }
}

// ============================================
// USER CREATION & DELETION
// ============================================

export interface CreateUserData {
  email: string
  password: string // Plain text - will be hashed
  firstName: string
  lastName: string
  phone?: string | null
  role?: "customer" | "admin"
  emailVerified?: boolean
  isActive?: boolean
}

/**
 * Create a new user
 * Validates email uniqueness and hashes password
 */
export async function createUser(data: CreateUserData): Promise<User> {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error("El email ya está registrado")
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password)

  // Create user with defaults
  const prismaUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || "customer",
      emailVerified: data.emailVerified || false,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
    include: userInclude,
  })

  return transformUser(prismaUser, false)
}

/**
 * Delete a user
 * Prevents self-deletion and last admin deletion
 */
export async function deleteUser(id: string, currentUserId: string): Promise<void> {
  // Prevent self-deletion
  if (id === currentUserId) {
    throw new Error("No puedes eliminar tu propia cuenta")
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  // If deleting an admin, check if they're the last one
  if (user.role === "admin") {
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    })

    if (adminCount <= 1) {
      throw new Error("No puedes eliminar el último administrador")
    }
  }

  // Hard delete (cascade will remove addresses)
  await prisma.user.delete({
    where: { id },
  })
}
