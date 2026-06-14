import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { JwtClaims, Role } from "@/types/auth";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "auth_token";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

const ROLE_ROUTES: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/admin", roles: ["Admin"] },
  { prefix: "/dashboard", roles: ["User", "Admin", "Seller"] },
  { prefix: "/cart", roles: ["User", "Admin", "Seller"] },
  { prefix: "/checkout", roles: ["User"] },
];

async function readClaims(token: string | undefined): Promise<JwtClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: "JwtIssuer",
      audience: "JwtAudience",
    });
    return payload as unknown as JwtClaims;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const claims = await readClaims(token);

  if (!claims) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (!match.roles.includes(claims.role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("denied", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/cart/:path*", "/checkout/:path*"],
};
