"use client";

import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGetProductByIdQuery } from "@/lib/store/api/api";
import { productDtoToProduct } from "@/lib/utils/product";
import { Breadcrumb } from "@/components/layout/PageShell";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductReviews } from "@/components/product/ProductReviews";

export function ProductDetailPageClient({ id }: { id: number }) {
  const { data, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (isError || !data) {
    notFound();
  }

  const product = productDtoToProduct(data);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Shop", href: "/products" }, { label: product.name }]} />
      <ProductDetailClient product={product} />
      <ProductReviews productId={id} />
    </div>
  );
}
