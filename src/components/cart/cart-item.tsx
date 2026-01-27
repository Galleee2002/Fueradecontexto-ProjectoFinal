"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/shared/quantity-selector"
import { formatPrice } from "@/lib/formatters"
import { useCart } from "@/hooks/use-cart"
import { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <Link
        href={`/producto/${item.product.slug}`}
        className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden bg-secondary shrink-0"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/producto/${item.product.slug}`}
          className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
        >
          {item.product.name}
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">
          Talle: {item.selectedSize} | Color: {item.selectedColor.name}
        </p>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(qty) =>
              updateQuantity(
                item.product.id,
                item.selectedSize,
                item.selectedColor.name,
                qty
              )
            }
            max={item.product.stock}
          />
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">
              {formatPrice(item.product.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() =>
                removeItem(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor.name
                )
              }
              aria-label="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
