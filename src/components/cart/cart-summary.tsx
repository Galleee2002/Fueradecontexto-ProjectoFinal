"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/formatters"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants"

interface CartSummaryProps {
  subtotal: number
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD

  return (
    <div className="bg-card rounded-lg p-6 sticky top-24 space-y-4">
      <h3 className="font-bold text-lg">Resumen del Pedido</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envio</span>
          <span className={freeShipping ? "text-primary font-medium" : ""}>
            {freeShipping ? "GRATIS" : "Calculado en checkout"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Cupon de descuento" className="text-sm" />
        <Button variant="outline" size="sm">
          Aplicar
        </Button>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/checkout">Ir al Checkout</Link>
      </Button>

      <div className="text-center">
        <Link
          href="/catalogo"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Seguir Comprando
        </Link>
      </div>

      {!freeShipping && (
        <p className="text-xs text-muted-foreground text-center">
          Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} mas para envio gratis
        </p>
      )}
    </div>
  )
}
