import type { Variants, Transition } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const variantMap = {
  "fade-up": fadeUp,
  "fade-down": fadeDown,
  "fade-in": fadeIn,
  "slide-left": slideLeft,
  "slide-right": slideRight,
  "scale-in": scaleIn,
  "blur-in": blurIn,
} as const;

export type MotionVariant = keyof typeof variantMap;

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const hoverLift = {
  y: -6,
  transition: springTransition,
};

export const tapScale = { scale: 0.97 };

export const defaultViewport = {
  once: true,
  amount: 0.12 as const,
  margin: "0px 0px -48px 0px" as const,
};
