import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listCategories } from "@/services/category.service";
import { listProducts } from "@/services/product.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const cats = await listCategories(1, 100);
    const cat = cats.Data.find((c) => c.Id === Number(id));
    return { title: cat?.Name ?? "Category" };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const categoryId = Number(id);

  const [categoriesRes, productsRes] = await Promise.all([
    listCategories(1, 100).catch(() => ({ Data: [] })),
    listProducts(1, 100).catch(() => ({ Data: [], TotalRecords: 0, PageNumber: 1, PageSize: 100 })),
  ]);

  const category = categoriesRes.Data.find((c) => c.Id === categoryId);
  if (!category) notFound();

  const filtered = productsRes.Data.filter((p) => p.CategoryId === categoryId && p.IsActive);
  const pageSize = 12;
  const start = (pageNum - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: category.Name }]} />
      <h1 className="mb-2 text-3xl font-bold">{category.Name}</h1>
      <p className="mb-8 text-sm text-muted">{filtered.length} products found</p>
      <ProductGrid products={paged} />
      <Pagination page={pageNum} pageSize={pageSize} total={filtered.length} />
    </div>
  );
}
