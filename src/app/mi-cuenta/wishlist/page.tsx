"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import { useWishlist } from "@/hooks/use-wishlist"
import { products } from "@/data/products"

export default function WishlistPage() {
  const { items } = useWishlist()
  const wishlistProducts = products.filter((p) => items.includes(p.id))

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Lista de Deseos</h2>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Tu lista de deseos esta vacia</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Agrega productos tocando el corazon en cada producto
          </p>
          <Button variant="outline" asChild>
            <Link href="/catalogo">Explorar Catalogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
