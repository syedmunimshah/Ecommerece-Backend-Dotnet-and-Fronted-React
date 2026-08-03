"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetProductsQuery } from "@/lib/store/api/api";
import { productDtosToProducts } from "@/lib/utils/product";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { Breadcrumb, EmptyState, PageHeader } from "@/components/layout/PageShell";
import { ProductGrid } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { data, isLoading } = useGetProductsQuery({ pageNumber: 1, pageSize: 100 });

  const products = useMemo(() => {
    const all = productDtosToProducts(data?.data ?? []);
    return all.filter((p) => ids.includes(p.id));
  }, [data, ids]);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <PageHeader title="Wishlist" subtitle={`${products.length} saved item(s)`} />
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState
          title="No saved items"
          description="Tap the heart icon on products to save them here."
          action={{ label: "Browse Products", href: "/products" }}
        />
      )}
    </div>
  );
}
