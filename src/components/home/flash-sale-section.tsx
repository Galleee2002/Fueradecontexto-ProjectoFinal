"use client"

import { Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/shared/countdown-timer"
import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/data/products"
import { FLASH_SALE_END_DATE } from "@/lib/constants"
import { useRef } from "react"

export function FlashSaleSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const flashProducts = products.filter((p) => p.isFlashSale)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = direction === "left" ? -220 : 220
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="bg-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary fill-primary" />
            <h2 className="text-xl font-bold">Flash Sale</h2>
          </div>
          <CountdownTimer targetDate={FLASH_SALE_END_DATE} />
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
      >
        {flashProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="horizontal"
          />
        ))}
      </div>
    </section>
  )
}
