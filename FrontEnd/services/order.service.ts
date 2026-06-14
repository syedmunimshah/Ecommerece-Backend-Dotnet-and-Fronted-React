import "server-only";
import { makeServerApi } from "./api";
import type { PagedResponse } from "@/types/api";
import type { OrderDto, OrderTrackingDto } from "@/types/order";

export async function createOrder(token: string): Promise<OrderDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<OrderDto>("/api/orders/create", {});
  return data;
}

export async function listMyOrders(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<OrderDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<OrderDto>>(
    "/api/orders/getmyorders",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function listAllOrders(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<OrderDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<OrderDto>>(
    "/api/orders/getall",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function getOrder(token: string, id: number): Promise<OrderDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<OrderDto>(`/api/orders/getbyid/${id}`);
  return data;
}

export async function getOrderTracking(
  token: string,
  id: number,
): Promise<OrderTrackingDto[]> {
  const api = makeServerApi(token);
  const { data } = await api.get<OrderTrackingDto[]>(
    `/api/orders/${id}/tracking`,
  );
  return data;
}

export async function listSellerOrders(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<OrderDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<OrderDto>>(
    "/api/orders/getsellerorders/seller",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

