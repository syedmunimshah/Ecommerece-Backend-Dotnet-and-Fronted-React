import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { AppUser, JwtClaims, Role } from "@/types/auth";
import { env } from "./env";
import { COOKIE_NAME } from "./cookies";

const encoder = new TextEncoder();

export async function verifyToken(token: string): Promise<JwtClaims | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(env.JWT_SECRET), {
      issuer: "JwtIssuer",
      audience: "JwtAudience",
    });
    return payload as unknown as JwtClaims;
  } catch {
    return null;
  }
}

export function claimsToUser(claims: JwtClaims): AppUser {
  return {
    id: Number(claims.sub),
    email: claims.email,
    role: claims.role as Role,
  };
}

export async function getServerUser(): Promise<AppUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const claims = await verifyToken(token);
  return claims ? claimsToUser(claims) : null;
}

export async function getServerToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
