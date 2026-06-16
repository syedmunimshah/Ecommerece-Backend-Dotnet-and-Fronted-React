"use client";

import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";
import { pushToast } from "@/features/ui/uiSlice";
import { cn } from "@/lib/cn";

export function WishlistButton({
  productId,
  className,
}: {
  productId: number;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.wishlist.productIds);
  const active = ids.includes(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(productId));
    dispatch(
      pushToast({
        tone: "success",
        message: active ? "Removed from wishlist" : "Added to wishlist",
      }),
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full border border-border bg-surface/80 p-2 backdrop-blur transition-colors hover:bg-elevated",
        active && "border-destructive/50 text-destructive",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
