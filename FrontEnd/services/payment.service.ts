import "server-only";
import { makeServerApi } from "./api";
import type { CreatePaymentDto, PaymentDto } from "@/types/payment";

export async function createPayment(
  token: string,
  dto: CreatePaymentDto,
): Promise<PaymentDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<PaymentDto>("/api/payments", dto);
  return data;
}

export async function getPayment(
  token: string,
  orderId: number,
): Promise<PaymentDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<PaymentDto>(`/api/payments/${orderId}`);
  return data;
}
