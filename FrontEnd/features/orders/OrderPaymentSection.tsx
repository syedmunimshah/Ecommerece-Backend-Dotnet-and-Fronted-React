"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentForm } from "@/features/orders/PaymentForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PaymentDto } from "@/types/payment";

export function OrderPaymentSection({
  orderId,
  amount,
  initialPayment,
}: {
  orderId: number;
  amount: number;
  initialPayment: PaymentDto | null;
}) {
  const router = useRouter();
  const [payment, setPayment] = useState(initialPayment);
  const [showForm, setShowForm] = useState(false);

  if (payment) {
    return (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Payment</h2>
          <Badge tone={payment.Status === "Completed" ? "success" : "warning"}>
            {payment.Status}
          </Badge>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Amount</dt>
            <dd className="font-medium">{formatCurrency(payment.Amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Method</dt>
            <dd className="font-medium">{payment.PaymentMethod}</dd>
          </div>
          {payment.TransactionId && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Transaction ID</dt>
              <dd className="font-mono text-xs">{payment.TransactionId}</dd>
            </div>
          )}
          {payment.PaidAt && (
            <div>
              <dt className="text-xs text-muted">Paid at</dt>
              <dd>{formatDateTime(payment.PaidAt)}</dd>
            </div>
          )}
        </dl>
      </Card>
    );
  }

  if (showForm) {
    return (
      <PaymentForm
        orderId={orderId}
        amount={amount}
        onSuccess={(p) => {
          setPayment(p);
          setShowForm(false);
          router.refresh();
        }}
      />
    );
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <h2 className="font-semibold">Payment pending</h2>
      <p className="mt-1 text-sm text-muted">
        This order has not been paid yet. Complete payment to confirm your purchase.
      </p>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mt-4 text-sm font-medium text-accent hover:underline"
      >
        Pay now →
      </button>
    </Card>
  );
}
