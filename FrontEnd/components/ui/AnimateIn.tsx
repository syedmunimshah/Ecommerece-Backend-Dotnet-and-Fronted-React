"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { defaultViewport, easeOut, type MotionVariant, variantMap } from "@/lib/motion";

export type { MotionVariant as AnimateVariant };

interface AnimateInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> {
  children: React.ReactNode;
  className?: string;
  variant?: MotionVariant;
  /** Delay in milliseconds */
  delay?: number;
  /** Duration in milliseconds */
  duration?: number;
  once?: boolean;
  as?: "div" | "section";
}

export function AnimateIn({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 650,
  once = true,
  as = "div",
  ...rest
}: AnimateInProps) {
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...defaultViewport, once }}
      variants={variantMap[variant]}
      transition={{ duration: duration / 1000, delay: delay / 1000, ease: easeOut }}
      {...rest}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
  stagger?: number;
}

export function StaggerContainer({
  children,
  className,
  as = "div",
  stagger = 0.08,
}: StaggerProps) {
  const components = { div: motion.div, section: motion.section, ul: motion.ul };
  const Component = components[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: 0.04 },
        },
      }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
