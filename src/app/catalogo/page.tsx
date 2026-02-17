"use client"

import { useState, useEffect } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FilterSidebar } from "@/components/catalog/filter-sidebar"
import { SortDropdown } from "@/components/catalog/sort-dropdown"
import { ActiveFilters } from "@/components/catalog/active-filters"
import { ProductGrid } from "@/components/catalog/product-grid"
import { fetchProducts } from "@/lib/api/products"
import { CategorySlug, Size, SortOption, Product } from "@/types"
import { PRODUCTS_PER_PAGE } from "@/lib/constants"

export default function CatalogoPage() {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [page, setPage] = useState(1)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load products whenever filters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)

        const { products: fetchedProducts, total: totalCount } = await fetchProducts({
          categories: selectedCategories.length ? selectedCategories : undefined,
          priceRange:
            priceRange[0] > 0 || priceRange[1] < 100000 ? priceRange : undefined,
          sizes: selectedSizes.length ? selectedSizes : undefined,
          colors: selectedColors.length ? selectedColors : undefined,
          sortBy,
          limit: page * PRODUCTS_PER_PAGE,
          offset: 0,
        })

        setProducts(fetchedProducts)
        setTotal(totalCount)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategories, priceRange, selectedSizes, selectedColors, sortBy, page])

  const hasMore = products.length < total

  const activeFiltersList = [
    ...selectedCategories.map((c) => ({
      type: "category",
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
    })),
    ...selectedSizes.map((s) => ({
      type: "size",
      value: s,
      label: `Talle ${s}`,
    })),
    ...selectedColors.map((c) => ({
      type: "color",
      value: c,
      label: c,
    })),
  ]

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "category":
        setSelectedCategories((prev) =>
          prev.filter((c) => c !== value)
        )
        setPage(1) // Reset page when filter changes
        break
      case "size":
        setSelectedSizes((prev) => prev.filter((s) => s !== value))
        setPage(1)
        break
      case "color":
        setSelectedColors((prev) => prev.filter((c) => c !== value))
        setPage(1)
        break
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 100000])
    setSelectedSizes([])
    setSelectedColors([])
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catalogo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-4 lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={(cats) => {
              setSelectedCategories(cats)
              setPage(1)
            }}
            priceRange={priceRange}
            onPriceRangeChange={(range) => {
              setPriceRange(range)
              setPage(1)
            }}
            selectedSizes={selectedSizes}
            onSizesChange={(sizes) => {
              setSelectedSizes(sizes)
              setPage(1)
            }}
            selectedColors={selectedColors}
            onColorsChange={(colors) => {
              setSelectedColors(colors)
              setPage(1)
            }}
            onClearFilters={clearFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? "Cargando..." : `${total} productos`}
            </p>
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterSidebar
                      selectedCategories={selectedCategories}
                      onCategoryChange={(cats) => {
                        setSelectedCategories(cats)
                        setPage(1)
                      }}
                      priceRange={priceRange}
                      onPriceRangeChange={(range) => {
                        setPriceRange(range)
                        setPage(1)
                      }}
                      selectedSizes={selectedSizes}
                      onSizesChange={(sizes) => {
                        setSelectedSizes(sizes)
                        setPage(1)
                      }}
                      selectedColors={selectedColors}
                      onColorsChange={(colors) => {
                        setSelectedColors(colors)
                        setPage(1)
                      }}
                      onClearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <SortDropdown
                value={sortBy}
                onChange={(sort) => {
                  setSortBy(sort)
                  setPage(1)
                }}
              />
            </div>
          </div>

          <ActiveFilters filters={activeFiltersList} onRemove={removeFilter} />

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando productos...
            </div>
          ) : (
            <>
              <ProductGrid products={products} />

              {hasMore && (
                <div className="text-center mt-8">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                    Cargar mas productos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
