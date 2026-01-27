"use client"

import { useState, useMemo } from "react"
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
import { products } from "@/data/products"
import { CategorySlug, Size, SortOption } from "@/types"
import { PRODUCTS_PER_PAGE } from "@/lib/constants"

export default function CatalogoPage() {
  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }

    if (priceRange[0] > 0) {
      result = result.filter((p) => p.price >= priceRange[0])
    }
    if (priceRange[1] < 100000) {
      result = result.filter((p) => p.price <= priceRange[1])
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      )
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      )
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "best-selling":
        result.sort((a, b) => b.soldCount - a.soldCount)
        break
    }

    return result
  }, [selectedCategories, priceRange, selectedSizes, selectedColors, sortBy])

  const paginated = filtered.slice(0, page * PRODUCTS_PER_PAGE)
  const hasMore = paginated.length < filtered.length

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
        break
      case "size":
        setSelectedSizes((prev) => prev.filter((s) => s !== value))
        break
      case "color":
        setSelectedColors((prev) => prev.filter((c) => c !== value))
        break
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 100000])
    setSelectedSizes([])
    setSelectedColors([])
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

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedSizes={selectedSizes}
            onSizesChange={setSelectedSizes}
            selectedColors={selectedColors}
            onColorsChange={setSelectedColors}
            onClearFilters={clearFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} productos
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
                      onCategoryChange={setSelectedCategories}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      selectedSizes={selectedSizes}
                      onSizesChange={setSelectedSizes}
                      selectedColors={selectedColors}
                      onColorsChange={setSelectedColors}
                      onClearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <ActiveFilters filters={activeFiltersList} onRemove={removeFilter} />

          <ProductGrid products={paginated} />

          {hasMore && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                Cargar mas productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
