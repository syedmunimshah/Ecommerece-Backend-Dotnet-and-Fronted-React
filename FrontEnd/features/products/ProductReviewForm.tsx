"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, Textarea } from "@/components/ui/Input";
import { bffApi } from "@/services/api";

export function ProductReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reviews are only written by buyers (role: User)
  if (!isAuthenticated || user?.role !== "User") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bffApi.post("/reviews", {
        ProductId: productId,
        Rating: rating,
        Comment: comment.trim(),
      });
      dispatch(pushToast({ tone: "success", message: "Review submitted successfully!" }));
      setComment("");
      setRating(5);
      router.refresh();
    } catch {
      dispatch(pushToast({ tone: "error", message: "Failed to submit review." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mt-8 border border-border p-6 bg-surface/50 backdrop-blur-sm shadow-sm">
      <h3 className="text-lg font-bold mb-4">Write a customer review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="block text-sm font-medium text-foreground mb-1.5">Rating *</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starVal = i + 1;
              const filled = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 focus:outline-none transition-colors"
                  aria-label={`Rate ${starVal} out of 5 stars`}
                >
                  <Star
                    className={`h-6 w-6 transition-colors duration-150 ${
                      filled ? "fill-warning text-warning scale-110" : "fill-transparent text-muted hover:text-warning"
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-2 text-sm text-muted">
              {rating} Star{rating > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <FormField label="Comment (Optional)">
          <Textarea
            placeholder="Help others by sharing your experience with this product…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" loading={submitting} disabled={rating < 1 || rating > 5}>
            Submit Review
          </Button>
        </div>
      </form>
    </Card>
  );
}
