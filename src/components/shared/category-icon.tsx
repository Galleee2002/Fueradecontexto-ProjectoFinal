import Link from "next/link"
import {
  Shirt,
  HardHat,
  Watch,
  LayoutGrid,
} from "lucide-react"
import { CategorySlug } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  Shirt,
  HardHat,
  Jacket: Shirt,
  Watch,
  LayoutGrid,
}

interface CategoryIconProps {
  slug: CategorySlug | "all"
  name: string
  icon: string
}

export function CategoryIcon({ slug, name, icon }: CategoryIconProps) {
  const Icon = iconMap[icon] || Shirt
  const href = slug === "all" ? "/catalogo" : `/catalogo?category=${slug}`

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 group shrink-0"
    >
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <span className="text-xs font-medium text-center">{name}</span>
    </Link>
  )
}
