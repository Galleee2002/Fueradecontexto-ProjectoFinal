"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import { fetchProducts } from "@/lib/api/products"
import type { Product } from "@/types"

const tabs = [
  { id: "best-selling", label: "Mas Vendidos" },
  { id: "new", label: "Novedades" },
  { id: "discount", label: "Ofertas" },
  { id: "featured", label: "Destacados" },
] as const

type TabId = (typeof tabs)[number]["id"]

export function TodaysPicksSection() {
  const [activeTab, setActiveTab] = useState<TabId>("best-selling")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        let data

        switch (activeTab) {
          case "best-selling":
            data = await fetchProducts({ sortBy: "best-selling", limit: 10 })
            break
          case "new":
            data = await fetchProducts({ isNew: true, limit: 10 })
            break
          case "discount":
            // Fetch best-selling and filter by originalPrice
            data = await fetchProducts({ sortBy: "best-selling", limit: 20 })
            data.products = data.products.filter((p) => p.originalPrice).slice(0, 10)
            break
          case "featured":
            data = await fetchProducts({ isFeatured: true, limit: 10 })
            break
          default:
            data = await fetchProducts({ limit: 10 })
        }

        setProducts(data.products)
      } catch (error) {
        console.error("Error loading today's picks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [activeTab])

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold">Elegidos del Dia</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="text-muted-foreground">Cargando productos...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/catalogo">Ver Todo</Link>
        </Button>
      </div>
    </section>
  )
}
