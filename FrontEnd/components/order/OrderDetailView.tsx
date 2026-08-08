"use client";

import Link from "next/link";
import {
  useGetOrderByIdQuery,
  useGetOrderTrackingQuery,
  useGetPaymentByOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";
import { formatRs } from "@/lib/format";
import { getOrderStatusClass } from "@/lib/orderStatus";
import { ShippingAddressCard } from "@/components/order/ShippingAddressCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { MotionButton } from "@/components/motion/MotionButton";
import { cn } from "@/lib/cn";
import { CheckCircle2, Circle, Package } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export function OrderDetailView({
  orderId,
  backHref,
  backLabel,
}: {
  orderId: number;
  backHref: string;
  backLabel: string;
}) {
  const { user, isUser } = useAuth();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const { data: tracking = [] } = useGetOrderTrackingQuery(orderId);
  const { data: payment } = useGetPaymentByOrderQuery(orderId);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();
  const [newStatus, setNewStatus] = useState("");

  const canUpdateStatus =
    user?.roleName === "Admin" || user?.roleName === "Seller";

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    await updateStatus({ id: orderId, status: newStatus });
    setNewStatus("");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">Order not found or you don&apos;t have access.</p>
        <Link href={backHref} className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          ← {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href={backHref} className="text-sm font-medium text-accent hover:underline">
        ← {backLabel}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-muted">
            Placed{" "}
            {order.createdDate
              ? new Date(order.createdDate).toLocaleString("en-PK")
              : "—"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-semibold",
            getOrderStatusClass(order.status),
          )}
        >
          {order.status}
        </span>
      </div>

      {/* Tracking timeline */}
      {tracking.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-[var(--card-bg)] p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-accent" />
            Order Tracking
          </h2>
          <ol className="mt-6 space-y-0">
            {tracking.map((step, i) => {
              const isLast = i === tracking.length - 1;
              return (
                <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast && (
                    <span className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                  )}
                  {isLast ? (
                    <CheckCircle2 className="relative z-10 h-6 w-6 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="relative z-10 h-6 w-6 shrink-0 fill-[var(--card-bg)] text-muted" />
                  )}
                  <div>
                    <p className={cn("font-medium", isLast && "text-emerald-600 dark:text-emerald-400")}>
                      {step.status}
                    </p>
                    <p className="text-xs text-muted">
                      {step.createdDate
                        ? new Date(step.createdDate).toLocaleString("en-PK")
                        : "—"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Status update (admin/seller) */}
      {canUpdateStatus && (
        <div className="mt-6 rounded-2xl border border-border bg-[var(--card-bg)] p-5">
          <p className="text-sm font-medium">Update order status</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="h-10 rounded-xl border border-border bg-[var(--surface)] px-3 text-sm outline-none"
            >
              <option value="">Select status...</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <MotionButton
              type="button"
              onClick={handleStatusUpdate}
              disabled={!newStatus || updating}
            >
              {updating ? "Updating..." : "Update"}
            </MotionButton>
          </div>
        </div>
      )}

      {/* Delivery address */}
      <div className="mt-6">
        <ShippingAddressCard address={order.shippingAddress} />
      </div>

      {/* Items */}
      <div className="mt-8 rounded-2xl border border-border bg-[var(--card-bg)] p-6">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <Link
                  href={`/products/${item.productId}`}
                  className="font-medium hover:text-accent hover:underline"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-muted">Qty: {item.quantity}</p>
                {isUser ? (
                  <Link
                    href={`/products/${item.productId}#reviews`}
                    className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                  >
                    Write a review →
                  </Link>
                ) : null}
              </div>
              <p className="font-semibold">{formatRs(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatRs(order.totalAmount)}</span>
        </div>
      </div>

      {/* Payment */}
      {payment && (
        <div className="mt-6 rounded-2xl border border-border bg-[var(--card-bg)] p-5 text-sm">
          <h2 className="font-semibold">Payment</h2>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-muted">Method</dt>
              <dd className="font-medium">{payment.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd className="font-medium">{payment.status}</dd>
            </div>
            <div>
              <dt className="text-muted">Transaction ID</dt>
              <dd className="font-mono text-xs">{payment.transactionId}</dd>
            </div>
            {payment.paidAt && (
              <div>
                <dt className="text-muted">Paid at</dt>
                <dd>{new Date(payment.paidAt).toLocaleString("en-PK")}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
