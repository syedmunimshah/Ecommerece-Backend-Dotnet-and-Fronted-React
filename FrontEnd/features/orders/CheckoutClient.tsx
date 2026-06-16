"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCartQuery } from "@/features/cart/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { cartKeys } from "@/features/cart/useCart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PaymentForm } from "@/features/orders/PaymentForm";
import { bffApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";
import type { OrderDto } from "@/types/order";
import type { PaymentDto } from "@/types/payment";

type Step = "review" | "payment" | "complete";

export function CheckoutClient() {
  const router = useRouter();
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const { data: cart, isLoading } = useCartQuery();
  const [step, setStep] = useState<Step>("review");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [payment, setPayment] = useState<PaymentDto | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (step === "complete" && order) {
    return (
      <div className="py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
        <h2 className="text-2xl font-bold">Order confirmed!</h2>
        <p className="mt-2 text-muted">
          Order #{order.Id} · {formatCurrency(order.TotalAmount)}
        </p>
        {payment && (
          <p className="mt-1 text-sm text-muted">
            Payment {payment.Status.toLowerCase()}
            {payment.TransactionId ? ` · ${payment.TransactionId}` : ""}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={() => router.push(`/dashboard/orders/${order.Id}`)}>
            <ShoppingBag className="h-4 w-4" /> Track order
          </Button>
          <Button variant="outline" onClick={() => router.push("/products")}>
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || !cart.Items.length) {
    if (step === "review") {
      router.replace("/cart");
      return null;
    }
  }

  const placeOrder = async () => {
    if (!cart?.Items.length) return;
    setPlacing(true);
    try {
      const { data } = await bffApi.post<OrderDto>("/orders");
      setOrder(data);
      qc.setQueryData(cartKeys.all, null);
      setStep("payment");
      dispatch(pushToast({ tone: "success", message: "Order created — complete payment below." }));
    } catch {
      dispatch(pushToast({ tone: "error", message: "Failed to place order. Try again." }));
    } finally {
      setPlacing(false);
    }
  };

  if (step === "payment" && order) {
    return (
      <div className="mx-auto max-w-lg">
        <PaymentForm
          orderId={order.Id}
          amount={order.TotalAmount}
          onSuccess={(p) => {
            setPayment(p);
            router.push(`/checkout/success?orderId=${order.Id}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-lg font-semibold">Review your items</h2>
        {cart!.Items.map((item) => (
          <div key={item.Id} className="card flex items-center gap-4 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-elevated text-xs text-muted">
              #{item.ProductId}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.ProductName}</p>
              <p className="text-sm text-muted">
                {item.Quantity} × {formatCurrency(item.Price)}
              </p>
            </div>
            <p className="font-semibold">
              {formatCurrency(item.Price * item.Quantity)}
            </p>
          </div>
        ))}
      </div>

      <div>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(cart!.TotalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-success">Free</span>
            </div>
          </div>
          <div className="my-4 border-t border-border" />
          <div className="mb-4 flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-accent">{formatCurrency(cart!.TotalAmount)}</span>
          </div>
          <p className="mb-6 text-xs text-muted">
            Your cart will be cleared when you continue. Payment is collected on the next step.
          </p>
          <Button className="w-full" size="lg" loading={placing} onClick={placeOrder}>
            Continue to payment
          </Button>
        </Card>
      </div>
    </div>
  );
}
