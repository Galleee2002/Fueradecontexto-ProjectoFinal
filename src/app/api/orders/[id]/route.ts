import { NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/db/orders"
import { orderStatusSchema } from "@/lib/validations/admin"
import { requireAdmin } from "@/lib/auth/auth-utils"

/**
 * GET /api/orders/[id]
 * Returns: Order with full details (items included)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/orders/[id]
 * Body: { status: "pending" | "confirmed" | "shipped" | "delivered" }
 * Returns: Updated Order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const { status } = orderStatusSchema.parse(body)

    const order = await updateOrderStatus(id, status)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error updating order status:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid status", details: error.errors },
        { status: 400 }
      )
    }

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
}
