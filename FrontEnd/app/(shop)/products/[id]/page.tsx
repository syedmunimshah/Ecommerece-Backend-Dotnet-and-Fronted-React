import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProduct } from "@/services/product.service";
import { listProducts } from "@/services/product.service";
import { listProductReviews } from "@/services/review.service";
import { getServerToken } from "@/lib/jwt";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/features/products/AddToCartButton";
import { BuyNowButton } from "@/features/products/BuyNowButton";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { CompareButton } from "@/features/compare/CompareButton";
import { ProductReviewForm } from "@/features/products/ProductReviewForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { ReviewCard } from "@/components/review/ReviewCard";
import { formatCurrency } from "@/lib/format";
import { ApiError } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(Number(id));
    return { title: product.Name, description: product.Description ?? undefined };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const token = await getServerToken().catch(() => null);

  let product;
  try {
    product = await getProduct(Number(id), token);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 0)) notFound();
    notFound();
  }

  const reviewsRes = await listProductReviews(product.Id, 1, 20, token).catch(
    () => null,
  );
  const reviews = reviewsRes?.Data ?? [];
  const avgRating =
    reviews.length
      ? reviews.reduce((s, r) => s + r.Rating, 0) / reviews.length
      : 0;

  const allProducts = await listProducts(1, 50).catch(() => ({ Data: [] }));
  const related = allProducts.Data.filter(
    (p) => p.Id !== product.Id && p.CategoryId === product.CategoryId && p.IsActive,
  ).slice(0, 4);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Shop", href: "/products" },
    ...(product.CategoryName && product.CategoryId
      ? [{ label: product.CategoryName, href: `/categories/${product.CategoryId}` }]
      : []),
    { label: product.Name },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-elevated">
          {product.Image ? (
            <Image src={product.Image} alt={product.Name} fill className="object-cover" priority />
          ) : (
            <div className="grid h-full place-items-center text-muted/30 text-6xl font-bold">?</div>
          )}
          <div className="absolute right-3 top-3">
            <WishlistButton productId={product.Id} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {product.CategoryName && (
              <Badge tone="primary" className="mb-3">
                {product.CategoryName}
              </Badge>
            )}
            <h1 className="text-3xl font-bold">{product.Name}</h1>
            {product.SellerName && (
              <p className="mt-1 text-sm text-muted">Sold by {product.SellerName}</p>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-warning text-warning" : "fill-transparent text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          <p className="text-4xl font-bold text-accent">
            {formatCurrency(product.Price)}
          </p>

          {product.Description && (
            <p className="leading-relaxed text-foreground/80">{product.Description}</p>
          )}

          <div className="flex items-center gap-4">
            <Badge tone={product.Stock > 0 ? "success" : "destructive"}>
              {product.Stock > 0 ? `${product.Stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          <AddToCartButton productId={product.Id} stock={product.Stock} fullWidth />
          <BuyNowButton productId={product.Id} stock={product.Stock} />
          <CompareButton productId={product.Id} size="lg" className="w-full" />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-semibold">
          Customer reviews {reviews.length > 0 ? `(${reviews.length})` : ""}
        </h2>
        {reviews.length > 0 ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.Id} review={r} />
            ))}
          </div>
        ) : (
          <p className="mb-6 text-sm text-muted">No reviews yet. Be the first to review!</p>
        )}
        <ProductReviewForm productId={product.Id} />
      </section>
    </div>
  );
}
