"use client";

import { Suspense, useMemo, useState } from "react";
import { useGetProductsQuery } from "@/lib/store/api/api";
import { useCategoryList } from "@/lib/hooks/useCategoryList";
import { productDtosToProducts } from "@/lib/utils/product";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductSearchBar, CategoryPills } from "@/components/product/ProductFilters";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Skeleton } from "@/components/ui/Skeleton";

function ProductsContent({
  query,
  categoryId,
}: {
  query?: string;
  categoryId?: number;
}) {
  const [page] = useState(1);
  const { data, isLoading, isError } = useGetProductsQuery({
    pageNumber: page,
    pageSize: 48,
    search: query,
    categoryId,
  });
  const { categories } = useCategoryList();

  const products = useMemo(
    () => productDtosToProducts(data?.data ?? []),
    [data],
  );

  const categoryPills = useMemo(
    () =>
      categories
        .filter((c) => c.isActive)
        .map((c) => ({ id: c.id, name: c.name })),
    [categories],
  );

  const activeCategoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name
    : undefined;

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Shop" }]} />
      <PageHeader
        title="Shop"
        subtitle={
          query
            ? `Results for "${query}"${activeCategoryName ? ` in ${activeCategoryName}` : ""}`
            : activeCategoryName
              ? `${activeCategoryName} products`
              : "Browse our full catalog"
        }
      />
      <div className="mb-8 space-y-4">
        <ProductSearchBar />
        <CategoryPills categories={categoryPills} activeCategoryId={categoryId} />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-muted">
          Could not load products. Please refresh, or try again in a moment.
        </p>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-muted">No products found.</p>
      ) : (
        <AnimateIn>
          <ProductGrid products={products} />
        </AnimateIn>
      )}
    </div>
  );
}

export function ProductsPageClient({
  query,
  categoryId,
}: {
  query?: string;
  categoryId?: number;
}) {
  return (
    <Suspense>
      <ProductsContent query={query} categoryId={categoryId} />
    </Suspense>
  );
}
