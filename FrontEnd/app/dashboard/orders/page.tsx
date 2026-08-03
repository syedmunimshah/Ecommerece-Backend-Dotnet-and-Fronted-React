"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useGetMyOrdersQuery } from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { formatRs } from "@/lib/format";
import { getOrderStatusClass } from "@/lib/orderStatus";

function OrdersContent() {
  const { isAuthenticated, isUser } = useAuth();
  const searchParams = useSearchParams();
  const successId = searchParams.get("success");
  const { data, isLoading, isError } = useGetMyOrdersQuery(undefined, { skip: !isAuthenticated || !isUser });

  if (!isAuthenticated) {
    return (
      <p className="text-muted">
        <Link href="/login?redirect=/dashboard/orders" className="text-accent">Sign in</Link> to view orders.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  const orders = data?.data ?? [];

  return (
    <>
      {successId && (
        <div className="mb-6 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          Order #{successId} placed successfully! Open the order to track it, or{" "}
          <Link href="/dashboard/orders" className="font-semibold underline">
            view all orders
          </Link>
          . To review products, open the product page from your order and scroll to{" "}
          <strong>Customer Reviews</strong>.
        </div>
      )}
      {isError ? (
        <p className="py-8 text-center text-muted">Could not load orders.</p>
      ) : !orders.length ? (
        <p className="py-8 text-center text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-[var(--card-bg)] p-5 transition-colors hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted">
                  {order.createdDate
                    ? new Date(order.createdDate).toLocaleDateString()
                    : "—"}{" "}
                  · {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
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

export default function OrdersPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Orders" }]} />
      <PageHeader title="My Orders" subtitle="Track and manage your purchases" />
      <AnimateIn>
        <Suspense>
          <OrdersContent />
        </Suspense>
      </AnimateIn>
    </>
  );
}
