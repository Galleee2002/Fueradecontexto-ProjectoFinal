import { z } from "zod"

// ============================================
// PRODUCTS
// ============================================

const productColorSchema = z.object({
  name: z.string().min(1, "El nombre del color es requerido"),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Código hex inválido (ej: #FF0000)"),
})

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  originalPrice: z.number().positive().optional().nullable(),
  discount: z.number().int().min(0).max(100).optional().nullable(),
  category: z.enum(["buzos", "gorras", "camperas", "remeras", "accesorios"], {
    message: "Categoría inválida",
  }),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  soldCount: z.number().int().min(0),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  // Nested arrays
  images: z
    .array(
      z.object({
        url: z.string().url("URL de imagen inválida"),
        order: z.number().int().min(0).optional(),
      })
    )
    .min(1, "Al menos una imagen es requerida"),
  sizes: z
    .array(z.enum(["XS", "S", "M", "L", "XL", "XXL", "Unico"]))
    .min(1, "Al menos un tamaño es requerido"),
  colors: z.array(productColorSchema).min(1, "Al menos un color es requerido"),
  tags: z.array(z.string()),
})

export type ProductFormData = z.infer<typeof productSchema>

export const stockUpdateSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
})

export type StockUpdateData = z.infer<typeof stockUpdateSchema>

// ============================================
// ORDERS
// ============================================

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered"], {
    message: "Estado de pedido inválido",
  }),
})

export type OrderStatusData = z.infer<typeof orderStatusSchema>

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type OrderFiltersData = z.infer<typeof orderFiltersSchema>

// ============================================
// USERS
// ============================================

export const userStatusSchema = z.object({
  isActive: z.boolean(),
})

export type UserStatusData = z.infer<typeof userStatusSchema>

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["customer", "admin"]).optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type UserFiltersData = z.infer<typeof userFiltersSchema>

export const userRoleSchema = z.object({
  role: z.enum(["customer", "admin"], {
    message: "Rol inválido",
  }),
})

export type UserRoleData = z.infer<typeof userRoleSchema>

export const createUserSchema = z
  .object({
    email: z.string().email("Email inválido").min(1, "El email es requerido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres"),
    lastName: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres"),
    phone: z
      .string()
      .regex(/^[0-9+\-\s()]*$/, "Teléfono inválido")
      .optional()
      .nullable(),
    role: z.enum(["customer", "admin"], { message: "Rol inválido" }),
    emailVerified: z.boolean(),
    isActive: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type CreateUserFormData = z.infer<typeof createUserSchema>
