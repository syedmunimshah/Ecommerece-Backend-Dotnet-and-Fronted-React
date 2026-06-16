import type { ProductDto } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/features/products/AddToCartButton";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/cn";

export function ProductGrid({
  products,
  view = "grid",
  animated = false,
}: {
  products: ProductDto[];
  view?: "grid" | "list";
  animated?: boolean;
}) {
  if (!products.length) {
    return (
      <div className="col-span-full py-16 text-center text-muted">
        No products found.
      </div>
    );
  }

  if (view === "list") {
    const rows = products.map((p) => (
      <div key={p.Id} className="card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <Link href={`/products/${p.Id}`} className="relative h-32 w-full shrink-0 overflow-hidden rounded bg-elevated sm:h-24 sm:w-24">
          {p.Image ? (
            <Image src={p.Image} alt={p.Name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
          ) : null}
        </Link>
        <div className="flex-1">
          <Link href={`/products/${p.Id}`}>
            <h3 className="font-semibold hover:text-accent">{p.Name}</h3>
          </Link>
          {p.SellerName && <p className="text-xs text-muted">by {p.SellerName}</p>}
          {p.Description && <p className="mt-1 text-sm text-muted line-clamp-2">{p.Description}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xl font-bold text-accent">{formatCurrency(p.Price)}</span>
          <AddToCartButton productId={p.Id} stock={p.Stock} />
        </div>
      </div>
    ));

    if (animated) {
      return (
        <StaggerContainer className="space-y-4">
          {products.map((p) => (
            <StaggerItem key={p.Id}>
              <div className="card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={`/products/${p.Id}`} className="relative h-32 w-full shrink-0 overflow-hidden rounded bg-elevated sm:h-24 sm:w-24">
                  {p.Image ? (
                    <Image src={p.Image} alt={p.Name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                  ) : null}
                </Link>
                <div className="flex-1">
                  <Link href={`/products/${p.Id}`}>
                    <h3 className="font-semibold hover:text-accent">{p.Name}</h3>
                  </Link>
                  {p.SellerName && <p className="text-xs text-muted">by {p.SellerName}</p>}
                  {p.Description && <p className="mt-1 text-sm text-muted line-clamp-2">{p.Description}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold text-accent">{formatCurrency(p.Price)}</span>
                  <AddToCartButton productId={p.Id} stock={p.Stock} />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      );
    }

    return <div className="space-y-4">{rows}</div>;
  }

  const cards = products.map((p) => (
    <StaggerItem key={p.Id}>
      <ProductCard product={p} animated={animated} />
    </StaggerItem>
  ));

  if (animated) {
    return (
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards}
      </StaggerContainer>
    );
  }

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
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
          <Skeleton className="h-48 w-full animate-shimmer rounded-none" />
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
