import { NextResponse } from "next/server";
import { removeCartItem } from "@/services/cart.service";
import { failure, ok, requireToken } from "../../_helpers";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const { itemId } = await params;
    return ok(await removeCartItem(token, Number(itemId)));
  } catch (error) {
    return failure(error);
  }
}
