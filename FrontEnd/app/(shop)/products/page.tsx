import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/services/product.service";
import { listCategories } from "@/services/category.service";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/features/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { safeApi, emptyPaged } from "@/lib/safeApi";
import { BackendOfflineBanner } from "@/components/home/BackendOfflineBanner";
import { isBackendOnline } from "@/lib/health";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demoData";

export const metadata: Metadata = { title: "Shop" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    view?: string;
  }>;
}

function sortProducts<T extends { Price: number; Name: string; Id: number }>(
  products: T[],
  sort?: string,
): T[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc": return copy.sort((a, b) => a.Price - b.Price);
    case "price-desc": return copy.sort((a, b) => b.Price - a.Price);
    case "name": return copy.sort((a, b) => a.Name.localeCompare(b.Name));
    case "newest": return copy.sort((a, b) => b.Id - a.Id);
    default: return copy;
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { page = "1", q, category, sort, min, max, view = "grid" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const pageSize = 12;

  const backendOnline = await isBackendOnline();

  const [productsRes, categoriesRes] = await Promise.all([
    safeApi(() => listProducts(1, 100), emptyPaged()),
    safeApi(() => listCategories(1, 100), emptyPaged()),
  ]);

  let products = (productsRes.Data?.length ? productsRes.Data : DEMO_PRODUCTS).filter((p) => p.IsActive);

  if (q) {
    const lower = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.Name?.toLowerCase().includes(lower) ||
        p.Description?.toLowerCase().includes(lower),
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
      <Breadcrumb items={[{ label: "Shop" }]} />
      <h1 className="mb-6 text-3xl font-bold">Shop</h1>
      <div className="mb-8">
        <Suspense>
          <ProductFilters categories={categoriesRes.Data?.length ? categoriesRes.Data : DEMO_CATEGORIES} />
        </Suspense>
      </div>
      <ProductGrid products={paged} view={view === "list" ? "list" : "grid"} animated />
      <Suspense>
        <Pagination page={pageNum} pageSize={pageSize} total={total} />
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
