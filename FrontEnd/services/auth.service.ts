import "server-only";
import { makeServerApi } from "./api";
import type { LoginDto, LoginResponse, RegisterDto, UserDto } from "@/types/auth";
import type { PagedResponse } from "@/types/api";

export async function loginRequest(dto: LoginDto): Promise<LoginResponse> {
  const api = makeServerApi();
  const { data } = await api.post<LoginResponse>("/api/auth/login", dto);
  return data;
}

/** Backend uses [FromForm] for register — must send urlencoded form. */
export async function registerRequest(dto: RegisterDto): Promise<RegisterDto> {
  const api = makeServerApi();
  const body = new URLSearchParams();
  body.append("FullName", dto.FullName);
  body.append("Email", dto.Email);
  body.append("Password", dto.Password);
  const { data } = await api.post<RegisterDto>("/api/auth/register", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function listUsers(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<UserDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<UserDto>>("/api/auth/users", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return data;
}
