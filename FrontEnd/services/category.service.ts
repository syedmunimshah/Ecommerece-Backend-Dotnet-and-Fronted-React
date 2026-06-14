import "server-only";
import { makeServerApi } from "./api";
import type { PagedResponse } from "@/types/api";
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";

export async function listCategories(
  pageNumber = 1,
  pageSize = 100,
  token?: string | null,
): Promise<PagedResponse<CategoryDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<CategoryDto>>(
    "/api/categories/getall",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function createCategory(
  token: string,
  dto: CreateCategoryDto,
): Promise<CategoryDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<CategoryDto>("/api/categories/create", dto);
  return data;
}

export async function updateCategory(
  token: string,
  id: number,
  dto: UpdateCategoryDto,
): Promise<CategoryDto> {
  const api = makeServerApi(token);
  const { data } = await api.put<CategoryDto>(
    `/api/categories/update/${id}`,
    dto,
  );
  return data;
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  const api = makeServerApi(token);
  await api.delete(`/api/categories/delete/${id}`);
}
