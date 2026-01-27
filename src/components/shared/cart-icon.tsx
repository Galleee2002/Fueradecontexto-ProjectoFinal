"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Button variant="ghost" size="icon" asChild aria-label="Carrito">
      <Link href="/carrito" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
