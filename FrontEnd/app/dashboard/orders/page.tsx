import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listMyOrders } from "@/services/order.service";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { OrderStatusBadge } from "@/features/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Suspense } from "react";

export const metadata: Metadata = { title: "My Orders" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MyOrdersPage({ searchParams }: PageProps) {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard/orders");

  const token = (await getServerToken())!;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const res = await listMyOrders(token, pageNum, 10).catch(() => null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My orders</h1>
      {!res || !res.Data.length ? (
        <Card>
          <p className="text-muted">No orders yet.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {res.Data.map((order) => (
              <Card key={order.Id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order #{order.Id}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {formatDate(order.CreatedDate)} ·{" "}
                      {order.Items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.Status} />
                    <span className="font-bold text-accent">
                      {formatCurrency(order.TotalAmount)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-3 flex flex-wrap gap-2">
                  {order.Items.slice(0, 3).map((item, i) => (
                    <Badge key={i} tone="default" className="text-xs">
                      {item.ProductName} ×{item.Quantity}
                    </Badge>
                  ))}
                  {order.Items.length > 3 && (
                    <Badge tone="default">+{order.Items.length - 3} more</Badge>
                  )}
                </div>
                <div className="mt-3">
                  <Link
                    href={`/dashboard/orders/${order.Id}`}
                    className="text-xs text-accent hover:underline"
                  >
                    View tracking →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <Suspense>
            <Pagination page={pageNum} pageSize={10} total={res.TotalRecords} />
          </Suspense>
        </>
      )}
    </div>
  );
}
