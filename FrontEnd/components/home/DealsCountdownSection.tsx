"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { springTransition } from "@/lib/motion";

export function DealsCountdownSection() {
  const [time, setTime] = useState({ h: 5, m: 30, s: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => {
        let { h, m, s } = t;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <AnimateIn as="section" className="container-page py-12" variant="scale-in">
      <div className="card flex flex-col items-center justify-between gap-6 overflow-hidden bg-gradient-to-r from-destructive/10 via-primary/10 to-accent/10 p-8 motion-safe:animate-gradient-shift sm:flex-row">
        <div className="flex items-center gap-4">
          <Timer className="h-10 w-10 text-destructive motion-safe:animate-bounce-soft" />
          <div>
            <h2 className="text-2xl font-bold">Deal of the Day</h2>
            <p className="text-sm text-muted">Hurry! Offer ends in</p>
          </div>
        </div>
        <div className="flex gap-3">
          {([["h", time.h], ["m", time.m], ["s", time.s]] as const).map(([label, val]) => (
            <motion.div
              key={label}
              className="grid h-16 w-16 place-items-center rounded-lg bg-elevated"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={springTransition}
            >
              <motion.span
                key={val}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-2xl font-bold tabular-nums"
              >
                {pad(val)}
              </motion.span>
              <span className="text-[10px] uppercase text-muted">
                {label === "h" ? "hrs" : label === "m" ? "min" : "sec"}
              </span>
            </motion.div>
          ))}
        </div>
        <Link href="/products">
          <Button variant="destructive" size="lg">Shop Deals</Button>
        </Link>
      </div>
    </AnimateIn>
  );
}
