import { z } from "zod"

/**
 * Validation schemas for checkout flow
 * Used in both frontend (react-hook-form) and backend (API routes)
 */

export const shippingAddressSchema = z.object({
  fullName: z
    .string({ message: "El nombre completo es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),

  email: z
    .string({ message: "El email es requerido" })
    .email("Email inválido"),

  phone: z
    .string({ message: "El teléfono es requerido" })
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .regex(/^[0-9\s\-\+\(\)]+$/, "El teléfono solo puede contener números, espacios y símbolos +()-"),

  street: z
    .string({ message: "La calle es requerida" })
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),

  city: z
    .string({ message: "La ciudad es requerida" })
    .min(2, "La ciudad debe tener al menos 2 caracteres"),

  province: z.enum(
    [
      "Buenos Aires",
      "CABA",
      "Catamarca",
      "Chaco",
      "Chubut",
      "Córdoba",
      "Corrientes",
      "Entre Ríos",
      "Formosa",
      "Jujuy",
      "La Pampa",
      "La Rioja",
      "Mendoza",
      "Misiones",
      "Neuquén",
      "Río Negro",
      "Salta",
      "San Juan",
      "San Luis",
      "Santa Cruz",
      "Santa Fe",
      "Santiago del Estero",
      "Tierra del Fuego",
      "Tucumán",
    ],
    { message: "Provincia inválida" }
  ),

  postalCode: z
    .string({ message: "El código postal es requerido" })
    .min(4, "El código postal debe tener al menos 4 caracteres")
    .max(8, "El código postal no puede exceder 8 caracteres"),

  saveAddress: z.boolean().optional(),
})

export const shippingMethodSchema = z.object({
  method: z.enum(["standard", "express"], {
    message: "Método de envío inválido",
  }),
  cost: z.number().min(0, "El costo no puede ser negativo"),
})

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema.omit({ saveAddress: true }),
  shippingMethod: shippingMethodSchema,
})

// Types
export type ShippingAddressData = z.infer<typeof shippingAddressSchema>
export type ShippingMethodData = z.infer<typeof shippingMethodSchema>
export type CreateOrderData = z.infer<typeof createOrderSchema>
