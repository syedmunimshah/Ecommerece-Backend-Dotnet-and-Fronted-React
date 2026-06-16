"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { readStorage, writeStorage } from "@/lib/localStorage";

const STORAGE_KEY = "edgecart_compare";
const MAX_COMPARE = 4;

interface CompareState {
  productIds: number[];
  hydrated: boolean;
}

const initialState: CompareState = {
  productIds: [],
  hydrated: false,
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    hydrateCompare(state) {
      state.productIds = readStorage<number[]>(STORAGE_KEY, []);
      state.hydrated = true;
    },
    toggleCompare(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.productIds.indexOf(id);
      if (idx >= 0) {
        state.productIds.splice(idx, 1);
      } else if (state.productIds.length < MAX_COMPARE) {
        state.productIds.push(id);
      }
      writeStorage(STORAGE_KEY, state.productIds);
    },
    removeFromCompare(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      writeStorage(STORAGE_KEY, state.productIds);
    },
    clearCompare(state) {
      state.productIds = [];
      writeStorage(STORAGE_KEY, []);
    },
  },
});

export const {
  hydrateCompare,
  toggleCompare,
  removeFromCompare,
  clearCompare,
} = compareSlice.actions;
export default compareSlice.reducer;
