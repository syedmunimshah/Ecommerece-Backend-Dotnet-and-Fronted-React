"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useMounted } from "@/lib/hooks/useMounted";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-[var(--chip-bg)]",
        className,
      )}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {!mounted ? (
        <span className="h-4 w-4" />
      ) : theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
