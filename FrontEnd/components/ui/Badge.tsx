import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "primary" | "success" | "warning" | "destructive";

const tones: Record<Tone, string> = {
  default: "border-border bg-elevated text-foreground",
  primary: "border-primary/30 bg-primary/15 text-accent",
  success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  destructive: "border-red-500/30 bg-red-500/15 text-red-300",
};

export function Badge({
  className,
  tone = "default",
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
