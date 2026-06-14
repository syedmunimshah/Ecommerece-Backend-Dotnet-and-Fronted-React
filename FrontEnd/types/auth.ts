export type Role = "Admin" | "User" | "Seller";

export const ROLE_IDS = { Admin: 1, User: 2, Seller: 3 } as const;

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface RegisterDto {
  FullName: string;
  Email: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtClaims {
  sub: string;
  email: string;
  role: Role;
  exp: number;
  iss?: string;
  aud?: string;
}

export interface AppUser {
  id: number;
  email: string;
  role: Role;
}

export interface UserDto {
  Id: number;
  FullName: string;
  Email: string;
  RoleName: Role;
  IsActive: boolean;
  /** Backend has a typo: `Imgae` instead of `Image`. Preserved to match the API. */
  Imgae: string | null;
  CreatedDate: string | null;
  CreatedBy: number | null;
  UpdateDate: string | null;
  UpdateBy: number | null;
}
