import { NextResponse, type NextRequest } from "next/server";
import { loginRequest } from "@/services/auth.service";
import { verifyToken, claimsToUser } from "@/lib/jwt";
import { COOKIE_NAME, baseCookieOptions } from "@/lib/cookies";
import { failure, ok } from "../../_helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = await loginRequest(body);
    const claims = await verifyToken(token);
    if (!claims) {
      return NextResponse.json(
        { message: "Backend issued an invalid or unverifiable token" },
        { status: 502 },
      );
    }
    const response = ok({ user: claimsToUser(claims) });
    response.cookies.set(COOKIE_NAME, token, baseCookieOptions);
    return response;
  } catch (error) {
    return failure(error);
  }
}
