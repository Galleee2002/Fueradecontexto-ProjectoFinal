"use client"

import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { PriceDisplay } from "@/components/shared/price-display"
import { RatingStars } from "@/components/shared/rating-stars"
import { WishlistButton } from "@/components/shared/wishlist-button"
import { formatSoldCount } from "@/lib/formatters"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  variant?: "default" | "horizontal" | "compact"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/producto/${product.slug}`}
        className="group flex-shrink-0 w-48 snap-start"
      >
        <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="192px"
          />
          <WishlistButton
            productId={product.id}
            className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 text-[10px]">
              -{product.discount}%
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium line-clamp-2 mb-1">
          {product.name}
        </p>
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          size="sm"
        />
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/producto/${product.slug}`}
        className="group flex-shrink-0 w-40 snap-start"
      >
        <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="160px"
          />
        </div>
        <p className="text-xs font-medium line-clamp-1 mb-1">
          {product.name}
        </p>
        <PriceDisplay price={product.price} size="sm" />
      </Link>
    )
  }

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm"
        />
        {product.discount && (
          <Badge className="absolute top-2 left-2">
            -{product.discount}%
          </Badge>
        )}
        {product.isNew && !product.discount && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            NUEVO
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <RatingStars
          rating={product.rating}
          soldCount={formatSoldCount(product.soldCount)}
        />
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
        />
      </div>
    </Link>
  )
}
