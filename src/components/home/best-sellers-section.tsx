import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/data/products"

export function BestSellersSection() {
  const bestSellers = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4)

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">Mas Vendidos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
