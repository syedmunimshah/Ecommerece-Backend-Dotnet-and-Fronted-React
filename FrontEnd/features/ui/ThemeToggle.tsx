"use client";

import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { toggleTheme } from "@/features/ui/uiSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="rounded p-2 text-muted hover:bg-elevated hover:text-foreground"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
