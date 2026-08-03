"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { FLASH_SALE_PRODUCTS } from "@/lib/content/home";
import { FlashSaleCard } from "./FlashSaleCard";
import { AnimateIn } from "@/components/ui/AnimateIn";

function useCountdown(targetHours = 12, targetMinutes = 45, targetSeconds = 30) {
  const [time, setTime] = useState({ h: targetHours, m: targetMinutes, s: targetSeconds });

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

  return time;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  const pad = String(value).padStart(2, "0");
  return (
    <div className="grid min-w-[64px] flex-1 place-items-center rounded-xl bg-white/20 px-3 py-2.5 backdrop-blur-sm sm:min-w-[72px] sm:px-4 sm:py-3">
      <motion.span
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold tabular-nums text-white"
      >
        {pad}
      </motion.span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleSection() {
  const time = useCountdown();

  return (
    <section className="container-page py-12 sm:py-16">
      <AnimateIn>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#f97316] via-[#ef4444] to-[#dc2626] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left — promo + timer */}
            <div className="shrink-0 lg:max-w-xs">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 fill-amber-300 text-amber-300" />
                <h2 className="text-2xl font-bold tracking-wide text-white sm:text-3xl">
                  FLASH SALE
                </h2>
              </div>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                Up to 70% off on selected items. Limited time only!
              </p>
              <div className="mt-6 flex gap-3">
                <TimeBlock value={time.h} label="Hours" />
                <TimeBlock value={time.m} label="Min" />
                <TimeBlock value={time.s} label="Sec" />
              </div>
            </div>

            {/* Right — product cards */}
            <div className="flex gap-4 overflow-x-auto pb-1 lg:grid lg:flex-1 lg:grid-cols-3 lg:overflow-visible">
              {FLASH_SALE_PRODUCTS.map((product) => (
                <FlashSaleCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
