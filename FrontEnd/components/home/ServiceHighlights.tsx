"use client";

import { motion } from "framer-motion";
import { SERVICE_HIGHLIGHTS } from "@/lib/content/home";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

export function ServiceHighlights() {
  return (
    <section className="bg-[var(--section-muted)] px-4 py-8 sm:px-6 sm:py-12">
      <StaggerContainer className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
        {SERVICE_HIGHLIGHTS.map(
          ({ icon: Icon, title, subtitle, desktopTitle, desktopSubtitle }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex h-full flex-col items-center rounded-2xl border border-border bg-[var(--card-bg)] p-5 text-center shadow-sm sm:p-6 lg:flex-row lg:items-center lg:gap-4 lg:p-5 lg:text-left"
              >
                <div className="mb-3 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--chip-bg)] lg:mb-0">
                  <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    <span className="lg:hidden">{title}</span>
                    <span className="hidden lg:inline">{desktopTitle ?? title}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    <span className="lg:hidden">{subtitle}</span>
                    <span className="hidden lg:inline">{desktopSubtitle ?? subtitle}</span>
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ),
        )}
      </StaggerContainer>
    </section>
  );
}
