"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { hoverLift, springTransition, tapScale } from "@/lib/motion";

type MotionButtonProps = HTMLMotionProps<"button"> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "white";
  children: React.ReactNode;
};

const VARIANTS = {
  primary:
    "text-white shadow-lg hover:shadow-xl [background-image:var(--accent-gradient)]",
  secondary:
    "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  ghost: "bg-transparent text-foreground hover:bg-[var(--chip-bg)]",
  white: "bg-white text-gray-900 shadow-md hover:shadow-lg",
};

export function MotionButton({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: MotionButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-shadow",
    VARIANTS[variant],
    className,
  );

  const motionProps = {
    whileHover: { ...hoverLift, scale: 1.02 },
    whileTap: tapScale,
    transition: springTransition,
  };

  if (href) {
    return (
      <motion.div
        {...motionProps}
        className={cn("inline-flex", className?.includes("w-full") && "w-full")}
      >
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button className={classes} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}
