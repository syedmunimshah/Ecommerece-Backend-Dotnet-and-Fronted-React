"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface WishlistContextValue {
  ids: number[];
  count: number;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("edgecart-wishlist");
      if (raw) setIds(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("edgecart-wishlist", JSON.stringify(ids));
  }, [ids, ready]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
