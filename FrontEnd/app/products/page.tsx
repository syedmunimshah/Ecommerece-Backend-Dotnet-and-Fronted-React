import type { Metadata } from "next";
import { ProductsPageClient } from "./ProductsPageClient";

export const metadata: Metadata = { title: "Shop" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoryId?: string }>;
}) {
  const { q, categoryId } = await searchParams;
  const parsedCategoryId = categoryId ? Number(categoryId) : undefined;
  return (
    <ProductsPageClient
      query={q}
      categoryId={parsedCategoryId && !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined}
    />
  );
}
