"use client";

import { ThemeProvider } from "@/features/ui/ThemeProvider";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { WishlistProvider } from "@/features/wishlist/WishlistProvider";
import { AuthProfileSync } from "@/components/auth/AuthProfileSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProfileSync />
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
