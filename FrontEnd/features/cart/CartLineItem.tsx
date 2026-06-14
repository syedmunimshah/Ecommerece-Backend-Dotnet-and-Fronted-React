"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemDto } from "@/types/cart";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { useRemoveCartItem, useUpdateCartItem } from "./useCart";

export function CartLineItem({ item }: { item: CartItemDto }) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();

  const setQuantity = (q: number) => {
    if (q < 1) return;
    update.mutate({ CartItemId: item.Id, Quantity: q });
  };

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-0">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded bg-elevated text-muted">
        #{item.ProductId}
      </div>
      <div className="flex-1">
        <p className="font-medium">{item.ProductName}</p>
        <p className="text-sm text-muted">{formatCurrency(item.Price)}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity(item.Quantity - 1)}
          disabled={update.isPending || item.Quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.Quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity(item.Quantity + 1)}
          disabled={update.isPending}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <p className="w-24 text-right font-medium">
        {formatCurrency(item.Price * item.Quantity)}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => remove.mutate(item.Id)}
        disabled={remove.isPending}
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
