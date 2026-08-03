"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog";
import { useAuth } from "@/features/auth/useAuth";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/lib/store/api/api";

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isLoading: boolean;
  addItem: (product: Product, qty?: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQty: (cartItemId: number, qty: number) => Promise<void>;
  refetch: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isUser } = useAuth();
  const { data: cart, isLoading, refetch } = useGetCartQuery(undefined, {
    skip: !isAuthenticated || !isUser,
  });
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = useMemo<CartItem[]>(
    () =>
      cart?.items.map((item) => ({
        cartItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })) ?? [],
    [cart],
  );

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = cart?.totalAmount ?? items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = useCallback(
    async (product: Product, qty = 1) => {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
        return;
      }
      await addToCart({ productId: product.id, quantity: qty }).unwrap();
    },
    [isAuthenticated, addToCart, router],
  );

  const removeItem = useCallback(
    async (cartItemId: number) => {
      await removeFromCart(cartItemId).unwrap();
    },
    [removeFromCart],
  );

  const updateQty = useCallback(
    async (cartItemId: number, qty: number) => {
      if (qty < 1) return;
      await updateCartItem({ cartItemId, quantity: qty }).unwrap();
    },
    [updateCartItem],
  );

  return (
    <CartContext.Provider
      value={{ items, count, total, isLoading, addItem, removeItem, updateQty, refetch }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
