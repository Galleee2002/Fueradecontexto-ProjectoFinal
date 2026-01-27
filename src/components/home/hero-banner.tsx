"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { banners } from "@/data/banners"

export function HeroBanner() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
      className="w-full"
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center"
              style={{
                background: `linear-gradient(135deg, ${banner.backgroundColor} 0%, ${banner.backgroundColor}cc 50%, transparent 100%)`,
              }}
            >
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-lg">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                    {banner.subtitle}
                  </p>
                  <Button asChild size="lg">
                    <Link href={banner.ctaLink}>{banner.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <CarouselPrevious className="static translate-y-0 h-8 w-8" />
        <CarouselNext className="static translate-y-0 h-8 w-8" />
      </div>
    </Carousel>
  )
}
