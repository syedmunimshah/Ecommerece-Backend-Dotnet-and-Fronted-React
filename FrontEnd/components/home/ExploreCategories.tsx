"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HOME_CATEGORIES } from "@/lib/content/home";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

export function ExploreCategories() {
  return (
    <section className="bg-[var(--section-muted)] pb-16 pt-4 sm:pb-20">
      <div className="container-page">
        <AnimateIn className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explore Categories
            </h2>
            <p className="mt-1 text-sm text-muted sm:text-base">
              Quality essentials across every vertical
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {HOME_CATEGORIES.map(({ slug, name, productCount, icon: Icon, iconColor, iconBg }) => (
            <StaggerItem key={slug}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Link
                  href={`/categories/${slug}`}
                  className="flex flex-col items-center rounded-xl border border-border bg-[var(--card-bg)] px-4 py-8 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
                  </div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-muted">{productCount}</p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
