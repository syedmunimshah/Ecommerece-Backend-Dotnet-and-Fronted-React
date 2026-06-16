"use client";

import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function DashboardReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>
      <Card className="p-6">
        <p className="text-sm text-muted">
          Reviews you&apos;ve written appear on product pages. Visit any product you&apos;ve purchased to leave a review.
        </p>
        <Link href="/products" className="mt-4 inline-block text-sm text-accent hover:underline">
          Browse products to review →
        </Link>
      </Card>
      <EmptyState
        icon={<Star className="h-16 w-16" />}
        title="No reviews yet"
        description="Share your experience by reviewing products you've purchased."
        actionLabel="Shop Now"
        actionHref="/products"
      />
    </div>
  );
}
