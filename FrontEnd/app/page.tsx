import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { listProducts } from "@/services/product.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const { Data: featured } = await listProducts(1, 4).catch(() => ({ Data: [] }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container-page text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Shop smarter with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EdgeCart
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted">
              A modern marketplace with role-based access — shop as a buyer,
              sell as a verified seller, or manage as admin.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        />
      </section>

      {/* Value props */}
      <section className="border-y border-border bg-surface/40">
        <div className="container-page grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck, title: "Fast delivery", body: "Same-day dispatch on all in-stock items" },
            { icon: ShieldCheck, title: "Verified sellers", body: "Every seller is reviewed and approved" },
            { icon: RotateCcw, title: "Easy returns", body: "30-day no-hassle return policy" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4 p-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-sm text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured products</h2>
            <Link href="/products" className="text-sm text-accent hover:underline">
              View all →
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}
    </>
  );
}
