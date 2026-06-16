import { listProducts } from "@/services/product.service";
import { listCategories } from "@/services/category.service";
import { safeApi, emptyPaged } from "@/lib/safeApi";
import { isBackendOnline } from "@/lib/health";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demoData";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PromoBannerStrip } from "@/components/home/PromoBannerStrip";
import { ValueProps } from "@/components/home/ValueProps";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductSection } from "@/components/home/ProductSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { TopBrandsSection } from "@/components/home/TopBrandsSection";
import { DealsCountdownSection } from "@/components/home/DealsCountdownSection";
import { ShopByPriceSection } from "@/components/home/ShopByPriceSection";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { AppDownloadCTA } from "@/components/home/AppDownloadCTA";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { BackendOfflineBanner } from "@/components/home/BackendOfflineBanner";

export default async function HomePage() {
  const backendOnline = await isBackendOnline();

  const [productsRes, categoriesRes] = await Promise.all([
    safeApi(() => listProducts(1, 24), emptyPaged()),
    safeApi(() => listCategories(1, 12), emptyPaged()),
  ]);

  const products = (productsRes.Data?.length ? productsRes.Data : DEMO_PRODUCTS);
  const categories = (categoriesRes.Data?.length ? categoriesRes.Data : DEMO_CATEGORIES);

  const featured = products.slice(0, 4);
  const bestSellers = [...products].sort((a, b) => b.Stock - a.Stock).slice(0, 4);
  const newArrivals = products.slice(4, 8);
  const trending = [...products].sort((a, b) => b.Id - a.Id).slice(0, 4);
  const flashSale = products.filter((p) => p.Price > 0).slice(0, 4);

  return (
    <>
      {!backendOnline && <BackendOfflineBanner />}
      <HeroBanner />
      <PromoBannerStrip />
      <ValueProps />
      <FeaturedCategories categories={categories.filter((c) => c.IsActive)} />
      <ProductSection title="Featured Products" subtitle="Hand-picked for you" products={featured} />
      <FlashSaleSection products={flashSale} />
      <DealsCountdownSection />
      <ProductSection title="Trending Now" subtitle="Popular picks this week" products={trending} href="/products?sort=newest" />
      <TopBrandsSection products={products} />
      <ProductSection title="Best Sellers" subtitle="Most popular this week" products={bestSellers} href="/products?sort=popular" />
      <ShopByPriceSection />
      <ProductSection title="New Arrivals" subtitle="Fresh additions to our catalog" products={newArrivals} href="/products?sort=newest" />
      <CustomerReviews />
      <AppDownloadCTA />
      <NewsletterSection />
    </>
  );
}
