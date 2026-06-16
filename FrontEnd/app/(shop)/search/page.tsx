import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/services/product.service";
import { listCategories } from "@/services/category.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/features/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { safeApi, emptyPaged } from "@/lib/safeApi";
import { BackendOfflineBanner } from "@/components/home/BackendOfflineBanner";
import { isBackendOnline } from "@/lib/health";

export const metadata: Metadata = { title: "Search Results" };

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; category?: string; sort?: string; min?: string; max?: string; view?: string }>;
}

function sortProducts<T extends { Price: number; Name: string; Id: number }>(products: T[], sort?: string): T[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc": return copy.sort((a, b) => a.Price - b.Price);
    case "price-desc": return copy.sort((a, b) => b.Price - a.Price);
    case "name": return copy.sort((a, b) => a.Name.localeCompare(b.Name));
    case "newest": return copy.sort((a, b) => b.Id - a.Id);
    default: return copy;
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", page = "1", category, sort, min, max } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const pageSize = 12;
  const backendOnline = await isBackendOnline();

  const [productsRes, categoriesRes] = await Promise.all([
    safeApi(() => listProducts(1, 100), emptyPaged()),
    safeApi(() => listCategories(1, 100), emptyPaged()),
  ]);

  let products = (productsRes.Data ?? []).filter((p) => p.IsActive);

  if (q) {
    const lower = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.Name?.toLowerCase().includes(lower) ||
        p.Description?.toLowerCase().includes(lower) ||
        p.CategoryName?.toLowerCase().includes(lower) ||
        p.SellerName?.toLowerCase().includes(lower),
    );
  }
  if (category) products = products.filter((p) => String(p.CategoryId) === category);
  if (min) products = products.filter((p) => p.Price >= Number(min));
  if (max) products = products.filter((p) => p.Price <= Number(max));

  products = sortProducts(products, sort);
  const total = products.length;
  const paged = products.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  return (
    <div className="container-page py-10">
      {!backendOnline && <BackendOfflineBanner />}
      <Breadcrumb items={[{ label: q ? `Search: "${q}"` : "Search" }]} />
      <h1 className="mb-2 text-3xl font-bold">{q ? `Results for "${q}"` : "Search Products"}</h1>
      <p className="mb-6 text-sm text-muted">{total} products found</p>
      <div className="mb-8">
        <Suspense>
          <ProductFilters categories={categoriesRes.Data ?? []} />
        </Suspense>
      </div>
      {paged.length > 0 ? (
        <>
          <ProductGrid products={paged} />
          <Pagination page={pageNum} pageSize={pageSize} total={total} />
        </>
      ) : (
        <p className="py-16 text-center text-muted">No products match your search.</p>
      )}
    </div>
  );
}
