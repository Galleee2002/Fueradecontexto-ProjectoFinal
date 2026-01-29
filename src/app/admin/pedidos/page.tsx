import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona los pedidos de la tienda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Próximamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La gestión de pedidos estará disponible próximamente. Aquí podrás
            ver y gestionar todos los pedidos de la tienda, actualizar estados
            de envío y más.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
