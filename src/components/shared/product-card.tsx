"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Product, ProductColor } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/shared/price-display"
import { WishlistButton } from "@/components/shared/wishlist-button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  variant?: "default" | "horizontal" | "compact"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Default to first size if available
    const selectedSize = product.sizes[0] || "Unico"
    
    addItem(product, selectedSize, selectedColor)
    toast.success(`Se añadió "${product.name}" al carrito`, {
      description: `Color: ${selectedColor.name}${product.sizes.length > 0 ? `, Talle: ${selectedSize}` : ""}`,
      action: {
        label: "Ir al carrito",
        onClick: () => router.push("/carrito"),
      },
    })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const selectedSize = product.sizes[0] || "Unico"
    addItem(product, selectedSize, selectedColor)
    router.push("/checkout")
  }

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
    <div className="group relative flex flex-col h-full bg-card rounded-xl border border-border/50 overflow-hidden transition-all hover:shadow-lg hover:border-primary/10">
      {/* 1. Image Container - Hover effect isolated here */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary group/image">
        <Link href={`/producto/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover/image:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <WishlistButton
          productId={product.id}
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-md opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {product.discount && (
            <Badge className="bg-primary text-primary-foreground font-bold">
              -{product.discount}%
            </Badge>
          )}
          {product.isNew && !product.discount && (
            <Badge variant="secondary" className="font-bold">
              NUEVO
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* 2. Name */}
        <Link href={`/producto/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="text-base font-bold line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* 3. Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* 4. Price & Color Selector */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="md"
          />
          
          {/* Minimal Color Selector */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-full px-2">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColor(color)
                  }}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full ring-offset-2 ring-offset-card transition-all cursor-pointer",
                    selectedColor.name === color.name ? "ring-2 ring-primary scale-110" : "hover:scale-125 opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground ml-0.5">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 pt-2 mt-auto">
          {/* 5. Comprar ahora */}
          <Button 
            className="w-full font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] z-10"
            onClick={handleBuyNow}
          >
            Comprar ahora
          </Button>

          {/* 6. Añadir al carrito */}
          <Button 
            variant="secondary"
            className="w-full font-bold uppercase tracking-wide transition-all active:scale-[0.98] z-10"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

