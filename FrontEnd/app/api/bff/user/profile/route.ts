import { NextResponse, type NextRequest } from "next/server";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
import { failure, ok, requireToken } from "../../_helpers";

export async function GET() {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    return ok(await getUserProfile(token));
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await updateUserProfile(token, body));
  } catch (error) {
    return failure(error);
  }
}
