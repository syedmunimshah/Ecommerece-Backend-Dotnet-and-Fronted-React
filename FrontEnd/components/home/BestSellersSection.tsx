"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BEST_SELLERS } from "@/lib/content/home";
import { formatRs } from "@/lib/format";
import { hoverLift, springTransition } from "@/lib/motion";

export function BestSellersSection() {
  return (
    <section className="border-t border-border bg-background py-8 lg:hidden">
      <div className="px-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 fill-amber-400 text-amber-400" />
          <h2 className="text-lg font-bold text-foreground">Best Sellers</h2>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
          {BEST_SELLERS.map((product) => (
            <motion.div
              key={product.id}
              whileHover={hoverLift}
              transition={springTransition}
              className="w-[140px] shrink-0 sm:w-[160px]"
            >
              <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                {product.name}
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {formatRs(product.price)}
              </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
