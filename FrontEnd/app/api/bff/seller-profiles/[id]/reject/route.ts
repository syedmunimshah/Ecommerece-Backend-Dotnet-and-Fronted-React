import { NextResponse } from "next/server";
import { rejectSeller } from "@/services/sellerProfile.service";
import { failure, ok, requireToken } from "../../../_helpers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const { id } = await params;
    return ok(await rejectSeller(token, Number(id)));
  } catch (error) {
    return failure(error);
  }
}
