"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { hydrateWishlist } from "@/features/wishlist/wishlistSlice";
import { hydrateCompare } from "@/features/compare/compareSlice";

export function ClientHydration() {
  const dispatch = useAppDispatch();
  const wishlistHydrated = useAppSelector((s) => s.wishlist.hydrated);
  const compareHydrated = useAppSelector((s) => s.compare.hydrated);

  useEffect(() => {
    if (!wishlistHydrated) dispatch(hydrateWishlist());
    if (!compareHydrated) dispatch(hydrateCompare());
  }, [dispatch, wishlistHydrated, compareHydrated]);

  return null;
}
