"use client";

import { useWishlist } from "@/features/wishlist/WishlistProvider";

export function WishlistBadge() {
  const { count } = useWishlist();
  if (!count) return null;
  return (
    <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
      {count}
    </span>
  );
}

export function WishlistNavBadge() {
  const { count } = useWishlist();
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--nav-text)] px-1 text-[10px] font-bold text-[var(--nav-bg)]">
      {count}
    </span>
  );
}
