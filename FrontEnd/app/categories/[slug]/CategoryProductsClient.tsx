"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetProductsQuery } from "@/lib/store/api/api";
import { useCategoryList } from "@/lib/hooks/useCategoryList";
import { productDtosToProducts, slugifyCategory } from "@/lib/utils/product";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { ProductGrid } from "@/components/product/ProductCard";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function CategoryProductsClient({ slug }: { slug: string }) {
  const { categories } = useCategoryList();
  const category = useMemo(
    () => categories.find((c) => slugifyCategory(c.name) === slug),
    [categories, slug],
  );

  const { data, isLoading, isError } = useGetProductsQuery(
    { pageNumber: 1, pageSize: 48, categoryId: category?.id },
    { skip: !category?.id },
  );

  const products = useMemo(
    () => productDtosToProducts(data?.data ?? []),
    [data],
  );

  const title = category?.name ?? slug.replace(/-/g, " ");

  if (isLoading || (!category && categories.length === 0)) {
    return (
      <div className="container-page flex min-h-[40vh] items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: title }]} />
      <PageHeader title={title} subtitle={`${products.length} product(s)`} />
      {isError ? (
        <p className="py-12 text-center text-muted">Could not load products.</p>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-muted">No products in this category.</p>
      ) : (
        <AnimateIn>
          <ProductGrid products={products} />
        </AnimateIn>
      )}
    </div>
  );
}
