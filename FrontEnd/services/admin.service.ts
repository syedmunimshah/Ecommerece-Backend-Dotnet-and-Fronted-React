import "server-only";
import { makeServerApi } from "./api";
import type { UserDto } from "@/types/auth";
import type { PagedResponse } from "@/types/api";

export interface AdminUpdateUserDto {
  FullName: string;
  Email: string;
  IsActive: boolean;
  RoleId: number;
}

export async function listAdminUsers(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<UserDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<UserDto>>("/api/admin/users", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return data;
}

export async function getAdminUser(token: string, id: number): Promise<UserDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<UserDto>(`/api/admin/users/${id}`);
  return data;
}

export async function updateAdminUser(
  token: string,
  id: number,
  dto: AdminUpdateUserDto,
): Promise<UserDto> {
  const api = makeServerApi(token);
  const { data } = await api.put<UserDto>(`/api/admin/users/${id}`, dto);
  return data;
}

export async function deleteAdminUser(token: string, id: number): Promise<void> {
  const api = makeServerApi(token);
  await api.delete(`/api/admin/users/${id}`);
}
