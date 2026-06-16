import Link from "next/link";
import { Timer } from "lucide-react";
import type { ProductDto } from "@/types/product";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function FlashSaleSection({ products }: { products: ProductDto[] }) {
  if (!products.length) return null;

  return (
    <AnimateIn as="section" variant="blur-in" className="border-y border-destructive/20 bg-destructive/5 py-12">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Timer className="h-6 w-6 text-destructive motion-safe:animate-bounce-soft" />
            <div>
              <h2 className="text-2xl font-bold text-destructive">Flash Sale</h2>
              <p className="text-sm text-muted">Limited time offers — grab them before they&apos;re gone!</p>
            </div>
          </div>
          <Link href="/products">
            <Button variant="destructive">Shop Flash Sale</Button>
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} animated />
      </div>
    </AnimateIn>
  );
}
