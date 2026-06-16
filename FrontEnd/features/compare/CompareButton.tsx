"use client";

import { GitCompare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { toggleCompare } from "@/features/compare/compareSlice";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function CompareButton({
  productId,
  className,
  size = "sm",
}: {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.compare.productIds);
  const active = ids.includes(productId);

  const onClick = () => {
    if (!active && ids.length >= 4) {
      dispatch(pushToast({ tone: "error", message: "You can compare up to 4 products." }));
      return;
    }
    dispatch(toggleCompare(productId));
    dispatch(
      pushToast({
        tone: "success",
        message: active ? "Removed from compare" : "Added to compare",
      }),
    );
  };

  return (
    <Button
      variant={active ? "primary" : "outline"}
      size={size}
      onClick={onClick}
      className={cn(className)}
    >
      <GitCompare className="h-4 w-4" /> {active ? "In Compare" : "Compare"}
    </Button>
  );
}
