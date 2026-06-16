"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { readStorage, writeStorage } from "@/lib/localStorage";

const STORAGE_KEY = "edgecart_wishlist";

interface WishlistState {
  productIds: number[];
  hydrated: boolean;
}

const initialState: WishlistState = {
  productIds: [],
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist(state) {
      state.productIds = readStorage<number[]>(STORAGE_KEY, []);
      state.hydrated = true;
    },
    toggleWishlist(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.productIds.indexOf(id);
      if (idx >= 0) state.productIds.splice(idx, 1);
      else state.productIds.push(id);
      writeStorage(STORAGE_KEY, state.productIds);
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
      writeStorage(STORAGE_KEY, state.productIds);
    },
    clearWishlist(state) {
      state.productIds = [];
      writeStorage(STORAGE_KEY, []);
    },
  },
});

export const {
  hydrateWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
