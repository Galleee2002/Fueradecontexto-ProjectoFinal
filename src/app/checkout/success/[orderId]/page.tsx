import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth/auth-utils"
import { getOrderById } from "@/lib/db/orders"
import { formatPrice } from "@/lib/formatters"

interface PageProps {
  params: { orderId: string }
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  // Authenticate user
  const userId = await requireAuth()

  // Get order
  const order = await getOrderById(params.orderId)

  // Validate order exists and belongs to user
  if (!order) {
    notFound()
  }

  if (order.userId !== userId) {
    redirect("/")
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3">¡Pedido Confirmado!</h1>
      <p className="text-muted-foreground mb-2">
        Gracias por tu compra en Fuera de Contexto
      </p>

      {/* Order Number Box */}
      <div className="bg-card rounded-lg p-6 my-6 inline-block border-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Package className="h-4 w-4" />
          Número de pedido
        </div>
        <p className="text-2xl font-bold font-mono">{order.orderNumber}</p>
      </div>

      {/* Order Details */}
      <div className="bg-card rounded-lg p-4 mb-6 text-left border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total pagado:</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estado:</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6">
        Vas a recibir un email con los detalles de tu pedido y el seguimiento del
        envío.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/mi-cuenta/pedidos">Ver Mis Pedidos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  )
}
