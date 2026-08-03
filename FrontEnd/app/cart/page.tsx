"use client";

import { ProductImage } from "@/components/product/ProductImage";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/CartProvider";
import { Breadcrumb, EmptyState, PageHeader } from "@/components/layout/PageShell";
import { formatRs } from "@/lib/format";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, updateQty, removeItem, total, isLoading } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="container-page py-10 sm:py-14">
        <Breadcrumb items={[{ label: "Cart" }]} />
        <EmptyState
          title="Sign in to view your cart"
          description="Login to add items and checkout."
          action={{ label: "Sign in", href: "/login?redirect=/cart" }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[40vh] items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-page py-10 sm:py-14">
        <Breadcrumb items={[{ label: "Cart" }]} />
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add items to your cart."
          action={{ label: "Start Shopping", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <PageHeader title="Shopping Cart" subtitle={`${items.length} item(s)`} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <AnimateIn key={item.cartItemId}>
              <div className="flex gap-4 rounded-xl border border-border bg-[var(--card-bg)] p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {item.image ? (
                    <ProductImage src={item.image} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">No img</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${item.productId}`} className="font-semibold hover:text-accent">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm font-bold">{formatRs(item.price)}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-muted hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
        <div className="h-fit rounded-2xl border border-border bg-[var(--card-bg)] p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatRs(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-emerald-600">{total >= 3500 ? "Free" : formatRs(250)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatRs(total >= 3500 ? total : total + 250)}</span>
          </div>
          <MotionButton href="/checkout" className="mt-6 w-full">
            Proceed to Checkout
          </MotionButton>
        </div>
      </div>
    </div>
  );
}
