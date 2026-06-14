import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listAllOrders } from "@/services/order.service";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { OrderStatusBadge } from "@/features/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "All Orders" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const res = await listAllOrders(token, pageNum, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All orders</h1>
        <span className="text-sm text-muted">{res.TotalRecords} total</span>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-elevated">
              <tr>
                {["Order", "User", "Items", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {res.Data.map((o) => (
                <tr key={o.Id} className="hover:bg-elevated/50">
                  <td className="px-4 py-3 font-mono text-xs text-muted">#{o.Id}</td>
                  <td className="px-4 py-3">#{o.UserId}</td>
                  <td className="px-4 py-3 text-muted">{o.Items.length}</td>
                  <td className="px-4 py-3 font-medium text-accent">
                    {formatCurrency(o.TotalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.Status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(o.CreatedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Suspense>
        <Pagination page={pageNum} pageSize={15} total={res.TotalRecords} />
      </Suspense>
    </div>
  );
}
