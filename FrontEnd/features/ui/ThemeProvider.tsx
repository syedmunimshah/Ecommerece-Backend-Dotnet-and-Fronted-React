"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { hydrateTheme, setTheme } from "@/features/ui/uiSlice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    dispatch(hydrateTheme());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = localStorage.getItem("edgecart_theme");
      if (!stored) dispatch(setTheme(mq.matches ? "dark" : "light"));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [dispatch]);

  return children;
}
