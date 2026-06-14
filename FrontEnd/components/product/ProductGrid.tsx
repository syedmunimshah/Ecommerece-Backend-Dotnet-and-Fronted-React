import type { ProductDto } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductGrid({ products }: { products: ProductDto[] }) {
  if (!products.length) {
    return (
      <div className="col-span-full py-16 text-center text-muted">
        No products found.
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.Id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden p-0">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
