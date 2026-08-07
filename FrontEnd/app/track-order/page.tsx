"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/features/auth/useAuth";
import { useMounted } from "@/lib/hooks/useMounted";
import { useGetOrderByIdQuery, useGetOrderTrackingQuery } from "@/lib/store/api/api";
import { getOrderStatusClass } from "@/lib/orderStatus";
import { cn } from "@/lib/cn";

export default function TrackOrderPage() {
  const { isAuthenticated: authFromStore } = useAuth();
  // The token lives in localStorage, so the server always renders as signed out while
  // the browser renders as signed in — React reports that as a hydration mismatch and
  // throws the tree away. Treating everyone as signed out until mounted makes the first
  // client render match the server's, and the real state takes over immediately after.
  const mounted = useMounted();
  const isAuthenticated = mounted && authFromStore;
  const [input, setInput] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  // Both calls are ownership-checked server-side, so a guessed id returns nothing.
  const { data: order, isFetching, isError } = useGetOrderByIdQuery(orderId!, { skip: !orderId });
  const { data: tracking = [] } = useGetOrderTrackingQuery(orderId!, { skip: !orderId });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(input.trim());
    setOrderId(Number.isInteger(parsed) && parsed > 0 ? parsed : null);
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Track Order" }]} />
      <AnimateIn>
        <PageHeader title="Track Order" subtitle="Enter your order ID to see where it is" />

        <div className="max-w-3xl space-y-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-3 rounded-2xl border border-border bg-[var(--card-bg)] p-6 sm:p-8"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              inputMode="numeric"
              placeholder="Order ID, e.g. 14"
              aria-label="Order ID"
              className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-[var(--search-bg)] px-4 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!input.trim() || !isAuthenticated}
              className="h-11 rounded-xl bg-[var(--product-btn-bg)] px-6 text-sm font-semibold text-[var(--product-btn-text)] transition hover:opacity-90 disabled:opacity-40"
            >
              Track
            </button>
          </form>

          {!isAuthenticated ? (
            <Card>
              <p className="text-sm text-muted">
                Orders are private, so you need to be signed in to track one.{" "}
                <Link href="/login" className="font-medium text-accent hover:underline">
                  Sign in
                </Link>{" "}
                and try again.
              </p>
            </Card>
          ) : isFetching ? (
            <Card>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-24 rounded-xl" />
            </Card>
          ) : orderId && (isError || !order) ? (
            <Card>
              <p className="text-sm text-muted">
                No order <span className="font-medium text-foreground">#{orderId}</span> on your
                account. Check the ID — it is on your{" "}
                <Link href="/dashboard/orders" className="font-medium text-accent hover:underline">
                  orders page
                </Link>
                .
              </p>
            </Card>
          ) : order ? (
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Order #{order.id}</h2>
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

              {tracking.length > 0 ? (
                <ol className="mt-8 space-y-0">
                  {tracking.map((step, i) => (
                    <li key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "mt-1 h-3 w-3 shrink-0 rounded-full",
                            i === tracking.length - 1 ? "bg-accent" : "bg-border",
                          )}
                        />
                        {i < tracking.length - 1 && <span className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-medium text-foreground">{step.status}</p>
                        <p className="text-xs text-muted">
                          {step.createdDate
                            ? new Date(step.createdDate).toLocaleString("en-PK")
                            : "—"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-6 text-sm text-muted">
                  No tracking updates yet. They appear here as the order moves along.
                </p>
              )}

              <Link
                href={`/dashboard/orders/${order.id}`}
                className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
              >
                View full order details →
              </Link>
            </Card>
          ) : (
            <Card>
              <p className="text-sm text-muted">
                Your order ID is on the confirmation page after checkout, and on your{" "}
                <Link href="/dashboard/orders" className="font-medium text-accent hover:underline">
                  orders page
                </Link>
                . You can also just ask the assistant in the corner — it knows your orders without
                an ID.
              </p>
            </Card>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--card-bg)] p-6 sm:p-8">{children}</div>
  );
}
