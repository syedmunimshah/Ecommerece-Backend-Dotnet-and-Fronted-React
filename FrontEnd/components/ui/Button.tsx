import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow",
  secondary: "bg-elevated text-foreground hover:bg-border",
  ghost: "bg-transparent text-foreground hover:bg-elevated",
  destructive: "bg-destructive text-white hover:bg-red-600",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-elevated",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", loading, disabled, children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded font-medium",
          "motion-safe:transition-all motion-safe:duration-200",
          "motion-safe:active:scale-95 motion-safe:hover:scale-[1.02]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
