"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ShoppingBag, Star, Store } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useGetMyOrdersQuery } from "@/lib/store/api/api";
import { useCart } from "@/features/cart/CartProvider";

const STEPS = [
  { id: "browse", label: "Browse products & search", href: "/products", icon: ShoppingBag },
  { id: "cart", label: "Add items to cart", href: "/products", icon: ShoppingBag },
  { id: "checkout", label: "Checkout & place order", href: "/checkout", icon: ShoppingBag },
  { id: "orders", label: "View orders & tracking", href: "/dashboard/orders", icon: ShoppingBag },
  { id: "review", label: "Write a product review", href: "/products/1", icon: Star },
  { id: "seller", label: "Apply to become a seller", href: "/dashboard/become-seller", icon: Store },
] as const;

export function CustomerNextSteps() {
  const { isAuthenticated, isUser, isSeller, isAdmin } = useAuth();
  const { count: cartCount } = useCart();
  const { data: orders } = useGetMyOrdersQuery(undefined, { skip: !isAuthenticated || !isUser });

  if (!isAuthenticated || isSeller || isAdmin) return null;

  const orderCount = orders?.data?.length ?? 0;

  return (
    <section className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
      <h2 className="text-lg font-bold">Your next steps</h2>
      <p className="mt-1 text-sm text-muted">
        Follow this checklist to test the full customer flow on EdgeCart.
      </p>
      <ol className="mt-4 space-y-3">
        {STEPS.map((step, index) => {
          const completed =
            step.id === "browse"
              ? true
              : step.id === "cart"
                ? cartCount > 0
                : step.id === "checkout" || step.id === "orders"
                  ? orderCount > 0
                  : false;
          const Icon = step.icon;
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-[var(--card-bg)] px-4 py-3 transition-colors hover:border-accent/40"
              >
                {completed ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted" />
                )}
                <span className="flex-1 text-sm font-medium">
                  <span className="text-muted">{index + 1}. </span>
                  {step.label}
                </span>
                <Icon className="h-4 w-4 text-muted" />
              </Link>
            </li>
          );
        })}
      </ol>
      {isUser && (
        <p className="mt-4 text-xs text-muted">
          Tip: Forgot-password OTP appears in the backend console during development.
        </p>
      )}
    </section>
  );
}
