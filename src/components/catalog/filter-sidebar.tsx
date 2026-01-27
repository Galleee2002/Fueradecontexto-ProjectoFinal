"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { categories } from "@/data/categories"
import { CategorySlug, Size } from "@/types"
import { cn } from "@/lib/utils"

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"]

const colors = [
  { name: "Negro", hex: "#000000" },
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Gris", hex: "#808080" },
  { name: "Rosa", hex: "#E91E8C" },
  { name: "Azul", hex: "#0000FF" },
  { name: "Rojo", hex: "#FF0000" },
  { name: "Verde", hex: "#4B5320" },
  { name: "Beige", hex: "#C9B99A" },
]

interface FilterSidebarProps {
  selectedCategories: CategorySlug[]
  onCategoryChange: (categories: CategorySlug[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedSizes: Size[]
  onSizesChange: (sizes: Size[]) => void
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
  onClearFilters: () => void
}

export function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSizes,
  onSizesChange,
  selectedColors,
  onColorsChange,
  onClearFilters,
}: FilterSidebarProps) {
  const toggleCategory = (slug: CategorySlug) => {
    onCategoryChange(
      selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug]
    )
  }

  const toggleSize = (size: Size) => {
    onSizesChange(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    )
  }

  const toggleColor = (color: string) => {
    onColorsChange(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    )
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <span className="text-sm">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h3 className="font-semibold mb-3">Precio</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0] || ""}
            onChange={(e) =>
              onPriceRangeChange([Number(e.target.value), priceRange[1]])
            }
            className="text-sm"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1] < 100000 ? priceRange[1] : ""}
            onChange={(e) =>
              onPriceRangeChange([
                priceRange[0],
                e.target.value ? Number(e.target.value) : 100000,
              ])
            }
            className="text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h3 className="font-semibold mb-3">Talle</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "h-9 min-w-[2.5rem] px-3 rounded-md border text-sm font-medium transition-colors",
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                selectedColors.includes(color.name)
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-border hover:scale-110"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full"
          >
            Limpiar Filtros
          </Button>
        </>
      )}
    </div>
  )
}
