"use client";

import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
}

interface UiState {
  cartDrawerOpen: boolean;
  toasts: Toast[];
}

const initialState: UiState = {
  cartDrawerOpen: false,
  toasts: [],
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
  },
});

export const { setCartDrawer, pushToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
