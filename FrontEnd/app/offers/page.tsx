"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetProductsQuery } from "@/lib/store/api/api";
import { productDtosToProducts } from "@/lib/utils/product";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { ProductGrid } from "@/components/product/ProductCard";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function OffersPage() {
  const { data, isLoading, isError } = useGetProductsQuery({ pageNumber: 1, pageSize: 48 });

  const products = useMemo(() => {
    const all = productDtosToProducts(data?.data ?? []);
    return all.filter((p) => p.price > 0).slice(0, 8);
  }, [data]);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Offers" }]} />
      <PageHeader title="Special Offers" subtitle="Featured deals from our catalog" />
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-muted">Could not load offers.</p>
      ) : (
        <AnimateIn>
          <ProductGrid products={products} />
        </AnimateIn>
      )}
    </div>
  );
}
