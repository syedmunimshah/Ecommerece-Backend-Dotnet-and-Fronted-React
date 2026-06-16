import Link from "next/link";
import type { ProductDto } from "@/types/product";
import { Store } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function TopBrandsSection({ products }: { products: ProductDto[] }) {
  const brands = [...new Set(products.map((p) => p.SellerName).filter(Boolean))] as string[];
  if (!brands.length) return null;

  return (
    <AnimateIn as="section" className="container-page py-12" variant="fade-up">
      <h2 className="mb-6 text-2xl font-bold">Top Brands & Stores</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {brands.slice(0, 10).map((brand, i) => (
          <AnimateIn key={brand} variant="scale-in" delay={i * 60} duration={400}>
            <Link
              href={`/brands/${slugify(brand)}`}
              className="card-interactive flex min-w-[140px] flex-col items-center gap-3 p-5"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 motion-safe:transition-transform motion-safe:duration-300 hover:rotate-6 hover:scale-110">
                <Store className="h-6 w-6 text-accent" />
              </div>
              <span className="text-center text-sm font-medium">{brand}</span>
            </Link>
          </AnimateIn>
        ))}
      </div>
    </AnimateIn>
  );
}
