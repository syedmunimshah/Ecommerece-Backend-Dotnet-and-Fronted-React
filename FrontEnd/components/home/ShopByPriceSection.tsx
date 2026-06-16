import Link from "next/link";
import { AnimateIn } from "@/components/ui/AnimateIn";

const RANGES = [
  { label: "Under Rs. 1,000", href: "/products?max=1000" },
  { label: "Rs. 1,000 – 5,000", href: "/products?min=1000&max=5000" },
  { label: "Rs. 5,000 – 20,000", href: "/products?min=5000&max=20000" },
  { label: "Premium (Rs. 20,000+)", href: "/products?min=20000" },
];

export function ShopByPriceSection() {
  return (
    <section className="bg-surface/40 py-12">
      <div className="container-page">
        <AnimateIn variant="fade-up">
          <h2 className="mb-6 text-2xl font-bold">Shop by Price</h2>
        </AnimateIn>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {RANGES.map(({ label, href }, i) => (
            <AnimateIn key={label} variant="fade-up" delay={i * 80}>
              <Link
                href={href}
                className="card-interactive block p-6 text-center"
              >
                <span className="font-semibold">{label}</span>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
