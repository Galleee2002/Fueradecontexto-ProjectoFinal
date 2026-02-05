import { HeroBanner } from "@/components/home/hero-banner"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsCarousel } from "@/components/home/featured-products-carousel"
import { InfoBanner } from "@/components/home/info-banner"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroBanner />

      <div className="container mx-auto px-4">
        <div className="space-y-16 py-12">
          {/* Sección de Categorías */}
          <CategoriesSection />

          {/* Sección de Productos Destacados */}
          <FeaturedProductsCarousel />
        </div>
      </div>

      {/* Banner de Información */}
      <InfoBanner />
    </div>
  )
}
