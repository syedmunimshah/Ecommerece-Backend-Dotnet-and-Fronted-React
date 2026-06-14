import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { getOrder, getOrderTracking } from "@/services/order.service";
import { getPayment } from "@/services/payment.service";
import { Card } from "@/components/ui/Card";
import { OrderStatusBadge } from "@/features/orders/OrderStatusBadge";
import { OrderPaymentSection } from "@/features/orders/OrderPaymentSection";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { ApiError } from "@/types/api";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Order Details" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const token = (await getServerToken())!;

  let order, tracking, payment;
  try {
    [order, tracking] = await Promise.all([
      getOrder(token, Number(id)),
      getOrderTracking(token, Number(id)).catch(() => []),
    ]);
    payment = await getPayment(token, Number(id)).catch(() => null);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Order #{order.Id}</h1>
        <OrderStatusBadge status={order.Status} />
      </div>

      <OrderPaymentSection
        orderId={order.Id}
        amount={order.TotalAmount}
        initialPayment={payment}
      />

      <Card>
        <h2 className="mb-3 font-semibold">Items</h2>
        <div className="divide-y divide-border">
          {order.Items.map((item) => (
            <div key={item.ProductId} className="flex items-center justify-between py-3 text-sm">
              <span>{item.ProductName} × {item.Quantity}</span>
              <span className="font-medium">{formatCurrency(item.Price * item.Quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-bold">
          <span>Total</span>
          <span className="text-accent">{formatCurrency(order.TotalAmount)}</span>
        </div>
      </Card>

      {tracking.length > 0 && (
        <Card>
          <h2 className="mb-4 font-semibold">Tracking history</h2>
          <ol className="relative space-y-4 border-l border-border pl-4">
            {tracking.map((t) => (
              <li key={t.Id} className="flex items-start gap-3">
                <CheckCircle2 className="relative -left-[1.15rem] mt-0.5 h-4 w-4 shrink-0 text-success" />
                <div>
                  <p className="font-medium">{t.Status}</p>
                  <p className="text-xs text-muted">{formatDateTime(t.CreatedDate)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <p className="text-sm text-muted">Placed on {formatDate(order.CreatedDate)}</p>
    </div>
  );
}
