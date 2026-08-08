"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroEffects({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute h-[480px] w-[480px] rounded-full opacity-35 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          x: "-50%",
          y: "-50%",
        }}
        animate={{ left: `${mouse.x}%`, top: `${mouse.y}%` }}
        transition={{ type: "spring", stiffness: 35, damping: 22 }}
      />

      <motion.div
        style={{ y: orbY1, scale: orbScale }}
        className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        style={{ y: orbY2, scale: orbScale }}
        className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[var(--accent)]/20 blur-3xl"
      />
      <motion.div
        style={{ y: orbY2 }}
        className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--seller)]/12 blur-3xl"
      />
    </div>
  );
}

export function useHeroMouse() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  return { mouse, onMouseMove };
}
