import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  reviewCount?: number
  soldCount?: string
  size?: "sm" | "md"
}

export function RatingStars({
  rating,
  reviewCount,
  soldCount,
  size = "sm",
}: RatingStarsProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating)
          const half = !filled && i < rating
          return (
            <Star
              key={i}
              className={cn(
                iconSize,
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : half
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "text-muted-foreground/30"
              )}
            />
          )
        })}
      </div>
      <span className="font-medium text-foreground">{rating}</span>
      {reviewCount !== undefined && <span>({reviewCount})</span>}
      {soldCount && (
        <>
          <span className="text-muted-foreground/50">|</span>
          <span>{soldCount}</span>
        </>
      )}
    </div>
  )
}
