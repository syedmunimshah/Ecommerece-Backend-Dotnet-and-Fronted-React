import "server-only";
import { makeServerApi } from "./api";
import type {
  AddCartItemDto,
  CartDto,
  UpdateCartItemDto,
} from "@/types/cart";

export async function getCart(token: string): Promise<CartDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<CartDto>("/api/cart/get");
  return data;
}

export async function addToCart(
  token: string,
  dto: AddCartItemDto,
): Promise<CartDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<CartDto>("/api/cart/add", dto);
  return data;
}

export async function updateCartItem(
  token: string,
  dto: UpdateCartItemDto,
): Promise<CartDto> {
  const api = makeServerApi(token);
  const { data } = await api.put<CartDto>("/api/cart/update", dto);
  return data;
}

export async function removeCartItem(
  token: string,
  cartItemId: number,
): Promise<CartDto> {
  const api = makeServerApi(token);
  const { data } = await api.delete<CartDto>(`/api/cart/remove/${cartItemId}`);
  return data;
}
