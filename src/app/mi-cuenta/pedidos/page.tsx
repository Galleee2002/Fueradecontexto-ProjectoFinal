import { Package } from "lucide-react"

export default function PedidosPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Mis Pedidos</h2>
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Package className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-base">Aún no tienes pedidos realizados</p>
        <p className="text-sm mt-1">Cuando realices una compra, aparecerá aquí.</p>
      </div>
    </div>
  )
}
