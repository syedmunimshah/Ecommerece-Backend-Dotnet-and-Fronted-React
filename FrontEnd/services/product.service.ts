import "server-only";
import { makeServerApi } from "./api";
import type { PagedResponse } from "@/types/api";
import type {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from "@/types/product";

export async function listProducts(
  pageNumber = 1,
  pageSize = 12,
  token?: string | null,
): Promise<PagedResponse<ProductDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<ProductDto>>(
    "/api/product/getall",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function getProduct(
  id: number,
  token?: string | null,
): Promise<ProductDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<ProductDto>(`/api/product/getbyid/${id}`);
  return data;
}

export async function createProduct(
  token: string,
  dto: CreateProductDto,
): Promise<ProductDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<ProductDto>("/api/product/create", dto);
  return data;
}

export async function updateProduct(
  token: string,
  id: number,
  dto: UpdateProductDto,
): Promise<ProductDto> {
  const api = makeServerApi(token);
  const { data } = await api.put<ProductDto>(`/api/product/update/${id}`, dto);
  return data;
}

export async function deleteProduct(token: string, id: number): Promise<void> {
  const api = makeServerApi(token);
  await api.delete(`/api/product/delete/${id}`);
}
