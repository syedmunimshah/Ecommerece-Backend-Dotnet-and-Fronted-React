"use client";

import Link from "next/link";
import { useCartQuery } from "./useCart";
import { CartLineItem } from "./CartLineItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/format";
import { ShoppingCart } from "lucide-react";

export function CartPageClient() {
  const { data: cart, isLoading } = useCartQuery();

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!cart || !cart.Items.length) {
    return (
      <div className="py-20 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted/30" />
        <p className="text-xl font-semibold">Your cart is empty</p>
        <p className="mt-2 text-muted">Add some products to get started</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {cart.Items.map((item) => (
          <CartLineItem key={item.Id} item={item} />
        ))}
      </div>

      <div className="h-fit">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">
                Subtotal ({cart.Items.reduce((s, i) => s + i.Quantity, 0)} items)
              </span>
              <span>{formatCurrency(cart.TotalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-success">Free</span>
            </div>
          </div>
          <div className="my-4 border-t border-border" />
          <div className="mb-6 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-accent text-lg">{formatCurrency(cart.TotalAmount)}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
