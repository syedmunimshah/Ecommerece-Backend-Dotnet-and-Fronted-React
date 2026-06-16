"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAddToCart } from "@/features/cart/useCart";
import { useAuth } from "@/features/auth/useAuth";

export function BuyNowButton({
  productId,
  stock,
}: {
  productId: number;
  stock: number;
}) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push(`/login?from=/products/${productId}`);
      return;
    }
    addToCart.mutate(
      { ProductId: productId, Quantity: 1 },
      { onSuccess: () => router.push("/checkout") },
    );
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={handleClick}
      loading={addToCart.isPending}
      disabled={stock === 0}
    >
      <Zap className="h-4 w-4" /> Buy Now
    </Button>
  );
}
