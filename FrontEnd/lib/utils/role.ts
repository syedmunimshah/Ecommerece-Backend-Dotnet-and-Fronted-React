import type { UserRole } from "@/lib/types/api";
import { getRoleFromToken } from "@/lib/utils/jwt";

const ROLE_CLAIM_KEYS = [
  "role",
  "Role",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
];

/** Human-friendly label for dashboard / header. */
export function formatRoleLabel(role: string | null | undefined): string {
  if (!role) return "Customer";
  switch (role) {
    case "User":
      return "Customer";
    case "Admin":
      return "Admin";
    case "Seller":
      return "Seller";
    default:
      return role;
  }
}

export function normalizeRole(raw: unknown): UserRole | null {
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return null;
  if (value === "Admin" || value === "User" || value === "Seller") return value;
  return null;
}

export function getRoleFromJwtPayload(payload: Record<string, unknown>): UserRole | null {
  for (const key of ROLE_CLAIM_KEYS) {
    const role = normalizeRole(payload[key]);
    if (role) return role;
  }

  for (const [key, value] of Object.entries(payload)) {
    if (key.toLowerCase().includes("role")) {
      const role = normalizeRole(value);
      if (role) return role;
    }
  }

  return null;
}

const ROLE_ID_TO_NAME: Record<number, UserRole> = {
  1: "Admin",
  2: "User",
  3: "Seller",
};

export function roleIdToName(roleId: number | null | undefined): UserRole | null {
  if (!roleId) return null;
  return ROLE_ID_TO_NAME[roleId] ?? null;
}

export function resolveUserRole(
  user: { roleName?: UserRole | null; roleId?: number | null } | null | undefined,
  token?: string | null,
): UserRole | null {
  if (user?.roleName) return user.roleName;
  const fromId = roleIdToName(user?.roleId);
  if (fromId) return fromId;
  if (token) return getRoleFromToken(token);
  return null;
}

export function resolveRoleId(
  user: { roleName?: UserRole | null; roleId?: number | null },
): number | undefined {
  if (user.roleId) return user.roleId;
  const match = Object.entries(ROLE_ID_TO_NAME).find(([, name]) => name === user.roleName);
  return match ? Number(match[0]) : undefined;
}
