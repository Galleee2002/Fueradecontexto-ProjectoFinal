import { ProductCard } from "@/components/shared/product-card"
import { getProducts } from "@/lib/db/products"

export async function BestSellersSection() {
  const { products: bestSellers } = await getProducts({
    sortBy: "best-selling",
    limit: 4,
  })

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
