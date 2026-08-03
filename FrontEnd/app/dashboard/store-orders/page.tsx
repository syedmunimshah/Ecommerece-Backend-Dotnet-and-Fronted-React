"use client";

import { Loader2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { useGetSellerOrdersQuery } from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";
import { formatRs } from "@/lib/format";
import { getOrderStatusClass } from "@/lib/orderStatus";
import Link from "next/link";
import { useMounted } from "@/lib/hooks/useMounted";

export default function StoreOrdersPage() {
  const mounted = useMounted();
  const { isSeller } = useAuth();
  const { data, isLoading, isError } = useGetSellerOrdersQuery(undefined, { skip: !isSeller });

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!isSeller) {
    return (
      <p className="text-muted">
        Seller access required.{" "}
        <Link href="/dashboard/become-seller" className="text-accent">
          Apply as seller
        </Link>
      </p>
    );
  }

  const orders = data?.data ?? [];

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Store Orders" }]} />
      <PageHeader title="Store Orders" subtitle="Orders containing your products" />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load store orders.</p>
      ) : !orders.length ? (
        <p className="text-center text-muted">No store orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block rounded-2xl border border-border bg-[var(--card-bg)] p-5 transition-colors hover:border-seller/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-muted">{order.items.length} item(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold">{formatRs(order.totalAmount)}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.productName} × {item.quantity} — {formatRs(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
