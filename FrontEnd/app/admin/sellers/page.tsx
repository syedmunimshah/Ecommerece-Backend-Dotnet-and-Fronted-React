"use client";

import { useState } from "react";
import { Loader2, Check, X, Package, ChevronDown, ChevronRight } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetPendingSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useGetAllSellerProfilesQuery,
  useGetProductsQuery,
} from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import { asArray } from "@/lib/utils/paged";
import type { SellerProfileDto } from "@/lib/types/api";

// Matches Service.Component.SellerStatus on the API side.
const STATUS: Record<number, { label: string; className: string }> = {
  0: { label: "Pending", className: "bg-amber-500/10 text-amber-700" },
  1: { label: "Approved", className: "bg-emerald-500/10 text-emerald-700" },
  2: { label: "Rejected", className: "bg-red-500/10 text-red-600" },
};

/**
 * Catalogue summary for one seller. The query only fires once the row is expanded,
 * so opening the page doesn't pull every seller's products at once.
 */
function SellerProducts({ sellerId }: { sellerId: number }) {
  const { data, isLoading, isError } = useGetProductsQuery({ sellerId, pageNumber: 1, pageSize: 100 });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading products...
      </div>
    );
  }
  if (isError) return <p className="py-3 text-sm text-muted">Could not load this seller&apos;s products.</p>;

  const products = data?.data ?? [];
  if (!products.length) return <p className="py-3 text-sm text-muted">This seller has no products yet.</p>;

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    const key = p.categoryName ?? "Uncategorised";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="border-t border-border pt-4">
      <p className="mb-3 text-sm font-semibold text-foreground">
        {products.length} product{products.length === 1 ? "" : "s"} across {Object.keys(byCategory).length} categor
        {Object.keys(byCategory).length === 1 ? "y" : "ies"}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(byCategory)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => (
            <span
              key={name}
              className="rounded-full bg-[var(--chip-bg)] px-3 py-1 text-xs font-medium text-muted"
            >
              {name} · {count}
            </span>
          ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="pb-2 pr-4 font-semibold">Product</th>
              <th className="pb-2 pr-4 font-semibold">Category</th>
              <th className="pb-2 pr-4 font-semibold">Price</th>
              <th className="pb-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4 text-muted">{p.categoryName ?? "—"}</td>
                <td className="py-2 pr-4 text-muted">Rs. {p.price.toLocaleString()}</td>
                <td className="py-2">
                  <span className={p.isActive ? "text-emerald-700" : "text-red-600"}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminSellersPage() {
  const { skipAdminApi } = useRoleApiSkip();
  const { data, isLoading, isError, refetch } = useGetPendingSellersQuery(undefined, {
    skip: skipAdminApi,
  });
  const { data: allData, isLoading: allLoading } = useGetAllSellerProfilesQuery(undefined, {
    skip: skipAdminApi,
  });
  const [approve] = useApproveSellerMutation();
  const [reject] = useRejectSellerMutation();
  const [expanded, setExpanded] = useState<number | null>(null);

  const pending = asArray<SellerProfileDto>(data);
  const allSellers = asArray<SellerProfileDto>(allData);

  const handleApprove = async (id: number) => {
    await approve(id).unwrap();
    refetch();
  };

  const handleReject = async (id: number) => {
    await reject(id).unwrap();
    refetch();
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Seller Approval" }]} />
      <PageHeader title="Sellers" subtitle="Review applications and browse seller catalogues" />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Pending applications
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load pending sellers.</p>
      ) : !pending.length ? (
        <p className="rounded-xl border border-dashed border-border py-8 text-center text-muted">
          No pending seller applications.
        </p>
      ) : (
        <div className="space-y-4">
          {pending.map((seller) => (
            <div key={seller.id} className="rounded-xl border border-border bg-[var(--card-bg)] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{seller.storeName}</p>
                  <p className="text-sm text-muted">
                    By {seller.userName} · {seller.phoneNumber}
                  </p>
                  <p className="mt-2 text-sm">{seller.storeDescription}</p>
                  <p className="mt-1 text-sm text-muted">{seller.storeAddress}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(seller.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(seller.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
        All sellers
      </h2>

      {allLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : !allSellers.length ? (
        <p className="rounded-xl border border-dashed border-border py-8 text-center text-muted">
          No sellers yet.
        </p>
      ) : (
        <div className="space-y-3">
          {allSellers.map((seller) => {
            const isOpen = expanded === seller.id;
            const status = STATUS[seller.status] ?? { label: "Unknown", className: "bg-[var(--chip-bg)] text-muted" };

            return (
              <div key={seller.id} className="rounded-xl border border-border bg-[var(--card-bg)] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold">{seller.storeName}</p>
                    <p className="text-sm text-muted">
                      {seller.userName} · {seller.storeAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : seller.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-surface"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Package className="h-4 w-4" />
                      {isOpen ? "Hide products" : "View products"}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4">
                    <SellerProducts sellerId={seller.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
