"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/data/products"

const tabs = [
  { id: "best-selling", label: "Mas Vendidos" },
  { id: "new", label: "Novedades" },
  { id: "discount", label: "Ofertas" },
  { id: "featured", label: "Destacados" },
] as const

type TabId = (typeof tabs)[number]["id"]

function filterProducts(tabId: TabId) {
  switch (tabId) {
    case "best-selling":
      return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 10)
    case "new":
      return products.filter((p) => p.isNew).slice(0, 10)
    case "discount":
      return products
        .filter((p) => p.originalPrice)
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
        .slice(0, 10)
    case "featured":
      return products.filter((p) => p.isFeatured).slice(0, 10)
    default:
      return products.slice(0, 10)
  }
}

export function TodaysPicksSection() {
  const [activeTab, setActiveTab] = useState<TabId>("best-selling")
  const filtered = filterProducts(activeTab)

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/catalogo">Ver Todo</Link>
        </Button>
      </div>
    </section>
  )
}
