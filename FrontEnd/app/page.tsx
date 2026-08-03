import { HeroSection } from "@/components/home/HeroSection";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import { ExploreCategories } from "@/components/home/ExploreCategories";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { ShopOnTheGoBanner } from "@/components/home/ShopOnTheGoBanner";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { TrustedBrands } from "@/components/home/TrustedBrands";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MobileTestimonialsSection } from "@/components/home/MobileTestimonialsSection";
import { StayUpdatedSection } from "@/components/home/StayUpdatedSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlights />
      <ExploreCategories />
      <BestSellersSection />
      <ShopOnTheGoBanner />
      <FlashSaleSection />
      <FeaturedProductsSection />
      <TrustedBrands className="hidden lg:block" />
      <MobileTestimonialsSection />
      <StayUpdatedSection />
      <TestimonialsSection />
      <AppDownloadSection />
    </>
  );
}
