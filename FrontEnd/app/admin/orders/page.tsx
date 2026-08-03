"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { useGetAllOrdersQuery } from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import { formatRs } from "@/lib/format";
import { getOrderStatusClass } from "@/lib/orderStatus";

export default function AdminOrdersPage() {
  const [page] = useState(1);
  const { skipAdminApi } = useRoleApiSkip();
  const { data, isLoading, isError } = useGetAllOrdersQuery(
    { pageNumber: page, pageSize: 20 },
    { skip: skipAdminApi },
  );

  const orders = data?.data ?? [];

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]} />
      <PageHeader title="All Orders" subtitle={`${data?.totalRecords ?? 0} total orders`} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load orders.</p>
      ) : !orders.length ? (
        <p className="text-center text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-[var(--card-bg)] p-4 transition-colors hover:border-orange-500/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted">
                  User ID {order.userId} · {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(order.status)}`}
                >
                  {order.status}
                </span>
                <span className="font-bold">{formatRs(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
