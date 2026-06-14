import "server-only";
import { makeServerApi } from "./api";
import type { UserDto } from "@/types/auth";

export interface UpdateProfileDto {
  FullName: string;
  NewPassword?: string;
}

export async function getUserProfile(token: string): Promise<UserDto> {
  const api = makeServerApi(token);
  const { data } = await api.get<UserDto>("/api/user/profile");
  return data;
}

export async function updateUserProfile(
  token: string,
  dto: UpdateProfileDto,
): Promise<UserDto> {
  const api = makeServerApi(token);
  const { data } = await api.put<UserDto>("/api/user/update-profile", dto);
  return data;
}
