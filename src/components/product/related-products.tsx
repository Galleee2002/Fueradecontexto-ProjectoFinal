import { ProductCard } from "@/components/shared/product-card"
import { getProductsByCategory } from "@/lib/db/products"
import { Product } from "@/types"

interface RelatedProductsProps {
  currentProduct: Product
}

export async function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = await getProductsByCategory(currentProduct.category, {
    excludeId: currentProduct.id,
    limit: 6,
  })

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
