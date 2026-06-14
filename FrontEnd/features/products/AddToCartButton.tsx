"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAddToCart } from "@/features/cart/useCart";
import { useAuth } from "@/features/auth/useAuth";
import { useRouter } from "next/navigation";

export function AddToCartButton({
  productId,
  stock,
  fullWidth = false,
}: {
  productId: number;
  stock: number;
  fullWidth?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=/products/${productId}`);
      return;
    }
    addToCart.mutate({ ProductId: productId, Quantity: 1 });
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      loading={addToCart.isPending}
      disabled={stock === 0}
      className={fullWidth ? "w-full" : ""}
    >
      <ShoppingCart className="h-4 w-4" />
      {stock === 0 ? "Out of stock" : "Add to cart"}
    </Button>
  );
}
