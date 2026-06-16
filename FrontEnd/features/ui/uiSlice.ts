"use client";

import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
}

export type Theme = "light" | "dark";

interface UiState {
  cartDrawerOpen: boolean;
  toasts: Toast[];
  theme: Theme;
  themeHydrated: boolean;
}

const initialState: UiState = {
  cartDrawerOpen: false,
  toasts: [],
  theme: "dark",
  themeHydrated: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartDrawer(state, action: PayloadAction<boolean>) {
      state.cartDrawerOpen = action.payload;
    },
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
      },
      prepare(input: Omit<Toast, "id">) {
        return { payload: { id: nanoid(), ...input } };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    hydrateTheme(state) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("edgecart_theme") as Theme | null;
        state.theme = stored ?? "dark";
      }
      state.themeHydrated = true;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("edgecart_theme", action.payload);
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("edgecart_theme", state.theme);
      }
    },
  },
});

export const { setCartDrawer, pushToast, dismissToast, hydrateTheme, setTheme, toggleTheme } =
  uiSlice.actions;
export default uiSlice.reducer;
