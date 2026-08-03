import type { UserRole } from "@/lib/types/api";
import { getRoleFromJwtPayload } from "@/lib/utils/role";

export interface JwtPayload {
  nameid?: string;
  sub?: string;
  email?: string;
  role?: UserRole;
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return getRoleFromJwtPayload(payload);
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
