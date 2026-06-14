import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listPendingSellers } from "@/services/sellerProfile.service";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SellerApprovalActions } from "@/features/seller/SellerApprovalActions";
import { formatDate } from "@/lib/format";
import { SellerStatus } from "@/types/seller";

export const metadata: Metadata = { title: "Seller Approvals" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminSellersPage({ searchParams }: PageProps) {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const res = await listPendingSellers(token, pageNum, 15);

  const statusTone = (s: number) =>
    s === SellerStatus.Approved
      ? "success"
      : s === SellerStatus.Rejected
        ? "destructive"
        : "warning";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seller approvals</h1>
        <span className="text-sm text-muted">{res.TotalRecords} pending</span>
      </div>

      {!res.Data.length ? (
        <Card>
          <p className="text-muted">No pending seller applications.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {res.Data.map((seller) => (
              <Card key={seller.Id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{seller.StoreName}</p>
                      <Badge tone={statusTone(seller.Status)}>{seller.StatusName}</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {seller.UserName} — applied {formatDate(seller.CreatedDate)}
                    </p>
                    {seller.StoreDescription && (
                      <p className="text-sm">{seller.StoreDescription}</p>
                    )}
                    {seller.StoreAddress && (
                      <p className="text-xs text-muted">{seller.StoreAddress}</p>
                    )}
                    {seller.PhoneNumber && (
                      <p className="text-xs text-muted">{seller.PhoneNumber}</p>
                    )}
                  </div>
                  {seller.Status === SellerStatus.Pending && (
                    <SellerApprovalActions sellerId={seller.Id} />
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Suspense>
            <Pagination page={pageNum} pageSize={15} total={res.TotalRecords} />
          </Suspense>
        </>
      )}
    </div>
  );
}
