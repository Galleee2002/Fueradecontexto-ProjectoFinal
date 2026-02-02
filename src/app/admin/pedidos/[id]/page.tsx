import { getOrderById } from "@/lib/db/orders"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrderStatusUpdater } from "@/components/admin/order-status-updater"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pedido #{order.orderNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            {format(new Date(order.createdAt), "PPpp", { locale: es })}
          </p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Estado del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge type="order" value={order.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Estado del Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge type="payment" value={order.paymentStatus} />
          </CardContent>
        </Card>
      </div>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Nombre</p>
            <p className="text-sm text-muted-foreground">{order.userName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{order.userEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Talle</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unit.</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded border">
                        <Image
                          src={item.productSnapshot.image}
                          alt={item.productSnapshot.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <span className="font-medium">
                        {item.productSnapshot.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.selectedSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>{item.selectedColor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    ${item.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Descuento</span>
              <span className="text-red-500">
                -${order.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span>${order.shippingCost.toFixed(2)}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Impuestos</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dirección de Envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dirección de Facturación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{order.billingAddress.fullName}</p>
            <p>{order.billingAddress.street}</p>
            <p>
              {order.billingAddress.city}, {order.billingAddress.province}{" "}
              {order.billingAddress.postalCode}
            </p>
            <p>{order.billingAddress.phone}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
