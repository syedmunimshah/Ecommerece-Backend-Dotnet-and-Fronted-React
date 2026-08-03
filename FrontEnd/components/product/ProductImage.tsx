"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/utils/product";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

/** Product/cart images from API — any external URL works (no next.config hostname needed). */
export function ProductImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed || !src ? PRODUCT_PLACEHOLDER_IMAGE : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={cn(className, fill && "absolute inset-0 h-full w-full")}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
