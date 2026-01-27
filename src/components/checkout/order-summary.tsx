"use client"

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/formatters"
import { useCart } from "@/hooks/use-cart"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants"

export function OrderSummary() {
  const { items, subtotal } = useCart()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 2500
  const total = subtotal + shipping

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h3 className="font-bold">Resumen del Pedido</h3>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
            className="flex gap-3"
          >
            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-secondary shrink-0">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.selectedSize} / {item.selectedColor.name}
              </p>
            </div>
            <span className="text-sm font-medium shrink-0">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envio</span>
          <span className={shipping === 0 ? "text-primary font-medium" : ""}>
            {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
