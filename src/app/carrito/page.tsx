"use client"

import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"

export default function CarritoPage() {
  const { items, totalItems, subtotal } = useCart()

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Mi Carrito ({totalItems})
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
              item={item}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  )
}
