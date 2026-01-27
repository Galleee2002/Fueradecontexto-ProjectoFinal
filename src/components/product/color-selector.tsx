"use client"

import { ProductColor } from "@/types"
import { cn } from "@/lib/utils"

interface ColorSelectorProps {
  colors: ProductColor[]
  selected: ProductColor | null
  onSelect: (color: ProductColor) => void
}

export function ColorSelector({
  colors,
  selected,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">Color</span>
        {selected && (
          <span className="text-sm text-muted-foreground">
            - {selected.name}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelect(color)}
            className={cn(
              "h-9 w-9 rounded-full border-2 transition-all",
              selected?.name === color.name
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent"
                : "border-border hover:scale-110"
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
