import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/auth-utils"
import { createOrderSchema } from "@/lib/validations/checkout"
import { createOrder, updateOrderMpPreference } from "@/lib/db/orders"
import {
  checkStockAvailability,
  reserveStock,
  restoreStock,
} from "@/lib/db/stock"
import { createPreference, getCheckoutUrl } from "@/lib/mercadopago/preference"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/checkout/create-order
 * Creates an order and returns Mercado Pago checkout URL
 *
 * Flow:
 * 1. Authenticate user
 * 2. Validate request body
 * 3. Check stock availability
 * 4. Reserve stock
 * 5. Create order in database
 * 6. Create Mercado Pago preference
 * 7. Return checkout URL
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const userId = await requireAuth()

    // 2. Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // 3. Parse and validate request body
    const body = await request.json()

    // Validate main schema (address + shipping method)
    const validated = createOrderSchema.parse(body)

    // Validate cart items exist
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    // 4. Fetch products and construct order items
    const productIds = body.items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    })

    // Build order items with product data
    const orderItems = body.items.map((cartItem: any) => {
      const product = products.find((p) => p.id === cartItem.productId)

      if (!product) {
        throw new Error(`Producto ${cartItem.productId} no encontrado`)
      }

      return {
        productId: product.id,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        productSnapshot: {
          name: product.name,
          price: product.price,
          image: product.images[0]?.url || "",
        },
      }
    })

    // 5. Calculate totals
    const subtotal = orderItems.reduce(
      (sum: number, item: typeof orderItems[number]) =>
        sum + item.unitPrice * item.quantity,
      0
    )
    const shippingCost = validated.shippingMethod.cost
    const discount = 0 // TODO: Apply coupons
    const tax = 0 // TODO: Calculate tax if needed
    const total = subtotal + shippingCost - discount + tax

    // 6. Check stock availability
    const stockCheck = await checkStockAvailability(
      orderItems.map((item: typeof orderItems[number]) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    )

    if (stockCheck.length > 0) {
      return NextResponse.json(
        {
          error: "Stock insuficiente para algunos productos",
          details: stockCheck,
        },
        { status: 409 }
      )
    }

    // 7. Reserve stock
    try {
      await reserveStock(
        orderItems.map((item: typeof orderItems[number]) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )
    } catch (error) {
      console.error("Error reserving stock:", error)
      return NextResponse.json(
        { error: "Error al reservar stock" },
        { status: 500 }
      )
    }

    // 8. Create order in database
    let order
    try {
      order = await createOrder({
        userId,
        shippingAddress: validated.shippingAddress,
        shippingCost,
        items: orderItems,
        subtotal,
        discount,
        tax,
        total,
      })
    } catch (error) {
      console.error("Error creating order:", error)
      // Rollback: restore stock
      await restoreStock(
        orderItems.map((item: typeof orderItems[number]) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )
      return NextResponse.json({ error: "Error al crear orden" }, { status: 500 })
    }

    // 9. Create Mercado Pago preference
    let preferenceId: string
    try {
      preferenceId = await createPreference({
        order,
        userEmail: user.email,
      })

      // Update order with preference ID
      await updateOrderMpPreference(order.id, preferenceId)
    } catch (error) {
      console.error("Error creating MP preference:", error)
      // Rollback: restore stock
      await restoreStock(
        orderItems.map((item: typeof orderItems[number]) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )
      return NextResponse.json(
        { error: "Error al crear preferencia de pago" },
        { status: 500 }
      )
    }

    // 10. Return success response with checkout URL
    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
        },
        checkoutUrl: getCheckoutUrl(preferenceId),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error in create-order:", error)

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    // Handle authentication errors
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Generic error
    return NextResponse.json(
      { error: "Error al procesar la orden" },
      { status: 500 }
    )
  }
}
