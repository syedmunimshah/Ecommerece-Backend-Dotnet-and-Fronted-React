"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Percent, Truck, Gift } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { hoverLift, tapScale } from "@/lib/motion";

const PROMOS = [
  { icon: Percent, title: "Up to 50% Off", subtitle: "Electronics sale", href: "/products?sort=price-desc", color: "from-red-500/20 to-orange-500/10" },
  { icon: Truck, title: "Free Shipping", subtitle: "Orders over Rs. 5,000", href: "/shipping-policy", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: Gift, title: "New User Deal", subtitle: "10% off first order", href: "/register", color: "from-purple-500/20 to-pink-500/10" },
  { icon: Tag, title: "Daily Deals", subtitle: "Limited time offers", href: "/products", color: "from-emerald-500/20 to-green-500/10" },
];

export function PromoBannerStrip() {
  return (
    <section className="border-b border-border bg-surface/30">
      <StaggerContainer className="container-page grid grid-cols-2 gap-3 py-4 sm:grid-cols-4">
        {PROMOS.map(({ icon: Icon, title, subtitle, href, color }) => (
          <StaggerItem key={title}>
            <motion.div whileHover={hoverLift} whileTap={tapScale}>
              <Link
                href={href}
                className={`group flex items-center gap-3 rounded-lg border border-border bg-gradient-to-br ${color} p-3 hover:border-primary/40 hover:shadow-glow`}
              >
                <motion.div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15"
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Icon className="h-5 w-5 text-accent" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted">{subtitle}</p>
                </div>
              </Link>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
