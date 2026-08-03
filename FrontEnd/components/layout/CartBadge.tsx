"use client";

import { useCart } from "@/features/cart/CartProvider";

export function CartBadge() {
  const { count } = useCart();
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--nav-text)] px-1 text-[10px] font-bold text-[var(--nav-bg)]">
      {count}
    </span>
  );
}
