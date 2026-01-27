"use client"

import { useState } from "react"
import { ShoppingCart, CreditCard, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PriceDisplay } from "@/components/shared/price-display"
import { RatingStars } from "@/components/shared/rating-stars"
import { WishlistButton } from "@/components/shared/wishlist-button"
import { QuantitySelector } from "@/components/shared/quantity-selector"
import { SizeSelector } from "@/components/product/size-selector"
import { ColorSelector } from "@/components/product/color-selector"
import { useCart } from "@/hooks/use-cart"
import { Product, Size, ProductColor } from "@/types"
import { formatSoldCount } from "@/lib/formatters"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors[0] ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    addItem(product, selectedSize, selectedColor, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const canAdd = selectedSize && selectedColor

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
        <RatingStars
          rating={product.rating}
          reviewCount={product.reviewCount}
          soldCount={formatSoldCount(product.soldCount)}
          size="md"
        />
      </div>

      <PriceDisplay
        price={product.price}
        originalPrice={product.originalPrice}
        size="lg"
      />

      <Separator />

      <SizeSelector
        sizes={product.sizes}
        selected={selectedSize}
        onSelect={setSelectedSize}
      />

      <ColorSelector
        colors={product.colors}
        selected={selectedColor}
        onSelect={setSelectedColor}
      />

      <div>
        <span className="text-sm font-medium mb-2 block">Cantidad</span>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          max={product.stock}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {product.stock} disponibles
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="w-full"
        >
          {added ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Agregado al Carrito
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Agregar al Carrito
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          disabled={!canAdd}
          className="w-full"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Comprar Ahora
        </Button>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <WishlistButton productId={product.id} />
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      <Separator />

      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          100% Algodon Premium
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          Estampado DTF de alta definicion
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          Envio a todo el pais
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          Cambio y devolucion gratis
        </li>
      </ul>
    </div>
  )
}
