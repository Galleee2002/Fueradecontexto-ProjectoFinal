import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutFailurePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {/* Error Icon */}
      <XCircle className="h-20 w-20 text-destructive mx-auto mb-6" />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3">Pago No Completado</h1>
      <p className="text-muted-foreground mb-6">
        Hubo un problema al procesar tu pago. No se realizó ningún cargo.
      </p>

      {/* Error Details */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm text-muted-foreground">
          <strong>Posibles causas:</strong>
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
          <li>Fondos insuficientes</li>
          <li>Datos de tarjeta incorrectos</li>
          <li>Límite de compra excedido</li>
          <li>Cancelaste la operación</li>
        </ul>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Podés intentar nuevamente o usar otro método de pago. Si el problema
        persiste, contactanos.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/checkout">Intentar Nuevamente</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/carrito">Volver al Carrito</Link>
        </Button>
      </div>
    </div>
  )
}
