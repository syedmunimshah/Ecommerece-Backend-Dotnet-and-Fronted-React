"use client";

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";
import { MotionButton } from "@/components/motion/MotionButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatRoleLabel } from "@/lib/utils/role";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`Rate ${n} stars`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              n <= value ? "fill-amber-400 text-amber-400" : "text-muted",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: number }) {
  const { isAuthenticated, isUser, role } = useAuth();
  const { data, isLoading } = useGetProductReviewsQuery({ productId, pageSize: 20 });
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reviews = data?.data ?? [];
  const canReview = isAuthenticated && isUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createReview({ productId, rating, comment: comment.trim() || undefined }).unwrap();
      setComment("");
      setRating(5);
    } catch {
      setError("Could not submit review. You may have already reviewed this product.");
    }
  };

  return (
    <section id="reviews" className="mt-12 border-t border-border pt-10 scroll-mt-24">
      <h2 className="text-xl font-bold">Customer Reviews</h2>
      <p className="mt-1 text-sm text-muted">
        {data?.totalRecords ?? 0} review{(data?.totalRecords ?? 0) !== 1 ? "s" : ""}
      </p>

      {canReview && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border bg-[var(--card-bg)] p-5"
        >
          <p className="text-sm font-medium">Write a review</p>
          <div className="mt-3">
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-border bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <MotionButton type="submit" className="mt-4" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </MotionButton>
        </form>
      )}

      {!canReview && !isAuthenticated && (
        <p className="mt-4 text-sm text-muted">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>{" "}
          as a customer to write a review.
        </p>
      )}

      {isAuthenticated && !isUser && (
        <p className="mt-4 text-sm text-muted">
          Only customers can write reviews. Your role: {formatRoleLabel(role)}.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-border bg-[var(--card-bg)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{r.userName}</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted",
                      )}
                    />
                  ))}
                </div>
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
              <p className="mt-2 text-xs text-muted">
                {new Date(r.createdDate).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
