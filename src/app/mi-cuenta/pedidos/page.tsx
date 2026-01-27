import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/formatters"

const statusConfig = {
  pending: { label: "Pendiente", variant: "outline" as const },
  processing: { label: "En Proceso", variant: "secondary" as const },
  shipped: { label: "Enviado", variant: "default" as const },
  delivered: { label: "Entregado", variant: "default" as const },
}

const mockOrders = [
  {
    id: "FDC-2026-00142",
    date: "25 ene 2026",
    status: "shipped" as const,
    itemCount: 2,
    total: 87000,
  },
  {
    id: "FDC-2026-00098",
    date: "10 ene 2026",
    status: "delivered" as const,
    itemCount: 1,
    total: 45000,
  },
  {
    id: "FDC-2025-00321",
    date: "15 dic 2025",
    status: "delivered" as const,
    itemCount: 3,
    total: 62000,
  },
]

export default function PedidosPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Mis Pedidos</h2>
      <div className="space-y-4">
        {mockOrders.map((order) => {
          const status = statusConfig[order.status]
          return (
            <div key={order.id} className="bg-card rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-mono font-bold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <Separator className="mb-3" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {order.itemCount} {order.itemCount === 1 ? "producto" : "productos"}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatPrice(order.total)}</span>
                  <Button variant="outline" size="sm">
                    Ver Detalle
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
