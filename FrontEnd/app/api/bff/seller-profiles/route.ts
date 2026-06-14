import { NextResponse, type NextRequest } from "next/server";
import { createSellerProfile } from "@/services/sellerProfile.service";
import { failure, ok, requireToken } from "../_helpers";

export async function POST(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await createSellerProfile(token, body), 201);
  } catch (error) {
    return failure(error);
  }
}
