import { formatPrice, calculateDiscount } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  size?: "sm" | "md" | "lg"
}

export function PriceDisplay({
  price,
  originalPrice,
  size = "md",
}: PriceDisplayProps) {
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }

  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={cn("font-bold", textSize[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <>
          <span
            className={cn(
              "line-through text-muted-foreground",
              size === "lg" ? "text-base" : "text-xs"
            )}
          >
            {formatPrice(originalPrice)}
          </span>
          <Badge variant="secondary" className="text-xs font-medium">
            -{discount}%
          </Badge>
        </>
      )}
    </div>
  )
}
