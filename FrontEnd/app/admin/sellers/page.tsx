"use client";

import { Loader2, Check, X } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetPendingSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
} from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import { asArray } from "@/lib/utils/paged";
import type { SellerProfileDto } from "@/lib/types/api";

export default function AdminSellersPage() {
  const { skipAdminApi } = useRoleApiSkip();
  const { data, isLoading, isError, refetch } = useGetPendingSellersQuery(undefined, {
    skip: skipAdminApi,
  });
  const [approve] = useApproveSellerMutation();
  const [reject] = useRejectSellerMutation();

  const pending = asArray<SellerProfileDto>(data);

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
      <PageHeader title="Pending Sellers" subtitle="Review and approve seller applications" />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load pending sellers.</p>
      ) : !pending.length ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-muted">
          No pending seller applications.
        </p>
      ) : (
        <div className="space-y-4">
          {pending.map((seller) => (
            <div
              key={seller.id}
              className="rounded-xl border border-border bg-[var(--card-bg)] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{seller.storeName}</p>
                  <p className="text-sm text-muted">By {seller.userName} · {seller.phoneNumber}</p>
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
    </>
  );
}
