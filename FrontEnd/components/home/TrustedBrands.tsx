import { TRUSTED_BRANDS } from "@/lib/content/home";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/cn";

export function TrustedBrands({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-border bg-[var(--section-muted)] py-10 sm:py-12", className)}>
      <div className="container-page">
        <AnimateIn>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Trusted by Global Brands
          </p>
        </AnimateIn>
        <StaggerContainer className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:gap-x-16">
          {TRUSTED_BRANDS.map((brand) => (
            <StaggerItem key={brand}>
              <span className="text-lg font-bold tracking-tight text-foreground/70 transition-colors hover:text-foreground sm:text-xl">
                {brand}
              </span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
