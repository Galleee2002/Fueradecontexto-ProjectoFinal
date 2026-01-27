import { HeroBanner } from "@/components/home/hero-banner"
import { CategoryRow } from "@/components/home/category-row"
import { FlashSaleSection } from "@/components/home/flash-sale-section"
import { TodaysPicksSection } from "@/components/home/todays-picks-section"
import { BestSellersSection } from "@/components/home/best-sellers-section"
import { QuoteBanner } from "@/components/home/quote-banner"

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 space-y-12 py-8">
        <CategoryRow />
        <FlashSaleSection />
        <TodaysPicksSection />
        <BestSellersSection />
      </div>
      <QuoteBanner />
    </>
  )
}
