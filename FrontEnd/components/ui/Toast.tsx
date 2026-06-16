"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { dismissToast } from "@/features/ui/uiSlice";
import { cn } from "@/lib/cn";
import { easeOut, slideRight } from "@/lib/motion";

const ICONS = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
} as const;

const TONE_CLASSES = {
  info: "border-primary/30 bg-primary/10 text-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-foreground",
  error: "border-red-500/40 bg-red-500/10 text-foreground",
} as const;

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dispatch(dismissToast(t.id)), 4000),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              variants={slideRight}
              transition={{ duration: 0.35, ease: easeOut }}
              className={cn(
                "flex min-w-[260px] items-start gap-3 rounded border px-4 py-3 shadow-lg",
                TONE_CLASSES[t.tone],
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1 text-sm">{t.message}</p>
              <button
                onClick={() => dispatch(dismissToast(t.id))}
                className="text-muted hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
