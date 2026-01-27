"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const active = isInWishlist(productId)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 rounded-full", className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(productId)
      }}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          active ? "fill-primary text-primary" : "text-muted-foreground"
        )}
      />
    </Button>
  )
}
