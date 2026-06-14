"use client";

import { ShoppingCart } from "lucide-react";
import { useCartQuery } from "./useCart";

export function CartIndicator() {
  const { data } = useCartQuery();
  const count = data?.Items.reduce((acc, i) => acc + i.Quantity, 0) ?? 0;
  return (
    <div className="relative">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </div>
  );
}
