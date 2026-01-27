import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/data/products"
import { Product } from "@/types"

interface RelatedProductsProps {
  currentProduct: Product
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = products
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id
    )
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6">Tambien te puede gustar</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </div>
    </section>
  )
}
