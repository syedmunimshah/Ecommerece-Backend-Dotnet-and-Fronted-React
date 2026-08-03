"use client";

import Link from "next/link";
import { Plus, Loader2, Trash2, Pencil } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { useAuth } from "@/features/auth/useAuth";
import {
  useGetProductsQuery,
  useGetMySellerProfileQuery,
  useDeleteProductMutation,
} from "@/lib/store/api/api";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { formatRs } from "@/lib/format";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useMounted } from "@/lib/hooks/useMounted";

export default function SellerProductsPage() {
  const mounted = useMounted();
  const { isSeller } = useAuth();
  const { data: sellerProfile } = useGetMySellerProfileQuery(undefined, { skip: !isSeller });
  const sellerProfileId = sellerProfile?.id;

  const { data, isLoading, isError } = useGetProductsQuery(
    { pageNumber: 1, pageSize: 100, sellerId: sellerProfileId },
    { skip: !sellerProfileId },
  );
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data ?? [];

  if (!mounted) {
    return (
      <>
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Products" }]} />
        <PageHeader title="My Products" subtitle="Manage your listings" />
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Products" }]} />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="My Products"
          subtitle={sellerProfile ? `${sellerProfile.storeName} listings` : "Manage your listings"}
          className="mb-0"
        />
        {isSeller && (
          <Link
            href="/dashboard/products/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--product-btn-bg)] px-5 text-sm font-semibold text-[var(--product-btn-text)]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        )}
      </div>
      {!isSeller ? (
        <p className="text-muted">
          You need seller approval to manage products.{" "}
          <Link href="/dashboard/become-seller" className="text-accent">
            Apply here
          </Link>
        </p>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load products.</p>
      ) : (
        <AnimateIn>
          <div className="space-y-4">
            {products.length === 0 && <p className="text-muted">No products listed yet.</p>}
            {products.map((p) => (
              <div
                key={p.id}
                className="flex gap-4 rounded-2xl border border-border bg-[var(--card-bg)] p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <ProductImage
                    src={p.image ?? ""}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted">Stock: {p.stock}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3 sm:mt-0">
                    <p className="font-bold">{formatRs(p.price)}</p>
                    <Link
                      href={`/dashboard/products/${p.id}/edit`}
                      className="text-muted hover:text-accent"
                      aria-label="Edit product"
                      title="Edit product"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                      className="text-muted hover:text-red-500"
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      )}
    </>
  );
}
