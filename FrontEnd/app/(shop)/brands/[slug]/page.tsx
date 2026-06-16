import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@/services/product.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${brandName} Products` };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const pageSize = 12;

  const { Data: allProducts } = await listProducts(1, 200).catch(() => ({ Data: [] }));

  const sellers = [...new Set(allProducts.map((p) => p.SellerName).filter(Boolean))] as string[];
  const brand = sellers.find((s) => slugify(s) === slug);
  if (!brand) notFound();

  const filtered = allProducts.filter((p) => p.SellerName === brand && p.IsActive);
  const paged = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Brands", href: "/products" }, { label: brand }]} />
      <h1 className="mb-2 text-3xl font-bold">{brand}</h1>
      <p className="mb-8 text-sm text-muted">Official store · {filtered.length} products</p>
      <ProductGrid products={paged} />
      <Pagination page={pageNum} pageSize={pageSize} total={filtered.length} />
    </div>
  );
}
