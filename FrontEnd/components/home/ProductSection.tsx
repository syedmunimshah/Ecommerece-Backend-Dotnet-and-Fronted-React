import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductDto } from "@/types/product";
import { ProductGrid } from "@/components/product/ProductGrid";
import { AnimateIn } from "@/components/ui/AnimateIn";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ProductDto[];
  href?: string;
}

export function ProductSection({ title, subtitle, products, href = "/products" }: ProductSectionProps) {
  if (!products.length) return null;

  return (
    <AnimateIn as="section" className="container-page py-12" variant="fade-up">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          View all{" "}
          <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
      <ProductGrid products={products} animated />
    </AnimateIn>
  );
}
