import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";

const TESTIMONIALS = [
  { name: "Ayesha K.", rating: 5, text: "Amazing shopping experience! Fast delivery and great product quality." },
  { name: "Ahmed R.", rating: 5, text: "EdgeCart has the best prices. I always find what I need here." },
  { name: "Sara M.", rating: 4, text: "Love the seller verification system. I feel safe shopping here." },
];

export function CustomerReviews() {
  return (
    <section className="bg-surface/40 py-16">
      <div className="container-page">
        <AnimateIn variant="fade-up" className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold">What Our Customers Say</h2>
          <p className="text-sm text-muted">Trusted by thousands of shoppers across Pakistan</p>
        </AnimateIn>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <AnimateIn key={t.name} variant="fade-up" delay={i * 100}>
              <Card className="h-full p-6 motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="mb-3 flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 motion-safe:transition-transform ${j < t.rating ? "fill-warning text-warning" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
              </Card>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
