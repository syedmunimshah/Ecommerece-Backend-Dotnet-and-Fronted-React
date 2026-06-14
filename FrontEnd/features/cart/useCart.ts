"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bffApi } from "@/services/api";
import type { AddCartItemDto, CartDto, UpdateCartItemDto } from "@/types/cart";
import { useAppSelector, useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { ApiError } from "@/types/api";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCartQuery() {
  const user = useAppSelector((s) => s.auth.user);
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: async () => (await bffApi.get<CartDto>("/cart")).data,
    enabled: !!user,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (dto: AddCartItemDto) =>
      (await bffApi.post<CartDto>("/cart", dto)).data,
    onSuccess: (data) => {
      qc.setQueryData(cartKeys.all, data);
      dispatch(pushToast({ tone: "success", message: "Added to cart" }));
    },
    onError: (e) => {
      const message = e instanceof ApiError ? e.message : "Could not add to cart";
      dispatch(pushToast({ tone: "error", message }));
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateCartItemDto) =>
      (await bffApi.put<CartDto>("/cart", dto)).data,
    onSuccess: (data) => qc.setQueryData(cartKeys.all, data),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cartItemId: number) =>
      (await bffApi.delete<CartDto>(`/cart/${cartItemId}`)).data,
    onSuccess: (data) => qc.setQueryData(cartKeys.all, data),
  });
}
