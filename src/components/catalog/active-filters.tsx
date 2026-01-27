"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActiveFiltersProps {
  filters: { type: string; value: string; label: string }[]
  onRemove: (type: string, value: string) => void
}

export function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Badge
          key={`${filter.type}-${filter.value}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.type, filter.value)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
            aria-label={`Quitar filtro ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
