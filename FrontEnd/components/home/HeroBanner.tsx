"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { easeOut, springTransition } from "@/lib/motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="hero-orb -left-32 -top-32 h-96 w-96 bg-primary/20"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-orb -right-24 top-1/4 h-72 w-72 bg-accent/15"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="hero-orb bottom-0 left-1/3 h-64 w-64 bg-purple-500/10"
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-page relative grid min-h-[480px] items-center gap-8 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.span
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-accent"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-3.5 w-3.5" />
            </motion.span>
            Flash Sale — Up to 50% Off
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Shop smarter with{" "}
            <span className="text-gradient">EdgeCart</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-lg text-lg text-muted">
            Discover thousands of products from verified sellers. Fast delivery, secure payments, and hassle-free returns.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="group gap-2">
                Shop Now{" "}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/products?sort=newest">
              <Button size="lg" variant="outline">New Arrivals</Button>
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-8 border-t border-border/50 pt-8"
          >
            {[
              { value: "10K+", label: "Products" },
              { value: "500+", label: "Sellers" },
              { value: "4.8★", label: "Rating" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3, scale: 1.03 }}
                transition={springTransition}
              >
                <p className="text-2xl font-bold text-accent">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative hidden aspect-square lg:block"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: easeOut }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 opacity-50 blur-xl"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
              alt="Shopping"
              fill
              className="rounded-2xl object-cover shadow-lift"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
