import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryDto } from "@/types/category";
import { CategoryCard } from "@/components/category/CategoryCard";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function FeaturedCategories({ categories }: { categories: CategoryDto[] }) {
  if (!categories.length) return null;

  return (
    <AnimateIn as="section" className="container-page py-16" variant="fade-up">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Categories</h2>
          <p className="mt-1 text-sm text-muted">Browse by category</p>
        </div>
        <Link href="/categories" className="group inline-flex items-center gap-1 text-sm text-accent hover:underline">
          View all <ArrowRight className="h-4 w-4 motion-safe:group-hover:translate-x-1 motion-safe:transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.slice(0, 6).map((c, i) => (
          <AnimateIn key={c.Id} variant="scale-in" delay={i * 70} duration={450}>
            <CategoryCard category={c} index={i} />
          </AnimateIn>
        ))}
      </div>
    </AnimateIn>
  );
}
