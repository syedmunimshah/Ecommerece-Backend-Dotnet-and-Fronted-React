"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/CartProvider";
import { useCreateOrderMutation, useCreatePaymentMutation } from "@/lib/store/api/api";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { formatRs } from "@/lib/format";
import { MotionButton } from "@/components/motion/MotionButton";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isUser } = useAuth();
  const { items, total } = useCart();
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = total >= 3500 ? 0 : 250;
  const grandTotal = total + shipping;

  if (!isAuthenticated) {
    return (
      <div className="container-page py-10 text-center">
        <p className="text-muted">
          Please <Link href="/login?redirect=/checkout" className="text-accent">sign in</Link> to checkout.
        </p>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="container-page py-10 text-center">
        <p className="text-muted">
          Checkout is for customer accounts only.{" "}
          <Link href="/dashboard" className="text-accent">Go to dashboard</Link>
        </p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-page py-10">
        <p className="text-center text-muted">
          Cart is empty. <Link href="/products" className="text-accent">Shop now</Link>
        </p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const order = await createOrder().unwrap();
      const result = await createPayment({
        orderId: order.id,
        paymentMethod,
      }).unwrap();

      if (result.type === "stripe_checkout" && result.checkoutUrl) {
        // Redirect to Stripe-hosted checkout (returns to /checkout/success on completion).
        window.location.href = result.checkoutUrl;
        return;
      }

      router.push(`/dashboard/orders?success=${order.id}`);
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <PageHeader title="Checkout" subtitle="Review and place your order" />
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-[var(--card-bg)] p-6 sm:p-8">
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between">
              <span className="text-muted">
                {item.productName} × {item.quantity}
              </span>
              <span>{formatRs(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        {shipping > 0 && (
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>{formatRs(shipping)}</span>
          </div>
        )}
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatRs(grandTotal)}</span>
          </div>
        </div>
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="Card">Card (Stripe)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <MotionButton className="mt-6 w-full gap-2" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Processing..." : "Place Order"}
        </MotionButton>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <CheckCircle2 className="h-4 w-4" />
          Payments secured by Stripe
        </p>
      </div>
    </div>
  );
}
