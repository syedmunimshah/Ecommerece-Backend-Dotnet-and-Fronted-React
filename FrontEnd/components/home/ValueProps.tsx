import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const ITEMS = [
  { icon: Truck, title: "Fast Delivery", body: "Same-day dispatch on in-stock items nationwide" },
  { icon: ShieldCheck, title: "Verified Sellers", body: "Every seller is reviewed and approved by our team" },
  { icon: RotateCcw, title: "Easy Returns", body: "30-day no-hassle return policy on eligible items" },
  { icon: Headphones, title: "24/7 Support", body: "Our support team is always here to help you" },
];

export function ValueProps() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="container-page grid grid-cols-1 divide-y divide-border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <AnimateIn key={title} variant="fade-up" delay={i * 80} duration={500}>
            <div className="flex items-start gap-4 p-6 motion-safe:transition-colors motion-safe:hover:bg-elevated/50">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 motion-safe:transition-transform motion-safe:duration-300 hover:scale-110">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-sm text-muted">{body}</p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
