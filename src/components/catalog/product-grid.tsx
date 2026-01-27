import { ShoppingBag } from "lucide-react"
import { Product } from "@/types"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No se encontraron productos
        </h3>
        <p className="text-muted-foreground mb-4">
          Proba ajustando los filtros o explorando otras categorias
        </p>
        <Button variant="outline" asChild>
          <Link href="/catalogo">Ver todos los productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
