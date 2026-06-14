import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/services/product.service";
import { listCategories } from "@/services/category.service";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/features/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = { title: "Shop" };

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { page = "1", q, category } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const pageSize = 12;

  const [productsRes, categoriesRes] = await Promise.all([
    listProducts(pageNum, pageSize),
    listCategories(1, 100),
  ]);

  let products = productsRes.Data;
  if (q) {
    const lower = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.Name.toLowerCase().includes(lower) ||
        p.Description?.toLowerCase().includes(lower),
    );
  }
  if (category) {
    products = products.filter((p) => String(p.CategoryId) === category);
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold">Shop</h1>
      <div className="mb-8">
        <Suspense>
          <ProductFilters categories={categoriesRes.Data} />
        </Suspense>
      </div>
      <ProductGrid products={products} />
      <Suspense>
        <Pagination
          page={pageNum}
          pageSize={pageSize}
          total={productsRes.TotalRecords}
        />
      </Suspense>
    </div>
  );
}

export function loading() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 h-12 w-full animate-pulse rounded bg-elevated" />
      <ProductGridSkeleton />
    </div>
  );
}
