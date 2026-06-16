import { Star } from "lucide-react";
import type { ReviewDto } from "@/types/review";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";

export function ReviewCard({ review }: { review: ReviewDto }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < review.Rating ? "fill-warning text-warning" : "fill-transparent text-muted"}`}
            />
          ))}
        </div>
        <span className="ml-auto text-xs text-muted">{formatDate(review.CreatedDate)}</span>
      </div>
      {review.Comment && (
        <p className="mt-2 text-sm text-foreground/80 line-clamp-4">{review.Comment}</p>
      )}
    </Card>
  );
}
