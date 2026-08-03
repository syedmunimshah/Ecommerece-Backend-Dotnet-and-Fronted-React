"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useConfirmPaymentQuery } from "@/lib/store/api/api";

function CheckoutSuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const sessionId = params.get("session_id");

  // Confirm the Stripe session server-side (marks the order paid) on return.
  const { data: payment, isLoading } = useConfirmPaymentQuery(sessionId ?? "", {
    skip: !sessionId,
  });

  const paid = payment?.status?.toLowerCase() === "paid";

  if (isLoading) {
    return (
      <div className="container-page py-16 text-center">
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-accent" />
        <p className="mt-4 text-muted">Confirming your payment…</p>
      </div>
    );
  }

  return (
    <div className="container-page py-16 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold">
        {paid ? "Payment successful" : "Order placed"}
      </h1>
      <p className="mt-2 text-muted">
        Thank you!{" "}
        {paid ? "Your payment has been received" : "Your order has been placed"}
        {orderId ? ` for order #${orderId}` : ""}.
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        {orderId ? (
          <Link href={`/dashboard/orders/${orderId}`} className="text-accent">
            View order
          </Link>
        ) : null}
        <Link href="/products" className="text-accent">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16 text-center text-muted">Loading…</div>
      }
    >
      <CheckoutSuccessInner />
    </Suspense>
  );
}
